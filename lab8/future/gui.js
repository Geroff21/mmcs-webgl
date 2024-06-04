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

	return gui;
}