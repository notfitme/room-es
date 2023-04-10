import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { parseData, loadFile } from '../utils/indes.mjs'


function addBoxes(file, scene) {
  const {min, max, data} = file;
  const range = max - min;

  // make one box geometry
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  // 将物体像z移动0.5，此时因为本身长度是1，所以移动后底部和中心点对齐，方便下面进行以底部未=为中心点进行缩放
  geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 0, 0.5));

  // 通过这个对象，横向旋转，改变经度
  const lonHelper = new THREE.Object3D();
  scene.add(lonHelper);
  
  // 通过这个对象，竖向旋转，改变纬度
  const latHelper = new THREE.Object3D();
  lonHelper.add(latHelper);

  // 通过这个对象，移动顶部的方形
  const positionHelper = new THREE.Object3D();
  positionHelper.position.z = 1; // 调整位置按z到1，方便进行旋转
  latHelper.add(positionHelper);

  // 捏造参数，用来修正贴图与数据的位置差异
  const lonFudge = Math.PI * .5; // 修正90度
  const latFudge = Math.PI * -0.135; // 修正-24.3度

  // row(latNdx): 1-145, col(lonNdx): 1-360
  data.forEach((row, latNdx) => {
    row.forEach((value, lonNdx) => {
      if (value === undefined) {
        return;
      }
      const amount = (value - min) / range; // 值在总量的相对占比，在[0, 1]之间，作为“量”的指标
      const material = new THREE.MeshBasicMaterial();
      const hue = THREE.MathUtils.lerp(0.7, 0.3, amount); // 色相，线性插值[0,1]对照到[0.7, 0.3]
      const saturation = 1; // 饱和度，1
      const lightness = THREE.MathUtils.lerp(0.4, 1.0, amount); // 亮度，线性插值[0,1]对照到[0.4, 1.0]
      material.color.setHSL(hue, saturation, lightness);
      const mesh = new THREE.Mesh(geometry, material); // 显示数据的方体
      scene.add(mesh);

      // 数据的坐标转换成旋转角度
      // x[-180，180] y[-60, 85] = [-PI, PI] [-PI/3, 17*PI/18*2] = x:[-1/2, 3/2]PI  y:[-281/600, 607/(360*5)]PI
      // TODO 修正的理由
      lonHelper.rotation.y = THREE.MathUtils.degToRad(lonNdx + file.xllcorner) + lonFudge; // 绕着y轴旋转，就是控制经度
      latHelper.rotation.x = THREE.MathUtils.degToRad(latNdx + file.yllcorner) + latFudge; // 绕x轴旋转，就是控制纬度

      // 获取旋转后的物体的世界坐标的转移矩阵，并将转移矩阵应用到方体中
      positionHelper.updateWorldMatrix(true, false);
      mesh.applyMatrix4(positionHelper.matrixWorld);

      // 这里按照“量”，进行长度缩放
      mesh.scale.set(0.005, 0.005, THREE.MathUtils.lerp(0.01, 0.5, amount));
    });
  });
}

const earth2Show = async ({canvas, render}) => {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('black');

  const camera = new THREE.PerspectiveCamera(60, 2, 0.1, 10);
  camera.position.z = 2.5;


  const loader = new THREE.TextureLoader();
  const texture = await loader.load('./lib/images/world.jpg')
  const geometry = new THREE.SphereGeometry(1, 64, 32)
  const material = new THREE.MeshBasicMaterial({map: texture})
  scene.add(new THREE.Mesh(geometry, material))

  // 摄像头控制器
	const controls = new OrbitControls(camera, canvas)
	controls.enableDamping = true

  const ascUrl = './lib/gpw_v4_basic_demographic_characteristics_rev10_a000_014mt_2010_cntm_1_deg.asc'
  const file = await loadFile(ascUrl).then(parseData)
  addBoxes(file,scene)

	let renderRequested = false
	const sRender = () => {
		renderRequested = false
		render()
		controls.update()
	}

	const requestRenderIfNotRequested = () => {
		if (!renderRequested) {
			renderRequested = true
			requestAnimationFrame(() => sRender({ updateControls: true }))
		}
	}

	const start = () => {
		controls.addEventListener('change', requestRenderIfNotRequested);
		window.addEventListener('resize', requestRenderIfNotRequested);
	}

	const update = ({ timestamp }) => {
		requestRenderIfNotRequested()
	}

	const end = () => {
		controls.removeEventListener('change', requestRenderIfNotRequested);
		window.removeEventListener('resize', requestRenderIfNotRequested);
	}

  
  return {
		scene,
		start,
		end,
		camera,
		// update
	}
}


export default earth2Show