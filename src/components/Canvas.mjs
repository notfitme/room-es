import { createElement, createRef, Component } from 'react'
import { createRenderer, create2dRenderer } from '../utils/indes.mjs'

const Canvas = ({ showCreator }) => {
	if(!showCreator) {
		return createElement('div', null, '"showCreator" is empty!')
	}

	const Canvas = showCreator.canvasType === '2d'  ? Canvas2D : Canvas3D

	return createElement(Canvas, { showCreator})
}

const Canvas2D = ({showCreator}) => createElement(CanvasRenderer, { showCreator, createRenderer: create2dRenderer })

const Canvas3D = ({ showCreator }) =>  createElement(CanvasRenderer, { showCreator, createRenderer })

const LOADING = createElement('div', null, 'loading')

class CanvasRenderer extends Component {
	canvasRef = createRef()
	canvas = createElement('canvas', { ref: this.canvasRef, id: 'canvas' })
	renderer
	state = {
		ui: LOADING,
	}

	async renderShow() {
		const renderer = this.renderer

		this.setState({ ui: LOADING })
		await renderer.setShowCreator(this.props.showCreator)
		renderer.startRender()
		this.setState({ui: createElement(renderer.state.ui || 'div')})

	}

	componentDidMount() {
		this.renderer = this.props.createRenderer({ canvas: this.canvasRef.current })
		this.renderShow()
	}

	// createRenderer改变时应该重新执行挂载新的canvas
	componentDidUpdate(prevProps) {
		if (this.props.createRenderer !== prevProps.createRenderer) {
			this.componentWillUnmount()
			throw new Error('"this.props.createRenderer" can not be changed，because one kind of "renderer" match one canvas dom')
		}

    if (this.props.showCreator !== prevProps.showCreator) {
      this.renderShow()
    }
  }

	componentWillUnmount() {
		this.renderer.stopRender()
	}

	render() {
    return createElement('div', { className: 'container'}, this.state.ui, this.canvas)
  }
}

export default Canvas
