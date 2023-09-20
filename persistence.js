const fs = require('fs');
const path = require('path');

Object.prototype.NAMES = function()
{
	return Object.keys(this);
}
String.prototype.TO_INT = function()
{
	return parseInt(this.toString());	
}
Date.prototype.MES = function() {
	return new Date().getMonth() + 1;
}
Date.prototype.DAYS_COUNT = function() {
	return new Date(new Date().getFullYear(), new Date().MES(), 0).getDate();
}
Function.prototype.TO_STRING_METHOD = function() {
	return 'function ' + this.toString() + '\n';
}
Function.prototype.TO_STRING_FUNCTION = function() {
	return 'function()\n' + this.TO_STRING_RAW();
}
String.prototype.DB_TYPE = function() {
	var db = ['', '_AWS3'];
	return this + db[0];
}
String.prototype.JSON_TO_LIST = function() {
	var ls = this.SPLIT('\n');// \n (tipo: string[])
	var lo = ls.map(JSON.parse);//  (tipo: object[])
	return lo;
}
String.prototype.HTTP = function(path, metodo, heads, data, callback) {
	//vanguard.fundroof.repl.co host
	var options =
	{
		host: this.toString()
		,
		path: path
		,
		method: metodo
		,
		headers: heads
	}

	console.log("options:");
	console.log(options);

	var req = http.request
		(
			options
			,
			function(resp) {
				let result = '';

				resp.on('data', (chunk) => {
					//console.log("chunk:");
					//console.log(chunk);
					result += chunk;
				});
				resp.on('end', () => {
					console.log("result:");
					console.log(result);//comentar estas cosas cuando se vaya a trabajar con clientes.

					try {
						callback(result);
					}
					catch (error) {
						callback(result);
					}
				});
				/*
				resp.on("error", (err) => 
				{
					console.log("Error: " + err.message);
				});
				*/
			}
		);
	if (data != undefined) {
		if (typeof data == 'string') {
			req.write(data);
		}
		else {
			req.write(JSON.stringify(data));
		}
	}
	req.end();
}
String.prototype.ID_DB = function() {
	return (Date.now().toString() + this).SHA();
}
String.prototype.SHA = function() {
	return crypto.createHash('sha256').update(this.toString()).digest('hex');
}
Object.prototype.TO_JSON = function() {
	return JSON.stringify(this).toString();
}
String.prototype.TO_OBJECT = function() {
	return JSON.parse(this);
}

Function.prototype.TO_STRING = function() {
	return ('function ' + this.toString() + this.name + "();\n\n").PROPS({ await: 'await' });
}
Function.prototype.TO_STRING_VAR = function() {
	return (this.toString() + this.name + "();\n\n").PROPS({ await: 'await' });
}
Function.prototype.TO_STRING_RAW = function() {
	return this.toString().replace(this.name + '()', '').replace('function()', '').PROPS({ await: 'await' });
}
String.prototype.DIR = function() {
	var p = path.join(__dirname, this.toString())
	fs.readdir(p, (err, files) => {
		files.forEach(file => {
			console.log(file);
			/*
			var f = path.join(this.toString(), file);
			f.LOAD
			(
			  function(data)
			  {
				console.log(data);
			  }
			);
		  */
		});
	});
}
String.prototype.SPLIT = function(separator) {
	return this.toString().split(separator).REMOVE_ALL(n => n == "");
}
Array.prototype.SUPER_ALL = function(predicate, super_add) 
{
	return this.map
	(
		function(n)
		{
			let b = predicate(n);
			console.log('SUPER ALL');
			console.log(predicate);
			console.log(n);
			console.log('b:');
			console.log(b);
			
			if(b)
			{
				return(
					{
						...n
						,
						...super_add
					}
				)
			}
			else
			{
				return n;
			}
		}
	);
}
Array.prototype.REMOVE_ALL = function(predicate) {
	return this.filter(n => !predicate(n));
}
Array.prototype.REMOVE_AT = function(index) {
	return this.filter(n => this.indexOf(n) != index);
}
String.prototype.PROPS = function(props) {
	a = this;
	Object.keys(props).forEach
		(
			function(n) {
				a = a.replaceAll("/*" + n + "*/", props[n]);
				a = a.replaceAll("__" + n + "__", props[n]);
				a = a.replaceAll(">>" + n + "<<", props[n]);
				a = a.replaceAll("<!--" + n + "-->", props[n]);
			}
		)
	return a
}
String.prototype.FORMAT = function() {
	a = this;
	for (k in arguments) {
		a = a.replace("<!--" + k + "-->", arguments[k])
		a = a.replace("/*" + k + "*/", arguments[k])
	}
	return a
}
String.prototype.FORMAT_INDEX = function(index, value) {
	a = this;
	a = a.replace("<!--" + index + "-->", value);
	a = a.replace("/*" + index + "*/", value);
	return a
}
Array.prototype.LIST_TO_STRING = function(plus, minus) {
	var r = "";

	if (typeof plus === 'undefined') {
		for (var i = 0; i < this.length; i++) {
			if (i < this.length) {
				r += this[i];
			}
		}
	}
	else if (typeof minus === 'undefined') {
		for (var i = 0; i < this.length; i++) {
			if (i < this.length) {
				r += this[i] + plus;
			}
		}
	}
	else {
		for (var i = 0; i < this.length; i++) {
			if (i < this.length + minus) {
				r += this[i] + plus;
			}
		}
	}
	return r;
}
String.prototype.SAVE_TO_JSON = function(data, callback) {
	this.SAVE(data.TO_JSON(), callback);
}
/** checkea la persistencia de forma asyncronica */
String.prototype.EXIST_PERSISTENCE = function(callback) {
	fs.stat
		(
			this.toString()
			,
			function(err, stat) {
				if (err == null) {
					callback(true, stat);
				}
				else if (err.code === 'ENOENT') {
					// el archivo no existe
					callback(false);
				}
				else {
					//ha sucedido un error
					callback(undefined);
				}
			}
		);
}
String.prototype.SAVE = function(data, callback) {

	var t = this;
	var dir = this.split("/");
	//console.log(dir);
	var dirpath = dir.LIST_TO_STRING("/", -1);

	t.EXIST_PERSISTENCE
		(
			function(b) {
				if (b) {

				}
				else {
					fs.mkdirSync(dirpath, { recursive: true });
				}
				fs.writeFile
					(
						path.join(__dirname, t.toString())
						,
						data
						,
						function(ex) {
							if (ex == null) {
								//console.log("saved: " + data);
								callback ? callback(data) : "";
								return;
							}
							console.log(ex.toString());
						}
						,
						callback
					);
			}
		);
}
String.prototype.LOAD = function(method) {
	console.log("LOAD:");
	console.log(this.toString());

	try {
		fs.readFile
			(
				path.join(__dirname, this.toString())
				,
				function(ex, data) {
					if (data != null) {
						method(data.toString());
					}
					else {
						method(undefined);

					}
				}
			);
		console.log("END LOAD:");
	}
	catch (ex) {
		//console.error("error: " + ex.toString());
		method(undefined);
	}
}
String.prototype.LOAD_TO_OBJECT = function(callback) {
	console.log(this.toString());
	this.LOAD
		(
			function(data) {
				if (data) {
					callback(data.TO_OBJECT());
				}
				else {
					callback(undefined);
				}
			}
		);
}
String.prototype.SAVE_BINARY = function(data, callback) {
	var t = this;
	var dir = this.split("/");
	//console.log(dir);
	var dirpath = dir.LIST_TO_STRING("/", -1);

	t.EXIST_PERSISTENCE
		(
			function(b) {
				if (b) {

				}
				else {
					fs.mkdirSync(dirpath, { recursive: true });
				}
				fs.writeFile
					(
						path.join(__dirname, t.toString())
						,
						data
						,
						function(ex) {
							if (ex == null) {
								//console.log("saved: " + data);
								callback ? callback(data) : "";
								return;
							}
							console.log(ex.toString());
						}
						,
						callback
					);
			}
		);
}
String.prototype.LOAD_BINARY = function(method) {
	console.log(this.toString());

	fs.readFile
		(
			path.join(__dirname, this.toString())
			,
			function(ex, data) {
				if (data != null) {
					method(data);
				}
				else {
					method("");
					console.error("error: " + ex.toString());
				}
			}
		);
}
Array.prototype.INSERT = function(index, add) {
	if (this.length == 0) {
		this.push(add);
		return;
	}

	if (index < this.length) {
		this.splice(index, 0, add);
	}
	else {
		this.splice(this.length - 1, 0, add);
	}
}
String.prototype.async_GET_PERSISTENCE = function()
{
	var t = this;
	return new Promise
	(
		function(callback)
		{
			t.GET_PERSISTENCE
			(
				function(data)
				{
					callback(data);
				}
			)
		}
	);
}
String.prototype.GET_PERSISTENCE = function(method) {
	this.LOAD(function(data) {
		if (data) 
		{
			if(data[0] == "[")
			{
				var arr = data.TO_OBJECT();
				method(arr);
			}
			else
			{
				var ls = data.match(/{[\s\S]*?}/g);
				var lss = ls.map(n => n.replace('\n','').replace('\t',''));
				var lo = lss.map(JSON.parse);
				method(lo);
			}
		}
		else {
			method(undefined);
		}
	});
}
String.prototype.SET_PERSISTENCE = function(object, callback) {
	console.log("SET_PERSISTENCE:");
	var data = object.TO_JSON();
	this.SAVE(data, callback);
}
String.prototype.REMOVE_PERSISTENCE = function(method, predicate) {
	var pth = this;
	this.GET_PERSISTENCE(function(object) {
		if (object) {
			object = object.REMOVE_ALL(predicate);
			pth.SET_PERSISTENCE(object);
		}
		method(object);
	}
	);
}
String.prototype.SELECT_PERSISTENCE = function(method, predicate) {
	this.GET_PERSISTENCE
		(
			function(object) {
				if (object) {
					method(object.filter(predicate));
				}
				else {
					method(undefined);
				}
			}
		);
}
String.prototype.ADD_PERSISTENCE = function(
	method,
	add,
	predicate,
	is_update,
	index,
) {
	console.log('ADD_PERSISTENCE:');

	var rute = this;

	try {
		this.GET_PERSISTENCE(function(object) {
			if (object == undefined) {
				object = [];
			}
			if (predicate == undefined) {
				object.push(add);
				rute.SET_PERSISTENCE
				(
					object
					,
					function(info)
					{
						method(object, true);
					}
				);
				return;
			}
			
			var i = object.findIndex(predicate);
			if(is_update)
			{
				if(i != -1)
				{
					console.log('ADD LO VOY A DAR UPDATE');
					object = object.SUPER_ALL(predicate, add);
					console.log('UPDATE::');
					console.log(object);
				}
				else
				{
					//por esto podria suceder algun problema estar atento.
					console.log('VOY A DAR PUSH');
					object.push(add);
					console.log('PUSH');
				}
			}
			else
			{
				if(i != -1)
				{
					console.log(
						'OBJETO REPETIDO (ESTE ES UN OBJETO UNICO DB_PERSISTENCE AWS3) :'
					);
					console.log(object[i]);
					console.log('VS');
					console.log(add);
					method(undefined, false);
					return;	
				}
				else
				{
					if (typeof index === 'undefined') {
						object.push(add);
					} else {
						object.INSERT(index, add);
					}
				}
			}
			console.log(object);
			rute.SET_PERSISTENCE
			(
				object
				,
				function(info)
				{
					method(object, true);
				}
			);
		});
	} catch (ex) {
		console.log(ex);
		method(undefined, false);
	}
	console.log('END ADD_PERSISTENCE:');
};
String.prototype.FIND_PERSISTENCE = function(method, predicate) {
	console.log("FIND_PERSISTENCE:");
	this.GET_PERSISTENCE(function(object) {
		if (object == undefined) {
			method(undefined);
			return;
		}

		var f = object.find(predicate);

		method(f);
	});
}
Array.prototype.ADD = function(add, predicate, no_replace, callback) {
	var i = this.findIndex(predicate);

	if (i != -1) {
		if(no_replace)
		{
			
		}
		else
		{
			this[i] = add;
		}
		callback ? callback(this[i]) : '';
		return this;
	}
	else {
		this.push(add);
		callback ? callback(add) : '';
		return this;
	}
}
Array.prototype.FIND = function(predicate) {
	var i = this.findIndex(predicate);

	if (i != -1) {
		return this[i];
	}
	else {
		return undefined;
	}
}

String.prototype.GET_COUNTER = function(callback, predicate)
{
	
	var dir = 'db/counter/counter.json';

	dir['EXIST_PERSISTENCE'.DB_TYPE()]
	(
		function(b)
		{
			if(b)
			{
				dir['FIND_PERSISTENCE'.DB_TYPE()]
				(
					function(data) {
						data.counter++;
						dir['ADD_PERSISTENCE'.DB_TYPE()]
							(
								function(res) {
									callback(data.counter);
								}
								,
								data
								,
								predicate
								,
								true
							);
					}
					,
					predicate
				);
			}
			else
			{
				let data =
				{
					id:0
					,
					counter:1015
				}
				dir['ADD_PERSISTENCE'.DB_TYPE()]
				(
					function(res) {
						callback(data.counter);
					}
					,
					data
					,
					predicate
					,
					true
				);
			}
		}
	);
}
String.prototype.GET_FECHAS = function(callback, mes)
{
	var dt = new Date();
	''.RESERVACION_PATH_FULL(mes)['GET_PERSISTENCE'.DB_TYPE()]
	(
		function(reserv)
		{
			callback(reserv);
		}
	);	
}
Array.prototype.PROMISE = function(callback, timeout)
{
	var arr = this;
	var pro = new Promise(function(resolve, rejected) 
	{
		var loop = function() 
		{
			var is_stop = false;
			
			arr.forEach(function(o) 
			{
				if (o.data == undefined) {
					is_stop = true;
					setTimeout(loop, timeout);
				}
			});

			if (is_stop) {
				return;
			}

			resolve(arr);
		};
		loop();
	});

	pro.then
	(
		function(response)
		{
			callback(arr);
		}
	);
}
Boolean.prototype.PROMISE = function(callback, delay, time_out)
{
	var is_ready = this;
	var current_date = new Date();
	//declaras como funcionara la promesa
	var pro = new Promise(function(resolve, rejected) 
	{
		var loop = function() 
		{
			if (is_ready) 
			{
				console.log('is_ready promise (bool)');
				resolve(is_ready);
			}
			else if(new Date() - current_date > time_out)
			{
				console.log('time_out promise (bool)');
				rejected(false);
			}
			else
			{
				console.log('waiting... promise (bool)');
				setTimeout(loop, delay);
				return;
			}
		};
		loop();
	});
	console.log('starting promise (bool)');
	//mandas a ejecutar la promesa y lo hara tal como previamente le indicaste
	pro.then
	(
		function(response)
		{
			callback(response);
		}
		,
		function(response)
		{
			callback(response);
		}
	);
}
Number.prototype.TO_SECONDS = function()
{
	return this / 1000;
}
Number.prototype.TO_MINUTES = function()
{
	return this.TO_SECONDS() / 60;
}
Number.prototype.TO_HOURS = function()
{
	return this.TO_MINUTES() / 60;
}
Number.prototype.TO_DAYS = function()
{
	return this.TO_HOURS() / 24;
}
Number.prototype.TO_WEEKS = function()
{
	return this.TO_DAYS() / 7;
}
Number.prototype.TO_MOUTHS = function()
{
	return this.TO_WEEKS() / 4;
}
String.prototype.SEDES = function(callback)
{
	//console.log('SEDES');
	'autosalud.net'.HTTP
	(
		'/sedes'
		,
		'get'
		,
		{}
		,
		{}
		,
		function(sedes_string)
		{
			let sedes = sedes_string.JSON_TO_LIST();
			callback(sedes);
		}
	);
}
String.prototype.FECHAS_PREFAB = function(callback)
{
	var to_promise = [];
	''.SEDES
	(
		function(sedes)
		{
			//console.log('fecha sede');
			sedes.forEach
			(
				function(sede)
				{
					let t = ''.RESERVACION_PATH(sede.direccion_con);
					for(let i = 1; i < 13; i++)
					{
						let year = new Date().getFullYear();
						let j_dir = t.PROPS
						({
							mes:i
							,
							year:year
						});
						console.log(j_dir);
						to_promise.push
						({
							path:j_dir
							,
							data:undefined
							,
							mes:i
							,
							year:year
							,
							sede:sede.direccion_con
						})
						;
						j_dir['EXIST_PERSISTENCE'.DB_TYPE()]
						(
							function(b)
							{
								if(b)
								{
									//console.log(j_dir);
									//console.log(b);
									j_dir['GET_PERSISTENCE'.DB_TYPE()]
									(
										function(horas)
										{
											let current = to_promise.find(n => n.path == j_dir);
											current.data = horas;
											//console.log('current');
											//console.log(current);

											//console.log('to_promise:');
											//console.log(to_promise);
										}
									)
								}
								else
								{
									let current = to_promise.find(n => n.path == j_dir);
									current.data = false;
									//console.log('current');
									//console.log(current);
								}
							}
						);
					}
				}
			);
			to_promise.PROMISE
			(
				function()
				{
					callback(to_promise);
				}
				,
				2000
			)
		}
	);
}