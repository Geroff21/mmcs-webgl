import { drawMesh } from "./draw-mesh.js";

class MeshesRenderCore {
    constructor() {
    }

    tick() {
        meshes.forEach(mesh => {
            drawMesh(
                mesh.mesh,
                mesh.transform.scale,
                mesh.transform.location,
                mesh.transform.rotation,
                mesh.origin,
                mesh.color,
                [
                    loadedAssets[mesh.texture]
                ],
                {
                    type: "Mesh"
                }
            )
        });
    }
}

export { MeshesRenderCore };