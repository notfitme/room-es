import { createElement } from 'react'
import { isBasicType } from '../utils/indes.mjs'

const Select = ({ value = '', onChange, options = [] }) => {
	const getKey = (option) => option.key || (isBasicType(option.value) ? option.value : option.label )
	const getValue = (option) => isBasicType(option.value) ? option.value : (option.key || option.label)
	const optionElements = options.map((option) => createElement('option', { key: getKey(option), value: getValue(option) }, option.label))

	return createElement(
		'select',
		{
			value,
			onChange: ({ target }) => {
				onChange(options.find((option) => getValue(option) === target.value))
			}
		},
		createElement('option', { value: '' }, '请选择'),
		optionElements
	)

}


export default Select