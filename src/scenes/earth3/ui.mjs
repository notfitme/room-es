import { createElement, useState, useEffect } from 'react'

const UiShow = (fileInfos, defaultInfo) => {
  const hooks = {}

  const ReactComponent = (props) => {
    const [currentFileInfo, setCurrentFileInfo] = useState(defaultInfo)
    hooks.currentFileInfo = currentFileInfo
    hooks.setCurrentFileInfo = setCurrentFileInfo

    useEffect(() => {
      defaultInfo.show()
    }, [])

    const List = fileInfos.map(fileInfo => 
      createElement(
        'div',
        { 
          className: currentFileInfo.name === fileInfo.name ? 'selected': '',
          onMouseOver: (event) => { fileInfo.show(event) },
          onTouchStart: (event) => { fileInfo.show(event) },
        },
        fileInfo.name
      )
    )
    return createElement('div', null, ...List)
  }

  return {
    ReactComponent,
    hooks
  }
}

export default UiShow