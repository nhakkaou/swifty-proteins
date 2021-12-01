import { GLView } from "expo-gl";
import { Renderer } from "expo-three";
import * as THREE from "three";
import matchAll from "string.prototype.matchall";
import React, { useEffect, useState } from "react";
import { View, Text, SafeAreaView, Dimensions, TouchableOpacity } from "react-native";
// import { useHistory } from "react-router-native";

import { State, LongPressGestureHandler } from "react-native-gesture-handler";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Axios from "axios";
import Colors from "./CPK_Colors.json";
import { getConnect, mapAtoms } from "../Helpers/PdbParse_Connect";
import parsePdb from "parse-pdb";
import OrbitControlsView from "expo-three-orbit-controls";

const ViewProtein = (props) => {
  // const history = useHistory();
  let rnd = {};
  const [connects, setConnects] = useState([]);
  const [mount, setMounted] = useState(true);
  const [Atoms, setAtoms] = useState([]);
  const [atomSelected, setatomSelected] = useState({});
  // const { ligand } = props.location;
  const ligand = "10S";
  const url1 = `https://files.rcsb.org/ligands/view/${ligand}_model.pdb`;
  const [width, setWidth] = useState(Dimensions.get("screen").width);
  const [height, setHeight] = useState(Dimensions.get("screen").height - 10);

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

  const Zoom = (value) => {
    if (value && camera.position.z > 16)
      camera.position.z -= 5
    if (!value && camera.position.z < 100)
      camera.position.z += 5
    camera.lookAt(scene.position)
    console.log(camera.position.z, camera.position.x, camera.position.y)
    rnd?.render(scene, camera);
  }
  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", () => {
      setWidth(Dimensions.get("screen").width);
      setHeight(Dimensions.get("screen").height - 30);
    });
    return () => subscription?.remove();
  }, []);
  console.log("LENGTH", Atoms?.length);
  const geo = new THREE.SphereGeometry();
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    width < height ? width / height : height / width,
    0.1,
    1000
  );
  const raycaster = new THREE.Raycaster();
  const handleStateChange = ({ nativeEvent }) => {
    let mouse = new THREE.Vector2();
    mouse.x = (nativeEvent.pageX / width) * 2 - 1;
    mouse.y = -(nativeEvent.pageY / height) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    // calculate objects intersecting the picking ray
    const intersects = raycaster.intersectObjects(scene.children);
    console.log("Selected", mouse.x, mouse.y);
    if (intersects[0]?.object?.AtomsInfos)
      // setatomSelected(intersects[0]?.object?.AtomsInfos);
      alert(intersects[0]?.object?.AtomsInfos.name);
  };


  return (
    <SafeAreaView style={{ flex: 1 }}>
      {mount ? (
        <Text>HIII</Text>
      ) : (
        <>


          <OrbitControlsView style={{ flex: 2 }} camera={camera} onTouchEndCapture={handleStateChange}>
            {/* <LongPressGestureHandler onHandlerStateChange={handleStateChange} minDurationMs={800}> */}
            <GLView
              style={{ width: width, height: height }}
              onContextCreate={async (gl) => {
                const {
                  drawingBufferWidth: width,
                  drawingBufferHeight: height,
                } = gl;
                console.log(width, height, camera.position.z);
                const renderer = new Renderer({ gl });
                renderer.setClearColor("#000");
                renderer.setSize(width, height);
                rnd = renderer;
                camera.position.set(0, 2, 60);
                camera.lookAt(0, 0, 0);
                const ambientLight = new THREE.DirectionalLight(0xffffff, 0.9);
                ambientLight.position.copy(camera.position);
                scene.add(ambientLight);
                /**********Use PDB PARSER */
                const position = new THREE.Vector3();
                for (let i = 0; i < Atoms?.length; i++) {
                  position.x = Atoms[i].x;
                  position.y = Atoms[i].y;
                  position.z = Atoms[i].z;
                  let color = new THREE.Color(
                    "#" + Colors[Atoms[i].element].jmol
                  );
                  const mtrl = new THREE.MeshPhongMaterial({
                    color: color,
                    shininess: 50,
                  });
                  let object = new THREE.Mesh(geo, mtrl);
                  position.multiplyScalar(
                    width > height ? width / height + 1 : height / width + 1
                  );
                  object.position.copy(position);
                  object.AtomsInfos = Atoms[i];
                  scene.add(object);
                }
                const start = new THREE.Vector3();
                const end = new THREE.Vector3();
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
                        width > height ? width / height + 1 : height / width + 1
                      );
                      end.multiplyScalar(
                        width > height ? width / height + 1 : height / width + 1
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

                /************** */

                const render = () => {
                  requestAnimationFrame(render);
                  ambientLight.position.set(
                    camera.position.x,
                    camera.position.y,
                    camera.position.z
                  );
                  console.log(camera.position);
                  camera.aspect =
                    width > height ? height / width : width / height;
                  renderer.render(scene, camera);
                  gl.endFrameEXP();
                };
                render();
              }}
            />
            {/* </LongPressGestureHandler> */}
          </OrbitControlsView>
          <View style={{ backgroundColor: "0xFFFFFF" }}>
            <TouchableOpacity
              style={{ backgroundColor: "#fff", color: "#000" }}
              onPress={() => Zoom(true)}
            >
              <Text>+</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ backgroundColor: "#fff", color: "#000" }}
              onPress={() => Zoom(false)}
            >
              <Text>-</Text>
            </TouchableOpacity>
            <MaterialCommunityIcons
              // onPress={() => history.push("/list")}
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