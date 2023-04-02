import { createElement, useEffect, createRef, useState } from 'react'
import { createRenderer, create2dRenderer } from '../utils/indes.mjs'

const Canvas = ({ showCreator }) => {
	if(!showCreator) {
		return createElement('div', null, 'please choise a show!')
	}

	return showCreator.canvasType === '2d' ? createElement(Pure2dCanvas, { showCreator }) : createElement(PureCanvas, { showCreator })
}

const Pure2dCanvas = ({ showCreator }) => {
	const [renderer, setRenderer] = useState()
	const ref = createRef()
	const canvasElement = createElement('div', { ref })
	
	useEffect(() => {
		setRenderer(create2dRenderer({ container: ref.current }))
	}, [])
	

	useEffect(() => {
		const render = async () => {
			if (renderer && ref.current) {
				await renderer.setShowCreator(showCreator)
				renderer.startRender()
			}
		}
		render()
	})

	return canvasElement
}

const PureCanvas = ({ showCreator }) => {
	const [renderer, setRenderer] = useState()
	const ref = createRef()
	const canvasElement = createElement('div', { ref })
	
	useEffect(() => {
		setRenderer(createRenderer({ container: ref.current }))
	}, [])
	

	useEffect(() => {
		const render = async () => {
			if (renderer && ref.current) {
				await renderer.setShowCreator(showCreator)
				renderer.startRender()
			}
		}
		render()
	})

	return canvasElement
}

export default Canvas
