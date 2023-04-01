import { createElement, useEffect, createRef, useState } from 'react'
import { createRenderer } from '../utils/indes.mjs'

const Canvas = ({ showCreator }) => {
	
	if (!showCreator) {
		return createElement('div', null, 'please choise a show!')
	}
	
	return createElement(CanvasON, { showCreator })
}

const CanvasON = ({ showCreator }) => {
	const [renderer, setRenderer] = useState()

	useEffect(() => {
		setRenderer(createRenderer({ container: ref.current }))
	}, [])

	const ref = createRef()
	const canvasElement = createElement('div', { ref })

	useEffect(() => {
		if (renderer && ref.current) {
			renderer.setShow(showCreator({ container: ref.current }))
			renderer.startRender()
		}
	})

	return canvasElement
}

export default Canvas
