Element.prototype.FORCE = function() {
	var t = this;
	this.force = new Force(this);
	return this;
}
class Force extends Interfaz {
	/**
	 * 
	 * @param {Element} element 
	 */
	constructor(element) {
		super();

		/**
		 * @type {Element}
		 */
		this.element = element;
		this.arranque = new Vector3(0, 0, 0);
		this.fuerza = new Vector3(0, 0, 0);
		this.resistencia = new Vector3(0.9, 0.95, 0.9);
		this.masa = new Vector3(1, 1, 1);
		this.rebote = new Vector3(2, 1.5, 2);
		this.gravedad = new Vector3(0, 0, 0);//new Vector3(0,0.3,0);
		this.de_pie = false;
	}
	get position() {
		return new Vector3().get_otv(this.element);
	}
	set position(value) {
		new Vector3().Get(value).set_otv(this.element);
	}
	/**
	 * 
	 * @param {Vector3} arranque 
	 * @returns {Force}
	 */
	AddFuerza(arranque) {
		this.arranque.Get(`${this.arranque} + ${arranque}`);
		return this;
	}
	/**
	 * 
	 * @param {Vector3} arranque 
	 * @param {Element} other_element 
	 * @returns {Force}
	 */
	AddFuerzaLocal(arranque, other_element) {
		if (other_element) {
			let qua = new Quaternion().Euler
				(
					new Vector3().get_orv(other_element)
				);
			this.arranque.Get(`${this.arranque} + ${qua.CalcForce(arranque)}`.op());
		}
		else {
			let qua = new Quaternion().Euler
				(
					new Vector3().get_orv(this.element)
				);
			this.arranque.Get(`${this.arranque} + ${qua.CalcForce(arranque)}`.op());
		}
		return this;
	}
	Update() {
		this.fuerza.Get
			(
				`${this.fuerza} * ${this.resistencia}`.op()
			);
		this.fuerza.Get
			(
				`${this.fuerza} + ${this.arranque}`.op()
			);

		if (this.de_pie) {

		}
		else {
			this.fuerza.Get
				(
					`${this.fuerza} + ${this.gravedad}`.op()
				)
				;
		}



		this.arranque.x = 0;
		this.arranque.y = 0;
		this.arranque.z = 0;

		this.position = `${this.position} + ${this.fuerza}`.op();
	}
	/**
	 * 
	 * @param {CollisionResult} collision 
	 */
	OnCollisionStay(collision) {
		//console.log('stay');
		this.GetOut(collision);
	}
	/**
	 * por cuestiones de rendimiento voy a escoger este para determinar la fisicas de impacto
	 * @param {CollisionResult} collision 
	 */
	OnCollisionEnter(collision) {
		this.Collision(collision);
	}
	/**
	 * 
	 * @param {CollisionResult} collision 
	 */
	GetOut(collision) {
		let r = Math.max(...collision.vector.ToArray());

		let bx = r == collision.vector.x;
		let by = r == collision.vector.y;
		let bz = r == collision.vector.z;

		if (bx) {
			let arrastrar = new Vector3(collision.perforacion.x, 0, 0);
			//console.log(arrastrar);
			this.position = `${this.position} + ${arrastrar}`.op();
		}
		else if (by) {
			let arrastrar = new Vector3(0, collision.perforacion.y, 0);
			//console.log(arrastrar);
			this.position = `${this.position} + ${arrastrar}`.op();
		}
		else if (bz) {
			let arrastrar = new Vector3(0, 0, collision.perforacion.z);
			//console.log(arrastrar);
			this.position = `${this.position} + ${arrastrar}`.op();
		}
	}
	/**
	 * 
	 * @param {CollisionResult} collision 
	 */
	Collision(collision) {
		let arreglo = new Vector3
			(
				collision.diference.x.NATURA() / collision.vector_wh.x
				,
				collision.diference.y.NATURA() / collision.vector_wh.y
				,
				collision.diference.z.NATURA() / collision.vector_wh.z
			)

		//console.log(arreglo);

		let r = Math.max(...arreglo.ToArray());

		let bx = r == arreglo.x;
		let by = r == arreglo.y;
		let bz = r == arreglo.z;

		//console.log(`bx:${bx} by:${by} bz:${bz}`);

		if (by) {
			this.de_pie = true;
			return;
		}

		if (collision.other.force) {
			/**
			 * toda accion tiene una reaccion; dos fuerzas iguales que chocan son igual 0 (+x1-x2 = 0)
			 */
			let calc_rebote = `${collision.other.force.fuerza} * ${this.rebote}`.op();

			let tata =
				new Vector3().Get
					(
						`${this.fuerza} + ${calc_rebote}`.op()
					)
				;
			let fuerza_proporcional_this = new Vector3().Get
				(
					(
						`${collision.other.force.masa} / ${this.masa}`.op()
						+
						` / ${{ x: 2, y: 2, z: 2 }}`
					)
						.op()
				)
				;
			let reaccion_this = new Vector3().Get
				(
					`${tata} * ${fuerza_proporcional_this}`.op()
				)
				;
			this.fuerza.Get(reaccion_this);
		}
		else {
			this.fuerza.Get(`${this.fuerza} * ${{ x: -1, y: -1, z: -1 }}`.op());
		}
	}
	/**
	 * 
	 * @param {CollisionResult} collision 
	 */
	OnCollisionExit(collision) {
		this.de_pie = false;
	}
}
/*
	reaccion_f1 = f1 + f2 * (masa2/masa1)/2;
	reaccion_f2 = f1 + f2 * (masa1/masa2)/2;

*/
/*
Hoy lograste componer los elementos
hoy lograste extender las clases algo que nunca pense posible
hoy lograste crear tu primera clase transform y aplicarla para que todo fuera homogeneo
hoy lograste crear tu primera clase force y hacer que todo fuera homogeneo
hoy superarste el limite de un boton a la vez ahora puedes tocar varias teclas a la vez
hoy hasta superaste el jittering

el dia de hoy fue todo un exito 17 junio 2023 : 12:12 am

*/

