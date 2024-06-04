import { initBuffers } from "./init-mesh-buffers.js";

function drawMesh(mesh, scale = [1, 1, 1], translate = [0, 0, -6], rotation = [0, 0, 0], origins = [0, 0, 0], color, textureObjects, options) {
    gl.useProgram(shaderPrograms.mainPassProgram);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    const buffers = initBuffers(mesh, color);

    const modelViewMatrix = mat4.create();
    mat4.identity(modelViewMatrix);

    mat4.translate(modelViewMatrix, modelViewMatrix, translate)

    mat4.scale(modelViewMatrix, modelViewMatrix, scale)

    const newrot = mat4.create();
    const q = mat4.create();
    quat.fromEuler(q, rotation[0] * 180 / Math.PI, rotation[1] * 180 / Math.PI, rotation[2] * 180 / Math.PI);
    mat4.fromQuat(newrot, q);

    mat4.multiply(modelViewMatrix, modelViewMatrix, newrot);

    mat4.translate(modelViewMatrix, modelViewMatrix, origins);

    // set vertex positions 
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    gl.vertexAttribPointer(programInfoCollection.mainPassInfo.attribLocations.vertexPosition, 3, gl.FLOAT, false, 0, 0);

    // set vertex normals
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.normal);
    gl.vertexAttribPointer(programInfoCollection.mainPassInfo.attribLocations.vertexNormal, 3, gl.FLOAT, false, 0, 0);

    // set texture coordinates
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.textureCoord);
    gl.vertexAttribPointer(programInfoCollection.mainPassInfo.attribLocations.textureCoord, 2, gl.FLOAT, false, 0, 0,);

    // set vertex colors
    // gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
    // gl.vertexAttribPointer(programInfoCollection.mainPassInfo.attribLocations.vertexColor, 4, gl.FLOAT, false, 0, 0);

    // set incdices of triangles
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);

    gl.uniform1f(
        programInfoCollection.mainPassInfo.uniformLocations.materialMode, options.type === "Particle" ? 1 : 0
    );

    // project and model view matrix
    gl.uniformMatrix4fv(programInfoCollection.mainPassInfo.uniformLocations.projectionMatrix, false, projectionMatrix);
    gl.uniformMatrix4fv(programInfoCollection.mainPassInfo.uniformLocations.modelViewMatrix, false, modelViewMatrix);

    // texture samples
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, textureObjects[0]);
    gl.uniform1i(programInfoCollection.mainPassInfo.uniformLocations.sampler, 0);

    gl.activeTexture(gl.TEXTURE0 + 1);
    gl.bindTexture(gl.TEXTURE_2D, textureObjects[1]);
    gl.uniform1i(programInfoCollection.mainPassInfo.uniformLocations.normalSampler, 1);

    gl.enableVertexAttribArray(programInfoCollection.mainPassInfo.attribLocations.vertexPosition);
    gl.enableVertexAttribArray(programInfoCollection.mainPassInfo.attribLocations.vertexNormal);
    gl.enableVertexAttribArray(programInfoCollection.mainPassInfo.attribLocations.vertexColor);
    gl.enableVertexAttribArray(programInfoCollection.mainPassInfo.attribLocations.textureCoord);

    const vertexCount = mesh.indices.length;
    const type = gl.UNSIGNED_SHORT;
    const offset = 0;
    gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);

    gl.deleteBuffer(buffers.position);
    gl.deleteBuffer(buffers.textureCoord);
    gl.deleteBuffer(buffers.indices);
    gl.deleteBuffer(buffers.normal);
    gl.deleteBuffer(buffers.color);
}



export { drawMesh }