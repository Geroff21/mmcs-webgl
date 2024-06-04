attribute vec4 aVertexPosition;
attribute vec2 aTextureCoord;
attribute vec4 aVertexColor;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

varying vec2 vTextureCoord;
varying vec3 vFragPos;
varying vec4 vFragColor;

void main(void) {
    vFragPos = (uModelViewMatrix * aVertexPosition).xyz;
    vFragColor = aVertexColor;
    
    vTextureCoord = aTextureCoord;

    gl_Position = uProjectionMatrix * vec4(vFragPos, 1.0);
}
