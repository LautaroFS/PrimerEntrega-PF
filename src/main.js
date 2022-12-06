const express = require('express')
const { Server: HttpServer } = require('http')
const { Server: IO } = require('socket.io')
const PORT = 8080

const app = express()
const httpServer = new HttpServer(app)
const io = new IO(httpServer)
const products= require('../db/products.json')
const messages =require('../db/messages.json')
const prodCarrito=require('../db/prodCarrito.json')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.set('views', './views/pages')
app.set('view engine', 'ejs')

io.on('connection', socket => {

    /* CHAT */
    console.log('Nuevo cliente conectado!!');
    socket.emit('message', messages)
    socket.on('new-message', data => {
        messages.push(data)
        io.sockets.emit('message', messages)
    })

    /* PRODUCTOS */
    socket.emit('products', products)
    socket.on('new-products', produc => {
        products.push(produc)
        io.sockets.emit('products', products)
    })
})

/* PRODUCTOS */
app.get('/productos', (req, res) => {
    res.render('inicio', { products })
})

app.post('/productos', async (req, res) => {
})


app.delete('/productos', async (req, res) => {
    const { id } = req.params
    const prodDelete = products.splice(parseInt(id) - 1, 1)
    res.redirect('/productos')
})


/* CARRITO */
app.get('/carrito', (req, res) => {
    res.render('carrito', { prodCarrito })
})

app.post('/carrito', (req, res) => {
    const { nombre, precio, img, id } = req.body
    const prod = { nombre: nombre, precio: precio, img: img, id: id }

    if (prodCarrito.length === 0) {
        prod.id = 1
    } else {
        const idPosterior = prodCarrito[prodCarrito.length - 1].id
        prod.id = idPosterior + 1
    }

    prodCarrito.push(prod)
    console.log(prodCarrito);
    res.redirect('/carrito')
})

app.delete('/carrito', (req, res) => {
    const { id } = req.params
    const prodDelete = prodCarrito.splice(parseInt(id) + 1, 1)
    res.redirect('/carrito')
})



/* PUESTA EN MARCHA DEL SERVER */
httpServer.listen(PORT, () => {
    console.log(`Server corriendo en ${PORT}`);
})