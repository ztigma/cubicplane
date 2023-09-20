require('./persistence');
//require('./email');



String.prototype.ToNumber = function() 
{
	let r = this
	.replace('vw', '')
	.replace('vh', '')
	.replace('px', '')
	.replace('%', '')
	;
	return parseFloat(r);
};
String.prototype.HOST = function()
{
	let host = 
		[
			'https://RomeroftDev.repl.co'
			, 
			'https://RomeroftDev.com'
		]
	return host[0] + this;	
}
String.prototype.ASYNC_SEND_EMAIL = function(html, title)
{
	let path = this;
	return new Promise
	(
		function(callback)
		{
			path.SEND_EMAIL
			(
				function(b)
				{
					callback(b);
				}
				,
				html
				,
				title
			);
		}
	)
}
String.prototype.URI_TO_OBJ = function()
{
	let path = this;
	let divided = path.split('?');

	if(divided.length == 1)
	{
		return undefined;
	}
	else
	{
		let variables = divided[1].split('&');
		let r = {};
		variables.forEach
		(
			function(v)
			{
				let name_value = v.split('=');
				r[name_value[0]] = name_value[1];
			}
		);
		return r;
	}
}
String.prototype.OBJ_TO_URI = function(obj)
{
	let r = '';
	let counter = 0;
	Object.keys(obj).forEach
	(
		function(name)
		{
			if(counter == 0)
			{
				r += `${name}=${obj[name]}`;
			}
			else
			{
				r += `&${name}=${obj[name]}`;
			}
			counter++;
		}
	);
	return `${this}?${r}`;
}
String.prototype.CurePath = async function(query)
{
	let t = this;
	let r = '';
	if(query.la)
	{
		r = `db/idiom/${query.la}/${t}`;
	}
	else
	{
		r = `db/idiom/es/${t}`;
	}

	let b = await r.ASYNC_EXIST_PERSISTENCE();
	if(b)
	{
		
	}
	else
	{
		r = `db/idiom/es/${t}`;
	}
	return r;
}
String.prototype.SetIdiom = function(html)
{
	let path = this;
	return new Promise
	(
		async function(callback)
		{
			let data = await path.ASYNC_FIND_PERSISTENCE(n => true);
			
			let r = html.PROPS(data);
			callback(r);
		}
	)
}
String.prototype.ASYNC_EXIST_PERSISTENCE = function()
{
	let path = this;
	return new Promise
	(
		function(callback)
		{
			path.EXIST_PERSISTENCE
			(
				function(boo)
				{
					callback(boo);
				}
			)
		}
	)
}
String.prototype.ASYNC_REMOVE_PERSISTENCE = function(predicate)
{
	let path = this;
	return new Promise
	(
		function(callback)
		{
			path.REMOVE_PERSISTENCE
			(
				function(objs)
				{
					callback(objs);
				}
				,
				predicate
			);
		}
	);
}
String.prototype.ASYNC_SET_PERSISTENCE = function(obj)
{
	let path = this;
	return new Promise
	(
		function(callback)
		{
			path.SET_PERSISTENCE
			(
				obj
				,
				function(data)
				{
					callback(data);
				}
			);
		}
	);
}
String.prototype.ASYNC_GET_PERSISTENCE = function() 
{
	let path = this;
	return new Promise
	(
		function(callback)
		{
			path.GET_PERSISTENCE
			(
				function(data)
				{
					callback(data);
				}
			);
		}
	);
}
String.prototype.ASYNC_FIND_PERSISTENCE = function(predicate)
{
	let path = this;
	return new Promise
	(
		function(callback)
		{
			path.FIND_PERSISTENCE
			(
				function(data)
				{
					callback(data);
				}
				,
				predicate
			);
		}
	);
}
String.prototype.ASYNC_SELECT_PERSISTENCE = function(predicate)
{
	let path = this;
	return new Promise
	(
		function(callback)
		{
			path.SELECT_PERSISTENCE
			(
				function(data)
				{
					callback(data);
				}
				,
				predicate
			);
		}
	);
}
String.prototype.ASYNC_ADD_PERSISTENCE = function(add, predicate, is_update, index)
{
	let path = this;
	return new Promise
	(
		function(callback)
		{
			path.ADD_PERSISTENCE
			(
				function(data)
				{
					callback(data);
				}
				,
				add
				,
				predicate
				,
				is_update
				,
				index
			);
		}
	);
}
String.prototype.ASYNC_LOAD = function()
{
	let path = this;
	return new Promise
	(
		function(callback)
		{
			path.LOAD
			(
				function(data)
				{
					callback(data);
				}
			)
		}
	)
}
String.prototype.ASYNC_SAVE = function()
{
	let path = this;
	return new Promise
	(
		function(callback)
		{
			path.SAVE
			(
				function(data)
				{
					callback(data);
				}
			)
		}
	)
}
String.prototype.ASYNC_LOAD_BINARY = function()
{
	let path = this;
	return new Promise
	(
		function(callback)
		{
			path.LOAD_BINARY
			(
				function(data)
				{
					callback(data);
				}
			)
		}
	)
}
String.prototype.ASYNC_SAVE_BINARY = function(save)
{
	let path = this;
	return new Promise
	(
		function(callback)
		{
			path.SAVE_BINARY
			(
				save
				,
				function(data)
				{
					callback(data);
				}
			)
		}
	)
}