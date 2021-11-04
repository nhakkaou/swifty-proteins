import { GLView } from "expo-gl";
import { Renderer } from "expo-three";
import * as THREE from "three";
import React from "react";
import { View, Text, SafeAreaView, useWindowDimensions } from "react-native";
import { PDBLoader } from "three/examples/jsm/loaders/PDBLoader.js";
import pdbFile from "./test.pdb";
const ViewProtein = () => {
  const { height, width } = useWindowDimensions();
  const geo = new THREE.SphereGeometry();
  // const material = new THREE.MeshStandardMaterial({
  //   color: "#80",
  // });

  // const sphere = new THREE.Mesh(geo, material);
  const camera = new THREE.PerspectiveCamera(75, width / height, 0.01, 1000);
  // const camera = new THREE.PerspectiveCamera();

  let cameraInitialPositionX = 0;
  let cameraInitialPositionY = 2;
  let cameraInitialPositionZ = 5;
  let i = 0;
  return (
    <GLView
      style={{ width: width, height: height }}
      onContextCreate={async (gl) => {
        // GL Parameter disruption
        const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;

        // Renderer declaration and set properties
        console.log(width, height);
        const renderer = new Renderer({ gl });
        renderer.setSize(width, height);
        renderer.setClearColor("#fff");

        // Scene declaration, add a fog, and a grid helper to see axes dimensions
        const scene = new THREE.Scene();

        const ambientLight = new THREE.DirectionalLight(0xffffff, 1);
        ambientLight.position.set(
          cameraInitialPositionX,
          cameraInitialPositionY,
          cameraInitialPositionZ
        );
        // for (let i = 0; i < arr.length; i++) {
        //   let object = new THREE.Mesh(geo, material);
        //   console.log(arr[i]);
        //   object.position.set(arr[i]);
        //   scene.add(object);
        // }
        // scene.add(sphere);
        // scene.add(ambientLight);

        // Add sphere object instance to our scene

        // Set camera position and look to sphere
        camera.position.set(
          cameraInitialPositionX,
          cameraInitialPositionY,
          cameraInitialPositionZ
        );
        camera.lookAt(0, 0, 0);
        const loader = new PDBLoader();
        loader.load(
          pdbFile,
          function (pdb) {
            console.log("pdb ", pdb);
            const geometryAtoms = pdb.geometryAtoms;
            const geometryBonds = pdb.geometryBonds;
            const json = pdb.json;

            console.log("This molecule has " + json.atoms.length + " atoms");

            geometryAtoms.translate(0, 0, 0);
            geometryBonds.translate(0, 0, 0);

            let positions = geometryAtoms.getAttribute("position");
            const colors = geometryAtoms.getAttribute("color");
            console.log("positions", positions);
            console.log("colors", colors);
            const position = new THREE.Vector3();
            const color = new THREE.Color();

            for (let i = 0; i < positions.count; i++) {
              position.x = positions.getX(i);
              position.y = positions.getY(i);
              position.z = positions.getZ(i);

              color.r = colors.getX(i);
              color.g = colors.getY(i);
              color.b = colors.getZ(i);

              const mtrl = new THREE.MeshPhongMaterial({
                color: "yellow",
                shininess: 50,
              });
              console.log(color);
              let object = new THREE.Mesh(geo, mtrl);
              object.position.copy(position);
              scene.add(object);
            }
            camera.position.set(positions.getX(0), positions.getY(0), 100);

            console.log(
              positions.getX(0),
              positions.getY(0),
              positions.getZ(0)
            );
            console.log(colors.getX(0), colors.getY(0), colors.getZ(0));
            console.log(scene);
            // positions = geometryBonds.getAttribute("position");

            // const start = new THREE.Vector3();
            // const end = new THREE.Vector3();

            // for (let i = 0; i < positions.count; i += 2) {
            //   start.x = positions.getX(i);
            //   start.y = positions.getY(i);
            //   start.z = positions.getZ(i);

            //   end.x = positions.getX(i + 5);
            //   end.y = positions.getY(i + 5);
            //   end.z = positions.getZ(i + 5);

            //   // start.multiplyScalar(75);
            //   // end.multiplyScalar(75);

            //   const object = new THREE.Mesh(
            //     boxGeometry,
            //     new THREE.MeshPhongMaterial(0xffffff)
            //   );
            //   object.position.copy(start);
            //   object.position.lerp(end, 0.5);
            //   object.scale.set(0.5, 0.5, start.distanceTo(end));
            //   object.lookAt(end);
            //   scene.add(object);
            // }
          },
          function onProgress(xhr) {
            if (xhr.lengthComputable) {
              const percentComplete = (xhr.loaded / xhr.total) * 100;
              console.log(
                "model " + Math.round(percentComplete, 2) + "% downloaded"
              );
            }
          },
          (er) => console.log(er)
        );
        const render = () => {
          requestAnimationFrame(render);
          renderer.render(scene, camera);
          gl.endFrameEXP();
        };

        render();
      }}
    />
  );
};

export default ViewProtein;
