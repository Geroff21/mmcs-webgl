import { draw } from "../../systems/meshes-render-core/draw.js";
import { initBuffers } from "../../systems/meshes-render-core/init-mesh-buffers.js";

class Particle1 {
    constructor() {
        this.timeFromSpawn = 0.0;
        this.spawnInterval = 0.1; // Интервал спавна частиц (в секундах)
        this.particles = [];
        this.numParticles = 100; // Количество частиц в волне
        this.amplitude = 2.0; // Амплитуда волны
        this.frequency = 0.01; // Частота волны
        this.speed = 0.01; // Скорость распространения волны
    }

    async preload() {
        programInfoCollection.trailInfo = {
            attribLocations: {
                vertexPosition: gl.getAttribLocation(shaderPrograms.trailParticleProgram, "a_position"),
                color: gl.getAttribLocation(shaderPrograms.trailParticleProgram, "a_color"),
            },
            uniformLocations: {
                projectionMatrix: gl.getUniformLocation(shaderPrograms.trailParticleProgram, "u_pMatrix"),
                modelViewMatrix: gl.getUniformLocation(shaderPrograms.trailParticleProgram, "u_mvMatrix")
            }
        };
    }

    async start() {
        console.log("Начало работы");
        // Инициализация частиц
        for (let i = 0; i < this.numParticles; i++) {
            this.particles.push(new WaveParticle(i, this.numParticles, this.amplitude, this.frequency, this.speed));
        }
    }

    trail(vertices, indices, colors) {
        gl.useProgram(shaderPrograms.trailParticleProgram);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.enableVertexAttribArray(programInfoCollection.trailInfo.attribLocations.vertexPosition);
        gl.vertexAttribPointer(programInfoCollection.trailInfo.attribLocations.vertexPosition, 3, gl.FLOAT, false, 0, 0);

        const colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.enableVertexAttribArray(programInfoCollection.trailInfo.attribLocations.color);
        gl.vertexAttribPointer(programInfoCollection.trailInfo.attribLocations.color, 4, gl.FLOAT, false, 0, 0);

        const indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

        const modelViewMatrix = mat4.create();
        mat4.identity(modelViewMatrix);

        mat4.translate(modelViewMatrix, modelViewMatrix, [0, 0, -12]);

        mat4.scale(modelViewMatrix, modelViewMatrix, [1, 1, 1]);

        const newrot = mat4.create();
        const q = mat4.create();
        quat.fromEuler(q, 0, 0, 0);
        mat4.fromQuat(newrot, q);

        mat4.multiply(modelViewMatrix, modelViewMatrix, newrot);

        mat4.translate(modelViewMatrix, modelViewMatrix, [0, 0, 0]);

        gl.uniformMatrix4fv(programInfoCollection.trailInfo.uniformLocations.projectionMatrix, false, projectionMatrix);
        gl.uniformMatrix4fv(programInfoCollection.trailInfo.uniformLocations.modelViewMatrix, false, modelViewMatrix);

        const vertexCount = indices.length;
        const type = gl.UNSIGNED_SHORT;
        const offset = 0;
        gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);

        gl.deleteBuffer(positionBuffer);
        gl.deleteBuffer(colorBuffer);
        gl.deleteBuffer(indexBuffer);
    }

    tick(deltaTime) {
        this.timeFromSpawn += deltaTime;

        if (this.timeFromSpawn >= this.spawnInterval) {
            this.timeFromSpawn = 0;
        }

        this.particles.forEach(particle => {
            particle.update(deltaTime);
        });

        this.particles.forEach(particle => {
            this.trail(particle.vertexes, particle.indices, particle.colors);
        });
    }
}

class WaveParticle {
    constructor(index, totalParticles, amplitude, frequency, speed) {
        this.index = index;
        this.totalParticles = totalParticles;
        this.amplitude = amplitude;
        this.frequency = frequency;
        this.speed = speed;

        this.position = [index / totalParticles * 10 - 5 , 0, -12]; // Начальное положение по x и фиксированное по y
        this.color = [1, Math.random(), 0.5, 1]; // Случайный цвет

        this.vertexes = [];
        this.indices = [];
        this.colors = [];

        this.createParticleShape();
    }

    createParticleShape() {
        const size = 0.1; // Размер частицы
        this.vertexes = [
            this.position[0] - size, this.position[1] - size, this.position[2],
            this.position[0] + size, this.position[1] - size, this.position[2],
            this.position[0] - size, this.position[1] + size, this.position[2],
            this.position[0] + size, this.position[1] + size, this.position[2]
        ];
        this.indices = [
            0, 1, 2,
            1, 2, 3
        ];

        this.colors = [
            ...this.color, ...this.color,
            ...this.color, ...this.color
        ];
    }

    update(deltaTime) {
        // Обновляем положение по y на основе синусоидальной волны
        this.position[1] = Math.sin((this.index / this.totalParticles) * Math.PI * 2 + performance.now() * this.speed) * this.amplitude;

        this.createParticleShape();
    }
}

export { Particle1 };
