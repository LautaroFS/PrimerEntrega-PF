const express = require('express')
const { Server: HttpServer } = require('http')
const { Server: IO } = require('socket.io')
const PORT = 8080

const app = express()
const httpServer = new HttpServer(app)
const io = new IO(httpServer)


app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.set('views', './views/pages')
app.set('view engine', 'ejs')

const products = []
const messages = [{
    author: 'Robot', text: 'Hola deja tu consulta y te la contestaremos.'
}]
const prodCarrito = []

io.on('connection', socket => {
    console.log('Nuevo cliente conectado!!');
    socket.emit('message', messages)
    socket.on('new-message', data => {
        messages.push(data)
        io.sockets.emit('message', messages)
    })
})


app.get('/carrito', (req, res) => {
    res.render('stock', { prodCarrito })
})

app.get('/productos', (req, res) => {
    res.render('inicio', { products })
})

app.post('/carrito', async (req, res) => {
    products.push(req.body)
    res.redirect('/productos')
})

httpServer.listen(PORT, () => {
    console.log(`Server corriendo en ${PORT}`);
})