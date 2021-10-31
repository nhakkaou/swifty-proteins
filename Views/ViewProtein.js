import { View as GraphicsView } from "expo-graphics";
import ExpoTHREE, { THREE } from "expo-three";
import React from "react";
import { CylinderGeometry } from "three";

export default class App extends React.Component {
  componentWillMount() {
    THREE.suppressExpoWarnings();
  }

  render() {
    return (
      <GraphicsView
        onContextCreate={this.onContextCreate}
        onRender={this.onRender}
      />
    );
  }
  onContextCreate = async ({
    gl,
    canvas,
    width,
    height,
    scale: pixelRatio,
  }) => {
    // console.log(gl, canvas, width, height);
    this.renderer = new ExpoTHREE.Renderer({ gl, pixelRatio, width, height });
    this.renderer.setClearColor(0xffffff);
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    this.camera.position.z = 5;
    const geometry = new THREE.SphereGeometry(1, 100, 100);

    const material = new THREE.MeshPhongMaterial({
      color: 0xff0000,
      shininess: 5,
    });
    const materialcylinder = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      shininess: 5,
    });
    const geometryCylinder = new THREE.CylinderGeometry(1, 1, 2, 50);
    this.cylinder = new THREE.Mesh(geometryCylinder, materialcylinder);
    this.cylinder.position.x = 2;
    this.cube = new THREE.Mesh(geometry, material);
    this.scene.add(this.cylinder);
    this.scene.add(this.cube);
    const light = new THREE.PointLight(0xffffff, 0.8);
    light.position.set(0, 0, 100);
    this.scene.add(light);
  };

  onRender = (delta) => {
    // this.cube.rotation.x += 3.5 * delta;
    // this.cube.rotation.y += 2 * delta;
    this.renderer.render(this.scene, this.camera);
  };
}
