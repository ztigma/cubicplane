var console = {};
console.log = function() { };

require('./async');

var pnow = 0;
Object.prototype.ID = function() {
	return pnow++;
}

/** HERENCIA COMUN DE TODAS LAS VISTAS */
class View {
	constructor() {
		this.tag = "div";
		this.attributes =
		{
			id: this.constructor.name + "_" + this.ID()
			,
			_view: this.constructor.name
			,
			_orientation: "vertical_center"
			,
			onclick: "/*onclick*/"
			,
			onchange: "/*onchange*/"
			,
			_onloading: 'true'
		};
		this.children = [];
		this.style =
		{
			"--h": "auto"
			,
			"--w": "auto"
			,
			"--h_phone": "auto"
			,
			"--w_phone": "auto"
			,
			'--box_shadow': '2vw'
			,
			'--box_shadow_color': 'black'
		};
		this.token_options =
		{
			tokenable: false
			,
			db_to_props: []//{ path:'./db/form/__id__/home.json' }
		};
	}
	SetImg(src) {
		this.Style
			({
				...View.Style.background(`url('${src}') center center no-repeat`)
			})
		return this;
	}
	SetImgContain(src) {
		this.Style
			({
				...View.Style.background(`url('${src}') center center / contain no-repeat`)
			})
		return this;
	}
	/** 
		  method: 'GET_PERSISTENCE, LOAD_TO_OBJECT, SELECT_PERSISTENCE, (persistence.js)'
				,
		  template: new View().Children('__name__ __phone_code__');
				,
		callback: function(persistence_data){}
		  */
	SetPersistence(path, method, template, callback, predicate) {
		var t = this;

		path.toString()[method]
			(
				function(info) {
					if (info) {

					}
					else {
						callback(undefined);
						return;
					}

					let data = info;
					if (predicate) {
						data = info.filter(predicate);
					}

					if (data) {
						var map_html = data.map
							(
								function(n) {
									return template.toString().PROPS(n);
								}
							);

						var map = map_html.map
							(
								function(n) {
									return n.toView();
								}
							);

						t.Children(map);
						callback(data, map);
					}
					else {
						callback(undefined);
					}
				}
			);
	}
	/** Con esto envias la vista al cliente y no puesdes escribir debajo de este metodo, no sea bobo. */
	Send(req, res, path, id) {
		try {
			var t = this;
			if (this.token_options.tokenable) {
				View.OpenToken
					(
						function(user) {
							if (user) {
								console.log('OPEN TOKEN:');
								console.log(user);

								View.Db_Load(t.token_options.db_to_props, user.id);

								var final = 'none';

								View.Promise
									(
										function(array) {
											console.log('promise:');
											console.log(array);
											array.forEach
												(
													function(c) {
														if (c.data) {
															if (final == 'none') {
																final = t.toString().PROPS(c.data)
															}
															else {
																final = final.toString().PROPS(c.data)
															}
														}
													}
												);

											if (final == 'none') {
												var view_final = t.toString().replaceAll(/(>>)[\s\S]*?(<<)/g, '');

												view_final.FINAL_RESPONSE(req, res, path, id);
											}
											else {
												//limpieza de variables vacias
												final = final.replaceAll(/(>>)[\s\S]*?(<<)/g, '');

												//envio
												final.FINAL_RESPONSE(req, res, path, id);
											}
										}
										,
										t.token_options.db_to_props
									);
							}
							else {
								res.send('<script>location.replace("/login");</script>');
							}
						}
						,
						req
					);
			}
			else {
				this.FinalResponse(req, res, path, id);
			}
		}
		catch (error) {
			console.log('ERROR SEND VIEW:');
			res.send(error.stack);
		}
	}
	FinalResponse(req, res, path, id, THIS) {
		var t = THIS ? THIS : this;
		t.toString().FINAL_RESPONSE(req, res, path, id, THIS);
	}
	/** designa el tag o etiqueta de un objeto ejemplo: button, div, input */
	Tag(n) {
		this.tag = n;
		return this;
	}
	/** designa el hijo de un objeto ejemplo: new View().Childre("" + new View() + "")*/
	Children(n) {
		this.children = n;
		return this;
	}
	Children_add(n) {
		var t = this;
		n.forEach
			(
				function(c) {
					t.children.push(c);
				}
			)
		return this;
	}
	Fase(list_fases) {
		let r =
		{
			"_fase": "self"
			,
			"_fase_current": "0"
		};
		var i = 0;
		list_fases.forEach
			(
				function(c) {
					r["_fase_" + i] = c;
					i++;
				}
			);
		this.Attributes(r);
		return this.FaseMethod.TO_STRING().PROPS
			({
				this: this.attributes.id
			});
	}
	FaseMethod() {
		let h = __this__;
		let f = h.getAttribute('_fase_current');
		if (f === null) {
			var v = 1;
			//console.log(v);
			var fg = h.getAttribute('_fase_' + v);

			if (fg !== null) {
				h.innerHTML = h.getAttribute('_fase_' + v);
				h.setAttribute('_fase_current', v);
			}
			else {
				h.innerHTML = h.getAttribute('_fase_' + 0);
				h.setAttribute('_fase_current', 0);
			}
		}
		else {
			var v = parseInt(h.getAttribute('_fase_current'));
			v++;

			var fg = h.getAttribute('_fase_' + v);

			if (fg !== null) {
				h.innerHTML = h.getAttribute('_fase_' + v);
				h.setAttribute('_fase_current', v);
			}
			else {
				h.innerHTML = h.getAttribute('_fase_' + 0);
				h.setAttribute('_fase_current', 0);
			}
		}
	}
	/** designa los atributos de un objeto ejemplo: _orientation="vertical_center"*/
	Attributes(n) {
		this.attributes =
		{
			...this.attributes
			,
			...n
		};
		return this;
	}
	/** designa el estilo de un objeto ejemplo: style="color:red;"*/
	Style(n) {
		this.style =
		{
			...this.style
			,
			...n
		};
		return this;
	}
	AttributesToHtml() {

		var w = Object.entries(this.attributes).map(n => n[0] + "=" + '"' + n[1] + '"');
		var s = "";
		w.forEach(n => s += n);
		return s;
	}
	StyleToHtml() {

		var w = Object.entries(this.style).map(n => n[0] + ":" + n[1] + ';');
		var s = "";
		w.forEach(n => s += n);

		if (s == "") {
			return "";
		}
		else {
			return `style="${s}"`;
		}
	}
}
String.prototype.FINAL_RESPONSE = function(req, res, path, id, THIS) {
	var t = THIS ? THIS : this;
	var a = req.query.la;
	console.log("req.method");
	console.log(req.method);

	if (path) {

	}
	else {
		res.send(t.toString().HEAD().PROPS({ token: req.body.token }));
		return;
	}

	if (Array.isArray(path)) {

	}
	else {
		path =
			[
				{ path: path }
				,
				{ path: 'LateralMenu/LateralMenu.json' }
			]
	}

	if (req.method == 'POST') {

		var la = undefined;
		if (a) {
			la = a[0] + a[1];
		}
		else {
			la = "es";
		}

		//console.log(la);
		if (la == "es") {
			console.log('es');
			if (Array.isArray(path)) {
				console.log('array');
				path.forEach
					(
						function(p) {
							console.log('forEach');
							`db/idiom/es/${p.path}`.FIND_PERSISTENCE
								(
									function(data) {
										console.log('data');
										console.log(data);

										if (data) {
											p['data'] = data;
										}
										else {
											p['data'] = {};
										}
									}
									,
									id ? n.id == id : n => n.id == "0"
								);
						}
					);
				path.PROMISE
					(
						function() {
							console.log('PROMISE:::');
							let r = t.toString().HEAD().PROPS({ token: req.body.token });
							path.forEach
								(
									function(p) {
										r = r.PROPS(p.data);
									}
								)
							console.log('se envio la data');
							console.log(req.url);
							res.send(r);
						}
						,
						1000
					);
				return;
			}

			`db/idiom/${la}/${path}`.FIND_PERSISTENCE
				(
					function(data) {
						console.log('se envio la data');
						console.log(req.url);
						res.send(t.toString().HEAD().PROPS({ token: req.body.token }).PROPS(data));
					}
					,
					id ? n.id == id : n => n.id == "0"
				);
		}
		else {
			if (Array.isArray(path)) {
				path.forEach
					(
						function(p) {
							`db/idiom/en/${p.path}`.FIND_PERSISTENCE
								(
									function(data) {
										if (data) {
											p['data'] = data;
										}
										else {
											p['data'] = {};
										}
									}
									,
									id ? n.id == id : n => n.id == "0"
								);
						}
					);
				path.PROMISE
					(
						function() {
							let r = t.toString().HEAD().PROPS({ token: req.body.token });
							path.forEach
								(
									function(p) {
										r = r.PROPS(p.data);
									}
								)
							console.log('se envio la data');
							console.log(req.url);
							res.send(r);
						}
						,
						1000
					);
				return;
			}
			`db/idiom/en/${path}`.FIND_PERSISTENCE
				(
					function(data) {
						console.log('se envio la data');
						console.log(req.url);
						res.send(t.toString().HEAD().PROPS({ token: req.body.token }).PROPS(data));
					}
					,
					id ? n.id == id : n => n.id == "0"
				);
		}
	}
	else if (req.method == 'GET') {
		if (a) {
			var la = a[0] + a[1];
			//console.log(la);
			if (la == "es") {
				if (Array.isArray(path)) {
					path.forEach
						(
							function(p) {
								`db/idiom/${la}/${p.path}`.FIND_PERSISTENCE
									(
										function(data) {
											if (data) {
												p['data'] = data;
											}
											else {
												p['data'] = {};
											}
										}
										,
										id ? n.id == id : n => n.id == "0"
									);
							}
						);
					path.PROMISE
						(
							function() {
								let r = t.toString().HEAD().PROPS({ token: req.body.token });
								path.forEach
									(
										function(p) {
											r = r.PROPS(p.data);
										}
									)
								console.log('se envio la data');
								console.log(req.url);
								res.send(r);
							}
							,
							1000
						);
					return;
				}

				`db/idiom/${la}/${path}`.FIND_PERSISTENCE
					(
						function(data) {
							console.log('se envio la data');
							console.log(req.url);
							res.send(t.toString().HEAD().PROPS({ token: req.body.token }).PROPS(data));
						}
						,
						id ? n.id == id : n => n.id == "0"
					);
			}
			else {
				if (Array.isArray(path)) {
					path.forEach
						(
							function(p) {
								`db/idiom/en/${p.path}`.FIND_PERSISTENCE
									(
										function(data) {
											if (data) {
												p['data'] = data;
											}
											else {
												p['data'] = {};
											}
										}
										,
										id ? n.id == id : n => n.id == "0"
									);
							}
						);
					path.PROMISE
						(
							function() {
								let r = t.toString().HEAD().PROPS({ token: req.body.token });
								path.forEach
									(
										function(p) {
											r = r.PROPS(p.data);
										}
									)
								console.log('se envio la data');
								console.log(req.url);
								res.send(r);
							}
							,
							1000
						);
					return;
				}
				`db/idiom/en/${path}`.FIND_PERSISTENCE
					(
						function(data) {
							console.log('se envio la data');
							console.log(req.url);
							res.send(t.toString().HEAD().PROPS({ token: req.body.token }).PROPS(data));
						}
						,
						id ? n.id == id : n => n.id == "0"
					);
			}

		}
		else {
			res.send
				(
					`
						VIEW.FINAL_RESPONSE FAIL (ESTO NUNCA DEBE PASAR);
					`
				);
		}
	}
}
View.prototype.toString = function() {

	if (this.tag == 'input' || this.tag == "img") {
		return `<${this.tag} ${this.AttributesToHtml()}${this.StyleToHtml()}/>`;
	}
	else {
		if (this.attributes.style) {
			if (Array.isArray(this.children)) {
				var s = "";
				this.children.forEach(n => s += n.toString());
				return `<${this.tag} ${this.AttributesToHtml()}>${s}</${this.tag}>`;
			}
			else {
				return `<${this.tag} ${this.AttributesToHtml()}>${this.children + ''}</${this.tag}>`;
			}
		}
		else {
			if (Array.isArray(this.children)) {
				var s = "";
				this.children.forEach(n => s += n);
				return `<${this.tag} ${this.AttributesToHtml()}${this.StyleToHtml()}>${s}</${this.tag}>`;
			}
			else {
				return `<${this.tag} ${this.AttributesToHtml()}${this.StyleToHtml()}>${this.children + ''}</${this.tag}>`;
			}
		}
	}
}
View.Redirect = function() {
	let direcciones = ['https://app.autosalud.net', 'https://appinc.autosalud.repl.co'];
	return direcciones[1];
}
String.prototype.HTML_TO_TTR = function() {
	var t = this.replace(/>([\s\S]*)</g, '');
	var list = t.match(/([^"]*)="([^"]*)"/g);

	list[0] = list[0].split(' ')[1];
	//console.log(list);
	var ttr = {};

	list.forEach
		(
			function(n) {
				var split = n.split('=');
				var name = split[0];
				var value = split[1].slice(1, -1);
				ttr[name] = value;
			}
		);
	return ttr;
}
String.prototype.HTML_TO_CHILDREN = function() {
	var list = this.match(/>([\s\S]*)</g);
	list[0] = list[0].slice(1, -1);
	//console.log(list);
	return list[0];
}
String.prototype.toView = function() {
	var view = new View();
	view.attributes = this.HTML_TO_TTR();
	view.children = this.HTML_TO_CHILDREN();
	view.attributes.id = view.attributes._view + "_" + this.ID();
	return view;
}
Object.prototype.TO_INPUTS = function() {
	var input_prefab = `<input id="__name__" name="__name__" value="__value__" style="display: none;">`;
	var body_form = Object.entries(this).map(n => input_prefab.PROPS({ name: n[0], value: n[1] }));
	var s = '';
	body_form.forEach
		(
			function(n) {
				s += n;
			}
		)
	return s;
}
View.FORM_POST = function(body) {
	var input_prefab = `<input id="__name__" name="__name__" value="__value__">`;

	var body_form = Object.entries(body).map(n => input_prefab.PROPS({ name: n[0], value: n[1] }));

	var s = '';

	body_form.forEach
		(
			function(n) {
				s += n;
			}
		)

	var form = `
 		<form
		id="form"
		method="post"
		action="__action__"
		style="display: none;"
		>
  			${s}
		</form>
		<script> 
			if(localStorage.la)
			{

			}
			else
			{
				localStorage.la = 'es';
			}
			var phone = window.innerHeight > window.innerWidth;
   
   			form.setAttribute('action', window.location.href + "?la=" + localStorage.la + "&phone=" + phone);
  
		 	form.submit();
		</script>
 	`;

	return form.HEAD();
}
View.Promise = function(callback, arr) {
	var pro = new Promise
		(
			function(resolve, rejected) {
				var loop = function() {
					var is_stop = false;
					arr.forEach
						(
							function(o) {
								if (typeof o.exist === 'undefined') {
									is_stop = true;
									setTimeout(loop, 2000);
								}
							}
						);

					if (is_stop) {
						return;
					}

					resolve(arr);
				};
				loop();
			}
		);

	pro.then
		(
			function(form) {
				callback(form);
			}
		);
}
String.prototype.TO_LINK = function() {
	return `
 		<script>
			location.replace("${this}");
   		</script>
 	`
		;
}
View.Db_Load = function(arr, id) {
	var cant = 0;
	arr.forEach
		(
			function(f) {
				if (id) {

					var path = f.path.toString().PROPS({ user_id: id });
					console.log('path:::');
					console.log(path);

					path['EXIST_PERSISTENCE'.DB_TYPE()]
						(
							function(b) {
								console.log(`${b} ${path}`)
								if (b) {
									path['GET_PERSISTENCE'.DB_TYPE()]
										(
											function(data) {
												var current = data[0];
												console.log('current:');
												console.log(current);
												f['data'] = current;
												f['exist'] = true;
												console.log('arr:');
												console.log(arr);
												console.log('cant: ' + cant);
											}
										);
								}
								else {
									console.log('PERSISTENCE DONT EXIST 1');
									f['exist'] = false;
									console.log('arr:');
									console.log(arr);
									console.log('cant: ' + cant);
								}
							}
						);
				}
				else {
					f.path.toString()['EXIST_PERSISTENCE'.DB_TYPE()]
						(
							function(b) {
								if (b) {
									f.path.toString()['GET_PERSISTENCE'.DB_TYPE()]
										(
											function(data) {
												var current = data[0];
												f['data'] = current;
												f['exist'] = true;
												console.log('arr:');
												console.log(arr);
												console.log('cant: ' + cant);
											}
										);
								}
								else {
									console.log('PERSISTENCE DONT EXIST 2');
									f['exist'] = false;
									console.log('arr:');
									console.log(arr);
									console.log('cant: ' + cant);
								}
							}
						);
				}
				cant++;
			}
		);
	console.log('cant: ' + cant);
}
View.Token_Types =
{
	login: 'login'
	,
	entrada: 'entrada'
	,
	confirm: 'confirm'
	,
	password: 'password'
}
View.Logics =
{
	Input:
	{
		phone: function() {
			if (/[0-9]/.test(event.key)) {

			}
			else if (event.key == 'Backspace') {

			}
			else if (event.key == '-') {
				return false;
			}
			else {
				return false;
			}
		}
		,
		plus_character: function() {
			if (this.value.length == __index__ && event.key != 'Backspace') {
				this.value += '__char__';
			}
		}
		,
		limit: function() {
			if (this.value.length >= __limit__ && event.key != 'Backspace') {
				return false;
			}
		}
		,
		remove_cero: function() {
			while (this.value.charAt(0) === '0') {
				this.value = this.value.substring(1);
			}
		}
		,
		test_input: function() {
			if (new RegExp('__regex__').test(event.key)) {

			}
			else if (event.key == 'Backspace') {

			}
			else if (event.key == 'Enter') {

			}
			else {
				return false;
			}
		}
	}
	,
	input:
	{
		type:
		{
			phone: `if(new RegExp("[0-9]").test(event.key)){}else if(event.key == "Backspace"){}else if(event.key == "-"){return false;}else{return false;}`
			,
			calculator: `if(new RegExp("[0-9.]").test(event.key)){}else if(event.key == "Backspace"){}else if(event.key == "Enter"){}else if(event.key == "-"){return false;}else{return false;}`
			,
			text: `if(new RegExp("[a-zA-Z]").test(event.key)){}else if(event.key == "Backspace"){}else if(event.key == "Enter"){}else if(event.key == "-"){return false;}else{return false;}`
			,
			email: `if(new RegExp("[a-zA-Z0-9!-.@]").test(event.key)){}else if(event.key == "Backspace"){}else if(event.key == "Enter"){}else if(event.key == "-"){return false;}else{return false;}`
			,
			text_and_numbers: `if(new RegExp("[a-zA-Z0-9, ]").test(event.key)){}else if(event.key == "Backspace"){}else if(event.key == "Enter"){}else if(event.key == "-"){return false;}else{return false;}`
			,
			text_and_space: `if(new RegExp("[a-zA-Z ]").test(event.key)){}else if(event.key == "Backspace"){}else if(event.key == "Enter"){}else if(event.key == "-"){return false;}else{return false;}`
			,
			cedula_or_passport: function cedula_or_passport() {
				console.log(__this__.getAttribute('onkeyup'));
				if (__this__.getAttribute('onkeyup') == null) {
					__this__.setAttribute('onkeyup', 'this.value = this.value.toUpperCase();');
				}
				else {

				}
				if (new RegExp('[a-zA-Z0-9]').test(event.key)) {

				}
				else if (event.key == 'Backspace') {

				}
				else if (event.key == 'Enter') {

				}
				else if (event.key == '-') {
					return false;
				}
				else {
					return false;
				}
			}
		}
		,
		to_currency: function(value) {
			return (value.replace(",", "") * 1).toLocaleString('en-US', { minimumFractionDigits: 2 });
		}
		,
		to_number: function(value) {
			return value.replace(",", "");
		}
		,
		to_currency_client: function() {
			return `(this.value.replace(",","") * 1).toLocaleString('en-US', {minimumFractionDigits: 2})`;
		}
		,
		to_number_client: function() {
			return `value.replace(",","")`;
		}
	}
}
View.ToForm = function(view, path, token, type, redirect, method) {
	view.Tag('form');
	view.Attributes
		({
			action: `/form?path=${path.TO_URL()}&token=${token}&type=${type}&redirect=${redirect.TO_URL()}`
			,
			method: method
		});
	return view;
}
String.prototype.TO_FILE_PATH = function(path, token, type, redirect) {
	return `${this}?path=${path.TO_URL()}&token=${token}&type=${type}&redirect=${redirect.TO_URL()}&type_entrada=${View.Token_Types.entrada}`;
}
String.prototype.TO_URL = function() {
	return this.replaceAll('/', '%2F');
}


View.Tokens = [];//{ type:'home', id:'', token:'' }
View.Tokens_entrada = [];
View.Tokens_confirm = [];
View.Tokens_repassword = [];

View.CreateTokenPass = function(req) {
	console.log('create token starting');
	var token_object =
	{
		ip: req.ip
		,
		type: View.Token_Types.password
		,
		token: `${req.ip}${View.Token_Types.entrada}${Date.now().toString()}`.SHA()
		,
		email: req.body.email
		,
		pass: req.body.pass
	};
	View.Tokens_repassword.ADD
		(
			token_object
			,
			n => n.ip == token_object.ip && n.email == req.body.email && n.pass == req.body.pass
		);
	return token_object;
}
View.OpenTokenPass = function(req, callback) {
	var w = View.Tokens_repassword.find
		(n => n.token == req.body.repass
			&&
			n.ip == req.ip
			&&
			n.type == req.body.type_repass ? req.body.type_repass : req.query.type_repass
		);
	callback(w);
}
View.CreateTokenConfirm = function(req) {
	console.log('create token confirm starting');
	var token_object =
	{
		ip: req.ip
		,
		type: View.Token_Types.confirm
		,
		token: `${req.ip}${View.Token_Types.entrada}${Date.now().toString()}`.SHA()
		,
		id: req.body.id
	};
	View.Tokens_confirm.ADD
		(
			token_object
			,
			n => false//n.ip == token_object.ip && n.id == req.body.id
		);
	console.log(View.Tokens_confirm);
	return token_object;
}
View.OpenTokenConfirm = function(req, callback) {
	console.log('OpenTokenConfirm::');
	console.log(req.body);
	console.log(req.query);
	console.log(req.ip);

	var w = View.Tokens_confirm.find
		(n => n.token == req.query.confirm
			&&
			n.ip == req.ip
			&&
			n.type == req.body.type_confirm ? req.body.type_confirm : req.query.type_confirm
		);
	console.log(View.Tokens_confirm);
	callback(w);
}
View.CloseTokenConfirm = function(req, callback) {
	View.Tokens_confirm = View.Tokens_confirm.REMOVE_ALL
		(n => n.token == req.body.confirm ? req.body.confirm : req.query.confirm
			&&
			n.ip == req.ip
			&&
			n.type == req.body.type_confirm ? req.body.type_confirm : req.query.type_confirm
		);
	callback();
}
View.CreateTokenEntrada = function(req) {
	console.log('create token starting');
	var token_object =
	{
		ip: req.ip
		,
		type: View.Token_Types.entrada
		,
		token: `${req.ip}${View.Token_Types.entrada}${Date.now().toString()}`.SHA()
		,
		posts_number: 100
		,
	};
	//console.log('token entrada:');
	//console.log(token_object);
	View.Tokens_entrada.ADD
		(
			token_object
			,
			n => n.ip == token_object.ip
			,
			false//aqui esta el error. en true no puede reemplazar la sesion anterior
		);
	//console.log('All Tokens_entrada:');
	//console.log(View.Tokens_entrada);
	return token_object;
}
View.OpenTokenEntrada = function(req, callback) {
	var w = View.Tokens_entrada.find
		(n => n.token == req.body.entrada
			&&
			n.ip == req.ip
			&&
			n.type == req.body.type_entrada ? req.body.type_entrada : req.query.type_entrada
		);
	callback(w);
}
View.CloseTokenEntrada = function(req, callback) {
	View.Tokens_entrada = View.Tokens_entrada.REMOVE_ALL
		(n => n.token == req.body.entrada
			&&
			n.ip == req.ip
			&&
			n.type == req.body.type_entrada ? req.body.type_entrada : req.query.type_entrada
		);
	callback();
}
View.ConsumeEntrada = function(req) {
	var w = View.Tokens_entrada.find
		(n => n.token == req.body.entrada
			&&
			n.ip == req.ip
			&&
			n.type == req.body.type_entrada ? req.body.type_entrada : req.query.type_entrada
		);

	//console.log('consume entrada:');
	//console.log(w);

	if (w) {

	}
	else {
		return 'error';
	}

	var b = undefined;
	if (w.posts_number > 0) {
		//console.log(`consume entrada -- : ${req.ip}`);
		w.posts_number--;
		b = true;
	}
	else {
		b = false;
	}
	return b;
}
setInterval
	(
		function() {
			console.log('+1 posts_number');
			View.Tokens_entrada
				.forEach
				(
					function(n) {
						if (n.posts_number < 100) {
							n.posts_number++;
						}
					}
				)
				;
		}
		,
		10000
	);
View.CreateToken = function(user, req) {
	console.log('create token starting');
	var token_object =
	{
		ip: req.ip
		,
		id: user.id
		,
		type: View.Token_Types.login
		,
		token: `${View.Token_Types.login}${req.ip}${Date.now()}`.toString().SHA()
	};
	//console.log('token:');
	//console.log(token_object);
	View.Tokens.ADD
		(
			token_object
			,
			n => n.id == user.id
		);
	//console.log('All Tokens:');
	//console.log(View.Tokens);
	return token_object;
}
View.CloseToken = function(callback, req) {
	if (req.query.token) {
		View.Tokens = View.Tokens.REMOVE_ALL
			(
				n => n.type == req.query.type
					&&
					n.token == req.query.token
					&&
					n.ip == req.ip
			);
	}
	else if (req.body.token) {
		View.Tokens = View.Tokens.REMOVE_ALL
			(
				n => n.type == req.body.type
					&&
					n.token == req.body.token
					&&
					n.ip == req.ip
			);
	}
	callback();
}
View.OpenToken = function(callback, req) {

	//console.log('token body to open');
	//console.log(req.body);
	//console.log(req.query);
	console.log('OpenToken starting');

	var find = undefined;

	if (req.query.token) {
		find = View.Tokens.find
			(
				n => n.type == req.query.type
					&&
					n.token == req.query.token
					&&
					n.ip == req.ip
			);
	}
	else if (req.body.token) {
		find = View.Tokens.find
			(
				n => n.type == req.body.type
					&&
					n.token == req.body.token
					&&
					n.ip == req.ip
			);
	}

	//console.log('find token:');
	//console.log(find);

	//console.log('ALL TOKENS:');
	//console.log(View.Tokens);


	if (find) {
		'db/register/register.json'['FIND_PERSISTENCE'.DB_TYPE()]
			(
				function(user) {
					if (user) {
						console.log('token catch a user!');
					}
					else {
						console.log('token fail a user!');
					}

					callback(user);
				}
				,
				n => n.id == find.id
			);
	}
	else {
		callback(undefined);
	}
}
View.Colors =
{
	blue: "#0097DC"
	,
	white: "white"
	,
	blue_black: "rgb(0, 95, 157)"
	,
	gray: 'rgb(211,213,214)'
}
View.Tag =
{
	div: "div"
	,
	button: "button"
	,
	textarea: "textarea"
	,
	input: "input"
	,
	img: "img"
	,
	a: "a"
	,
	form: "form"
	,
	select: "select"
}
View.Attributes =
{
	css:
	{
		_shadow:
		{
			true: { "_shadow": "true" }
			,
			false: { "_shadow": "false" }
		}
		,
		_orientation:
		{
			vertical:
			{
				_orientation: "vertical"
			}
			,
			vertical_center:
			{
				_orientation: "vertical_center"
			}
			,
			horizontal_center:
			{
				_orientation: "horizontal_center"
			}
			,
			vertical_start:
			{
				_orientation: "vertical_start"
			}
			,
			horizontal_start:
			{
				_orientation: "horizontal_start"
			}
			,
			vertical_end:
			{
				_orientation: "vertical_end"
			}
			,
			horizontal_end:
			{
				_orientation: "horizontal_end"
			}
			,
			phone_vertical_center_pc_horizontal_center:
			{
				_orientation: "phone_vertical_center pc_horizontal_center"
			}
			,
			phone_horizontal_center_pc_vertical_center:
			{
				_orientation: "phone_horizontal_center pc_vertical_center"
			}
			,
			none:
			{
				_orientation: "none"
			}
		}
		,
		_word:
		{
			horizontal: { "_word": "horizontal" }
			,
			vertical: { "_word": "vertical" }
			,
			none: { "_word": "none" }
		}
		,
		_hover:
		{
			self: { "_hover": "self" }
			,
			none: { "_hover": "none" }
		}
		,
		_unhover:
		{
			self: { "_unhover": "self" }
			,
			none: { "_unhover": "none" }
		}
		,
		_hover_and_unhover:
		{
			self:
			{
				"_hover": "self"
				,
				"_unhover": "self"
			}
			,
			none:
			{
				"_hover": "none"
				,
				"_unhover": "none"
			}
		}
		,
		_focus:
		{
			self: { "_focus": "self" }
			,
			none: { "_focus": "none" }
		}
		,
		_scroll:
		{
			vertical: { "_scroll": "vertical" }
			,
			vertical_block: { "_scroll": "vertical_block", '_orientation': 'vertical' }
			,
			horizontal: { "_scroll": "horizontal" }
		}
		,
		_overflow:
		{
			auto: { "_overflow": "auto" }
			,
			scroll_x: { "_overflow": "scroll_x" }
			,
			scroll_y: { "_overflow": "scroll_y" }
			,
			scroll: { "_overflow": "scroll" }
			,
			hidden: { "_overflow": "hidden" }
			,
		}
		,
		_unreveal:
		{
			self: { "_unreveal": "self" }
			,
			none: { "_unreveal": "none" }
		}
		,
		_reveal:
		{
			self: { "_reveal": "self" }
			,
			none: { "_reveal": "none" }
		}
		,
		_reveal_and_unreveal:
		{
			self:
			{
				"_reveal": "self"
				,
				"_unreveal": "self"
			}
			,
			none:
			{
				"_reveal": "none"
				,
				"_unreveal": "none"
			}
		}
		,
		_undash:
		{
			horizontal: { "_undash": "horizontal" }
			,
			vertical: { "_undash": "vertical" }
			,
			none: { "_undash": "none" }
			,
		}
		,
		_dash:
		{
			horizontal: { "_dash": "horizontal" }
			,
			vertical: { "_dash": "vertical" }
			,
			none: { "_dash": "none" }
			,
		}
		,
		_dash_and_undash:
		{
			horizontal:
			{
				"_dash": "horizontal"
				,
				"_undash": "horizontal"
			}
			,
			vertical:
			{
				"_dash": "vertical"
				,
				"_undash": "vertical"
			}
			,
			none:
			{
				"_dash": "none"
				,
				"_undash": "none"
			}
			,
		}
		,
		_unexpand:
		{
			horizontal: { "_unexpand": "horizontal" }
			,
			vertical: { "_unexpand": "vertical" }
			,
			none: { "_unexpand": "none" }
			,
		}
		,
		_expand:
		{
			horizontal: { "_expand": "horizontal" }
			,
			vertical: { "_expand": "vertical" }
			,
			none: { "_expand": "none" }
			,
		}
		,
		_expand_and_unexpand:
		{
			horizontal:
			{
				"_expand": "horizontal"
				,
				"_unexpand": "horizontal"
			}
			,
			vertical:
			{
				"_expand": "vertical"
				,
				"_unexpand": "vertical"
			}
			,
			none:
			{
				"_expand": "none"
				,
				"_unexpand": "none"
			}
			,
		}
		,
		_border:
		{
			self: { "_border": "self" }
			,
			self_right: { "_border": "self_right" }
			,
			self_left: { "_border": "self_left" }
			,
			self_top: { "_border": "self_top" }
			,
			self_bottom: { "_border": "self_bottom" }
		}
		,
		_events:
		{
			none: { "_events": "none" }
			,
			child_none: { "_events": "child_none" }
		}
		,
		_blur:
		{
			self: { "_blur": "self" }
			,
			none: { "_blur": "none" }
		}
		,
		_active:
		{
			true: { "_active": "true" }
			,
			false: { "_active": "false" }
		}
		,
		_is_enable:
		{
			true: { "_is_enable": "true" }
			,
			false: { "_is_enable": "false" }
		}
		,
		_selected:
		{
			true: { "_selected": "true" }
			,
			false: { "_selected": "false" }
		}
		,
		_expand_click:
		{
			true: { "_expand_click": "true" }
			,
			false: { "_expand_click": "false" }
		}
		,
		_on_selection:
		{
			true: { "_on_selection": "true" }
			,
			false: { "_on_selection": "false" }
		}
	}
	,
	js:
	{
		_remove_phone:
		{
			true: { "_remove_phone": "true" }
			,
			false: { "_remove_phone": "false" }
		}
		,
		_click_event:
		{
			querySelectorAll: function(query) {
				return { "_click_event": query }
			}
		}
		,
		_get_start:
		{
			true: function(link) {
				return {
					"_get_start": "true"
					,
					"_get": link
				}
			}
			,
			false:
			{
				"_get_start": "true"
				,
				"_get": "link"
			}
		}
		,
		_child_attribute:
		{
			recursive: function(name, value, index) {
				var r = { "_child_attribute": "recursive" };
				r["_child_attribute_name_" + index] = name;
				r["_child_attribute_value_" + index] = value;
				return r;
			}
			,
			true: function(name, value, index) {
				var r = { "_child_attribute": "true" };
				r["_child_attribute_name_" + index] = name;
				r["_child_attribute_value_" + index] = value;
				return r;
			}
			,
		}
		,
		_child_style:
		{
			recursive: function(name, value, index) {
				var r = { "_child_style": "recursive" };
				r["_child_style_name_" + index] = name;
				r["_child_style_value_" + index] = value;
				return r;
			}
			,
			true: function(name, value, index) {
				var r = { "_child_style": "true" };
				r["_child_style_name_" + index] = name;
				r["_child_style_value_" + index] = value;
				return r;
			}
			,
		}
		,
		_fase:
		{
			self: function(values) {
				var r = { "_fase": "self", "_fase_current": "0" }
				var i = 0;
				values.forEach
					(
						function(c) {
							r["_fase_" + i] = c;
							i++;
						}
					);



				return r;
			}
		}
		,
		_pick:
		{
			querySelectorAll: function(query) {
				return { "_pick": query }
			}
		}
		,
		_pick_is_enable:
		{
			querySelectorAll: function(to_enable_query, to_remove_query) {
				return {
					"_pick_is_enable": to_enable_query
					,
					"_pick_remove": to_remove_query
				}
			}
		}
		,
		_validation:
		{

			server_validation: function(server_db_row_name, style_if_true, style_if_false, input_or_target_query, eval) {
				return {
					"_validation": server_db_row_name
					,
					"_validation_true": JSON.stringify(style_if_true)
					,
					"_validation_false": JSON.stringify(style_if_false)
					,
					"_validation_target": input_or_target_query
					,
					"_validation_eval": eval
					,
				}
			}
			,
			local_validation:
			{
				by_match_true: function(regular_expression, style_if_true, style_if_false, input_or_target_query) {
					return {
						"_validation": regular_expression
						,
						"_validation_true": JSON.stringify(style_if_true)
						,
						"_validation_false": JSON.stringify(style_if_false)
						,
						"_validation_target": input_or_target_query
						,
						"_is_match": "true"
						,
					}
				}
				,
				by_match_false: function(regular_expression, style_if_true, style_if_false, input_or_target_query) {
					return {
						"_validation": regular_expression
						,
						"_validation_true": JSON.stringify(style_if_true)
						,
						"_validation_false": JSON.stringify(style_if_false)
						,
						"_validation_target": input_or_target_query
						,
						"_is_match": "false"
						,
					}
				}
			}
		}
		,
		_max_count: function(numero_entero_int) {
			return { "_max_count": "" + numero_entero_int }
		}
		,
		_by_path: function(paths_or_links, style_by_this_path) {
			return {
				"_by_path": JSON.stringify(paths_or_links)
				,
				"_by_path_data": JSON.stringify(style_by_this_path)
			}
		}
		,
		_inner_html: function(query_target, data) {
			return {
				"_inner_html": query_target
				,
				"_inner_html_data": data
				,
			}
		}
		,
		_send: function(query_target) {
			return {
				"_send": query_target
			}
		}
		,
		_on_in_target: function(query) {
			return { "_on_in_target": query }
		}
		,
		one_shot: function(js) {
			return { one_shot: js, is_shot: 'true' }
		}
		,
		_eval: function(js_data_to_eval) {
			return { "_eval": js_data_to_eval }
		}
	}
	,
	html:
	{
		value: function(value) {
			return { 'value': value }
		}
		,
		name: function(value) {
			return { 'name': value }
		}
		,
		onchange: function(value) {
			return { "onchange": value }
		}
		,
		one_shot: function(value) {
			return {
				"one_shot": value
				,
				"is_shot": "true"
			}
		}
		,
		onload: function(value) {
			return { "onload": value }
		}
		,
		onclick: function(value) {
			return { "onclick": value }
		}
		,
		onkeyup: function(value) {
			return { "onkeyup": value }
		}
		,
		onkeydown: function(value) {
			return { "onkeydown": value }
		}
		,
		placeholder: function(value) {
			return { "placeholder": value };
		}
		,
		contenteditable:
		{
			true: { "contenteditable": "true" }
			,
			false: { "contenteditable": "false" }
		}
		,
		alt: function(value) {
			return { alt: value }
		}
		,
		src: function(value) {
			return { src: value }
		}
		,
		href: function(value) {
			return { href: value };
		}
		,
		class: function(value) {
			return { class: value };
		}
		,
		id: function(value) {
			return { id: value };
		}
		,
		title: function(value) {
			return { title: value };
		}
		,
		for: function(value) {
			return { for: value };
		}
		,
		type:
		{
			button:
			{
				type: "button"
			}
			,
			checkbox:
			{
				type: "checkbox"
			}
			,
			color:
			{
				type: "color"
			}
			,
			date:
			{
				type: "date"
			}
			,
			datetime_local:
			{
				type: "datetime-local"
			}
			,
			email:
			{
				type: "email"
			}
			,
			file:
			{
				type: "file"
			}
			,
			hidden:
			{
				type: "hidden"
			}
			,
			image:
			{
				type: "image"
			}
			,
			month:
			{
				type: "month"
			}
			,
			number:
			{
				type: "number"
			}
			,
			password:
			{
				type: "password"
			}
			,
			radio:
			{
				type: "radio"
			}
			,
			range:
			{
				type: "range"
			}
			,
			reset:
			{
				type: "reset"
			}
			,
			search:
			{
				type: "search"
			}
			,
			submit:
			{
				type: "submit"
			}
			,
			tel:
			{
				type: "tel"
			}
			,
			text:
			{
				type: "text"
			}
			,
			time:
			{
				type: "time"
			}
			,
			url:
			{
				type: "url"
			}
			,
			week:
			{
				type: "week"
			}
		}
	}
}
View.Style =
{
	visible:
	{
		true: { 'visibility': 'visible' }
		,
		false: { 'visibility': 'hidden' }
	}
	,
	width: function(value) {
		if (value) {
			return { width: value };
		}
		else {
			return { name: "width" };
		}
	}
	,
	height: function(value) {
		if (value) {
			return { height: value };
		}
		else {
			return { name: "height" };
		}
	}
	,
	w_pc: function(value) {
		if (value) {
			return { "--w": value };
		}
		else {
			return { name: "--w" }
		}
	}
	,
	w_phone: function(value) {
		if (value) {
			return { "--w_phone": value };
		}
		else {
			return { name: "--w_phone" };
		}
	}
	,
	w_to_pc: function(value) {
		if (value) {
			return { "--w_to": value };
		}
		else {
			return { name: "--w_to" };
		}
	}
	,
	w_to_phone: function(value) {
		if (value) {
			return { "--w_to_phone": value };
		}
		else {
			return { name: "--w_to_phone" };
		}
	}
	,
	h_pc: function(value) {
		if (value) {
			return { "--h": value };
		}
		else {
			return { name: "--h" };
		}
	}
	,
	h_phone: function(value) {
		if (value) {
			return { "--h_phone": value };
		}
		else {
			return { name: "--h_phone" };
		}
	}
	,
	h_to_pc: function(value) {
		if (value) {
			return { "--h_to": value };
		}
		else {
			return { name: "--h_to" };
		}
	}
	,
	h_to_phone: function(value) {
		if (value) {
			return { "--h_to_phone": value };
		}
		else {
			return { name: "--h_to_phone" };
		}
	}
	,
	y_pc: function(value) {
		if (value) {
			return { "--y": value };
		}
		else {
			return { name: "--y" };
		}
	}
	,
	y_phone: function(value) {
		if (value) {
			return { "--y_phone": value };
		}
		else {
			return { name: "--y_phone" };
		}
	}
	,
	x_pc: function(value) {
		if (value) {
			return { "--x": value }
		}
		else {
			return { name: "--x" };
		}
	}
	,
	x_phone: function(value) {
		if (value) {
			return { "--x_phone": value };
		}
		else {
			return { name: "--x_phone" };
		}
	}
	,
	y_to_pc: function(value) {
		if (value) {
			return { "--y_to": value }
		}
		else {
			return { name: "--y_to" };
		}
	}
	,
	y_to_phone: function(value) {
		if (value) {
			return { "--y_to_phone": value };
		}
		else {
			return { name: "--y_to_phone" };
		}
	}
	,
	x_to_pc: function(value) {
		if (value) {
			return { "--x_to": value }
		}
		else {
			return { name: "--x_to" };
		}
	}
	,
	x_to_phone: function(value) {
		if (value) {
			return { "--x_to_phone": value };
		}
		else {
			return { name: "--x_to_phone" };
		}
	}
	,
	z_index_pc: function(value) {
		if (value) {
			return { "--z_index": value };
		}
		else {
			return { name: "--z_index" };
		}
	}
	,
	z_index_phone: function(value) {
		if (value) {
			return { "--z_index_phone": value };
		}
		else {
			return { name: "--z_index_phone" };
		}
	}
	,
	z_index: function(value) {
		if (value) {
			return { "z-index": value };
		}
		else {
			return { name: "z-index" };
		}
	}
	,
	blur_pc: function(value) {
		if (value) {
			return { "--blur": value };
		}
		else {
			return { name: "--blur" };
		}
	}
	,
	blur_phone: function(value) {
		if (value) {
			return { "--blur_phone": value };
		}
		else {
			return { name: "--blur_phone" };
		}
	}
	,
	font_size_pc: function(value) {
		if (value) {
			return { "--font_size": value };
		}
		else {
			return { name: "--font_size" };
		}
	}

	,
	box_shadow: function(value) {
		if (value) {
			return { "--box_shadow": value };
		}
		else {
			return { name: "--box_shadow" };
		}

	}
	,
	font_size_phone: function(value) {
		if (value) {
			return { "--font_size_phone": value };
		}
		else {
			return { name: "--font_size_phone" };
		}
	}
	,

	font_weight: function(value) {
		if (value) {
			return { "font-weight": value };
		}
		else {
			return { name: "font-weight" };
		}
	}
	,
	justify: function() {
		return {
			"text-align": "justify"
			,
			"text-justify": "inter-word"
			,
		}
	}
	,
	text_justify: function(value) {
		if (value) {
			return { "text-justify": value };
		}
		else {
			return {
				name: "text-justify"
				,
				values:
				{
					auto: { "text-justify": "auto" }
					,
					inter_word: { "text-justify": "inter-word" }
					,
					inter_character: { "text-justify": "inter-character" }
					,
					none: { "text-justify": "none" }
					,
					initial: { "text-justify": "initial" }
					,
					inherit: { "text-justify": "inherit" }
					,
				}
			};
		}
	}
	,
	text_align: function(value) {
		if (value) {
			return { "text-align": value };
		}
		else {
			return {
				name: "text-align"
				,
				values:
				{
					left: { "text-align": "left" }
					,
					right: { "text-align": "right" }
					,
					center: { "text-align": "center" }
					,
					justify: { "text-align": "justify" }
					,
					initial: { "text-align": "initial" }
					,
					inherit: { "text-align": "inherit" }
					,
				}
			};
		}
	}
	,
	text_align_pc: function(value) {
		if (value) {
			return { "--text_align": value };
		}
		else {
			return {
				name: "--text_align"
				,
				values:
				{
					left: { "--text_align": "left" }
					,
					right: { "--text_align": "right" }
					,
					center: { "--text_align": "center" }
					,
					justify: { "--text_align": "justify" }
					,
					initial: { "--text_align": "initial" }
					,
					inherit: { "--text_align": "inherit" }
					,
				}
			};
		}
	}
	,
	text_align_phone: function(value) {
		if (value) {
			return { "--text_align_phone": value };
		}
		else {
			return {
				name: "--text_align_phone"
				,
				values:
				{
					left: { "--text_align_phone": "left" }
					,
					right: { "--text_align_phone": "right" }
					,
					center: { "--text_align_phone": "center" }
					,
					justify: { "--text_align_phone": "justify" }
					,
					initial: { "--text_align_phone": "initial" }
					,
					inherit: { "--text_align_phone": "inherit" }
					,
				}
			};
		}
	}
	,
	position: function(value) {
		if (value) {
			return { "position": value };
		}
		else {
			return {
				name: "position"
				,
				values:
				{
					static: { "position": "static" }
					,
					absolute: { "position": "absolute" }
					,
					fixed: { "position": "fixed" }
					,
					relative: { "position": "relative" }
					,
					sticky: { "position": "sticky" }
					,
					initial: { "position": "initial" }
					,
					inherit: { "position": "inherit" }
					,
				}
			};
		}
	}
	,
	type_position_pc: function(value) {
		if (value) {
			return { "--type_position": value };
		}
		else {
			return {
				name: "--type_position"
				,
				values:
				{
					static: { "--type_position": "static" }
					,
					absolute: { "--type_position": "absolute" }
					,
					fixed: { "--type_position": "fixed" }
					,
					relative: { "--type_position": "relative" }
					,
					sticky: { "--type_position": "sticky" }
					,
					initial: { "--type_position": "initial" }
					,
					inherit: { "--type_position": "inherit" }
					,
				}
			};
		}
	}
	,
	type_position_phone: function(value) {
		if (value) {
			return { "--type_position_phone": value };
		}
		else {
			return {
				name: "--type_position_phone"
				,
				values:
				{
					static: { "--type_position_phone": "static" }
					,
					absolute: { "--type_position_phone": "absolute" }
					,
					fixed: { "--type_position_phone": "fixed" }
					,
					relative: { "--type_position_phone": "relative" }
					,
					sticky: { "--type_position_phone": "sticky" }
					,
					initial: { "--type_position_phone": "initial" }
					,
					inherit: { "--type_position_phone": "inherit" }
					,
				}
			};
		}
	}
	,
	display: function(value) {
		if (value) {
			return { "display": value };
		}
		else {
			return {
				name: "display"
				,
				values:
				{
					outside:
					{
						block: { "display": "block" }
						,
						inline: { "display": "inline" }
						,
						run_in: { "display": "run-in" }
						,
					}
					,
					inside:
					{
						flow: { "display": "flow" }
						,
						flow_root: { "display": "flow-root" }
						,
						table: { "display": "table" }
						,
						flex: { "display": "flex" }
						,
						grid: { "display": "grid" }
						,
						ruby: { "display": "ruby" }
						,
						subgrid: { "display": "subgrid" }
					}
					,
					outside_and_inside:
					{
						block_flow: { "display": "block flow" }
						,
						inline_table: { "display": "inline table" }
						,
						flex_run_in: { "display": "flex run-in" }
					}
					,
					listitem:
					{
						list_item: { "display": "list-item" }
						,
						list_item_block: { "display": "list-item block" }
						,
						list_item_inline: { "display": "list-item inline" }
						,
						list_item_flow: { "display": "list-item flow" }
						,
						list_item_flow_root: { "display": "list-item flow-root" }
						,
						list_item_block_flow: { "display": "list-item block flow" }
						,
						list_item_block_flow_root: { "display": "list-item block flow-root" }
						,
						flow_list_item_block: { "display": "flow list-item block" }
					}
					,
					internal:
					{
						table_row_group: { "display": "table-row-group" }
						,
						table_header_group: { "display": "table-header-group" }
						,
						table_footer_group: { "display": "table-footer-group" }
						,
						table_row: { "display": "table-row" }
						,
						table_cell: { "display": "table-cell" }
						,
						table_column_group: { "display": "table-column-group" }
						,
						table_column: { "display": "table-column" }
						,
						table_caption: { "display": "table-caption" }
						,
						ruby_base: { "display": "ruby-base" }
						,
						ruby_text: { "display": "ruby-text" }
						,
						ruby_base_container: { "display": "ruby-base-container" }
						,
						ruby_text_container: { "display": "ruby-text-container" }
						,
					}
					,
					box:
					{
						contents: { "display": "contents" }
						,
						none: { "display": "none" }
					}
					,
					legacy:
					{
						inline_block: { "display": "inline-block" }
						,
						inline_table: { "display": "inline-table" }
						,
						inline_flex: { "display": "inline-flex" }
						,
						inline_grid: { "display": "inline-grid" }
					}
					,
					global:
					{
						inherit: { "display": "inherit" }
						,
						initial: { "display": "initial" }
						,
						unset: { "display": "unset" }
					}
				}
			};
		}
	}
	,
	display_pc: function(value) {
		if (value) {
			return { "--display": value };
		}
		else {
			return {
				name: "--display"
				,
				values:
				{
					outside:
					{
						block: { "--display": "block" }
						,
						inline: { "--display": "inline" }
						,
						run_in: { "--display": "run-in" }
						,
					}
					,
					inside:
					{
						flow: { "--display": "flow" }
						,
						flow_root: { "--display": "flow-root" }
						,
						table: { "--display": "table" }
						,
						flex: { "--display": "flex" }
						,
						grid: { "--display": "grid" }
						,
						ruby: { "--display": "ruby" }
						,
						subgrid: { "--display": "subgrid" }
					}
					,
					outside_and_inside:
					{
						block_flow: { "--display": "block flow" }
						,
						inline_table: { "--display": "inline table" }
						,
						flex_run_in: { "--display": "flex run-in" }
					}
					,
					listitem:
					{
						list_item: { "--display": "list-item" }
						,
						list_item_block: { "--display": "list-item block" }
						,
						list_item_inline: { "--display": "list-item inline" }
						,
						list_item_flow: { "--display": "list-item flow" }
						,
						list_item_flow_root: { "--display": "list-item flow-root" }
						,
						list_item_block_flow: { "--display": "list-item block flow" }
						,
						list_item_block_flow_root: { "--display": "list-item block flow-root" }
						,
						flow_list_item_block: { "--display": "flow list-item block" }
					}
					,
					internal:
					{
						table_row_group: { "--display": "table-row-group" }
						,
						table_header_group: { "--display": "table-header-group" }
						,
						table_footer_group: { "--display": "table-footer-group" }
						,
						table_row: { "--display": "table-row" }
						,
						table_cell: { "--display": "table-cell" }
						,
						table_column_group: { "--display": "table-column-group" }
						,
						table_column: { "--display": "table-column" }
						,
						table_caption: { "--display": "table-caption" }
						,
						ruby_base: { "--display": "ruby-base" }
						,
						ruby_text: { "--display": "ruby-text" }
						,
						ruby_base_container: { "--display": "ruby-base-container" }
						,
						ruby_text_container: { "--display": "ruby-text-container" }
						,
					}
					,
					box:
					{
						contents: { "--display": "contents" }
						,
						none: { "--display": "none" }
					}
					,
					legacy:
					{
						inline_block: { "--display": "inline-block" }
						,
						inline_table: { "--display": "inline-table" }
						,
						inline_flex: { "--display": "inline-flex" }
						,
						inline_grid: { "--display": "inline-grid" }
					}
					,
					global:
					{
						inherit: { "--display": "inherit" }
						,
						initial: { "--display": "initial" }
						,
						unset: { "--display": "unset" }
					}
				}
			};
		}
	}
	,
	display_phone: function(value) {
		if (value) {
			return { "--display_phone": value };
		}
		else {
			return {
				name: "--display_phone"
				,
				values:
				{
					outside:
					{
						block: { "--display_phone": "block" }
						,
						inline: { "--display_phone": "inline" }
						,
						run_in: { "--display_phone": "run-in" }
						,
					}
					,
					inside:
					{
						flow: { "--display_phone": "flow" }
						,
						flow_root: { "--display_phone": "flow-root" }
						,
						table: { "--display_phone": "table" }
						,
						flex: { "--display_phone": "flex" }
						,
						grid: { "--display_phone": "grid" }
						,
						ruby: { "--display_phone": "ruby" }
						,
						subgrid: { "--display_phone": "subgrid" }
					}
					,
					outside_and_inside:
					{
						block_flow: { "--display_phone": "block flow" }
						,
						inline_table: { "--display_phone": "inline table" }
						,
						flex_run_in: { "--display_phone": "flex run-in" }
					}
					,
					listitem:
					{
						list_item: { "--display_phone": "list-item" }
						,
						list_item_block: { "--display_phone": "list-item block" }
						,
						list_item_inline: { "--display_phone": "list-item inline" }
						,
						list_item_flow: { "--display_phone": "list-item flow" }
						,
						list_item_flow_root: { "--display_phone": "list-item flow-root" }
						,
						list_item_block_flow: { "--display_phone": "list-item block flow" }
						,
						list_item_block_flow_root: { "--display_phone": "list-item block flow-root" }
						,
						flow_list_item_block: { "--display_phone": "flow list-item block" }
					}
					,
					internal:
					{
						table_row_group: { "--display_phone": "table-row-group" }
						,
						table_header_group: { "--display_phone": "table-header-group" }
						,
						table_footer_group: { "--display_phone": "table-footer-group" }
						,
						table_row: { "--display_phone": "table-row" }
						,
						table_cell: { "--display_phone": "table-cell" }
						,
						table_column_group: { "--display_phone": "table-column-group" }
						,
						table_column: { "--display_phone": "table-column" }
						,
						table_caption: { "--display_phone": "table-caption" }
						,
						ruby_base: { "--display_phone": "ruby-base" }
						,
						ruby_text: { "--display_phone": "ruby-text" }
						,
						ruby_base_container: { "--display_phone": "ruby-base-container" }
						,
						ruby_text_container: { "--display_phone": "ruby-text-container" }
						,
					}
					,
					box:
					{
						contents: { "--display_phone": "contents" }
						,
						none: { "--display_phone": "none" }
					}
					,
					legacy:
					{
						inline_block: { "--display_phone": "inline-block" }
						,
						inline_table: { "--display_phone": "inline-table" }
						,
						inline_flex: { "--display_phone": "inline-flex" }
						,
						inline_grid: { "--display_phone": "inline-grid" }
					}
					,
					global:
					{
						inherit: { "--display_phone": "inherit" }
						,
						initial: { "--display_phone": "initial" }
						,
						unset: { "--display_phone": "unset" }
					}
				}
			};
		}
	}
	,
	margin: function(value) {
		if (value) {
			return { margin: value };
		}
		else {
			return { name: "margin" };
		}
	}
	,
	margin_pc: function(value) {
		if (value) {
			return { "--margin": value };
		}
		else {
			return { name: "--margin" };
		}
	}
	,
	margin_phone: function(value) {
		if (value) {
			return { "--margin_phone": value };
		}
		else {
			return { name: "--margin_phone" };
		}
	}
	,
	padding: function(value) {
		if (value) {
			return { padding: value };
		}
		else {
			return { name: "padding" };
		}
	}
	,
	padding_pc: function(value) {
		if (value) {
			return { "--padding": value };
		}
		else {
			return { name: "--padding" };
		}
	}
	,
	padding_phone: function(value) {
		if (value) {
			return { "--padding_phone": value };
		}
		else {
			return { name: "--padding_phone" };
		}
	}
	,
	border_pc: function(value) {
		if (value) {
			return { "--border": value };
		}
		else {
			return { name: "--border" };
		}
	}
	,
	color_back_pc: function(value) {
		if (value) {
			return { "--color_back": value };
		}
		else {
			return { name: "--color_back" };
		}
	}
	,
	color_back_phone: function(value) {
		if (value) {
			return { "--color_back_phone": value };
		}
		else {
			return { name: "--color_back_phone" };
		}
	}
	,
	color_text_pc: function(value) {
		if (value) {
			return { "--color_text": value };
		}
		else {
			return { name: "--color_text" };
		}
	}
	,
	color_text_phone: function(value) {
		if (value) {
			return { "--color_text_phone": value };
		}
		else {
			return { name: "--color_text_phone" };
		}
	}
	,
	color_border_pc: function(value) {
		if (value) {
			return { "--color_border": value };
		}
		else {
			return { name: "--color_border" };
		}
	}
	,
	color_border_hover_pc: function(value) {
		if (value) {
			return { "--color_border_hover": value };
		}
		else {
			return { name: "--color_border_hover" };
		}
	}
	,
	color_back_focus: function(value) {
		if (value) {
			return { "--color_back_focus": value };
		}
		else {
			return { name: "--color_back_focus" };
		}
	}
	,
	color_text_focus: function(value) {
		if (value) {
			return { "--color_text_focus": value };
		}
		else {
			return { name: "--color_text_focus" };
		}
	}
	,
	time_focus_pc: function(value) {
		if (value) {
			return { "--time_focus": value };
		}
		else {
			return { name: "--time_focus" };
		}
	}
	,
	color_back_hover_pc: function(value) {
		if (value) {
			return { "--color_back_hover": value };
		}
		else {
			return { name: "--color_back_hover" };
		}
	}
	,
	color_text_hover_pc: function(value) {
		if (value) {
			return { "--color_text_hover": value };
		}
		else {
			return { name: "--color_text_hover" };
		}
	}
	,
	time_hover_pc: function(value) {
		if (value) {
			return { "--time_hover": value };
		}
		else {
			return { name: "--time_hover" };
		}
	}
	,
	padding: function(value) {
		if (value) {
			return { "padding": value };
		}
		else {
			return { name: "padding" };
		}
	}
	,
	style_border_pc: function(value) {
		if (value) {
			return { "--style_border": value };
		}
		else {
			return {
				name: "--style_border"
				,
				values:
				{
					dotted: { "--style_border": "dotted" }
					,
					dashed: { "--style_border": "dashed" }
					,
					solid: { "--style_border": "solid" }
					,
					double: { "--style_border": "double" }
					,
					groove: { "--style_border": "groove" }
					,
					ridge: { "--style_border": "ridge" }
					,
					inset: { "--style_border": "inset" }
					,
					outset: { "--style_border": "none" }
					,
					outset: { "--style_border": "hidden" }
					,
					none: { "--style_border": "none" }
				}
			};
		}
	}
	,
	border_width: function(value) {
		if (value) {
			return { "--border_width": value };
		}
		else {
			return {
				name: "--border_width"
				,
				values:
				{
					medium: { "--border_width": "medium" }
					,
					thin: { "--border_width": "thin" }
					,
					thick: { "--border_width": "thick" }
					,
					length: { "--border_width": "length" }
					,
					initial: { "--border_width": "initial" }
					,
					inherit: { "--border_width": "inherit" }
				}
			};
		}
	}
	,
	w_border_pc: function(value) {
		if (value) {
			return { "--w_border": value };
		}
		else {
			return { name: "--w_border" };
		}
	}
	,
	border_radius: function(value) {
		if (value) {
			return { "border-radius": value }
		}
		else {
			return { name: "border-radius" };
		}
	}
	,
	border_radius_pc: function(value) {
		if (value) {
			return { "--border_radius": value }
		}
		else {
			return { name: "--border_radius" };
		}
	}
	,
	border_radius_phone: function(value) {
		if (value) {
			return { "--border_radius_phone": value }
		}
		else {
			return { name: "--border_radius_phone" };
		}
	}

	,
	overflow: function(value) {
		if (value) {
			return { "overflow": value }
		}
		else {
			return {
				name: "overflow"
				,
				values:
				{
					visible: { "overflow": "visible" }
					,
					hidden: { "overflow": "hidden" }
					,
					scroll: { "overflow": "scroll" }
					,
					auto: { "overflow": "auto" }
				}
			};
		}
	}
	,
	overflow_pc: function(value) {
		if (value) {
			return { "--overflow": value }
		}
		else {
			return {
				name: "--overflow"
				,
				values:
				{
					visible: { "--overflow": "visible" }
					,
					hidden: { "--overflow": "hidden" }
					,
					scroll: { "--overflow": "scroll" }
					,
					auto: { "--overflow": "auto" }
				}
			};
		}
	}
	,
	font_family: function(value) {
		if (value) {
			return { "font-family": value }
		}
		else {
			return "font-family";
		}
	}
	,
	font_family_pc: function(value) {
		if (value) {
			return { "--font_family": value }
		}
		else {
			return "--font_family";
		}
	}
	,
	orientation_text_pc: function(value) {
		if (value) {
			return { "--orientation_text": value }
		}
		else {
			return {
				name: "--orientation_text"
				,
				values:
				{
					normal: { "--orientation_text": "normal" }
					,
					break_word: { "--orientation_text": "break-word" }
					,
					initial: { "--orientation_text": "initial" }
					,
					inherit: { "--orientation_text": "inherit" }
				}
			}
		}
	}
	,
	text_decoration_pc: function(value) {
		if (value) {
			return { "--text_decoration": value }
		}
		else {
			return {
				name: "--text_decoration"
				,
				values:
				{
					underline: { "--text_decoration": "underline" }
					,
					overline: { "--text_decoration": "overline" }
					,
					line_through: { "--text_decoration": "line-through" }
					,
					blink: { "--text_decoration": "blink" }
					,
					none: { "--text_decoration": "none" }
				}
			};
		}
	}
	,
	outline_pc: function(value) {
		if (value) {
			return { "--outline": value }
		}
		else {
			return { name: "--outline" };
		}
	}
	,
	outline: function(value) {
		if (value) {
			return { "outline": value }
		}
		else {
			return { name: "outline" };
		}
	}
	,
	outline_color_pc: function(value) {
		if (value) {
			return { "--outline_color": value }
		}
		else {
			return {
				name: "--outline_color"
			}
		}
	}
	,
	cursor_pc: function(value) {
		if (value) {
			return { "--cursor": value }
		}
		else {
			return {
				name: "--cursor"
				,
				values:
				{
					general:
					{
						auto: { "--cursor": "auto" }
						,
						default: { "--cursor": "default" }
						,
						none: { "--cursor": "none" }
					}
					,
					link_and_status:
					{
						context_menu: { "--cursor": "context-menu" }
						,
						help: { "--cursor": "help" }
						,
						pointer: { "--cursor": "pointer" }
						,
						progress: { "--cursor": "progress" }
						,
						wait: { "--cursor": "wait" }
					}
					,
					selection:
					{
						cell: { "--cursor": "cell" }
						,
						crosshair: { "--cursor": "crosshair" }
						,
						text: { "--cursor": "text" }
						,
						vertical_text: { "--cursor": "vertical-text" }
					}
					,
					drag_and_drop:
					{
						alias: { "--cursor": "alias" }
						,
						copy: { "--cursor": "copy" }
						,
						move: { "--cursor": "move" }
						,
						no_drop: { "--cursor": "no-drop" }
						,
						not_allowed: { "--cursor": "not-allowed" }
					}
					,
					Resize_and_scrolling:
					{
						all_scroll: { "--cursor": "all-scroll" }
						,
						col_resize: { "--cursor": "col-resize" }
						,
						e_resize: { "--cursor": "e-resize" }
						,
						ew_resize: { "--cursor": "ew-resize" }
						,
						n_resize: { "--cursor": "n-resize" }
						,
						ne_resize: { "--cursor": "ne-resize" }
						,
						nesw_resize: { "--cursor": "nesw-resize" }
						,
						ns_resize: { "--cursor": "ns-resize" }
						,
						nw_resize: { "--cursor": "nw-resize" }
						,
						nwse_resize: { "--cursor": "nwse-resize" }
						,
						row_resize: { "--cursor": "row-resize" }
						,
						s_resize: { "--cursor": "s-resize" }
						,
						se_resize: { "--cursor": "se-resize" }
						,
						sw_resize: { "--cursor": "sw-resize" }
						,
						w_resize: { "--cursor": "w-resize" }
					}
				}
			}
		}
	}
	,
	layer_pc: function(value) {
		if (value) {
			return { "--layer": value }
		}
		else {
			return "--layer";
		}
	}
	,
	depth_pc: function(value) {
		if (value) {
			return { "--depth": value }
		}
		else {
			return "--depth";
		}
	}
	,
	/** sin uso */
	flex_wrap_pc: function(value) {
		if (value) {
			return { "--flex_wrap": value }
		}
		else {
			return "--flex_wrap";
		}
	}
	,
	/** sin uso */
	flex_direction_pc: function(value) {
		if (value) {
			return { "--flex_direction": value }
		}
		else {
			return "--flex_direction";
		}
	}
	,
	/** sin uso */
	justify_content_pc: function(value) {
		if (value) {
			return { "--justify_content": value }
		}
		else {
			return "--justify_content";
		}
	}
	,
	/** sin uso */
	justify_self_pc: function(value) {
		if (value) {
			return { "--justify_self": value }
		}
		else {
			return "--justify_self";
		}
	}
	,
	align_self_pc: function(value) {
		if (value) {
			return { "--align_self": value }
		}
		else {
			return {
				name: "--align_self"
				,
				values:
				{
					auto: { "--align_self": "auto" }
					,
					flex_start: { "--align_self": "flex-start" }
					,
					flex_end: { "--align_self": "flex-end" }
					,
					center: { "--align_self": "center" }
					,
					baseline: { "--align_self": "baseline" }
					,
					stretch: { "--align_self": "stretch" }
					,
					inherit: { "--align_self": "inherit" }
					,
					initial: { "--align_self": "initial" }
					,
					unset: { "--align_self": "unset" }
				}
			}
		}
	}
	,
	align_self: function(value) {
		if (value) {
			return { "align-self": value }
		}
		else {
			return {
				name: "align-self"
				,
				values:
				{
					auto: { "align-self": "auto" }
					,
					flex_start: { "align-self": "flex-start" }
					,
					flex_end: { "align-self": "flex-end" }
					,
					center: { "align-self": "center" }
					,
					baseline: { "align-self": "baseline" }
					,
					stretch: { "align-self": "stretch" }
					,
					inherit: { "align-self": "inherit" }
					,
					initial: { "align-self": "initial" }
					,
					unset: { "align-self": "unset" }
				}
			}
		}
	}
	,

	align_vertical_pc: function(value) {
		if (value) {
			return { "--align_vertical": value }
		}
		else {
			return {
				name: "--align_vertical"
				,
				values:
				{
					baseline: { "--align_vertical": "baseline" }
					,
					sub: { "--align_vertical": "sub" }
					,
					super: { "--align_vertical": "super" }
					,
					text_top: { "--align_vertical": "text-top" }
					,
					text_bottom: { "--align_vertical": "text-bottom" }
					,
					middle: { "--align_vertical": "middle" }
					,
					top: { "--align_vertical": "top" }
					,
					bottom: { "--align_vertical": "bottom" }
				}
			}
		}
	}
	,
	vertical_align: function(value) {
		if (value) {
			return { "vertical-align": value }
		}
		else {
			return {
				name: "vertical-align"
				,
				values:
				{
					baseline: { "vertical-align": "baseline" }
					,
					sub: { "vertical-align": "sub" }
					,
					super: { "vertical-align": "super" }
					,
					text_top: { "vertical-align": "text-top" }
					,
					text_bottom: { "vertical-align": "text-bottom" }
					,
					middle: { "vertical-align": "middle" }
					,
					top: { "vertical-align": "top" }
					,
					bottom: { "vertical-align": "bottom" }
				}
			}
		}
	}
	,
	color_text_selection_pc: function(value) {
		if (value) {
			return { "--color_text_selection": value }
		}
		else {
			return {
				name: "--color_text_selection"
			}
		}
	}
	,
	text_align_last: function(value) {
		if (value) {
			return { "text-align-last": value }
		}
		else {
			return {
				name: "text-align-last"
			}
		}
	}
	,
	color: function(value) {
		if (value) {
			return { "color": value }
		}
		else {
			return {
				name: "color"
			}
		}
	}
	,
	background_color: function(value) {
		if (value) {
			return { "background-color": value }
		}
		else {
			return {
				name: "background-color"
			}
		}
	}
	,
	border: function(value) {
		if (value) {
			return { "border": value }
		}
		else {
			return {
				name: "border"
			}
		}
	}
	,
	border_color: function(value) {
		if (value) {
			return { "border-color": value }
		}
		else {
			return {
				name: "border-color"
			}
		}
	}
	,
	outline_color: function(value) {
		if (value) {
			return { "outline-color": value }
		}
		else {
			return {
				name: "outline-color"
			}
		}
	}
	,
	background: function(value) {
		if (value) {
			return { "background": value }
		}
		else {
			return {
				name: "background"
			}
		}
	}
	,
	background_size: function(value) {
		if (value) {
			return { "background-size": value }
		}
		else {
			return {
				name: "background-size"
				,
				values:
				{
					cover: { "background-size": "cover" }
					,
					contain: { "background-size": "contain" }
					,
					inherit: { "background-size": "inherit" }
					,
					initial: { "background-size": "initial" }
					,
					revert: { "background-size": "revert" }
					,
					revert_layer: { "background-size": "revert-layer" }
					,
					unset: { "background-size": "unset" }
					,
				}
			}
		}
	}
	,
	/**https://developer.mozilla.org/es/docs/Web/CSS/cursor*/
	cursor: function(value) {
		if (value) {
			return { "cursor": value }
		}
		else {
			return {
				name: "cursor"
				,
				values:
				{
					general:
					{
						auto: { "cursor": "auto" }
						,
						default: { "cursor": "default" }
						,
						none: { "cursor": "none" }
					}
					,
					link_and_status:
					{
						context_menu: { "cursor": "context-menu" }
						,
						help: { "cursor": "help" }
						,
						pointer: { "cursor": "pointer" }
						,
						progress: { "cursor": "progress" }
						,
						wait: { "cursor": "wait" }
					}
					,
					selection:
					{
						cell: { "cursor": "cell" }
						,
						crosshair: { "cursor": "crosshair" }
						,
						text: { "cursor": "text" }
						,
						vertical_text: { "cursor": "vertical-text" }
					}
					,
					drag_and_drop:
					{
						alias: { "cursor": "alias" }
						,
						copy: { "cursor": "copy" }
						,
						move: { "cursor": "move" }
						,
						no_drop: { "cursor": "no-drop" }
						,
						not_allowed: { "cursor": "not-allowed" }
					}
					,
					Resize_and_scrolling:
					{
						all_scroll: { "cursor": "all-scroll" }
						,
						col_resize: { "cursor": "col-resize" }
						,
						e_resize: { "cursor": "e-resize" }
						,
						ew_resize: { "cursor": "ew-resize" }
						,
						n_resize: { "cursor": "n-resize" }
						,
						ne_resize: { "cursor": "ne-resize" }
						,
						nesw_resize: { "cursor": "nesw-resize" }
						,
						ns_resize: { "cursor": "ns-resize" }
						,
						nw_resize: { "cursor": "nw-resize" }
						,
						nwse_resize: { "cursor": "nwse-resize" }
						,
						row_resize: { "cursor": "row-resize" }
						,
						s_resize: { "cursor": "s-resize" }
						,
						se_resize: { "cursor": "se-resize" }
						,
						sw_resize: { "cursor": "sw-resize" }
						,
						w_resize: { "cursor": "w-resize" }
					}
				}
			}
		}
	}
	,
	resize: function(value) {
		if (value) {
			return { "resize": value }
		}
		else {
			return {
				name: "resize"
				,
				values:
				{
					none: { "resize": "none" }
					,
					both: { "resize": "both" }
					,
					horizontal: { "resize": "horizontal" }
					,
					vertical: { "resize": "vertical" }
					,
					inherit: { "resize": "inherit" }
					,
					initial: { "resize": "initial" }
					,
					unset: { "resize": "unset" }
					,
				}
			}
		}
	}
	,
	word_wrap: function(value) {
		if (value) {
			return { "word-wrap": value }
		}
		else {
			return {
				name: "word-wrap"
				,
				values:
				{
					normal: { "word-wrap": "normal" }
					,
					break_word: { "word-wrap": "break-word" }
					,
					initial: { "word-wrap": "initial" }
					,
					inherit: { "word-wrap": "inherit" }
				}
			}
		}
	}
	,
	word_break: function(value) {
		if (value) {
			return { "word-break": value }
		}
		else {
			return {
				name: "word-break"
				,
				values:
				{
					normal: { "word-break": "normal" }
					,
					break_all: { "word-break": "break-all" }
					,
					keep_all: { "word-break": "keep-all" }
				}
			}
		}
	}
	,
	pointer_events: function(value) {
		if (value) {
			return { "pointer-events": value }
		}
		else {
			return {
				name: "pointer-events"
				,
				values:
				{
					auto:
					{
						"pointer-events": "auto"
					}
					,
					none:
					{
						"pointer-events": "none"
					}
					,
					visiblePainted:
					{
						"pointer-events": "visiblePainted"
					}
					,
					visibleFill:
					{
						"pointer-events": "visibleFill"
					}
					,
					visibleStroke:
					{
						"pointer-events": "visibleStroke"
					}
					,
					visible:
					{
						"pointer-events": "visible"
					}
					,
					painted:
					{
						"pointer-events": "painted"
					}
					,
					fill:
					{
						"pointer-events": "fill"
					}
					,
					stroke:
					{
						"pointer-events": "stroke"
					}
					,
					all:
					{
						"pointer-events": "all"
					}
					,
					inherit:
					{
						"pointer-events": "inherit"
					}
					,
					initial:
					{
						"pointer-events": "initial"
					}
					,
					revert:
					{
						"pointer-events": "revert"
					}
					,
					revert_layer:
					{
						"pointer-events": "revert-layer"
					}
					,
					unset:
					{
						"pointer-events": "unset"
					}
					,
				}
			}
		}
	}
	,

}
module.exports = View;

/*
			'--font_size': "1vw"
			,
			'--font_size_phone': "2vw"
			,
			'--color_back': 'transparent'
			,
			'--color_back_phone': 'transparent'
			,
			'--color_text': 'gray'
			,
			'--color_back_focus': '#0d1f29'
			,
			'--color_text_focus': "white"
			,
			'--time_focus': '2s'
			,
			'--color_back_hover': "transparent"
			,
			'--color_text_hover': "orange"
			,
			'--time_hover': '1s'
			,
			'--y': 'auto'
			,
			'--x': 'auto'
			,
			'--y_to': 'auto'
			,
			'--x_to': 'auto'
			,
			'--w_border': '0.1vh'
			,
			"--h": 'auto',
			"--w": 'auto',
			"--h_to": 'auto',
			"--w_to": 'auto',
			"--y_phone": 'auto',
			"--x_phone": 'auto',
			"--y_to_phone": 'auto',
			"--x_to_phone": 'auto',
			"--h_phone": 'auto',
			"--w_phone": 'auto',
			"--h_to_phone": 'auto',
			"--w_to_phone": 'auto',
			"--text_align": 'center',
			"--text_align_phone": 'center',
			"--type_position": 'static',
			"--type_position_phone": 'static',
			"--color_border": "transparent",
			"--color_border_hover": "transparent",
			"--margin": 'auto',
			"--margin_phone": 'auto',
			"background": "",
			"background-size": 'contain',
   */