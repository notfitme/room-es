import * as THREE from 'three'

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

export const createRenderer = ({ container } = {}) => {
	// 设置渲染器
	const renderer = new THREE.WebGLRenderer()
	container.appendChild(renderer.domElement)

	const state = {
		scene: null,
		container,
		camera: null,
		update: () => {},
		running: true
	}

	const animate = (timestamp) => {
		timestamp *= 0.001

		// 更新大小
		if (resizeRendererToDisplaySize(renderer)) {
			const canvas = renderer.domElement
			state.camera.aspect = canvas.clientWidth / canvas.clientHeight
			state.camera.updateProjectionMatrix()
		}

		state.update(timestamp)

		renderer.render(state.scene, state.camera)

		if (state.running) {
			requestAnimationFrame(animate)
		}
	}

	const setShowCreator = (showCreator) => {
		const { scene, camera, update = () => {} } = showCreator({container: state.container})
		state.scene = scene
		state.camera = camera
		state.update = update
	}

	const stopRender = () => {
		state.running = false
	}

	const startRender = () => {
		state.running = true
		animate()
	}

	return {
		stopRender,
		startRender,
		setShowCreator
	}
}

export const isBasicType = (obj) => !(typeof obj === 'object' || typeof obj === 'function')