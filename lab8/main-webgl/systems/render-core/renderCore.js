import { LightingSystem } from "../lighting-render-core/ligthingCore.js";
import { MeshesRenderCore } from "../meshes-render-core/meshRenderCore.js";
import { ParticlesRenderCore } from "../particles-render-core/particlesRenderCore.js";
import { loadTexture } from "../../utils/loadTextures.js";

class RenderCore {
    constructor() {
        programInfoCollection.mainPassInfo = {
            attribLocations: {
                vertexPosition: gl.getAttribLocation(shaderPrograms.mainPassProgram, "aVertexPosition"),
                vertexNormal: gl.getAttribLocation(shaderPrograms.mainPassProgram, "aVertexNormal"),
                textureCoord: gl.getAttribLocation(shaderPrograms.mainPassProgram, "aTextureCoord"),
            },
            uniformLocations: {
                projectionMatrix: gl.getUniformLocation(shaderPrograms.mainPassProgram, "uProjectionMatrix"),
                modelViewMatrix: gl.getUniformLocation(shaderPrograms.mainPassProgram, "uModelViewMatrix"),
                sampler: gl.getUniformLocation(shaderPrograms.mainPassProgram, "uSampler"),
                normalSampler: gl.getUniformLocation(shaderPrograms.mainPassProgram, "uNormalSampler"),

                ambientLightColor: gl.getUniformLocation(shaderPrograms.mainPassProgram, "uAmbientLightColor"),
                diffusionLightColor: gl.getUniformLocation(shaderPrograms.mainPassProgram, "uDiffuseLightColor"),
                specularLightColor: gl.getUniformLocation(shaderPrograms.mainPassProgram, "uSpecularLightColor"),

                linearAttenuation: gl.getUniformLocation(shaderPrograms.mainPassProgram, "uLinearAttenuation"),
                quadraticAttenuation: gl.getUniformLocation(shaderPrograms.mainPassProgram, "uQuadraticAttenuation"),
                intensivity: gl.getUniformLocation(shaderPrograms.mainPassProgram, "uIntensivity"),

                materialMode: gl.getUniformLocation(shaderPrograms.mainPassProgram, "uParticle"),
            },
        };

        programInfoCollection.defaultParticleInfo = {
            attribLocations: {
                vertexPosition: gl.getAttribLocation(shaderPrograms.deafultParticleProgram, "aVertexPosition"),
                vertexColor: gl.getAttribLocation(shaderPrograms.deafultParticleProgram, "aVertexColor"),
                textureCoord: gl.getAttribLocation(shaderPrograms.deafultParticleProgram, "aTextureCoord"),
            },
            uniformLocations: {
                projectionMatrix: gl.getUniformLocation(shaderPrograms.deafultParticleProgram, "uProjectionMatrix"),
                modelViewMatrix: gl.getUniformLocation(shaderPrograms.deafultParticleProgram, "uModelViewMatrix"),
                sampler: gl.getUniformLocation(shaderPrograms.deafultParticleProgram, "uSampler"),
            },
        };

        this.meshRenderCore = new MeshesRenderCore();
        this.ligtingCore = new LightingSystem();
        this.particlesRenderCore = new ParticlesRenderCore();
    }

    async preload() {
        loadedAssets["/textures/mat0.png"] = await loadTexture("/textures/mat0.png");
        loadedAssets["/textures/mat1.png"] = await loadTexture("/textures/mat1.png");
        loadedAssets["/textures/mat2.png"] = await loadTexture("/textures/mat2.png");
        loadedAssets["/textures/mat6.png"] = await loadTexture("/textures/mat6.png");
        loadedAssets["/textures/mat9.png"] = await loadTexture("/textures/mat9.png");
        loadedAssets["/textures/mat13.png"] = await loadTexture("/textures/mat13.png");
        loadedAssets["/textures/mat15.png"] = await loadTexture("/textures/mat15.png");
        loadedAssets["/textures/mat16.png"] = await loadTexture("/textures/mat16.png");

        loadedAssets["/textures/Smoke.png"] = await loadTexture("/textures/Smoke.png");
        loadedAssets["/textures/Smoke2.png"] = await loadTexture("/textures/Smoke2.png");
        loadedAssets["/textures/spark.png"] = await loadTexture("/textures/spark.png");
        loadedAssets["/textures/firework.png"] = await loadTexture("/textures/firework.png");
        loadedAssets["/textures/firework1.png"] = await loadTexture("/textures/firework1.png");
        loadedAssets["/textures/firework2.png"] = await loadTexture("/textures/firework2.png");
        loadedAssets["/textures/FallingPart.png"] = await loadTexture("/textures/FallingPart.png");

        this.particlesRenderCore.preload();
        // console.log("Render core preload");
    }

    async start() {
        // console.log("Render core start");
        this.particlesRenderCore.start();
    }

    tick(deltaTime) {
        // console.log("Render core tick");

        // gl.clearColor(111 / 255, 217 / 255, 208 / 255, 1.0);
        gl.clearColor(0 / 255, 0 / 255, 0 / 255, 1.0);

        gl.clearDepth(1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);

        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true)

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        const fieldOfView = (45 * Math.PI) / 180;
        const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
        const zNear = 0.1;
        const zFar = 100.0;
        projectionMatrix = mat4.create();
        mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);

        // Renders
        gl.depthMask(false);
        this.particlesRenderCore.tick(deltaTime);
        gl.depthMask(true);
        this.meshRenderCore.tick();
        this.ligtingCore.tick();
        gl.flush();
    }
}

export { RenderCore };