import { drawMesh } from "../meshes-render-core/draw-mesh.js";
import { Particle1 } from "../../content/particles/particle7.js";
import { draw } from "../meshes-render-core/draw.js";

class ParticlesRenderCore {
    constructor() {
        this.particle1 = new Particle1();
    }

    preload() {
        this.particle1.preload();
    }

    start() {
        this.particle1.start();
    }

    tick(deltaTime) {
        this.particle1.tick(deltaTime);
    }
}

export { ParticlesRenderCore };