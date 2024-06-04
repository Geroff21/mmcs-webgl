async function loadShaders() {
    const vertexResponse = await fetch(debug ? "/shaders/shader.vs.glsl" : "https://str1xer.github.io/mmcs-webgl/shaders/shader.vs.glsl");
    const vertexShaderText = await vertexResponse.text();

    const fragmentResponse = await fetch(debug ? "/shaders/shader.fs.glsl" : "https://str1xer.github.io/mmcs-webgl/shaders/shader.fs.glsl");
    const fragmentShaderText = await fragmentResponse.text();

    const particleVertexResponse = await fetch(debug ? "/shaders/particles/default.vs.glsl" : "https://str1xer.github.io/mmcs-webgl/shaders/particles/default.vs.glsl");
    const particleVertexShaderText = await particleVertexResponse.text();

    const particleFragmentResponse = await fetch(debug ? "/shaders/particles/default.fs.glsl" : "https://str1xer.github.io/mmcs-webgl/shaders/particles/default.fs.glsl");
    const particleFragmentShaderText = await particleFragmentResponse.text();

    const trailVertexResponse = await fetch(debug ? "/shaders/particles/trail/trail.vs.glsl" : "https://str1xer.github.io/mmcs-webgl/shaders/particles/trail/trail.vs.glsl");
    const trailVertexShaderText = await trailVertexResponse.text();

    const trailFragmentResponse = await fetch(debug ? "/shaders/particles/trail/trail.fs.glsl" : "https://str1xer.github.io/mmcs-webgl/shaders/particles/trail/trail.fs.glsl");
    const trailFragmentShaderText = await trailFragmentResponse.text();

    return {
        vertexShader: vertexShaderText,
        fragmentShader: fragmentShaderText,

        particleVertexShader: particleVertexShaderText,
        particleFragmentShader: particleFragmentShaderText,
        
        trailVertexShader: trailVertexShaderText,
        trailFragmentShader: trailFragmentShaderText,
    }
}

export { loadShaders }