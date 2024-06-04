import { draw } from "../../systems/meshes-render-core/draw.js";
import { initBuffers } from "../../systems/meshes-render-core/init-mesh-buffers.js";

class Particle1 {
    constructor() {
        this.timeFromSpawn = 1.0;
        this.toggle = true;

        this.particles = [];
    }

    async preload() {

    }

    async start() {

    }

    spark(position, rotation, scale, color, texture_num) {

        var tex;

        if (texture_num == 0) {
            tex = loadedAssets["/textures/firework.png"]
        }
        if (texture_num == 1) {
            tex = loadedAssets["/textures/firework1.png"]
        }
        if (texture_num == 2) {
            tex = loadedAssets["/textures/firework2.png"]
        }

        draw(
            {
                mesh: loadedAssets["particle-plane"],
                transform: {
                    location: position,
                    rotation: rotation,
                    scale: [scale, scale, scale]
                }
            },
            {
                domain: "particle",
                color: color,
                textureObjects: [
                    tex
                ]
            }
        )
    }

    tick(deltaTime) {
        if (this.timeFromSpawn > 2) {
            for (let i = 0; i < 256; ++i) {
                this.particles.push(new Emiter())
            }
            this.timeFromSpawn = 0;
        } else {
            this.timeFromSpawn += deltaTime;
        }

        this.particles = this.particles.filter(elem => {
            elem.duration += deltaTime;

            elem.position[0] += elem.velocity[0] * (1 / (elem.duration + 0.5));
            elem.position[1] += elem.velocity[1] * (1 / (elem.duration + 0.5));

            this.spark(elem.position, [Math.PI / 2, 0, Math.PI * 2 * elem.rotation[2]], elem.maxScale * elem.scaleRatio, elem.color, Math.floor(Math.random() * 3))

            return elem.duration < elem.lifetime;
        })

    }
}

class Emiter {
    constructor() {
        const tempX = Math.random() * 2 - 1;
        const tempY = Math.random() * 2 - 1;

        this.duration = 0;
        this.lifetime = 2;
        this.position = [0, 0.5, -8];
        this.rotation = [0, 0, Math.random()];
        this.maxScale = Math.random() * 0.04 + 0.05;
        this.scaleRatio = 1;
        this.velocity = [
            tempX / Math.sqrt(tempX * tempX + tempY * tempY) * (Math.random() * 0.03 + 0.01),
            tempY / Math.sqrt(tempX * tempX + tempY * tempY) * (Math.random() * 0.03 + 0.01),
            1
        ];

        this.color = [1, 1, 1, Math.random() * 0.01 + 0.4]
    }
}

export { Particle1 };