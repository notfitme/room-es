import WebGL from 'three/addons/capabilities/WebGL.js'
import { createElement, useState } from 'react'
import Select from './components/Select.mjs'
import Canvas from './components/Canvas.mjs'
import cubeShowCreator from './scenes/cube.mjs'
import cube2ShowCreator from './scenes/cube2.mjs'
import map2dShowCreator from './scenes/map2d.mjs'

const shows = [
	{
		key: 'cube',
		label: 'cube',
		value: cubeShowCreator
	},
	{
		key: 'cube2',
		label: 'cube2',
		value: cube2ShowCreator
	},
	{
		key: 'map2d',
		label: 'map2d',
		value: map2dShowCreator
	}
]

const RenderMain = () => {
	const [sceneOption, setScene] = useState({})
	const { value: showCreator, key: optionId } = sceneOption

	const canvasElement = showCreator ? createElement(Canvas, { showCreator }) : createElement('div', null, 'please choise a show!')

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
