import { initShaderProgram } from "./init-shaders.js"

async function initShaderPrograms(shaders) {

    return {
        mainPassProgram: await initShaderProgram(shaders.vertexShader, shaders.fragmentShader),
        deafultParticleProgram: await initShaderProgram(shaders.particleVertexShader, shaders.particleFragmentShader),
        trailParticleProgram: await initShaderProgram(shaders.trailVertexShader, shaders.trailFragmentShader)
    }
}

export { initShaderPrograms }