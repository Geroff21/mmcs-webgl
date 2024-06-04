import { initImGUI } from "../imgui.js";
import { loadShaders } from "./utils/loadShaders.js";
import { Scene } from "./scene.js";
import { RenderCore } from "./systems/render-core/renderCore.js";
import { SceneParticle } from "./sceneParticle.js";
import { initShaderPrograms } from "./utils/init-shader-programs.js";

let deltaTime = 0;

async function main() {
  canvas.width = document.body.clientWidth;
  canvas.height = document.body.clientHeight;

  const scene = new SceneParticle();
  await scene.preload();
  await scene.start();

  var renderCore = new RenderCore(canvas);

  await renderCore.preload();

  await renderCore.start();

  await scene.start();

  let then = 0;
  function render(now) {
    now *= 0.001;
    deltaTime = now - then;
    then = now;

    scene.tick(deltaTime);
    renderCore.tick(deltaTime);

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

async function preloads() {
  canvas = document.querySelector("#glcanvas1");

  gl = canvas.getContext("webgl2", {
    premultipliedAlpha: false
  });

  if (gl === null) {
    alert(
      "Unable to initialize WebGL. Your browser or machine may not support it."
    );
    return;
  }

  const shaders = await loadShaders();

  shaderPrograms = await initShaderPrograms(shaders);

  await main();

}

preloads();