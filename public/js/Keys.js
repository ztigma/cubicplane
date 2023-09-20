var fuerza = 3;
/**
 * @type {Key[]}
 */
var keys = [];

/**
 * 
 * @param {KeyboardEvent} e 
 */
function key_on(e) {

	let key = e.key.toLowerCase();

	let k = keys.find(n => n.key == key);

	if (key == 'x') {
		is_active = !is_active;
	}

	if (k) {

	}
	else {
		keys.push(new Key(key));
	}

}
/**
 * 
 * @param {KeyboardEvent} e 
 */
function key_off(e) {
	//console.log(`key off: ${keys}`);
	let key = e.key.toLowerCase();
	let predicado = n => n.key == key;
	let f = keys.find(predicado);

	if (f) {
		RemoveUpdate(f);
		keys = keys.REMOVE_ALL(predicado);
	}
	else {

	}

}
class Key extends Interfaz {
	/**
	 * 
	 * @param {string} key 
	 */
	constructor(key) {
		super();
		this.key = key;
		AddUpdate(this);
	}
	Update() {
		if (is_active) {

		}
		else {
			return;
		}


		let key = this.key;
		let add_force = new Vector3(0, 0, 0);

		if (key == "z") {
			add_force.y = fuerza;
		}
		if (key == " ") {
			add_force.y = -fuerza;
		}
		if (key == "w") {
			add_force.z = -fuerza;
		}
		if (key == "s") {
			add_force.z = fuerza;
		}

		if (key == "a") {
			add_force.x = -fuerza;

			if (player.transform().rotation.z < -25) {
				player.transform().rotation = new Vector3(0, 0, -25);
			}

			player.transform().rotation = `${player.transform().rotation} - ${new Vector3(0, 0, 1)}`.op();
		}
		else if (key == "d") {
			add_force.x = fuerza;

			if (player.transform().rotation.z > 25) {
				player.transform().rotation = new Vector3(0, 0, 25);
			}

			player.transform().rotation = `${player.transform().rotation} + ${new Vector3(0, 0, 1)}`.op();
		}
		let q = mover.force.AddFuerzaLocal(add_force, rotar);
		//console.log(`${this.key} : key on: ${q.arranque}`);
	}
}
updates.push
(
	{
		Update:function()
		{
			player.transform().rotation = `${player.transform().rotation} * ${new Vector3(1, 1, 0.95)}`.op();
		}
	}
);