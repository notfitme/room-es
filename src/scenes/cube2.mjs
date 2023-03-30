import * as THREE from "three";
import cubeCreator from "../objs/cube.mjs";
import lightCreator from "../objs/light.mjs";

export default () => {
  const cube = cubeCreator();
  const light = lightCreator();

  // 场景
  const scene = new THREE.Scene();

  // 将绘制数据添加到场景
  scene.add(cube.obj);
  scene.add(light.obj);

  // 摄像头
  const camera = new THREE.PerspectiveCamera(
    50,
    container.clientWidth / container.clientHeight,
    1,
    50
  );
  camera.position.set(0, 0, 10);
  camera.lookAt(0, 0, 0);

  const update = (timestamp) => {
    cube.route(timestamp);
  };

  return {
    scene,
    camera,
    update,
  };
};
