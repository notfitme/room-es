import WebGL from 'three/addons/capabilities/WebGL.js'
import { createElement, useState } from 'react'
import Select from './components/Select.mjs'
import Canvas from './components/Canvas.mjs'
import cubeShowCreator from './scenes/cube.mjs'
import cube2ShowCreator from './scenes/cube2.mjs'
import map2dShowCreator from './scenes/map2d.mjs'
import earth1ShowCreator from './scenes/earth1.mjs'
import earth2ShowCreator from './scenes/earth2.mjs'
import earth3ShowCreator from './scenes/earth3/index.mjs'

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
	},
	{
		key: 'earth1',
		label: 'earth1',
		value: earth1ShowCreator
	},
	{
		key: 'earth2',
		label: 'earth2',
		value: earth2ShowCreator
	},
	{
		key: 'earth3',
		label: 'earth3',
		value: earth3ShowCreator
	}
]

const RenderMain = () => {
	const [sceneOption, setScene] = useState()
	const { value: showCreator, key: optionId } = sceneOption || {}

	const canvasElement = createElement(Canvas, { showCreator })

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
