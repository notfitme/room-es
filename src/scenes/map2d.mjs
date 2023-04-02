async function loadFile(url) {
	const req = await fetch(url)
	return req.text()
}

function parseData(text) {
	const data = []
	const settings = { data }
	let max
	let min
	// split into lines
	text.split('\n').forEach((line) => {
		// split the line by whitespace
		const parts = line.trim().split(/\s+/)
		if (parts.length === 2) {
			// only 2 parts, must be a key/value pair
			settings[parts[0]] = parseFloat(parts[1])
		} else if (parts.length > 2) {
			// more than 2 parts, must be data
			const values = parts.map((v) => {
				const value = parseFloat(v)
				if (value === settings.NODATA_value) {
					return undefined
				}
				max = Math.max(max === undefined ? value : max, value)
				min = Math.min(min === undefined ? value : min, value)
				return value
			})
			data.push(values)
		}
	})
	return Object.assign(settings, { min, max })
}


function px(v) {
	return `${v | 0}px`
}

function hsl(h, s, l) {
	return `hsl(${(h * 360) | 0},${(s * 100) | 0}%,${(l * 100) | 0}%)`
}


const map2D = async ({ canvas }) => {
	const ascUrl = './lib/gpw_v4_basic_demographic_characteristics_rev10_a000_014mt_2010_cntm_1_deg.asc'
	const file = await loadFile(ascUrl).then(parseData)


	const draw = (ctx) => {
		const { min, max, ncols, nrows, data } = file
		const range = max - min
		// make the canvas the same size as the data
		// ctx.canvas.width = ncols
		// ctx.canvas.height = nrows
		// but display it double size so it's not too small
		// ctx.canvas.style.width = px(ncols * 2)
		// fill the canvas to dark gray
		ctx.fillStyle = '#444'
		ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
		// draw each data point
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
	}

	const update = () => {}

	return {
		draw,
		update
	}
	
}

map2D.canvasType = '2d'

export default map2D
