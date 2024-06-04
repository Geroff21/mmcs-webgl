import { draw } from "../../systems/meshes-render-core/draw.js"

const clamp = (value, min, max) => {
    if (value < min) return min;
    if (value > max) return max;
    return value;
}

class Particle1 {
    constructor() {
        this.timeFromSpawn = 0.0;
        this.toggle = true;
        this.particles = [];
    }

    async preload() {

    }

    async start() {

    }

    smoke() {
        const size = 0.1 + Math.random() * 0.6;

        this.particles.push({
            lifetime: 1 + Math.random(),
            vlocity: [-0.003, 0.0275, 0.04],
            initScale: size,
            mesh: {
                mesh: loadedAssets["particle-plane"],
                transform: {
                    location: [0.1 + (Math.random() - 0.5) * 1, 0, -13.5 + (Math.random() - 0.5) * 1],
                    rotation: [Math.PI / 2, 0, Math.random() * Math.PI * 2],
                    scale: [0, 0, 0],
                },
                origin: [0, 0, 0],
                color: [0, 0, 0, 1],
                texture: "/textures/Smoke.png"
            }
        });
    }

    tick(deltaTime) {
        this.particles = this.particles.filter(elem => {
            elem.lifetime -= deltaTime;
            elem.mesh.transform.location[0] += elem.vlocity[0];
            elem.mesh.transform.location[1] += elem.vlocity[1];
            elem.mesh.transform.location[2] += elem.vlocity[2];
            const currentRatioScale = clamp((0.8 * 0.8 - (elem.lifetime - 0.8) * (elem.lifetime - 0.8)) / 0.8 / 0.8, 0, 1);
            elem.mesh.transform.scale[0] = elem.initScale * currentRatioScale * currentRatioScale;
            elem.mesh.transform.scale[1] = elem.initScale * currentRatioScale * currentRatioScale;
            elem.mesh.transform.scale[2] = elem.initScale * currentRatioScale * currentRatioScale;

            draw(
                {
                    mesh: elem.mesh.mesh,
                    transform: elem.mesh.transform
                },
                {
                    domain: "particle",
                    color: [0, 0, 0, 1],
                    textureObjects: [
                        loadedAssets[elem.mesh.texture]
                    ]
                }
            )

            return elem.lifetime > 0;
        });

        if (this.timeFromSpawn > 0.005) {
            this.smoke();
            this.timeFromSpawn = 0;
        } else {
            this.timeFromSpawn += deltaTime;
        }
    }
}

export { Particle1 };