import { initBuffers } from "./init-mesh-buffers.js";

function draw(model, material) {
    let currentProgram, currentProgramInfo;

    if (material.domain === "particle") {
        gl.depthMask(false);
        currentProgram = shaderPrograms.deafultParticleProgram;
        currentProgramInfo = programInfoCollection.defaultParticleInfo;
    }
    else {
        gl.depthMask(true);
        currentProgram = shaderPrograms.mainPassProgram;
        currentProgramInfo = programInfoCollection.mainPassInfo;
    }

    gl.useProgram(currentProgram);

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);


    const colors = [];
    Array(model.mesh.vertexPositions.length).fill().map(e => colors.push(...material.color))

    const buffers = initBuffers(model.mesh, colors);

    // Transform object
    const modelViewMatrix = mat4.create();
    mat4.identity(modelViewMatrix);

    mat4.translate(modelViewMatrix, modelViewMatrix, model.transform.location)

    mat4.scale(modelViewMatrix, modelViewMatrix, model.transform.scale)

    const newrot = mat4.create();
    const q = mat4.create();
    quat.fromEuler(q, model.transform.rotation[0] * 180 / Math.PI, model.transform.rotation[1] * 180 / Math.PI, model.transform.rotation[2] * 180 / Math.PI);
    mat4.fromQuat(newrot, q);

    mat4.multiply(modelViewMatrix, modelViewMatrix, newrot);

    mat4.translate(modelViewMatrix, modelViewMatrix, [0, 0, 0]);

    if (currentProgramInfo.attribLocations.vertexPosition != null) {
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
        gl.vertexAttribPointer(currentProgramInfo.attribLocations.vertexPosition, 3, gl.FLOAT, false, 0, 0);
    }

    if (currentProgramInfo.attribLocations.vertexNormal != null) {
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.normal);
        gl.vertexAttribPointer(currentProgramInfo.attribLocations.vertexNormal, 3, gl.FLOAT, false, 0, 0);
    }

    if (currentProgramInfo.attribLocations.vertexColor != null) {
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
        gl.vertexAttribPointer(currentProgramInfo.attribLocations.vertexColor, 4, gl.FLOAT, false, 0, 0);
    }

    if (currentProgramInfo.attribLocations.textureCoord != null) {
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.textureCoord);
        gl.vertexAttribPointer(currentProgramInfo.attribLocations.textureCoord, 2, gl.FLOAT, false, 0, 0,);
    }

    if (buffers.indices) {
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);
    }

    gl.uniformMatrix4fv(currentProgramInfo.uniformLocations.projectionMatrix, false, projectionMatrix);
    gl.uniformMatrix4fv(currentProgramInfo.uniformLocations.modelViewMatrix, false, modelViewMatrix);

    if (currentProgramInfo.uniformLocations.sampler != null) {
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, material.textureObjects[0]);
        gl.uniform1i(currentProgramInfo.uniformLocations.sampler, 0);
    }

    if (currentProgramInfo.uniformLocations.normalSampler != null) {
        gl.activeTexture(gl.TEXTURE0 + 1);
        gl.bindTexture(gl.TEXTURE_2D, material.textureObjects[1]);
        gl.uniform1i(currentProgramInfo.uniformLocations.normalSampler, 1);
    }

    if (currentProgramInfo.attribLocations.vertexPosition != null)
        gl.enableVertexAttribArray(currentProgramInfo.attribLocations.vertexPosition);
    if (currentProgramInfo.attribLocations.vertexNormal != null)
        gl.enableVertexAttribArray(currentProgramInfo.attribLocations.vertexNormal);
    if (currentProgramInfo.attribLocations.vertexColor != null)
        gl.enableVertexAttribArray(currentProgramInfo.attribLocations.vertexColor);
    if (currentProgramInfo.attribLocations.textureCoord != null)
        gl.enableVertexAttribArray(currentProgramInfo.attribLocations.textureCoord);

    // Draw mesh
    const vertexCount = model.mesh.indices.length;
    const type = gl.UNSIGNED_SHORT;
    const offset = 0;
    gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);

    // Delete Buffers
    gl.deleteBuffer(buffers.position);
    gl.deleteBuffer(buffers.textureCoord);
    gl.deleteBuffer(buffers.indices);
    gl.deleteBuffer(buffers.normal);
    gl.deleteBuffer(buffers.color);

}

export { draw }