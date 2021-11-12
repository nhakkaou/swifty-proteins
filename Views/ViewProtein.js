import { GLView } from "expo-gl";
import { Renderer } from "expo-three";
import * as THREE from "three";
import React, { useEffect, useState } from "react";
import { View, Text, SafeAreaView, Dimensions } from "react-native";
import { useHistory } from "react-router-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Axios from "axios";
import Colors from "./CPK_Colors.json";
import getConnect from "../Helpers/PdbParse_Connect";
import parsePdb from "parse-pdb";
const ViewProtein = (props) => {
  const history = useHistory();
  const [connects, setConnects] = useState([
    ["1", "2", "3"],
    ["2", "1"],
    ["3", "1"],
  ]);
  const [mount, setMounted] = useState(true);
  const [Atoms, setAtoms] = useState([]);
  const { ligand } = props.location;
  const url1 = `https://files.rcsb.org/ligands/view/${ligand}_model.pdb`;
  const url2 =
    "https://files.rcsb.org/ligands/0/" + ligand + "/" + ligand + "_ideal.pdb";
  const [width, setWidth] = useState(Dimensions.get("screen").width);
  const [height, setHeight] = useState(Dimensions.get("screen").height);
  const str = [
    {
      altLoc: "",
      chainID: "A",
      charge: "2",
      element: "O",
      iCode: "",
      name: "C1",
      occupancy: NaN,
      resName: "0E5",
      resSeq: 1,
      serial: 1,
      tempFactor: NaN,
      x: 0,
      y: 2,
      z: 10,
    },
    {
      altLoc: "",
      chainID: "A",
      charge: "2",
      element: "H",
      iCode: "",
      name: "C1",
      occupancy: NaN,
      resName: "0E5",
      resSeq: 1,
      serial: 1,
      tempFactor: NaN,
      x: 0,
      y: -2,
      z: 5,
    },
    {
      altLoc: "",
      chainID: "A",
      charge: "2",
      element: "H",
      iCode: "",
      name: "C1",
      occupancy: NaN,
      resName: "0E5",
      resSeq: 1,
      serial: 1,
      tempFactor: NaN,
      x: 0,
      y: 4,
      z: 5,
    },
  ];
  useEffect(() => {
    Axios(url2)
      .then((res) => {
        console.log("data", res.data);

        setConnects(getConnect(res.data));
        setAtoms(parsePdb(res.data));
        // setAtoms({ atoms: str });

        setMounted(false);
      })
      .catch((er) => alert(er));
  }, []);

  console.log("Ligand", ligand);
  console.log(Atoms.atoms?.length);
  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", () => {
      setWidth(Dimensions.get("screen").width);
      setHeight(Dimensions.get("screen").height);
    });

    return () => subscription?.remove();
  }, []);

  useEffect(() => console.log(width, height), [width, height]);

  const geo = new THREE.SphereGeometry();

  let cameraInitialPositionX = 0;
  let cameraInitialPositionY = 2;
  let cameraInitialPositionZ = 50;
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }}>
      {mount ? (
        <Text>HIII</Text>
      ) : (
        <>
          <GLView
            style={{ width: width, height: height }}
            onContextCreate={async (gl) => {
              const { drawingBufferWidth: width, drawingBufferHeight: height } =
                gl;

              const renderer = new Renderer({ gl });
              renderer.setClearColor("#000");
              renderer.setSize(width, height);
              const camera = new THREE.PerspectiveCamera(
                75,
                width < height ? width / height : height / width,
                0.1,
                1000
              );
              camera.position.set(
                cameraInitialPositionX,
                cameraInitialPositionY,
                cameraInitialPositionZ
              );
              camera.lookAt(0, 0, 0);
              const scene = new THREE.Scene();

              const ambientLight = new THREE.DirectionalLight(0xffffff, 0.9);
              ambientLight.position.set(
                cameraInitialPositionX,
                cameraInitialPositionY,
                cameraInitialPositionZ
              );

              scene.add(ambientLight);

              /**********Use PDB PARSER */
              const position = new THREE.Vector3();
              for (let i = 0; i < Atoms.atoms?.length; i++) {
                position.x = Atoms.atoms[i].x;
                position.y = Atoms.atoms[i].y;
                position.z = Atoms.atoms[i].z;

                let color = new THREE.Color(
                  "#" + Colors[Atoms.atoms[i].element].jmol
                );
                const mtrl = new THREE.MeshPhongMaterial({
                  color: color,
                  shininess: 50,
                });
                let object = new THREE.Mesh(geo, mtrl);
                position.multiplyScalar(width / height + 1);
                object.position.copy(position);
                scene.add(object);
              }
              /**************** ADD BOX */
              const start = new THREE.Vector3();
              const end = new THREE.Vector3();
              for (let j = 0; j < connects.length; j++) {
                for (let i = 1; i < connects[j].length; i++) {
                  start.x = Atoms.atoms[connects[j][0] - 1].x;
                  start.y = Atoms.atoms[connects[j][0] - 1].y;
                  start.z = Atoms.atoms[connects[j][0] - 1].z;
                  end.x = Atoms.atoms[connects[j][i] - 1]?.x;
                  end.y = Atoms.atoms[connects[j][i] - 1]?.y;
                  end.z = Atoms.atoms[connects[j][i] - 1]?.z;
                  console.log(start, end);
                  start.multiplyScalar(width / height + 1);
                  end.multiplyScalar(width / height + 1);
                  const cylinderGeometry = new THREE.CylinderGeometry();
                  const object = new THREE.Mesh(
                    cylinderGeometry,
                    new THREE.MeshPhongMaterial(0xffffff)
                  );
                  object.position.copy(start);
                  object.position.lerp(end, 0.5);
                  object.scale.set(0.1, 0.1, start.distanceTo(end));
                  object.position.lerp(end, 0.1);
                  console.log(object);
                  object.lookAt(end);
                  scene.add(object);
                }
              }
              /************** */

              const render = () => {
                requestAnimationFrame(render);
                scene.rotation.y += 1;
                renderer.render(scene, camera);
                gl.endFrameEXP();
              };
              render();
            }}
          />
          <View style={{ backgroundColor: "0xFFFFFF" }}>
            <Text style={{ color: "#FFF", fontSize: 16, padding: 5 }}>
              Atom:
            </Text>
            <MaterialCommunityIcons
              onPress={() => history.push("/list")}
              style={{ color: "#fff", padding: 5 }}
              size={35}
              name="keyboard-backspace"
            />
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

export default ViewProtein;
