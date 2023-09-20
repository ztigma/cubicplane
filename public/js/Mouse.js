var mouse_position = new Vector3(0, 0, 0);
var camera_euler = new Vector3(0, 0, 0);
var camera_quaternion = new Quaternion(0, 0, 0);
var is_active = true;

function get_mouse(e) {
	let h = getComputedStyle(document.body).height.TO_FLOAT();
	let w = getComputedStyle(document.body).width.TO_FLOAT();

	mouse_position.y = e.clientY / h - 0.5;
	mouse_position.x = e.clientX / w - 0.5;
}
//POR LA GRAN DIOSA LAIN!!! !!!! !!! !!! AAAAAAAAAH!!!
function set_mouse() {
	if (is_active) {

	}
	else {
		return;
	}

	camera_euler.x = rotar.style.getPropertyValue('--orx').TO_FLOAT();
	camera_euler.x -= mouse_position.y * 4;

	if (camera_euler.x >= 90) {
		camera_euler.x = 90;
	}
	if (camera_euler.x < -90) {
		camera_euler.x = -90;
	}

	camera_euler.y = rotar.style.getPropertyValue('--ory').TO_FLOAT();
	camera_euler.y += mouse_position.x * 4;

	if (camera_euler.y >= 180) {
		camera_euler.y -= 360;
	}
	if (camera_euler.y <= -180) {
		camera_euler.y += 360;
	}

	camera_quaternion.Euler(camera_euler);

	rotar.style.setProperty('--oqx', camera_quaternion.x + "");
	rotar.style.setProperty('--oqy', camera_quaternion.y + "");
	rotar.style.setProperty('--oqz', camera_quaternion.z + "");

	rotar.style.setProperty('--orx', camera_euler.x + "");
	rotar.style.setProperty('--ory', camera_euler.y + "");
}