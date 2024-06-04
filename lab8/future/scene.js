import { core } from "./core.js";
import { object } from "./drawObject.js";

var sceneParameters = {
	rotation: { x: 0, y: 0, z: 0, speed: 0 },
	offset: { x: 0, y: 0, z: -5 },
	lightOffset: { x: 0, y: 0, z: 0 },
	lightParams: { 
		ambient: [51,51,51], diffuse: [178,178,178], specular: [255,255,255], light: [255,255,255],
		lin_attenuation: 0.0, quad_attenuation: 0.0, 
		shininess: 16, fresnel: 0.5, intensity: 0.8, roughness: 0.5   
	},
	textureParams: {
		texture_contrib: 0
	},
	shadingIndex: 1,
	lightingIndex: 1,
	rotationIndex: 1,
	textureIndex: 1,
};

function drawScene() {	

	gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

	gl.enable     ( gl.DEPTH_TEST );
	gl.depthFunc  ( gl.LEQUAL );

	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.clearDepth(1.0); 
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	//Прочие uniforms
	gl.uniform1i(programData.uniforms["uShadingFlag"], sceneParameters.shadingIndex);
	gl.uniform1i(programData.uniforms["uLightFlag"], sceneParameters.lightingIndex);
	gl.uniform1f(programData.uniforms["uShininess"], sceneParameters.lightParams.shininess);
	gl.uniform1f(programData.uniforms["roughness"], sceneParameters.lightParams.roughness);
	gl.uniform1f(programData.uniforms["intensity"], sceneParameters.lightParams.intensity);
	gl.uniform1f(programData.uniforms["F0"], sceneParameters.lightParams.fresnel);
	gl.uniform1f(programData.uniforms["lin_attenuation"], sceneParameters.lightParams.lin_attenuation);
	gl.uniform1f(programData.uniforms["quad_attenuation"], sceneParameters.lightParams.quad_attenuation);
	gl.uniform1f(programData.uniforms["texture_contrib"], sceneParameters.textureParams.texture_contrib);

	//позиция источника света
	gl.uniform3fv(urogramData.uniforms["uLightPosition"], [sceneParameters.lightOffset.x, sceneParameters.lightOffset.y, sceneParameters.lightOffset.z]);

	//соствавляющие цвета
	gl.uniform3fv(programData.uniforms["uAmbientLightColor"], [sceneParameters.lightParams.ambient[0] / 255, sceneParameters.lightParams.ambient[1] / 255, sceneParameters.lightParams.ambient[2] / 255]);
	gl.uniform3fv(programData.uniforms["uDiffuseLightColor"], [sceneParameters.lightParams.diffuse[0] / 255, sceneParameters.lightParams.diffuse[1] / 255, sceneParameters.lightParams.diffuse[2] / 255]);
	gl.uniform3fv(programData.uniforms["uSpecularLightColor"], [sceneParameters.lightParams.specular[0] / 255, sceneParameters.lightParams.specular[1] / 255, sceneParameters.lightParams.specular[2] / 255]);
	gl.uniform3fv(programData.uniforms["uLightColor"], [sceneParameters.lightParams.light[0] / 255, sceneParameters.lightParams.light[1] / 255, sceneParameters.lightParams.light[2] / 255]);

	//Формирование небходимых осей
	let raxis = [];
	if (sceneParameters.rotationIndex == 1) {
		raxis = [sceneParameters.offset.x, sceneParameters.offset.y, sceneParameters.offset.z];
	}
	else if (sceneParameters.rotationIndex == 2) {
		raxis = [0,0,0];
	}

	perspective ( 45, window.innerWidth / window.innerHeight, 0.1, 100.0 );

	newObj = new Item(gl, programData, models.cube);
	newObj.draw(
		[parameters.rotation.x, parameters.rotation.y, parameters.rotation.z], //Rotations
		[parameters.offset.x, parameters.offset.y, parameters.offset.z], //Offset
		[1.0,0.0,0.0,1.0], //color
		[
			"orange.jpg", //texture
			"orange.jpg", //texture2
		]
		1, //size
		raxis
	);

	gl.flush();
}