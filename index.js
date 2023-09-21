const express = require('express');
const app = express();

app.use('/public', express.static('public'));

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true, limit: '2mb' }));
app.use(bodyParser.json({ limit: '2mb' }));

const Game = require('./views/Game/Game');

require('./async');

const red_interconnect = require('./red/interconnect/Interconnect');
const Interconnect = red_interconnect.Interconnect;
const User = red_interconnect.User;

app.get('/', async (req, res) => 
{
	let b = Interconnect.users.find(n => n.ip == req.ip);
	if(b)
	{
		b = new User(req.ip);
	}
	else
	{
		Interconnect.users.push(new User(req.ip));
	}

	console.log(Interconnect.users);
	
	let r = await new Game().toString();
	res.send(r);
})
app.post('/transform_update', async (req, res) => 
{
	console.log('/transform_update');
	
	let b = Interconnect.users.find(n => n.ip == req.ip);
	if(b)
	{
		b.position = req.body.position;
		b.rotation = req.body.rotation;
		console.log(b);
	}
	else
	{
		
	}
	res.send('ok');
})
app.get('/vida', async (req, res) => 
{
	let b = Interconnect.users.find(n => n.ip == req.ip);
	console.log(Interconnect.users);
	if(b)
	{
		res.send
		(
			b.vida.toString()
		);
	}
	else
	{
		res.send('undefined');
	}
});
app.get('/users', async (req, res) => 
{
	let users = Interconnect.users.map
	(
		function(n)
		{
			let c = 
			{
				...{}
				,
				...n
			}
			delete c.ip;
			return c;
		}
	);
	res.send(users);
});
app.listen(() => console.log(`server is up!`));