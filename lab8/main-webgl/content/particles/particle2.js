import { draw } from "../../systems/meshes-render-core/draw.js";
import { initBuffers } from "../../systems/meshes-render-core/init-mesh-buffers.js";

class Particle1 {
    constructor() {
        this.timeFromSpawn = 0.0;
        this.toggle = true;

        this.particles = [];
        this.timeFromSpawn = 0;
    }

    async preload() {
        console.log(shaderPrograms);

        programInfoCollection.sparkInfo = {
            attribLocations: {
                vertexPosition: gl.getAttribLocation(shaderPrograms.deafultParticleProgram, "aVertexPosition"),
                textureCoord: gl.getAttribLocation(shaderPrograms.deafultParticleProgram, "aTextureCoord"),
            },
            uniformLocations: {
                projectionMatrix: gl.getUniformLocation(shaderPrograms.deafultParticleProgram, "uProjectionMatrix"),
                modelViewMatrix: gl.getUniformLocation(shaderPrograms.deafultParticleProgram, "uModelViewMatrix"),
                sampler: gl.getUniformLocation(shaderPrograms.deafultParticleProgram, "uSampler"),
            },
        }

        programInfoCollection.trailInfo = {
            attribLocations: {
                vertexPosition: gl.getAttribLocation(shaderPrograms.trailParticleProgram, "a_position"),
                color: gl.getAttribLocation(shaderPrograms.trailParticleProgram, "a_color"),
            },
            uniformLocations: {
                projectionMatrix: gl.getUniformLocation(shaderPrograms.trailParticleProgram, "u_pMatrix"),
                modelViewMatrix: gl.getUniformLocation(shaderPrograms.trailParticleProgram, "u_mvMatrix")
            }
        }

        console.log("Particle Shader Init")
    }

    async start() {

    }

    spark(position, rotation, scale) {
        gl.useProgram(shaderPrograms.deafultParticleProgram);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        const buffers = initBuffers(loadedAssets["particle-plane"], [0, 0, 0]);

        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
        gl.enableVertexAttribArray(programInfoCollection.sparkInfo.attribLocations.vertexPosition);
        gl.vertexAttribPointer(programInfoCollection.sparkInfo.attribLocations.vertexPosition, 3, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.textureCoord);
        gl.enableVertexAttribArray(programInfoCollection.sparkInfo.attribLocations.textureCoord);
        gl.vertexAttribPointer(programInfoCollection.sparkInfo.attribLocations.textureCoord, 2, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);

        const modelViewMatrix = mat4.create();
        mat4.identity(modelViewMatrix);

        mat4.translate(modelViewMatrix, modelViewMatrix, position)

        mat4.scale(modelViewMatrix, modelViewMatrix, [scale, scale, scale])

        const newrot = mat4.create();
        const q = mat4.create();
        quat.fromEuler(q, rotation[0] * 180 / Math.PI, rotation[1] * 180 / Math.PI, rotation[2] * 180 / Math.PI);
        mat4.fromQuat(newrot, q);

        mat4.multiply(modelViewMatrix, modelViewMatrix, newrot);

        mat4.translate(modelViewMatrix, modelViewMatrix, [0, 0, 0]);

        gl.uniformMatrix4fv(programInfoCollection.sparkInfo.uniformLocations.projectionMatrix, false, projectionMatrix);
        gl.uniformMatrix4fv(programInfoCollection.sparkInfo.uniformLocations.modelViewMatrix, false, modelViewMatrix);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, loadedAssets["/textures/spark.png"]);
        gl.uniform1i(programInfoCollection.sparkInfo.uniformLocations.sampler, 0);

        {
            const vertexCount = loadedAssets["particle-plane"].indices.length;
            const type = gl.UNSIGNED_SHORT;
            const offset = 0;
            gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
        }
    }

    trail(position, rotation) {
        gl.useProgram(shaderPrograms.trailParticleProgram);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            0, 0.03, 0,
            Math.sqrt(position[0] * position[0] + position[1] * position[1]), 0, 0,
            0, -0.03, 0,

        ]), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.enableVertexAttribArray(programInfoCollection.trailInfo.attribLocations.vertexPosition);
        gl.vertexAttribPointer(programInfoCollection.trailInfo.attribLocations.vertexPosition, 3, gl.FLOAT, false, 0, 0);

        const colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            1,1,175 / 255,
            0.8, 0.4, 0.2,
            1,1,175 / 255
        ]), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.enableVertexAttribArray(programInfoCollection.trailInfo.attribLocations.color);
        gl.vertexAttribPointer(programInfoCollection.trailInfo.attribLocations.color, 3, gl.FLOAT, false, 0, 0);

        const indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2]), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

        const modelViewMatrix = mat4.create();
        mat4.identity(modelViewMatrix);

        mat4.translate(modelViewMatrix, modelViewMatrix, [0, 0, position[2]])

        mat4.scale(modelViewMatrix, modelViewMatrix, [1, 1, 1])

        const newrot = mat4.create();
        const q = mat4.create();
        quat.fromEuler(q, rotation[0] * 180 / Math.PI, rotation[1] * 180 / Math.PI, rotation[2] * 180 / Math.PI);
        mat4.fromQuat(newrot, q);

        mat4.multiply(modelViewMatrix, modelViewMatrix, newrot);

        mat4.translate(modelViewMatrix, modelViewMatrix, [0, 0, 0]);

        gl.uniformMatrix4fv(programInfoCollection.trailInfo.uniformLocations.projectionMatrix, false, projectionMatrix);
        gl.uniformMatrix4fv(programInfoCollection.trailInfo.uniformLocations.modelViewMatrix, false, modelViewMatrix);

        {
            const vertexCount = 3;
            const type = gl.UNSIGNED_SHORT;
            const offset = 0;
            gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
        }
    }

    tick(deltaTime) {
        if (this.timeFromSpawn > 0.025) {
            for (let i = 0; i < 1; ++i) {
                this.particles.push(new Emiter())
            }
            this.timeFromSpawn = 0;
        } else {
            this.timeFromSpawn += deltaTime;
        }

        this.particles = this.particles.filter(elem => {
            elem.lifetime -= deltaTime;
            elem.position[0] += elem.velocity[0];
            elem.position[1] += elem.velocity[1];

            this.trail(elem.position, [0, 0, Math.sign(elem.position[1]) * Math.acos(elem.position[0] / Math.sqrt(elem.position[0] * elem.position[0] + elem.position[1] * elem.position[1]))]);
            this.spark(elem.position, [Math.PI / 2, 0, Math.PI * 2], 0.23)

            return elem.lifetime > 0
        })

        console.log(this.particles)
    }
}

class Emiter {
    constructor() {
        this.lifetime = 1;
        this.position = [0, 0, -12];
        this.velocity = [Math.random() * 0.06 - 0.03, Math.random() * 0.06 - 0.03, 0]
    }
}

export { Particle1 };