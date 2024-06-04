async function loadModel(assetPath) {

    const response = await fetch((!debug ? "https://str1xer.github.io/mmcs-webgl" : "") + assetPath);
    const text = await response.text();

    return text;
}

function parseOBJ(objText) {
    const vertexArray = [];
    const normalArray = [];
    const textureArray = [];
    const indexArray = [];
    const tangentArray = [];
    const bitangentArray = [];

    const vertex = [];
    const normal = [];
    const texture = [];
    const facemap = {};
    let index = 0;

    const lines = objText.split("\n");
    for (let lineIndex in lines) {
        const line = lines[lineIndex].replace(/[ \t]+/g, " ").replace(/\s\s*$/, "");

        // ignore comments
        if (line[0] === "#")
            continue;

        const array = line.split(" ");
        if (array[0] === "v") {
            // vertex
            vertex.push(parseFloat(array[1]));
            vertex.push(parseFloat(array[2]));
            vertex.push(parseFloat(array[3]));
        }
        else if (array[0] === "vt") {
            // texture
            texture.push(parseFloat(array[1]));
            texture.push(parseFloat(array[2]));
        }
        else if (array[0] === "vn") {
            // normal
            normal.push(parseFloat(array[1]));
            normal.push(parseFloat(array[2]));
            normal.push(parseFloat(array[3]));
        }
        else if (array[0] === "f") {
            // face
            if (array.length !== 4) {
                continue;
            }


            for (let i = 1; i < 4; ++i) {
                if (!(array[i] in facemap)) {
                    const f = array[i].split("/");
                    let vtx, nor, tex;

                    if (f.length === 1) {
                        vtx = parseInt(f[0]) - 1;
                        nor = vtx;
                        tex = vtx;
                    }
                    else if (f.length === 3) {
                        vtx = parseInt(f[0]) - 1;
                        tex = parseInt(f[1]) - 1;
                        nor = parseInt(f[2]) - 1;
                    }
                    else {
                        return null;
                    }

                    // do the vertices
                    let x = 0;
                    let y = 0;
                    let z = 0;
                    if (vtx * 3 + 2 < vertex.length) {
                        x = vertex[vtx * 3];
                        y = vertex[vtx * 3 + 1];
                        z = vertex[vtx * 3 + 2];
                    }
                    vertexArray.push(x);
                    vertexArray.push(y);
                    vertexArray.push(z);

                    // do the textures
                    x = 0;
                    y = 0;
                    if (tex * 2 + 1 < texture.length) {
                        x = texture[tex * 2];
                        y = texture[tex * 2 + 1];
                    }
                    textureArray.push(x);
                    textureArray.push(y);

                    // do the normals
                    x = 0;
                    y = 0;
                    z = 1;
                    if (nor * 3 + 2 < normal.length) {
                        x = normal[nor * 3];
                        y = normal[nor * 3 + 1];
                        z = normal[nor * 3 + 2];
                    }
                    normalArray.push(x);
                    normalArray.push(y);
                    normalArray.push(z);

                    facemap[array[i]] = index++;
                }

                indexArray.push(facemap[array[i]]);
            }
        }
    }

    return {
        vertexPositions: vertexArray,
        vertexNormals: normalArray,
        textureCoord: textureArray,
        color: [],
        indices: indexArray,
        tangents: tangentArray,
        bitangents: bitangentArray
    };

}


export { loadModel, parseOBJ }