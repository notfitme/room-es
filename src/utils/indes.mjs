import * as THREE from 'three'
export * from './map.mjs'

export const isBasicType = (obj) => !(typeof obj === 'object' || typeof obj === 'function')

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

export const createRenderer = ({ canvas } = {}) => {
	// 设置渲染器
	const renderer = new THREE.WebGLRenderer({ canvas })

	const state = {
		scene: null,
		canvas,
		camera: null,
		start: () => {},
		update: null,
		end: () => {},
		ui: null,
		running: false
	}

	const render = ({ updateControls } = {}) => {

		// 更新大小
		if (resizeRendererToDisplaySize(renderer)) {
			const canvas = renderer.domElement
			state.camera.aspect = canvas.clientWidth / canvas.clientHeight
			state.camera.updateProjectionMatrix()
		}

		renderer.render(state.scene, state.camera)

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
		state.start({render, controls: state.controls})
	}

	const end = () => {
		state.end()
	}

	const setShowCreator = async (showCreator) => {
		const { scene, camera, update, start = () => {}, end = () =>{}, ui } 
			= await showCreator({canvas: state.canvas, renderer: renderer, render })
		state.scene = scene
		state.camera = camera
		state.update = update
		state.start = start
		state.ui = ui
		state.end = end
	}

	const stopRender = () => {
		end()
		state.running = false
	}

	const startRender = () => {
		state.running = true
		start()
		render()
		update()
	}

	return {
		state,
		stopRender,
		startRender,
		setShowCreator
	}
}

export const create2dRenderer = ({ canvas } = {}) => {

	const state = {
		draw: () => {},
		update: null,
		canvas,
		camera: null,
		start: () => {},
		end: () => {},
		ui: null,
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
		const { draw, update, start = () => {}, end = () =>{}, ui } = await showCreator({canvas: state.canvas})
		state.draw = draw
		state.update = update
		state.start = start
		state.ui = ui
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
		state,
		stopRender,
		startRender,
		setShowCreator
	}
}
