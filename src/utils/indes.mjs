import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

function resizeRendererToDisplaySize(renderer) {
	const canvas = renderer.domElement
	const pixelRatio = window.devicePixelRatio
	const width = (canvas.clientWidth * pixelRatio) | 0
	const height = (canvas.clientHeight * pixelRatio) | 0
	const needResize = canvas.width !== width || canvas.height !== height
	if (needResize) {
		renderer.setSize(width, height, false)
	}
	return needResize
}

function resizeRendererToDisplaySize2d(canvas) {
	const pixelRatio = window.devicePixelRatio
	const width = (canvas.clientWidth * pixelRatio) | 0
	const height = (canvas.clientHeight * pixelRatio) | 0
	const needResize = canvas.width !== width || canvas.height !== height
	if (needResize) {
		canvas.setAttribute('width', width)
		canvas.setAttribute('height', height)
	}

	return needResize
}

export const createRenderer = ({ container } = {}) => {
	// 设置渲染器
	const canvas = document.createElement('canvas')
	const renderer = new THREE.WebGLRenderer({ canvas })
	container.appendChild(canvas)

	const state = {
		scene: null,
		canvas,
		controls: null,
		camera: null,
		update: null,
		start: () => {},
		end: () => {},
		running: false
	}

	let renderRequested = false
	const render = ({ updateControls } = {}) => {
		renderRequested = false

		// 更新大小
		if (resizeRendererToDisplaySize(renderer)) {
			const canvas = renderer.domElement
			state.camera.aspect = canvas.clientWidth / canvas.clientHeight
			state.camera.updateProjectionMatrix()
		}

		if(updateControls) {
			state.controls.update()
		}
		renderer.render(state.scene, state.camera)

	}

	function requestRenderIfNotRequested() {
		if (!renderRequested) {
			renderRequested = true
			requestAnimationFrame(() => render({ updateControls: true }))
		}
	}

	const update = (timestamp) => {
		if(!state.update) {
			return
		}
		timestamp *= 0.001
		state.update({timestamp, render})

		if (state.running) {
			requestAnimationFrame(update)
		}
	}

	const start = () => {
		state.start({render})
	}

	const end = () => {
		state.end()
	}

	const setShowCreator = async (showCreator) => {
		const { scene, camera, update, start = () => {}, end = () =>{} } = await showCreator({canvas: state.canvas})
		state.scene = scene
		state.camera = camera
		state.update = update
		state.start = start
		state.end = end

		state.controls = new OrbitControls(camera, canvas)
		state.controls.enableDamping = true
	}

	const stopRender = () => {
		state.running = false
		state.controls.removeEventListener('change', requestRenderIfNotRequested);
		window.removeEventListener('resize', requestRenderIfNotRequested);
		end()
	}

	const startRender = () => {
		state.running = true
		start()
		render()
		state.controls.addEventListener('change', requestRenderIfNotRequested);
		window.addEventListener('resize', requestRenderIfNotRequested);
		update()
	}

	return {
		stopRender,
		startRender,
		setShowCreator
	}
}


export const create2dRenderer = ({ container } = {}) => {

	const canvas = document.createElement('canvas')
	container.appendChild(canvas)

	const state = {
		draw: () => {},
		update: null,
		canvas,
		camera: null,
		start: () => {},
		end: () => {},
		running: false
	}

	const render = () => {
		resizeRendererToDisplaySize2d(canvas)
		state.draw()
	}

	const start = () => {
		state.start({render})
	}

	const update = (timestamp) => {
		if(!state.update) {
			return
		}
		timestamp *= 0.001
		state.update({timestamp, render})

		if (state.running) {
			requestAnimationFrame(update)
		}
	}

	const end = () => {
		state.end()
	}

	const setShowCreator = async (showCreator) => {
		const { draw, update, start = () => {}, end = () =>{} } = await showCreator({canvas: state.canvas})
		state.draw = draw
		state.update = update
		state.start = start
		state.end = end
	}

	const stopRender = () => {
		state.running = false
		window.removeEventListener('resize', render);
		end()
	}

	const startRender = () => {
		state.running = true
		start()
		render()
		window.addEventListener('resize', render);
		update()
	}

	return {
		stopRender,
		startRender,
		setShowCreator
	}
}

export const isBasicType = (obj) => !(typeof obj === 'object' || typeof obj === 'function')