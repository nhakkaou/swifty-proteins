import { GLView } from "expo-gl";
import { Renderer } from "expo-three";
import * as THREE from "three";
import matchAll from "string.prototype.matchall";
import React, { useEffect, useState, useRef } from "react";
import {
	View,
	SafeAreaView,
	Dimensions,
	ActivityIndicator,
	StatusBar,
	Alert,
	Button,
} from "react-native";
import { useHistory } from "react-router-native";
import Axios from "axios";
import Colors from "./CPK_Colors.json";
import { getConnect, mapAtoms } from "../Helpers/PdbParse_Connect";
import parsePdb from "parse-pdb";
import OrbitControlsView from "expo-three-orbit-controls";

const ViewProtein = ({ ligand, modelisation, zoom }) => {
	const RefScreen = useRef(null);
	const history = useHistory();
	const [connects, setConnects] = useState([]);
	const [mount, setMounted] = useState(true);
	const [Atoms, setAtoms] = useState([]);
	const [keyRender, setKeyrender] = useState(false);
	const [jmol, setJmol] = useState(true);
	console.log(ligand);
	const url1 = `https://files.rcsb.org/ligands/view/${ligand}_model.pdb`;
	const [width, setWidth] = useState(Dimensions.get("screen").width);
	const [height, setHeight] = useState(Dimensions.get("screen").height);
	const [modul, setModulisation] = useState(1);
	const [aspectRatio, setCameraRatio] = useState(
		width < height ? width / height : height / width
	);
	const rendererRef = useRef(null);

	useEffect(() => {
		if (modelisation > 0 && modelisation < 4) {
			setModulisation(modelisation);
			setKeyrender(!keyRender);
		} else if (modelisation === 4) {
			change_color();
		} else return;
	}, [modelisation]);

	useEffect(() => {
		if (zoom > 0) Zoom(true);
		if (zoom < 0) Zoom(false);
	}, [zoom]);

	useEffect(() => {
		Axios(url1)
			.then((res) => {
				if (res.data) {
					let array = [...matchAll(res.data, /^CONECT(:?\s*\d+.+)+/gm)];
					let atomsPdb = parsePdb(res.data);
					let newAtoms = mapAtoms(atomsPdb.atoms);
					setAtoms(newAtoms);
					array = array.filter((el, key) => key < atomsPdb.atoms?.length);
					setConnects(getConnect(array));
					setMounted(false);
				}
			})
			.catch((er) => alert(er));
	}, []);
	const change_color = () => {
		setJmol(!jmol);
		setKeyrender(!keyRender);
	};
	useEffect(() => {
		const subscription = Dimensions.addEventListener("change", () => {
			setWidth(Dimensions.get("screen").width);
			setHeight(Dimensions.get("screen").height);
			setCameraRatio(
				Dimensions.get("screen").width / Dimensions.get("screen").height
			);
			setKeyrender(!keyRender);
		});
		return () => subscription?.remove();
	}, [width, height]);

	const geo = new THREE.SphereGeometry();
	const geo2 = new THREE.BoxGeometry();
	const scene = new THREE.Scene();
	const camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);
	const raycaster = new THREE.Raycaster();
	const handleStateChange = ({ nativeEvent }) => {
		let mouse = new THREE.Vector2();
		mouse.x = (nativeEvent.pageX / width) * 2 - 1;
		mouse.y = -(nativeEvent.pageY / height) * 2 + 1;
		raycaster.setFromCamera(mouse, camera);
		// calculate objects intersecting the picking ray
		const intersects = raycaster.intersectObjects(scene.children);
		if (intersects[0]?.object?.AtomsInfos) {
			Alert.alert(
				"Atom Details",
				`Element : ${intersects[0].object.AtomsInfos.element}
        Discovered by: ${
					Colors[intersects[0].object.AtomsInfos.element].discoverd_by
				}
        Phase: ${Colors[intersects[0].object.AtomsInfos.element].phase}`,
				[
					{
						text: "Cancel",
						onPress: () => console.log("Cancel Pressed"),
						style: "cancel",
					},
					{ text: "OK", onPress: () => console.log("OK Pressed") },
				],
				{ cancelable: false }
			);
		}
	};

	const Zoom = (value) => {
		if (value) camera.position.z -= 5;
		if (!value) camera.position.z += 5;
		camera.lookAt(scene.position);
		rendererRef.current.render(scene, camera);
	};

	return (
		<SafeAreaView style={{ flex: 1 }}>
			{mount ? (
				<ActivityIndicator size="large" />
			) : (
				<>
					<OrbitControlsView
						key={keyRender}
						style={{ flex: 2, position: "relative" }}
						camera={camera}
						onTouchEndCapture={handleStateChange}
					>
						<GLView
							ref={RefScreen}
							key={keyRender}
							style={{ width: width, height: height }}
							onContextCreate={async (gl) => {
								const {
									drawingBufferWidth: width,
									drawingBufferHeight: height,
								} = gl;
								const renderer = new Renderer({ gl });
								rendererRef.current = renderer;
								renderer.setClearColor("#000");
								renderer.setSize(width, height);
								camera.position.set(0, 2, 60);
								camera.lookAt(0, 0, 0);
								const ambientLight = new THREE.DirectionalLight(0xffffff, 0.9);
								ambientLight.position.copy(camera.position);
								scene.add(ambientLight);
								/********** Use PDB PARSER */
								const position = new THREE.Vector3();
								for (let i = 0; i < Atoms?.length; i++) {
									/**
									 * Make the first letter of the element uppercase amd the rest lowercase
									 */
									const element =
										Atoms[i].element.charAt(0).toUpperCase() +
										Atoms[i].element.slice(1).toLowerCase();
									let colorCpk = jmol
										? Colors[element].jmol
										: Colors[element].rasmol;
									position.x = Atoms[i].x;
									position.y = Atoms[i].y;
									position.z = Atoms[i].z;
									let color = new THREE.Color("#" + colorCpk);
									const mtrl = new THREE.MeshPhongMaterial({
										color: color,
										shininess: 50,
									});
									let object = new THREE.Mesh(modul === 3 ? geo2 : geo, mtrl);
									position.multiplyScalar(
										width > height ? width / height + 1 : height / width + 1
									);
									object.position.copy(position);
									object.AtomsInfos = Atoms[i];
									scene.add(object);
								}
								const start = new THREE.Vector3();
								const end = new THREE.Vector3();
								if (modul !== 2) {
									for (let j = 0; j < connects.length; j++) {
										for (let i = 1; i < connects[j].length; i++) {
											if (connects[j][i] - 1 < Atoms.length) {
												start.x = Atoms[connects[j][0] - 1].x;
												start.y = Atoms[connects[j][0] - 1].y;
												start.z = Atoms[connects[j][0] - 1].z;
												end.x = Atoms[connects[j][i] - 1].x;
												end.y = Atoms[connects[j][i] - 1].y;
												end.z = Atoms[connects[j][i] - 1].z;

												start.multiplyScalar(
													width > height
														? width / height + 1
														: height / width + 1
												);
												end.multiplyScalar(
													width > height
														? width / height + 1
														: height / width + 1
												);
												const geoBox = new THREE.BoxGeometry(
													0.5,
													0.5,
													start.distanceTo(end)
												);
												const cylinder = new THREE.Mesh(
													geoBox,
													new THREE.MeshPhongMaterial({ color: 0xffffff })
												);
												cylinder.position.copy(start);
												cylinder.position.lerp(end, 0.5);
												cylinder.lookAt(end);
												scene.add(cylinder);
											}
										}
									}
								}
								/************** */

								const render = () => {
									requestAnimationFrame(render);
									ambientLight.position.set(
										camera.position.x,
										camera.position.y,
										camera.position.z
									);
									renderer.render(scene, camera);
									gl.endFrameEXP();
								};
								render();
							}}
						/>
					</OrbitControlsView>
				</>
			)}
		</SafeAreaView>
	);
};

export default ViewProtein;
