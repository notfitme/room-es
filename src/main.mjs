import { createElement, useEffect, createRef, useState } from "react";
import WebGL from "three/addons/capabilities/WebGL.js";
import { createRenderer } from "./utils/indes.mjs";
import cubeSceneSystem from "./scenes/cube.mjs";
import cube2SceneSystem from "./scenes/cube2.mjs";

const sceneSystems = [
  {
    sceneSystem: cubeSceneSystem(),
    id: "cube",
  },
  {
    sceneSystem: cube2SceneSystem(),
    id: "cube2",
  },
];
const optionElements = sceneSystems.map(({ id }) =>
  createElement(
    "option",
    {
      key: id,
      value: id,
    },
    id
  )
);

const Select = ({ value = '', onChange }) =>
  createElement(
    "select",
    {
      value,
      onChange: (event) =>
        onChange(
          sceneSystems.find(
            (sceneSystem) => sceneSystem.id === event.target.value
          )
        ),
    },
    createElement(
      "option",
      {
        value: '',
      },
      '请选择'
    ),
    optionElements
  );

const Canvas = ({ sceneSystem }) => {
  if (!sceneSystem) {
    return createElement("div", null, "please choise a sceneSystem!");
  }

  const ref = createRef();
  const canvasElement = createElement("div", { ref });
  const [renderer, setRenderer] = useState();

  useEffect(() => {
    setRenderer(createRenderer({ container: ref.current }));
  }, []);

  if (renderer) {
    renderer.setSceneSystem(sceneSystem);
    renderer.startRender();
  }

  return canvasElement;
};

function Main() {
  if (!WebGL.isWebGLAvailable()) {
    return createElement("div", null, WebGL.getWebGLErrorMessage());
  }

  const [sceneOption, setScene] = useState();

  const canvasElement = createElement(Canvas, {
    sceneSystem: sceneOption?.sceneSystem,
  });
  const selectElement = createElement(Select, {
    value: sceneOption?.id,
    onChange: setScene,
  });

  return createElement("div", null, selectElement, canvasElement);
}

export default Main;
