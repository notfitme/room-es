import * as THREE from "three";

const color = 0xffffff;
const intensity = 1;

export default () => {
  const light = new THREE.DirectionalLight(color, intensity);
  light.position.set(-1, 2, 4);

  return {
    obj: light,
  };
};
