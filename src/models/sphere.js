export function getSphereElements(radius, latitudeBands, longitudeBands) {
    const positions = [];
    const normals = [];
    const texturecoords = [];
    const indices = [];
    const colors = [];

    for (let lat = 0; lat <= latitudeBands; lat++) {
        const theta = lat * Math.PI / latitudeBands;
        const sinTheta = Math.sin(theta);
        const cosTheta = Math.cos(theta);

        for (let long = 0; long <= longitudeBands; long++) {
            const phi = long * 2 * Math.PI / longitudeBands;
            const sinPhi = Math.sin(phi);
            const cosPhi = Math.cos(phi);

            const x = cosPhi * sinTheta;
            const y = cosTheta;
            const z = sinPhi * sinTheta;
            const u = 1 - (long / longitudeBands);
            const v = 1 - (lat / latitudeBands);

            normals.push(x);
            normals.push(y);
            normals.push(z);
            texturecoords.push(u);
            texturecoords.push(v);
            positions.push(radius * x);
            positions.push(radius * y);
            positions.push(radius * z);
        }
    }

    for (let lat = 0; lat < latitudeBands; lat++) {
        for (let long = 0; long < longitudeBands; long++) {
            const first = (lat * (longitudeBands + 1)) + long;
            const second = first + longitudeBands + 1;
            indices.push(first);
            indices.push(second);
            indices.push(first + 1);

            indices.push(second);
            indices.push(second + 1);
            indices.push(first + 1);
        }
    }

    return { positions, normals, colors, indices, texturecoords };
}

export default getSphereElements;