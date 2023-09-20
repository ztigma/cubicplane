/*
	debe tener
	  lista del top 10 del recorrido mas largo.
		en el piso cosas para ir mas rapido
		  y cosas para ir mas lento
	si tu velocidad toca 0 explotas y pierdes
	  tu velocidad empieza en 100
		cada vez que toques mas speed sube y si tocas menos baja.
		  el mundo se debe ir generando y destruyendo progresivamente.

	  lo unico que genera el mundo son speed up y speed down
		contador de km recorridos para tener en cuenta el record.

		  el objeto se mueve hacia adelante la camara lo sigue
	las unicas acciones son moverse a la izquierda y a la derecha
*/


class Game {
	constructor() {

	}
}
Game.prototype.toString = async function() {
	return await 'views/Game/html/Game.html'.ASYNC_LOAD();
}
module.exports = Game;