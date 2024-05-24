import { getCubeElements } from '../src/models/cube.js';
import { getSphereElements } from '../src/models/sphere.js';

var gl;
const gui = new dat.GUI();
var shaderProgram;

var parameters = {
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


function setGui() {

	var fpsStats = {fps: 0};
	gui.add(fpsStats, 'fps').name('FPS').listen();

	function updateFPS() {
	    var now = performance.now();
	    var elapsed = now - lastTime;
	    var fps = 1000 / elapsed;
	    fpsStats.fps = Math.round(fps); 
	    lastTime = now;
	    requestAnimationFrame(updateFPS);
	}

	var lastTime = performance.now();
	updateFPS();

	gui.useLocalStorage = true;

	const mainParamsFolder = gui.addFolder('Params')
  	mainParamsFolder.add(parameters, 'shadingIndex', { Guroud: 1, Fong: 2 } );
  	mainParamsFolder.add(parameters, 'lightingIndex', { Lambert: 1, Fong: 2, "Toon-Shading": 3, "Blinn-Fong": 4, "Cook-Torrance": 5, "Без освещения": 0 } );
  	mainParamsFolder.add(parameters, 'rotationIndex', { "Центр пьедестала": 1, "Центр сцены": 2, "Центр кубика": 3 } );
  	mainParamsFolder.add(parameters, 'textureIndex', { "Стандартный цвет": 1, "Текстуры кубиков": 2, "Текстуры номеров": 3, "Смешение 1": 4, "Смешение 2": 5, "BUMP": 6 } );
	const offsetFolder = gui.addFolder('Offset')
	offsetFolder.add(parameters.offset, 'x', -3, 3)
	offsetFolder.add(parameters.offset, 'y', -3, 3)
	offsetFolder.add(parameters.offset, 'z', -15, 3)
	offsetFolder.open()
	const rotationFolder = gui.addFolder('Rotation')
	rotationFolder.add(parameters.rotation, 'speed', 0, 100)
	rotationFolder.add(parameters.rotation, 'x', -360, 360)
	rotationFolder.add(parameters.rotation, 'y', -360, 360)
	rotationFolder.add(parameters.rotation, 'z', -360, 360)
	rotationFolder.open()
	const lightFolder = gui.addFolder('Light')
	lightFolder.addColor(parameters.lightParams, 'ambient')
	lightFolder.addColor(parameters.lightParams, 'diffuse')
	lightFolder.addColor(parameters.lightParams, 'specular')
	lightFolder.addColor(parameters.lightParams, 'light')
	lightFolder.add(parameters.lightParams, 'shininess', 0, 100)
	lightFolder.add(parameters.lightParams, 'fresnel', 0, 1)
	lightFolder.add(parameters.lightParams, 'intensity', 0, 1)
	lightFolder.add(parameters.lightParams, 'roughness', 0, 1)
	lightFolder.add(parameters.lightParams, 'lin_attenuation', 0, 1)
	lightFolder.add(parameters.lightParams, 'quad_attenuation', 0, 1)
	lightFolder.add(parameters.lightOffset, 'x', -10, 10)
	lightFolder.add(parameters.lightOffset, 'y', -10, 10)
	lightFolder.add(parameters.lightOffset, 'z', -15, 15)
	lightFolder.open()
	const textureFolder = gui.addFolder('Texture')
	textureFolder.add(parameters.textureParams, 'texture_contrib', 0, 1)
	textureFolder.open()

	for (var i = 0; i < Object.keys(gui.__folders).length; i++) {
	    var key = Object.keys(gui.__folders)[i];
	    for (var j = 0; j < gui.__folders[key].__controllers.length; j++ ){    	
		    gui.__folders[key].__controllers[j].onChange(function() {
	    	drawScene()
	    });
		}
	}

	gui.__folders['Params'].__controllers[0].onChange(function() {
	    baseInit();
	});
}

var models = {};
var textures = {};
var images = {};

var texture;

var vertexPositionAttribute;
var vertexColorAttribute;
var vertexNormalAttribute;
var textureCoordAttribute;

var mvMatrix;
var prMatrix;
var nMatrix;

var positionBuffer;
var colorBuffer;
var indexBuffer;
var normalBuffer;
var texBuffer;

export function start() {
	setGui();
	webGLStart();
}

window.addEventListener('resize', function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    drawScene();
});

function rotateCubes() {

	if (parameters.rotation.speed > 0) {
		for (var j = 0; j < gui.__folders['Rotation'].__controllers.length; j++ ){    	
		    gui.__folders['Rotation'].__controllers[j].updateDisplay();
		}

		parameters.rotation.y += (0.3 * parameters.rotation.speed / 100 );
		//parameters.rotation.y += (0.2 * parameters.rotation.speed / 100 );
		//parameters.rotation.z += (0.3 * parameters.rotation.speed / 100 );

		parameters.rotation.y %= 360;
		//parameters.rotation.y %= 360;
		//parameters.rotation.z %= 360;

		drawScene()
	}

}

function baseInit(callback) {
	initShaders(parameters.shadingIndex);

	loadTextures([
		"stone.png",
		"cobblestone.png",
		"glowstone.png",
		"bumpMap.jpg",
		"orange.jpg",
		"orange_ao.jpg",
		], function() {
			models['sphere'] = getSphereElements(1,30,30);
			drawScene();	
		});
}

//setup GLSL
function webGLStart() {
	var canvas = document.getElementById("canvas");

	if ( !canvas )
		alert("Could not initialize canvas");

	try {

		gl = canvas.getContext("webgl2");
		if ( !gl )
			gl = canvas.getContext("experimental-webgl");

	} catch(e) {}

	if ( !gl )
		alert("Could not initialize WebGL");

	canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

	//Инициализируем шейдеры

	baseInit(function() {
		setInterval(rotateCubes, 15);
	});
	
}

async function loadJSON(path) {
	try {
	    const response = await fetch(path);
	    if (!response.ok) throw new Error('Сетевой ответ некорректен');
	    return await response.json(); 
	} catch (error) {
	    console.error('Ошибка при загрузке:', error);  
	}
}

function drawCube(model, position, rotation, color, texSrc, tex2Src, tex3Src, size, raxis, isBlended=false) {

	console.log(model);

	gl.enable(gl.BLEND);

	if (isBlended) { gl.blendFunc(gl.SRC_ALPHA, gl.ONE); } 
	else { gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);}

	//Установка и формирование матриц
	var positions = model.positions.map(el => el * size);
	var colors = [];
	var normals = model.normals;
	var indices = model.indices;
	var textureCoordinates = model.texturecoords;
	var dim = 3;

	for (var i = 0; i < positions.length; i++) {
		colors.push(color);
	}
	
	loadIdentity();
	initBuffers(positions, colors, normals, indices, textureCoordinates, dim)

	var rotationAxis = [];

	if (raxis.length != 0) {
		rotationAxis = [-position[0]+raxis[0], -position[1]+raxis[1], -position[2]+raxis[2]];
	}
	else {
		rotationAxis = [0,0,0];
	}

	mvTranslate( [position[0], position[1], position[2]] )
	mvTranslate( rotationAxis );
	mvRotate(rotation[0], [1,0,0]);
	mvRotate(rotation[1], [0,1,0]);
	mvRotate(rotation[2], [0,0,1]);
	mvTranslate( rotationAxis.map(el => -1 * el ) ); 

	var Pmatrix = gl.getUniformLocation(shaderProgram, "prMatrix");
	var Vmatrix = gl.getUniformLocation(shaderProgram, "mvMatrix");
	var Nmatrix = gl.getUniformLocation(shaderProgram, "nMatrix");

	var subMatrix = Matrix.create([
		[mvMatrix.elements[0][0], mvMatrix.elements[0][1], mvMatrix.elements[0][2]],
		[mvMatrix.elements[1][0], mvMatrix.elements[1][1], mvMatrix.elements[1][2]],
		[mvMatrix.elements[2][0], mvMatrix.elements[2][1], mvMatrix.elements[2][2]]
	]); 
	nMatrix = subMatrix.inverse().transpose();

	handleTextureLoaded(images[texSrc], texSrc);
	handleTextureLoaded(images[tex2Src], tex2Src);
	handleTextureLoaded(images[tex3Src], tex3Src);	
	
	gl.activeTexture(gl.TEXTURE0 + 0);
	gl.bindTexture(gl.TEXTURE_2D, textures[texSrc]);

	gl.activeTexture(gl.TEXTURE0 + 1);
	gl.bindTexture(gl.TEXTURE_2D, textures[tex2Src]);

	gl.activeTexture(gl.TEXTURE0 + 2);
	gl.bindTexture(gl.TEXTURE_2D, textures[tex3Src]);

	gl.uniformMatrix4fv(Pmatrix, false, new Float32Array(prMatrix.flatten()));
	gl.uniformMatrix4fv(Vmatrix, false, new Float32Array(mvMatrix.flatten()));
	gl.uniformMatrix3fv(Nmatrix, false, new Float32Array(nMatrix.flatten()));

	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	gl.vertexAttribPointer(vertexPositionAttribute, positionBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
	gl.vertexAttribPointer(vertexColorAttribute, colorBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
	gl.vertexAttribPointer(vertexNormalAttribute, normalBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, texBuffer);
	gl.vertexAttribPointer(textureCoordAttribute, texBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
	
	gl.drawElements(gl.TRIANGLES, indexBuffer.numItems*indexBuffer.itemSize, gl.UNSIGNED_SHORT, 0);

}

	function loadTextures(srcs, callback){
		
		var imagesToLoad = srcs.length;
		var image = new Image();

		var onImageLoad = function() {
			--imagesToLoad;
			if (imagesToLoad == 0) {
				callback(images);
			}
		};

		for (var ii = 0; ii < imagesToLoad; ++ii) {
			var image = loadImage('../src/textures/' + srcs[ii], onImageLoad);
			images[srcs[ii]] = image;
			
		}

		var sampler1 = gl.getUniformLocation(shaderProgram, "u1Sampler");
		var sampler2 = gl.getUniformLocation(shaderProgram, "u2Sampler");
		var sampler3 = gl.getUniformLocation(shaderProgram, "u3Sampler");

		gl.uniform1i(sampler1, 0);
		gl.uniform1i(sampler2, 1);
		gl.uniform1i(sampler3, 2);

	}

	function loadImage(src, callback) {
		var image = new Image();
		image.src = src;
		image.onload = callback;
		return image;
	}

	//Загрузка текстуры
	function handleTextureLoaded(image, imageSrc) {

		texture = gl.createTexture();

		gl.bindTexture(gl.TEXTURE_2D, texture);

		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

		textures[imageSrc] = texture;
	}

	//Инициализация шейдеров и аттрибутов
	function initShaders(shaderIndex) 
	{

		shaderProgram = loadProgram ( gl, "shader-vs-"+shaderIndex, "shader-fs-"+shaderIndex );
		gl.useProgram(shaderProgram);

		vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
		gl.enableVertexAttribArray(vertexPositionAttribute);

		vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
		gl.enableVertexAttribArray(vertexColorAttribute);  

		vertexNormalAttribute = gl.getAttribLocation(shaderProgram, "aVertexNormal");
		gl.enableVertexAttribArray(vertexNormalAttribute); 

		textureCoordAttribute = gl.getAttribLocation(shaderProgram, "aTextureCoord");
		gl.enableVertexAttribArray(textureCoordAttribute); 

	}

	//Инициализаця буфферов
	function initBuffers(pos, col, nor, ind, tex, dim) 
	{
		const positions = pos.flat();
		const colors = col.flat();
		const normals = nor.flat();
		const indices = ind.flat();
		const texs = tex.flat();

		// Create and store data into vertex buffer
		positionBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

	    // Create and store data into color buffer
	    colorBuffer = gl.createBuffer();
	    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
	    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

	    // Create and store data into normal buffer
	    normalBuffer = gl.createBuffer();
	    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
	    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);

	    // Create and store data into texture buffer
	    texBuffer = gl.createBuffer();
	    gl.bindBuffer(gl.ARRAY_BUFFER, texBuffer);
	    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texs), gl.STATIC_DRAW);

	    // Create and store data into index buffer
	    indexBuffer = gl.createBuffer();
	    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
	    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

	    positionBuffer.itemSize = dim;
	    positionBuffer.numItems = pos.length / dim;

	    colorBuffer.itemSize = 4;
	    colorBuffer.numItems = col.length / 4;	

	    indexBuffer.itemSize = 3;
	    indexBuffer.numItems = ind.length / 3;	

	    normalBuffer.itemSize = 3;
	    normalBuffer.numItems = nor.length / 3;	

	    texBuffer.itemSize = 2;
	    texBuffer.numItems = tex.length / 2;		

	}

	//Вспомогательные операции

	function loadIdentity() 
	{
		mvMatrix = Matrix.I(4);
		nMatrix = Matrix.I(3);
	}

	function multMatrix(m) 
	{
		mvMatrix = mvMatrix.x(m);
	}

	function mvTranslate(v) 
	{
		var m = Matrix.Translation($V([v[0], v[1], v[2]])).ensure4x4();
		multMatrix(m);
	}

	function mvRotate(angle, axis) {
		var radians = angle * Math.PI / 180.0;
		var sinA = Math.sin(radians);
		var cosA = Math.cos(radians);
		var length = Math.sqrt(axis[0]*axis[0] + axis[1]*axis[1] + axis[2]*axis[2]);
		var x = axis[0] / length;
		var y = axis[1] / length;
		var z = axis[2] / length;
		var t = 1.0 - cosA;

		var rotationMatrix = Matrix.create(
			[
			[t*x*x + cosA,     t*x*y - sinA*z,   t*x*z + sinA*y, 0],
			[t*x*y + sinA*z,   t*y*y + cosA,     t*y*z - sinA*x, 0],
			[t*x*z - sinA*y,   t*y*z + sinA*x,   t*z*z + cosA,   0],
			[0,                0,                0,               1]
			]
			);

		multMatrix(rotationMatrix);
	}

	function setupLights(lightOffset ,ambientColor, diffuseColor, specularColor, lightColor) {

		var uniformLightPosition = gl.getUniformLocation(shaderProgram, "uLightPosition");
		var uniformAmbientLightColor = gl.getUniformLocation(shaderProgram, "uAmbientLightColor");
		var uniformDiffuseLightColor = gl.getUniformLocation(shaderProgram, "uDiffuseLightColor");
		var uniformSpecularLightColor = gl.getUniformLocation(shaderProgram, "uSpecularLightColor");
		var uniformLightColor = gl.getUniformLocation(shaderProgram, "uLightColor");

		//позиция источника света
		gl.uniform3fv(uniformLightPosition, [lightOffset.x, lightOffset.y, lightOffset.z]);

		//соствавляющие цвета
		gl.uniform3fv(uniformAmbientLightColor, [ambientColor[0] / 255, ambientColor[1] / 255, ambientColor[2] / 255]);
		gl.uniform3fv(uniformDiffuseLightColor, [diffuseColor[0] / 255, diffuseColor[1] / 255, diffuseColor[2] / 255]);
		gl.uniform3fv(uniformSpecularLightColor, [specularColor[0] / 255, specularColor[1] / 255, specularColor[2] / 255]);
		gl.uniform3fv(uniformLightColor, [lightColor[0] / 255, lightColor[1] / 255, lightColor[2] / 255]);

	}

	function perspective(fovy, aspect, znear, zfar) 
	{
		prMatrix = makePerspective(fovy, aspect, znear, zfar);
	}

	//Отрисовка сцены
	function drawScene() 	
	{	

		gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

		gl.enable     ( gl.DEPTH_TEST );
		gl.depthFunc  ( gl.LEQUAL );

		gl.clearColor(0.0, 0.0, 0.0, 1.0);
		gl.clearDepth(1.0); 
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		var uniformTextureFlag = gl.getUniformLocation(shaderProgram, "uTextureFlag");
		gl.uniform1i(uniformTextureFlag, parameters.textureIndex);

		var uniformShadingFlag = gl.getUniformLocation(shaderProgram, "uShadingFlag");
		gl.uniform1i(uniformShadingFlag, parameters.shadingIndex);

		var uniformLightFlag = gl.getUniformLocation(shaderProgram, "uLightFlag");
		gl.uniform1i(uniformLightFlag, parameters.lightingIndex);

		var uniformShininess = gl.getUniformLocation(shaderProgram, "uShininess");
		gl.uniform1f(uniformShininess, parameters.lightParams.shininess);

		var roughness = gl.getUniformLocation(shaderProgram, "roughness");
		gl.uniform1f(roughness, parameters.lightParams.roughness);

		var intensity = gl.getUniformLocation(shaderProgram, "intensity");
		gl.uniform1f(intensity, parameters.lightParams.intensity);

		var F0 = gl.getUniformLocation(shaderProgram, "F0");
		gl.uniform1f(F0, parameters.lightParams.fresnel);

		var lin_attenuation = gl.getUniformLocation(shaderProgram, "lin_attenuation");
		gl.uniform1f(lin_attenuation, parameters.lightParams.lin_attenuation);

		var quad_attenuation = gl.getUniformLocation(shaderProgram, "quad_attenuation");
		gl.uniform1f(quad_attenuation, parameters.lightParams.quad_attenuation);

		var texture_contrib = gl.getUniformLocation(shaderProgram, "texture_contrib");
		gl.uniform1f(texture_contrib, parameters.textureParams.texture_contrib);

		setupLights(
			parameters.lightOffset,
			parameters.lightParams.ambient, 
			parameters.lightParams.diffuse,
			parameters.lightParams.specular,
			parameters.lightParams.light,
			);

		//Формирование небходимых осей
		let raxis = [];
		if (parameters.rotationIndex == 1) {
			raxis = [parameters.offset.x, parameters.offset.y, parameters.offset.z];
		}
		else if (parameters.rotationIndex == 2) {
			raxis = [0,0,0];
		}

		perspective ( 45, window.innerWidth / window.innerHeight, 0.1, 100.0 );

		drawCube(
			getCubeElements(), //Model
			[parameters.offset.x-1, parameters.offset.y, parameters.offset.z], //Offset
			[parameters.rotation.x, parameters.rotation.y, parameters.rotation.z], //Rotations
			[1.0,0.0,0.0,1.0], //color
			"stone.png", //texture
			"stone.png", //texture2
			"bumpMap.jpg",
			0.5, //size		
			raxis // rotation axis
			);

		drawCube(
			getCubeElements(), //Model
			[parameters.offset.x+1, parameters.offset.y, parameters.offset.z], //Offset
			[parameters.rotation.x, parameters.rotation.y, parameters.rotation.z], //Rotations
			[0.0,1.0,0.0,1.0], //color
			"glowstone.png", //texture
			"stone.png", //texture2
			"bumpMap.jpg",
			0.5, //size		
			raxis // rotation axis
			);

		drawCube(
			getCubeElements(), //Model
			[parameters.offset.x, parameters.offset.y, parameters.offset.z], //Offset
			[parameters.rotation.x, parameters.rotation.y, parameters.rotation.z], //Rotations
			[0.0,0.0,1.0,1.0], //color
			"cobblestone.png", //texture
			"stone.png", //texture2
			"bumpMap.jpg",
			0.5, //size		
			raxis // rotation axis
			);

		drawCube(
			getCubeElements(), //Model
			[parameters.offset.x, parameters.offset.y+1, parameters.offset.z], //Offset
			[parameters.rotation.x, parameters.rotation.y, parameters.rotation.z], //Rotations
			[0.5,0.0,1.0,1.0], //color
			"glowstone.png", //texture
			"stone.png", //texture2
			"bumpMap.jpg", //texture3
			0.5, //size		
			raxis // rotation axis
			);

		//Пример прозрачного кубика

		/*drawCube(
			models.sphere,
			[parameters.offset.x, parameters.offset.y, parameters.offset.z], //Offset
			[parameters.rotation.x, parameters.rotation.y, parameters.rotation.z], //Rotations
			[1.0,0.0,0.0,1.0], //color
			"orange.jpg", //texture
			"orange.jpg", //texture2
			"orange_ao.jpg", //texture3
			0.7, //size		
			raxis
			);*/

		gl.flush();
	}