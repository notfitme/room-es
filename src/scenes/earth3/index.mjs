import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import UiShowCreator from './ui.mjs'
import { parseData, loadFile } from '../../utils/indes.mjs'

function mapValues(data, fn) {
  return data.map((row, rowNdx) => {
    return row.map((value, colNdx) => {
      return fn(value, rowNdx, colNdx);
    });
  });
}

function makeDiffFile(baseFile, otherFile, compareFn) {
  let min;
  let max;
  const baseData = baseFile.data;
  const otherData = otherFile.data;
  const data = mapValues(baseData, (base, rowNdx, colNdx) => {
    const other = otherData[rowNdx][colNdx];
      if (base === undefined || other === undefined) {
        return undefined;
      }
      const value = compareFn(base, other);
      min = Math.min(min === undefined ? value : min, value);
      max = Math.max(max === undefined ? value : max, value);
      return value;
  });
  // make a copy of baseFile and replace min, max, and data
  // with the new data
  return {...baseFile, min, max, data};
}

function amountGreaterThan(a, b) {
  return Math.max(a - b, 0);
}

function generateFiles(fileInfos) {
  const menInfo = fileInfos[0];
  const womenInfo = fileInfos[1];
  const menFile = menInfo.file;
  const womenFile = womenInfo.file;

  const files = []

  files.push({
    name: '>50%men',
    hueRange: [0.6, 1.1],
    file: makeDiffFile(menFile, womenFile, (men, women) => {
      return amountGreaterThan(men, women);
    }),
  });
  files.push({
    name: '>50% women',
    hueRange: [0.0, 0.4],
    file: makeDiffFile(womenFile, menFile, (women, men) => {
      return amountGreaterThan(women, men);
    }),
  });

  return files
}

function addBoxes({file, hueRange}, scene) {
  const {min, max, data} = file;
  const range = max - min;

  // 通过这个对象，横向旋转，改变经度
  const lonHelper = new THREE.Object3D();
  scene.add(lonHelper);
  
  // 通过这个对象，竖向旋转，改变纬度
  const latHelper = new THREE.Object3D();
  lonHelper.add(latHelper);

  // 通过这个对象，移动顶部的方形
  const positionHelper = new THREE.Object3D();
  positionHelper.position.z = 1; // 调整位置按z到1(球体的半径)，方便进行旋转
  latHelper.add(positionHelper);

  // 通过这个对象，沿着z轴偏移，使得中心在底部（方体的z高是1，移动0.5就达到底部是中心效果）, 以便接下来沿着Z轴缩放
  const originHelper = new THREE.Object3D();
  originHelper.position.z = 0.5;
  positionHelper.add(originHelper);

  // 顶点着色法，设定每个盒子的每个顶点的所有颜色
  const color = new THREE.Color();

  // 捏造参数，用来修正贴图与数据的位置差异
  const lonFudge = Math.PI * .5; // 修正90度
  const latFudge = Math.PI * -0.135; // 修正-24.3度

  const geometries = []; // 方体集

  // row(latNdx): 1-145, col(lonNdx): 1-360
  data.forEach((row, latNdx) => {
    row.forEach((value, lonNdx) => {
      if (value === undefined) {
        return;
      }
      const amount = (value - min) / range; // 值在总量的相对占比，在[0, 1]之间，作为“量”的指标
      const geometry = new THREE.BoxGeometry(1, 1, 1);

      // 数据的坐标转换成旋转角度
      // x[-180，180] y[-60, 85] = [-PI, PI] [-PI/3, 17*PI/18*2] = x:[-1/2, 3/2]PI  y:[-281/600, 607/(360*5)]PI
      lonHelper.rotation.y = THREE.MathUtils.degToRad(lonNdx + file.xllcorner) + lonFudge; // 绕着y轴旋转，就是控制经度
      latHelper.rotation.x = THREE.MathUtils.degToRad(latNdx + file.yllcorner) + latFudge; // 绕x轴旋转，就是控制纬度

      // 使用positionHelper放缩z轴，其子元素也被放缩（即originHelper也被放缩了）
      positionHelper.scale.set(0.005, 0.005, THREE.MathUtils.lerp(0.01, 0.5, amount));
      // 最后获得originHelper的世界变换矩阵
      originHelper.updateWorldMatrix(true, false);
      geometry.applyMatrix4(originHelper.matrixWorld);


      // 计算颜色
      const hue = THREE.MathUtils.lerp(...hueRange, amount);
      const saturation = 1;
      const lightness = THREE.MathUtils.lerp(0.4, 1.0, amount);
      color.setHSL(hue, saturation, lightness);
      // 以0到255之间的值数组形式获取颜色
      const rgb = color.toArray().map(v => v * 255);
  
      // 创建一个数组来存储每个顶点的颜色
      const numVerts = geometry.getAttribute('position').count;
      const itemSize = 3;  // r, g, b
      const colors = new Uint8Array(itemSize * numVerts);
  
      // 将颜色复制到每个顶点的颜色数组中
      colors.forEach((v, ndx) => {
        colors[ndx] = rgb[ndx % 3];
      });
  
      const normalized = true; // 是否标准化
      const colorAttrib = new THREE.BufferAttribute(colors, itemSize, normalized);
      geometry.setAttribute('color', colorAttrib);

      geometries.push(geometry);
    });
  });

  // 所有的方体合成为一个3d物体
  const mergedGeometry = mergeGeometries(geometries, false);
  const material = new THREE.MeshBasicMaterial({vertexColors: true}); // 使用顶点颜色
  const mesh = new THREE.Mesh(mergedGeometry, material);
  scene.add(mesh);

  return mesh;
}

const earth3Show = async ({ canvas, render}) => {
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

  const fileInfos = [
    {name: 'men',   hueRange: [0.7, 0.3], url: './lib/gpw_v4_basic_demographic_characteristics_rev10_a000_014mt_2010_cntm_1_deg.asc' },
    {name: 'women', hueRange: [0.9, 1.1], url: './lib/gpw_v4_basic_demographic_characteristics_rev10_a000_014ft_2010_cntm_1_deg.asc' },
  ];

  await Promise.all(fileInfos.map(async (fileInfo) => {
    const text = await loadFile(fileInfo.url);
    fileInfo.file = parseData(text);
  }))

  const othersFiles = generateFiles(fileInfos)
  fileInfos.push(...othersFiles)

  const { ReactComponent: ui, hooks } = UiShowCreator(fileInfos, fileInfos[0])

  // show the selected data, hide the rest
  const showFileInfo = (fileInfos, fileInfo) => {
    fileInfos.forEach((info) => {
      const visible = fileInfo === info;
      info.root.visible = visible; // 通过这个控制是否显示
      hooks.setCurrentFileInfo(fileInfo)
    });
    requestRenderIfNotRequested();
  }

  fileInfos.forEach((info) => {
    const boxes = addBoxes({file: info.file, hueRange: info.hueRange}, scene);
    info.root = boxes;
    info.show = () =>{
      showFileInfo(fileInfos, info);
    }
  });


  // show the first set of data
  // showFileInfo(fileInfos, fileInfos[0]);

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
    // update,
    ui
	}
}

export default earth3Show