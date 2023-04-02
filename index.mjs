import { createElement } from 'react'
import { createRoot } from 'react-dom/client'
import Main from './src/main.mjs'

createRoot(document.getElementById('app')).render(createElement(Main))
