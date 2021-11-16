import { GLView } from "expo-gl";
import { Renderer } from "expo-three";
import * as THREE from "three";
import matchAll from "string.prototype.matchall";
import React, { useEffect, useState } from "react";
import { View, Text, SafeAreaView, Dimensions } from "react-native";
// import { useHistory } from "react-router-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Axios from "axios";
import Colors from "./CPK_Colors.json";
import getConnect from "../Helpers/PdbParse_Connect";
import parsePdb from "parse-pdb";
import OrbitControlsView from "expo-three-orbit-controls";

const ViewProtein = (props) => {
  // const history = useHistory();
  const [connects, setConnects] = useState([]);
  const [mount, setMounted] = useState(true);
  const [Atoms, setAtoms] = useState([]);
  // const { ligand } = props.location;
  const ligand = "011";
  const url1 = `https://files.rcsb.org/ligands/view/${ligand}_model.pdb`;
  const url2 =
    "https://files.rcsb.org/ligands/0/" + ligand + "/" + ligand + "_ideal.pdb";
  const [width, setWidth] = useState(Dimensions.get("screen").width);
  const [height, setHeight] = useState(Dimensions.get("screen").height - 10);

  useEffect(() => {
    console.log("WIDTH", width / 2);
    Axios(url1)
      .then((res) => {
        if (res.data) {
          let array = [...matchAll(res.data, /^CONECT(:?\s*\d+.+)+/gm)];
          let atomsPdb = parsePdb(res.data);
          console.log(res.data);
          console.table(atomsPdb.atoms);
          setAtoms(atomsPdb);
          array = array.filter((el, key) => key < atomsPdb.atoms?.length);
          setConnects(getConnect(array));
          setMounted(false);
        }
      })
      .catch((er) => alert(er));
  }, []);
  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", () => {
      setWidth(Dimensions.get("screen").width);
      setHeight(Dimensions.get("screen").height - 30);
    });

    return () => subscription?.remove();
  }, []);
  console.log("LENGTH", Atoms.atoms?.length);
  const geo = new THREE.SphereGeometry();
  const camera = new THREE.PerspectiveCamera(
    75,
    width < height ? width / height : height / width,
    0.1,
    1000
  );
  let cameraInitialPositionX = 0;
  let cameraInitialPositionY = 2;
  let cameraInitialPositionZ = 500;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }}>
      {mount ? (
        <Text>HIII</Text>
      ) : (
        <>
          <OrbitControlsView style={{ flex: 1 }} camera={camera}>
            <GLView
              style={{ width: width, height: height }}
              onContextCreate={async (gl) => {
                const {
                  drawingBufferWidth: width,
                  drawingBufferHeight: height,
                } = gl;

                const renderer = new Renderer({ gl });
                renderer.setClearColor("#000");
                renderer.setSize(width, height);
                camera.position.set(
                  cameraInitialPositionX,
                  cameraInitialPositionY,
                  cameraInitialPositionZ
                );
                // camera.lookAt(0, 0, 0);
                const scene = new THREE.Scene();
                console.log(scene.);
                const ambientLight = new THREE.DirectionalLight(0xffffff, 0.9);
                ambientLight.position.set(
                  cameraInitialPositionX,
                  cameraInitialPositionY,
                  cameraInitialPositionZ
                );
                scene.add(ambientLight);
                camera.lookAt(
                  Atoms.atoms[0]?.x,
                  Atoms.atoms[0]?.y,
                  Atoms.atoms[0]?.z
                );

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
                const start = new THREE.Vector3();
                const end = new THREE.Vector3();
                for (let j = 0; j < connects.length; j++) {
                  for (let i = 1; i < connects[j].length; i++) {
                    if (connects[j][i] - 1 < Atoms.atoms.length) {
                      start.x = Atoms.atoms[connects[j][0] - 1].x;
                      start.y = Atoms.atoms[connects[j][0] - 1].y;
                      start.z = Atoms.atoms[connects[j][0] - 1].z;

                      end.x = Atoms.atoms[connects[j][i] - 1].x;
                      end.y = Atoms.atoms[connects[j][i] - 1].y;
                      end.z = Atoms.atoms[connects[j][i] - 1].z;

                      start.multiplyScalar(width / height + 1);
                      end.multiplyScalar(width / height + 1);
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

                  camera.aspect =
                    width > height ? height / width : width / height;
                  renderer.render(scene, camera);
                  gl.endFrameEXP();
                };
                render();
              }}
            />
          </OrbitControlsView>
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
