import WebGL from 'three/addons/capabilities/WebGL.js'
import { createElement, useState } from 'react'
import Select from './components/Select.mjs'
import Canvas from './components/Canvas.mjs'
import cubeShow from './scenes/cube.mjs'
import cube2Show from './scenes/cube2.mjs'

const shows = [
	{
		key: 'cube',
		label: 'cube',
		value: cubeShow
	},
	{
		key: 'cube2',
		label: 'cube2',
		value: cube2Show
	}
]

const RenderMain = () => {
	const [sceneOption, setScene] = useState({})
	const { value: showCreator, key: optionId } = sceneOption

	const canvasElement = showCreator ? createElement(Canvas, { showCreator: showCreator }) : createElement('div', null, 'please choise a show!')

	const selectElement = createElement(Select, {
		options: shows,
		value: optionId,
		onChange: setScene
	})

	return createElement('div', null, selectElement, canvasElement)
}

function Main() {
	return WebGL.isWebGLAvailable() ? createElement(RenderMain) :  createElement('div', null, WebGL.getWebGLErrorMessage())
}

export default Main
