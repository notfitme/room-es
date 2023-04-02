import * as THREE from 'three'
import cubeCreator from '../objs/cube.mjs'
import lightCreator from '../objs/light.mjs'

const cube2Show = ({canvas}) => {
	const cube = cubeCreator()
	const light = lightCreator()

	// 场景
	const scene = new THREE.Scene()

	// 将绘制数据添加到场景
	scene.add(cube.obj)
	scene.add(light.obj)

	// 摄像头
	const camera = new THREE.PerspectiveCamera(
		50,
		canvas?.clientWidth / canvas?.clientHeight,
		1,
		50
	)
	camera.position.set(0, 0, 10)
	camera.lookAt(0, 0, 0)

	const update = ({timestamp, render}) => {
		cube.route(timestamp)
		render()
	}

	const start = () => {

	}

	const end = () => {}

	return {
		scene,
		start,
		end,
		camera,
		update
	}
}

export default cube2Show
