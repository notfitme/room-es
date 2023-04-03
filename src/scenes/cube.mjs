import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import lineCreator from '../objs/line.mjs'
import cubeCreator from '../objs/cube.mjs'
import lightCreator from '../objs/light.mjs'

const cubeShow = ({ canvas, render}) => {
	const line = lineCreator()
	const cube = cubeCreator()
	const light = lightCreator()

	// 场景
	const scene = new THREE.Scene()

	// 将绘制数据添加到场景
	scene.add(line.obj)
	scene.add(cube.obj)
	scene.add(light.obj)

	// 摄像头
	const aspect = canvas?.clientWidth / canvas?.clientHeight
	const camera = new THREE.PerspectiveCamera(45,aspect,1,500)
	camera.position.set(0, 0, 50)
	camera.lookAt(0, 0, 0)

	// 摄像头控制器
	const controls = new OrbitControls(camera, canvas)
	controls.enableDamping = true

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
		cube.route(timestamp)
		requestRenderIfNotRequested()
	}

	const end = () => {
		controls.removeEventListener('change', requestRenderIfNotRequested);
		window.removeEventListener('resize', requestRenderIfNotRequested);
	}


	return {
		start,
		update,
		end,
		scene,
		camera
	}
}


export default cubeShow
