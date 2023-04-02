import * as THREE from 'three'
import lineCreator from '../objs/line.mjs'
import cubeCreator from '../objs/cube.mjs'
import lightCreator from '../objs/light.mjs'

const cubeShow = ({ canvas }) => {
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

	const start = () => {

	}

	const end = () => {}

	const update = ({timestamp, render}) => {
		cube.route(timestamp)
		render()
	}

	return {
		scene,
		start,
		end,
		camera,
		update
	}
}


export default cubeShow
