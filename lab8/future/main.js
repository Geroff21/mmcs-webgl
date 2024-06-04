import { Scene } from "./scene.js";
import { Core } from "./core.js";
import { Gui } from "./gui.js";

async function main(gui, canvas, vsSource, fsSource) {

	let core = new Core(gui, canvas, vsSource, fsSource);

	await core.preload();
	await core.start();

	let scene = new Scene();

	await scene.preload();
	await scene.start();

	let then = 0;
	function render(now) {
		now *= 0.001;
		deltaTime = now - then;
		then = now;

		scene.tick();
		renderCore.tick();

		requestAnimationFrame(render);
	}

	requestAnimationFrame(render);
}

async function preloads() {
	var canvas = "canvas";
	const shaders = await loadShaders();
	await main(gui, canvas, shaders.vertexShader, shaders.fragmentShader);

	let GUI = setGui();
}