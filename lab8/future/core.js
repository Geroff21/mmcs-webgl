/* ----- Core Class ----- */

class Core {

	constructor(canvas, vsSource, fsSource) {

		this.gl = helpers.initCanvas(canvas);
		this.shaderProgram = this.initShaders(vsSource, fsSource);

		this.programData = {

			program: this.shaderProgram,

			buffers: {
				"colorBuffer": {
					data: null,
					bufferType: this.gl.ARRAY_BUFFER,
					dataType: Float32Array,
				},
				"positionBuffer": {
					data: null,
					bufferType: this.gl.ARRAY_BUFFER,
					dataType: Float32Array,
				}
			},

			attributes: {
				"aVertexPosition": this.gl.getAttribLocation(this.shaderProgram, "aVertexPosition"),
				"aVertexColor": this.gl.getAttribLocation(this.shaderProgram, "aVertexColor"),
				"aTextureCoord": this.gl.getAttribLocation(this.shaderProgram, "aTextureCoord"),
			},

			uniforms: {
				"prMatrix": this.gl.getUniformLocation(this.shaderProgram, "uPrMatrix"),
				"u1Sampler": gl.getUniformLocation(shaderProgram, "u1Sampler"),
				"uTextureFlag": gl.getUniformLocation(shaderProgram, "uTextureFlag"),
				"uShadingFlag": gl.getUniformLocation(shaderProgram, "uShadingFlag"),
				"uLightFlag": gl.getUniformLocation(shaderProgram, "uLightFlag"),
				"uShininess": gl.getUniformLocation(shaderProgram, "uShininess"),
				"roughness": gl.getUniformLocation(shaderProgram, "roughness"),
				"intensity": gl.getUniformLocation(shaderProgram, "intensity");
				"F0" : gl.getUniformLocation(shaderProgram, "F0");
				"lin_attenuation": gl.getUniformLocation(shaderProgram, "lin_attenuation");
				"quad_attenuation": gl.getUniformLocation(shaderProgram, "quad_attenuation");
				"texture_contrib": gl.getUniformLocation(shaderProgram, "texture_contrib");
				"uLightPosition": gl.getUniformLocation(shaderProgram, "uLightPosition");
				"uAmbientLightColor": gl.getUniformLocation(shaderProgram, "uAmbientLightColor");
				"uDiffuseLightColor": gl.getUniformLocation(shaderProgram, "uDiffuseLightColor");
				"uSpecularLightColor": gl.getUniformLocation(shaderProgram, "uSpecularLightColor");
				"uLightColor": gl.getUniformLocation(shaderProgram, "uLightColor");
			},

		};

		this.initAttributes(programData.attributes);

	}

	/* ----- Canvas ----- */

	initCanvas(idCanvas) {
		var canvas = document.getElementById(idCanvas);

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

	    return gl;
		
	}

	/* ----- Attributes ----- */

	initAttributes(attrList, shaderProgram) {
		for (const [attrName, aP] of Object.entries(attrList)) {
			this.gl.enableVertexAttribArray(aP);
		}
	}

	/* ----- Shaders ----- */

	initShaders(shaderIdVertex, shaderIdFragment) {
		shaderProgram = loadProgram( this.gl, shaderIdVertex, shaderIdFragment );
		this.gl.useProgram(shaderProgram);
		return shaderProgram;
	}

};

class Buffers {

	/* ----- Buffers ----- */

	constructor(gl, programDataBuffers) {

		this.gl = gl;
		this.programDataBuffers = programDataBuffers;

		for (const [bufferName, bP] of Object.entries(this.programDataBuffers)) {
		 	this.addBuffer(bufferName, bP.data, bP.dataType, bP.bufferType, bP.itemsize);
		}
	}

	addBuffer(bufferName, data, dataType, bufferType, itemSize) {
		const buffer = this.gl.createBuffer();
	    buffer = this.programDataBuffers[bufferName].data;
	    this.gl.bindBuffer(bufferType, buffer);
	    this.gl.bufferData(bufferType, new dataType(data.flat()), this.gl.STATIC_DRAW);
	    buffer.itemSize = itemSize;
	    buffer.numItems = data.length / buffer.itemSize;
	}

	deleteBuffer(bufferName) {
		const buffer = this.programDataBuffers[bufferName].data;
		this.gl.deleteBuffer(buffer);
	}

	deleteBuffers() {
		for (const bufferName of Object.entries(bufferList)) {
		 	this.gl.deleteBuffer(bufferName);
		}
	}

}