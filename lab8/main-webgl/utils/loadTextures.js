async function loadTexture(assetPath) {
    const response = await fetch((!debug ? "https://str1xer.github.io/mmcs-webgl" : "") + assetPath);
    const imageBlob = await response.blob();
    const imageBitmap = await createImageBitmap(imageBlob);

    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, imageBitmap);

    gl.bindTexture(gl.TEXTURE_2D, null);

    return texture;
}

export { loadTexture }