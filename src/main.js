const express = require('express')
const { Server: HttpServer } = require('http')
const { Server: IO } = require('socket.io')
const PORT = 8080

const routerProd = require('./router/routerProd')
const routerCarrito=require('./router/routerCarrito')

const app = express()
const httpServer = new HttpServer(app)
const io = new IO(httpServer)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.set('views', './views/pages')
app.set('view engine', 'ejs')

const messages = [{
    author: 'Robot', text: 'Hola deja tu consulta y te la contestaremos.'
}]
const products = [{
    "id": 1,
    "nombre": 'Coca',
    "precio": 12,
    "img": "https://ardiaprod.vtexassets.com/arquivos/ids/228472/Gaseosa-CocaCola-Sabor-Original-225-Lts-_2.jpg?v=637959903979400000"
}]
const prodCarrito = [{
    nombre: 'Coca',
    precio: 12,
    img: "https://ardiaprod.vtexassets.com/arquivos/ids/228472/Gaseosa-CocaCola-Sabor-Original-225-Lts-_2.jpg?v=637959903979400000",
    id: 0
}]

io.on('connection', socket => {
    console.log('Nuevo cliente conectado!!');
    socket.emit('message', messages)
    socket.on('new-message', data => {
        messages.push(data)
        io.sockets.emit('message', messages)
    })
})

app.use('/productos', routerProd)
app.use('/carrito', routerCarrito)

// app.get('/productos', (req, res) => {
//     res.render('inicio', { products })
// })

// app.post('/productos', async (req, res) => {
//     const { nombre, precio, cantidad, img, id } = req.body
//     const prod = { nombre: nombre, precio: precio, cantidad: cantidad, img: img, id: id }

//     if (products.length === 0) {
//         prod.id = 0
//     } else {
//         const idPosterior = products[products.length - 1].id
//         prod.id = idPosterior + 1
//     }

//     products.push(prod)
//     console.log(products);
//     res.redirect('/productos')
// })


// app.delete('/productos', async (req, res) => {
//     const { id } = req.params
//     const prodDelete = products.splice(parseInt(id) - 1, 1)
//     res.redirect('/productos')
// })


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