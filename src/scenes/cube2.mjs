import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import cubeCreator from '../objs/cube.mjs'
import lightCreator from '../objs/light.mjs'

const cube2Show = ({canvas, render}) => {
	const cube = cubeCreator()
	const light = lightCreator()

	// 场景
	const scene = new THREE.Scene()

	// 将绘制数据添加到场景
	scene.add(cube.obj)
	scene.add(light.obj)

	// 摄像头
	const aspect = canvas.clientWidth / canvas.clientHeight
	const camera = new THREE.PerspectiveCamera(50,aspect,1,50)
	camera.position.set(0, 0, 10)
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

	const update = ({timestamp}) => {
		cube.route(timestamp)
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
		update
	}
}

export default cube2Show
