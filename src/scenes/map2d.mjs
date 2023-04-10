import { parseData, loadFile } from '../utils/indes.mjs'

function px(v) {
	return `${v | 0}px`
}

function hsl(h, s, l) {
	return `hsl(${(h * 360) | 0},${(s * 100) | 0}%,${(l * 100) | 0}%)`
}


const map2D = async ({ canvas }) => {
	const ascUrl = './lib/gpw_v4_basic_demographic_characteristics_rev10_a000_014mt_2010_cntm_1_deg.asc'
	const file = await loadFile(ascUrl).then(parseData)
	const { min, max, ncols, nrows, data } = file
	const range = max - min
	const ctx = canvas.getContext('2d')
	let ncolsvar = ncols

	const draw = () => {
		// make the canvas the same size as the data
		// ctx.canvas.width = ncols
		// ctx.canvas.height = nrows
		// but display it double size so it's not too small
		// ctx.canvas.style.width = px(ncols * 2)
		// fill the canvas to dark gray
		

		ctx.fillStyle = '#444'
		ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
		data.forEach((row, latNdx) => {
			row.forEach((value, lonNdx) => {
				if (value === undefined) {
					return
				}
				const amount = (value - min) / range
				const hue = 1
				const saturation = 1
				const lightness = amount
				ctx.fillStyle = hsl(hue, saturation, lightness)
				ctx.fillRect(lonNdx, latNdx, 1, 1)
			})
		})

		if(canvas.width !== ncolsvar) {
			ctx.scale(canvas.width/ncols, canvas.height/nrows)
			ncolsvar = canvas.width
		}
	}

	const update = () => {

	}

	const start = ({render}) => {
		setTimeout(render, 0)
	}

	const end = () => {

	}

	return {
		draw,
		start,
		update,
		end
	}
	
}

map2D.canvasType = '2d'

export default map2D
