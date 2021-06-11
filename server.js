// server.js
require('dotenv').config({ path: './.env' })

// const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()
const port = 3000;

const express = require('express');
const server = express()


const fs = require('fs');
const http = require('http');
const https = require('https');


const http_port = process.env.HTTP_PORT || 3000;
const https_port = process.env.HTTPS_PORT || 8443;

let https_options; 
if(fs.existsSync('./privkey.pem')){
	https_options = {
		key: fs.readFileSync('./privkey.pem'),
		cert: fs.readFileSync('./cert.pem'),
		ca: fs.readFileSync("./chain.pem")
	}
}

const env = process.env.DOT_ENV || process.env.NODE_ENV || 'local';

app.prepare().then(() => {
    
	console.log(` NODE_ENV = ${process.env.NODE_ENV}`)
	console.log(` BACKEND_URI = ${process.env.BACKEND_URI}`)

	server.all('*', (req, res) => {
		// Be sure to pass `true` as the second argument to `url.parse`.
		// This tells it to parse the query portion of the URL.
		const parsedUrl = parse(req.url, true)
		const { pathname, query } = parsedUrl

		handle(req, res, parsedUrl);
	});
	let http_server;
	let https_server;

	http_server = http.createServer(server).listen(http_port, (err) => {
		if (err) throw err
		console.log('> Ready on http:'+http_port)
	})


	if (https_options) {
		https_server = https.createServer(https_options, server).listen(https_port, (err) => {
			if (err) throw err
			console.log('> Ready on https:' + https_port)
		})

	}

	if (https_server) {
		const https_socket_connection = require('./src/socket')(https_server)
	} else {
		const socket_connection = require('./src/socket')(http_server)
	}



})