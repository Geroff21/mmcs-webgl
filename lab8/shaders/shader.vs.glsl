attribute vec4 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
// uniform vec3 uLightPosition[1];

varying vec3 vNormal;
varying vec2 vTextureCoord;
varying vec3 vFragPos;
// varying vec3 vLightPos;

void main(void) {
    vFragPos = (uModelViewMatrix * aVertexPosition).xyz;
    // vMVMatrix = 
    // vLightPos = (uModelViewMatrix * vec4(uLightPosition, 1.0)).xyz;
    vNormal = normalize(mat3(uModelViewMatrix) * aVertexNormal); // World space normal
    vTextureCoord = aTextureCoord;
    gl_Position = uProjectionMatrix * vec4(vFragPos, 1.0);
}
