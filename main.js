const express = require('express');
const app = express();
const fs = require('fs');
var profiles = require('./profiles.json');
const port = 3000;

app.get('/', (req, res) => res.send('<p>Nothing to see there</p><p>P.S maybe you should use 127.0.0.1/click</p>'));
app.get('/click', (req, res) => {
	res.sendFile('clicker.html', {root: __dirname })
});
app.get('/:uid', (req, res)=>{
	profiles = require('./profiles.json');
	var uid = req.params.uid;
	if(!profiles[uid])
	{
		res.send('User does not exists');
	}
	else
	{
		res.send(`<h><b>Stats for ${uid}</b></h><p>Privilegy: ${profiles[uid].priv}</p><p>Coins: ${profiles[uid].coins}</p><p>Multiplier: ${profiles[uid].multiplier}</p>`);
	}
});

app.get('/api/userget/:uid', (req,res)=>
{
	profiles = require('./profiles.json');
	var uid = req.params.uid;
	if(!profiles[uid])
	{
		res.send(`{"error_id":"1", "desc":"no user with this name"}`)
	}
	else
	{
		res.send(`{"error_id":"null", "desc":"all is OK", "userpriv":"${profiles[uid].priv}", "coins":${profiles[uid].coins}, "multiplier":${profiles[uid].multiplier}}`);
	}
});

app.get('/api/clickfor/:uid', (req,res)=>
{
	profiles = require('./profiles.json');
	var uid = req.params.uid;
	if(!profiles[uid])
	{
		res.send(`{"error_id":"1", "desc":"no user with this name"}`)
	}
	else
	{
		profiles[uid].coins+=profiles[uid].multiplier;
		fs.writeFile('./profiles.json', JSON.stringify(profiles),(err)=>{
			if(err) console.log(err);
		});
		res.send(`{"error_id":"null", "desc":"all is OK"}`);
	}
});

app.get('/api/addtobal/:request', (req,res)=>{
	profiles = require('./profiles.json');
	var request = req.params.request;
	var request_arr = request.split(":");
	var user_add = request_arr[0];
	var coins_add = parseInt(request_arr[1],10);
	var adm_key = request_arr[2];
	if(request_arr.length!=3){res.send(`{"error_id":"1", "desc":"invalid request"}`);return;}
	if(!profiles[user_add]){res.send(`{"error_id":"2", "desc":"user does not exist"}`);return;}
	if(isNaN(coins_add)){res.send(`{"error_id":"3", "desc":"coins to add is not a number"}`);return;}
	if(adm_key!="cats1love1260__"){res.send(`{"error_id":"4", "desc":"admin key is invalid"}`);return;}
	profiles[user_add].coins+=coins_add;
	fs.writeFile('./profiles.json', JSON.stringify(profiles),(err)=>{
			if(err) console.log(err);
		});
	res.send(`{"error_id":"null", "desc":"all is OK"}`);
});
app.listen(port);