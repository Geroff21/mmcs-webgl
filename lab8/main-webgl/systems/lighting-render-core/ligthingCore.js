class LightingSystem {
    constructor() {
    }

    tick() {
        gl.useProgram(shaderPrograms.mainPassProgram);
        
        gl.uniform3fv(
            programInfoCollection.mainPassInfo.uniformLocations.ambientLightColor, ambientLightColor
        );
        gl.uniform3fv(
            programInfoCollection.mainPassInfo.uniformLocations.diffusionLightColor, diffusionLightColor
        );
        gl.uniform3fv(
            programInfoCollection.mainPassInfo.uniformLocations.specularLightColor, specularLightColor
        );
        gl.uniform1f(
            programInfoCollection.mainPassInfo.uniformLocations.linearAttenuation, linearAttenuation
        );
        gl.uniform1f(
            programInfoCollection.mainPassInfo.uniformLocations.quadraticAttenuation, quadraticAttenuation
        );
        gl.uniform1f(
            programInfoCollection.mainPassInfo.uniformLocations.intensivity, intensivity
        );

        lightSources.forEach((source, idx) => {
            const uniformLocation = gl.getUniformLocation(shaderPrograms.mainPassProgram, "uLightPosition[" + idx + "]");
            gl.uniform3fv(uniformLocation, source.location);
        })
    }
}

export { LightingSystem };