import { Particle1 } from "./content/particles/particle2.js";
import { parseOBJ, loadModel } from "./utils/loadModel.js"


class SceneParticle {

    async preload() {
        loadedAssets["particle-plane"] = await parseOBJ(await loadModel("/assets/particle-plane.obj"));
        // loadedAssets["vehicleTyres"] = await parseOBJ(await loadModel("/assets/vehicleTyres.obj"));
        // loadedAssets["vehicle"] = await parseOBJ(await loadModel("/assets/vehicle.obj"));
    }

    async start() {

        lightSources = [
            {
                location: [0, 5, 5],
                intensivity: 1.
            },
        ]

        
    }

    tick(deltaTime) {
        
    }
}

export { SceneParticle }