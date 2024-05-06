function initShaders() 
{
	shaderProgram = loadProgram ( gl, "shader-vs", "shader-fs" );
	gl.useProgram(shaderProgram);

	vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
	gl.enableVertexAttribArray(vertexPositionAttribute);

	vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
	gl.enableVertexAttribArray(vertexColorAttribute);  
}

function initBuffers(pos, col, ind, dim) 
{
	const positions = pos.flat();
	const colors = col.flat();
	const indices = ind.flat();

	positionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

    indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

    positionBuffer.itemSize = dim;
    positionBuffer.numItems = pos.length;

    colorBuffer.itemSize = 4;
    colorBuffer.numItems = col.length;	

    indexBuffer.itemSize = 3;
    indexBuffer.numItems = ind.length;	

}

//Вспомогательные операции

	function rotateZ(m, angle) {
        var c = Math.cos(angle);
        var s = Math.sin(angle);
        var mv0 = m[0], mv4 = m[4], mv8 = m[8];

        m[0] = c*m[0]-s*m[1];
        m[4] = c*m[4]-s*m[5];
        m[8] = c*m[8]-s*m[9];

        m[1]=c*m[1]+s*mv0;
        m[5]=c*m[5]+s*mv4;
        m[9]=c*m[9]+s*mv8;
    }

     function rotateX(m, angle) {
        var c = Math.cos(angle);
        var s = Math.sin(angle);
        var mv1 = m[1], mv5 = m[5], mv9 = m[9];

        m[1] = m[1]*c-m[2]*s;
        m[5] = m[5]*c-m[6]*s;
        m[9] = m[9]*c-m[10]*s;

        m[2] = m[2]*c+mv1*s;
        m[6] = m[6]*c+mv5*s;
        m[10] = m[10]*c+mv9*s;
    }

    function rotateY(m, angle) {
	    var c = Math.cos(angle);
	    var s = Math.sin(angle);

	    var mv0 = m[0], mv4 = m[4], mv8 = m[8];

	    m[0] = c * m[0] + s * m[2];
	    m[4] = c * m[4] + s * m[6];
	    m[8] = c * m[8] + s * m[10];

	    m[2] = c * m[2] - s * mv0;
	    m[6] = c * m[6] - s * mv4;
	    m[10] = c * m[10] - s * mv8;

	}

	function loadIdentity() 
	{
		mvMatrix = Matrix.I(4);
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

	function perspective(fovy, aspect, znear, zfar) 
	{
		prMatrix = makePerspective(fovy, aspect, znear, zfar);
	}