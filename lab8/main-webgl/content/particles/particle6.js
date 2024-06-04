import { draw } from "../../systems/meshes-render-core/draw.js";
import { initBuffers } from "../../systems/meshes-render-core/init-mesh-buffers.js";

class Particle1 {
    constructor() {
        this.timeFromSpawn = 0.0;
        this.spawnInterval = 0.05; // Интервал спавна частиц (в секундах)
        this.particles = [];
        this.maxParticles = 200; // Максимальное количество частиц в системе
        this.spawnRate = 5; // Количество частиц, создаваемых за один раз
        this.sectorAngle = Math.PI / 3; // Угол сектора, в котором вылетают частицы (45 градусов)
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
            for (let i = 0; i < this.spawnRate; i++) {
                if (this.particles.length < this.maxParticles) {
                    this.particles.push(new MudParticle(this.sectorAngle));
                }
            }
        }

        this.particles.forEach(particle => {
            particle.update(deltaTime);
        });

        this.particles = this.particles.filter(particle => particle.isAlive);

        this.particles.forEach(particle => {
            this.trail(particle.vertexes, particle.indices, particle.colors);
        });
    }
}

class MudParticle {
    constructor(sectorAngle) {
        this.isAlive = true;
        this.duration = 0;
        this.lifetime = 2; // Время жизни частицы в секундах

        this.vertexes = [];
        this.indices = [];
        this.colors = [];

        this.position = [0, -1, -12]; // Начальное положение у колеса
        this.velocity = this.generateRandomVelocity(sectorAngle); // Случайное направление и скорость в пределах сектора
        this.color = [0.3 + Math.random() * 0.2, 0.2 + Math.random() * 0.1, 0.1, 1]; // Цвет грязи

        this.createParticleShape();
    }

    generateRandomVelocity(sectorAngle) {
        const halfAngle = sectorAngle / 2;
        const angle = Math.random() * sectorAngle - halfAngle;
        const speed = 2 + Math.random() * 1;
        return [
            speed * Math.cos(angle),
            speed * Math.sin(angle),
            Math.random() * 0.5 - 0.25
        ];
    }

    createParticleShape() {
        const size = 0.05; // Размер частицы
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
        this.duration += deltaTime;

        if (this.duration > this.lifetime) {
            this.isAlive = false;
            return;
        }

        // Обновляем положение частицы на основе её скорости
        this.position[0] += this.velocity[0] * deltaTime;
        this.position[1] += this.velocity[1] * deltaTime;
        this.position[2] += this.velocity[2] * deltaTime;

        this.createParticleShape();
    }
}

export { Particle1 };
