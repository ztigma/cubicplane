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

let id = 0;

app.get('/', async (req, res) => 
{
	let user = new User(req.ip, id++);
	
	Interconnect.users.push(user);
	
	console.log(Interconnect.users);
	
	let r = await new Game().toString();

	r = r.PROPS
	({
		id:user.id
	})
	
	res.send(r);
})
setInterval
(
	function()
	{
		Interconnect.users = Interconnect.users.REMOVE_ALL
		(
			function(n)
			{
				let b = Date.now() - n.last_time > 60000;
				return b;
			}
		);
	}
	,
	1000
);
app.post('/transform_update', async (req, res) => 
{
	//console.log('/transform_update');
	
	let b = Interconnect.users.find(n => n.id == req.body.id);
	if(b)
	{
		b.position = req.body.position;
		b.rotation = req.body.rotation;
		b.last_time = Date.now();
		//console.log(b.id);
	}
	else
	{
		//console.log(`${req.body.id} disconnected user`);
	}
	res.send('ok');
})
app.get('/vida', async (req, res) => 
{
	let b = Interconnect.users.find(n => n.ip == req.query.id);
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
	console.log('/users');
	console.log(Interconnect.users);
	
	res.send(Interconnect.users);
});
app.listen(() => console.log(`server is up!`));