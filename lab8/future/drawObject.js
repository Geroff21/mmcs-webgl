import { core } from "./core.js";
import { helpers } from "./helpers.js";

class Item {

	constructor(gl, programData, data) {

		this.gl = gl;
		this.buffers = new Buffers(this.gl, programData.buffers);

		this.mvMatrix = Matrix.I(4);
		this.nMatrix = Matrix.I(3);

		this.buffers["positionBuffer"].data = data.positions;
		this.buffers["colorBuffer"].data = data.colors;
		this.buffers["normalBuffer"].data = data.normals;
		this.buffers["indexBuffer"].data = data.indices;
		this.buffers["textureBuffer"].data = data.texturecoords;

	}

	draw(rotation, location, color, textures, size, rAxis) {

		this.gl.enable(gl.BLEND);
		this.gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);	

		for (var i = 0; i < this.buffers["positionBuffer"].data.length; i++) {
			this.buffers["colorBuffer"].data.push(color);
		}	

		var rotationAxis = [];

		if (rAxis.length != 0) {
			rotationAxis = [-position[0]+rAxis[0], -position[1]+rAxis[1], -position[2]+rAxis[2]];
		}
		else {
			rotationAxis = [0,0,0];
		}

		this.mvTranslate( this.mvMatrix, [position[0], position[1], position[2]] )
		this.mvTranslate( this.mvMatrix, rotationAxis );
		this.mvRotate(this.mvMatrix, rotation[0], [1,0,0]);
		this.mvRotate(this.mvMatrix, rotation[1], [0,1,0]);
		this.mvRotate(this.mvMatrix, rotation[2], [0,0,1]);
		this.mvTranslate( this.mvMatrix, rotationAxis.map(el => -1 * el ) ); 

		var subMatrix = Matrix.create([
			[this.mvMatrix.elements[0][0], this.mvMatrix.elements[0][1], this.mvMatrix.elements[0][2]],
			[this.mvMatrix.elements[1][0], this.mvMatrix.elements[1][1], this.mvMatrix.elements[1][2]],
			[this.mvMatrix.elements[2][0], this.mvMatrix.elements[2][1], this.mvMatrix.elements[2][2]]
		]); 
		this.nMatrix = subMatrix.inverse().transpose();

		handleTextureLoaded(images[texSrc], texSrc);
		handleTextureLoaded(images[tex2Src], tex2Src);
		handleTextureLoaded(images[tex3Src], tex3Src);	
		
		gl.activeTexture(gl.TEXTURE0 + 0);
		gl.bindTexture(gl.TEXTURE_2D, textures[texSrc]);

		gl.activeTexture(gl.TEXTURE0 + 1);
		gl.bindTexture(gl.TEXTURE_2D, textures[tex2Src]);

		gl.activeTexture(gl.TEXTURE0 + 2);
		gl.bindTexture(gl.TEXTURE_2D, textures[tex3Src]);

		gl.uniformMatrix4fv(programData.uniforms["prMatrix"], false, new Float32Array(prMatrix.flatten()));
		gl.uniformMatrix4fv(programData.uniforms["mvMatrix"], false, new Float32Array(mvMatrix.flatten()));
		gl.uniformMatrix3fv(programData.uniforms["nMatrix"], false, new Float32Array(nMatrix.flatten()));

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

		this.buffers.deleteBuffers();
	}

	multMatrix(mv, m) 
	{
		return mv.x(m);
	}

	mvTranslate(mv, v) 
	{
		var m = Matrix.Translation($V([v[0], v[1], v[2]])).ensure4x4();
		return multMatrix(m);
	}

	mvRotate(mv, angle, axis) {
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

		return multMatrix(rotationMatrix);
	}

}