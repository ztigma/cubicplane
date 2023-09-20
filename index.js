const express = require('express');
const app = express();

app.use('/public', express.static('public'));
const Game = require('./views/Game/Game');

require('./async');

app.get('/', async (req, res) => {
	let r = await new Game().toString();
	res.send(r);
})

app.listen(() => console.log(`server is up!`));