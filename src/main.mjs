import WebGL from 'three/addons/capabilities/WebGL.js'
import { createElement, useEffect, createRef, useState } from 'react'
import { createRenderer } from './utils/indes.mjs'
import cubeShow from './scenes/cube.mjs'
import cube2Show from './scenes/cube2.mjs'

const shows = [
	{
		show: cubeShow(),
		id: 'cube'
	},
	{
		show: cube2Show(),
		id: 'cube2'
	}
]
const optionElements = shows.map(({ id }) =>
	createElement(
		'option',
		{
			key: id,
			value: id
		},
		id
	)
)

const Select = ({ value = '', onChange }) =>
	createElement(
		'select',
		{
			value,
			onChange: (event) =>
				onChange(shows.find((show) => show.id === event.target.value))
		},
		createElement(
			'option',
			{
				value: ''
			},
			'请选择'
		),
		optionElements
	)

const Canvas = ({ show }) => {
	if (!show) {
		return createElement('div', null, 'please choise a show!')
	}

	const ref = createRef()
	const canvasElement = createElement('div', { ref })
	const [renderer, setRenderer] = useState()

	useEffect(() => {
		setRenderer(createRenderer({ container: ref.current }))
	}, [])

	if (renderer) {
		renderer.setShow(show)
		renderer.startRender()
	}

	return canvasElement
}

function Main() {
	if (!WebGL.isWebGLAvailable()) {
		return createElement('div', null, WebGL.getWebGLErrorMessage())
	}

	const [sceneOption, setScene] = useState()

	const canvasElement = createElement(Canvas, {
		show: sceneOption?.show
	})
	const selectElement = createElement(Select, {
		value: sceneOption?.id,
		onChange: setScene
	})

	return createElement('div', null, selectElement, canvasElement)
}

export default Main
