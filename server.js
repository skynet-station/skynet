// server.js
const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()
const port = 3000;

app.prepare().then(() => {
    const server = createServer( (req, res) => {
		// Be sure to pass `true` as the second argument to `url.parse`.
		// This tells it to parse the query portion of the URL.
		const parsedUrl = parse(req.url, true)

		handle(req, res, parsedUrl)

	}).listen(port, (err) => {
		if (err) throw err
		console.log('> Ready on http://localhost:' + port)
		console.log(` Deploy mode: ${process.env.NODE_ENV}`)
	})

  const socket_connection = require('./src/socket')(server)

})