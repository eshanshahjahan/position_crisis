var update = function ( delta, vrstate, gamestate ) {

	const scale = .0025;

	var cameraObject = gamestate['camera']['object'];
	cameraObject.position.x = vrstate.sixense.controllers[0].position[0] * scale;
	cameraObject.position.y = vrstate.sixense.controllers[0].position[1] * scale + 5;
	cameraObject.position.z = vrstate.sixense.controllers[0].position[2] * scale;
	
	var gunObject = gamestate['gun']['object'];
	gunObject.position.x = vrstate.sixense.controllers[1].position[0] * scale;
	gunObject.position.y = vrstate.sixense.controllers[1].position[1] * scale + 5;
	gunObject.position.z = vrstate.sixense.controllers[1].position[2] * scale;
	
	gunObject.useQuaternion = true;
	gunObject.quaternion.x = vrstate.sixense.controllers[1].rotation[0];
	gunObject.quaternion.y = vrstate.sixense.controllers[1].rotation[1];
	gunObject.quaternion.z = vrstate.sixense.controllers[1].rotation[2];
	gunObject.quaternion.w = vrstate.sixense.controllers[1].rotation[3];
	
	if (vrstate.sixense.controllers[1].trigger > 0.75 && gamestate['gun']['trigger'] == false) {
		gamestate['gun']['trigger'] = true;
		var v = new THREE.Vector3(0,0,1);
		v.applyQuaternion(gunObject.quaternion);
		var rayc = new THREE.Raycaster(gunObject.position, v.negate());
		var hits = rayc.intersectObjects(gamestate['objects'], true);
		if (hits.length) {
			hits.sort(function (a, b) {return a['distance'] - b['distance']});
			if(hits[0]['object']['parent'].shoot) {hits[0]['object']['parent'].shoot();}
		}
	} else if (vrstate.sixense.controllers[1].trigger < 0.25 && gamestate['gun']['trigger'] == true) {
		gamestate['gun']['trigger'] = false;
		//gamestate['objects'].map(function (object) {object.children.map(function (child){child.visible=true})});
	}
	if (vrstate.sixense.controllers[1].buttons & vr.SixenseButton.BUTTON_START) {
		gamestate.reset();
		gamestate['objects'].map(function(object) {if (object.reset) {object.reset()}});
	}
	gamestate['objects'].map(function(object) {if (object.update) {object.update()}});
};