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
    Axios(url1)
      .then((res) => {
        if (res.data) {
          let array = [...matchAll(res.data, /^CONECT(:?\s*\d+.+)+/gm)];
          let atomsPdb = parsePdb(res.data);
          console.log(res.data);
          setAtoms(atomsPdb.atoms);
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
  console.log("LENGTH", Atoms?.length);
  const geo = new THREE.SphereGeometry();
  const camera = new THREE.PerspectiveCamera(
    75,
    width < height ? width / height : height / width,
    0.1,
    1000
  );
  let cameraInitialPositionX = 0;
  let cameraInitialPositionY = 2;
  let cameraInitialPositionZ = 50;

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
                camera.position.copy(Atoms[0]);
                camera.lookAt(Atoms[0]);
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
                for (let i = 0; i < Atoms?.length; i++) {
                  position.x = Atoms[i].x > 10 ? Atoms[i].x / 2 : Atoms[i].x;
                  position.y = Atoms[i].y > 10 ? Atoms[i].y / 2 : Atoms[i].y;
                  position.z = Atoms[i].z > 10 ? Atoms[i].z / 2 : Atoms[i].z;
                  console.log(position);
                  let color = new THREE.Color(
                    "#" + Colors[Atoms[i].element].jmol
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
                // for (let j = 0; j < connects.length; j++) {
                //   for (let i = 1; i < connects[j].length; i++) {
                //     if (connects[j][i] - 1 < Atoms.length) {
                //       start.x = Atoms[connects[j][0] - 1].x / 2;
                //       start.y = Atoms[connects[j][0] - 1].y / 2;
                //       start.z = Atoms[connects[j][0] - 1].z / 2;

                //       end.x = Atoms[connects[j][i] - 1].x / 2;
                //       end.y = Atoms[connects[j][i] - 1].y / 2;
                //       end.z = Atoms[connects[j][i] - 1].z / 2;

                //       start.multiplyScalar(width / height + 1);
                //       end.multiplyScalar(width / height + 1);
                //       const geoBox = new THREE.BoxGeometry(
                //         0.5,
                //         0.5,
                //         start.distanceTo(end)
                //       );
                //       const cylinder = new THREE.Mesh(
                //         geoBox,
                //         new THREE.MeshPhongMaterial({ color: 0xffffff })
                //       );
                //       cylinder.position.copy(start);
                //       cylinder.position.lerp(end, 0.5);
                //       cylinder.lookAt(end);
                //       scene.add(cylinder);
                //     }
                //   }
                // }

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
