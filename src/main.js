const express = require('express')
const { Server: HttpServer } = require('http')
const { Server: IO } = require('socket.io')
const PORT = 8080
const products =require('../db/products.json')
const routerProd = require('./router/routerProd')
const routerCarrito = require('./router/routerCarrito')

const app = express()
const httpServer = new HttpServer(app)
const io = new IO(httpServer)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.set('views', './views/pages')
app.set('view engine', 'ejs')

io.on('connection', socket => {
    console.log('Nuevo cliente conectado!!');

    socket.on('new-products', produc => {
        products.push(produc)
        io.sockets.emit('products', products)
    })
})

app.use('/productos', routerProd)
app.use('/carrito', routerCarrito)

/* PUESTA EN MARCHA DEL SERVER */
httpServer.listen(PORT, () => {
    console.log(`Server corriendo en ${PORT}`);
})