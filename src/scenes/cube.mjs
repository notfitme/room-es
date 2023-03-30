import * as THREE from "three";
import lineCreator from "../objs/line.mjs";
import cubeCreator from "../objs/cube.mjs";
import lightCreator from "../objs/light.mjs";

export default () => {
  const line = lineCreator();
  const cube = cubeCreator();
  const light = lightCreator();

  // 场景
  const scene = new THREE.Scene();

  // 将绘制数据添加到场景
  scene.add(line.obj);
  scene.add(cube.obj);
  scene.add(light.obj);

  // 摄像头
  const camera = new THREE.PerspectiveCamera(
    45,
    container.clientWidth / container.clientHeight,
    1,
    500
  );
  camera.position.set(0, 0, 50);
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
