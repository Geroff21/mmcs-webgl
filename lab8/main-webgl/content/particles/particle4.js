import { draw } from "../../systems/meshes-render-core/draw.js";
import { initBuffers } from "../../systems/meshes-render-core/init-mesh-buffers.js";

class Particle1 {
    constructor() {
        this.timeFromSpawn = 0.0;
        this.spawnInterval = 0.5; // Интервал спавна тетримино (в секундах)
        this.particles = [];
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
        }
    }

    async start() {
        console.log("Начало работы");
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
            console.log("Заспавнилась");
            this.particles.push(new TetrisBlock(Math.floor(Math.random() * 7), 0));
            this.timeFromSpawn = 0;
        }

        this.particles = this.particles.filter(elem => {
            elem.update(deltaTime);
            return elem.duration <= elem.lifetime;
        });

        this.particles.forEach(elem => {
            this.trail(elem.vertexes, elem.indices, elem.colors);
        });
    }
}

class TetrisBlock {
    constructor(shapeNum, rotationParam) {
        this.duration = 0;
        this.lifetime = 5; // Срок жизни для тетримино

        this.vertexes = [];
        this.indices = [];
        this.colors = [];

        this.shape = shapeNum;

        this.position = [Math.random() * 8 - 4, 5, -12]; // Случайное начальное положение по x и фиксированное по y
        this.velocity = [0, -0.1, 0]; // Падение вниз
        this.rotation = [0, 0, 0];

        this.color = [Math.random(), Math.random(), Math.random(), 1]; // Случайный цвет

        this.createTetrisShape(this.shape);
    }

    createTetrisShape(num) {
        // Определение формы тетримино (например, "I", "J", "L", "O", "S", "T", "Z")
        const shapes = [
            [[0, 0], [1, 0], [2, 0], [3, 0]], // I
            [[0, 0], [0, 1], [1, 1], [2, 1]], // J
            [[2, 0], [0, 1], [1, 1], [2, 1]], // L
            [[1, 0], [2, 0], [1, 1], [2, 1]], // O
            [[1, 0], [2, 0], [0, 1], [1, 1]], // S
            [[1, 0], [0, 1], [1, 1], [2, 1]], // T
            [[0, 0], [1, 0], [1, 1], [2, 1]], // Z
        ];

        const shape = shapes[num];

        // Создание вершин и индексов для отрисовки
        this.vertexes = [];
        this.indices = [];
        let index = 0;
        for (let [dx, dy] of shape) {
            const x = this.position[0] + dx;
            const y = this.position[1] + dy;
            this.vertexes.push(
                x, y, 0,
                x + 1, y, 0,
                x, y + 1, 0,
                x + 1, y + 1, 0
            );
            this.indices.push(
                index, index + 1, index + 2,
                index + 1, index + 2, index + 3
            );
            index += 4;
        }

        // Создание цветов для каждой вершины
        for (let i = 0; i < this.vertexes.length / 3; i++) {
            this.colors.push(...this.color);
        }
    }

    update(deltaTime) {
        this.duration += deltaTime;

        if (this.duration > this.lifetime) {
            this.vertexes = [];
            this.colors = [];
            this.indices = [];
            return;
        }

        this.position[1] += this.velocity[1];
        this.position[0] += this.velocity[0];

        console.log(this.rotation);

        this.createTetrisShape(this.shape);
    }
}

export { Particle1 };
