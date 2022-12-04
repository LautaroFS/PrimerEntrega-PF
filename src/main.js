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

const messages = [{
    author: 'Robot', text: 'Hola deja tu consulta y te la contestaremos.'
}]
const products = []
const prodCarrito = [{
    nombre: 'Coca',
    precio: 12,
    img: "https://ardiaprod.vtexassets.com/arquivos/ids/228472/Gaseosa-CocaCola-Sabor-Original-225-Lts-_2.jpg?v=637959903979400000"
}]

io.on('connection', socket => {
    console.log('Nuevo cliente conectado!!');
    socket.emit('message', messages)
    socket.on('new-message', data => {
        messages.push(data)
        io.sockets.emit('message', messages)
    })
})

/* PRODUCTOS */
app.get('/productos', (req, res) => {
    res.render('inicio', { products })
})

app.post('/productos', async (req, res) => {
    const { nombre, precio, cantidad, img } = req.body
    const prod = { nombre: nombre, precio: precio, cantidad: cantidad, img: img }

    if (products.length === 0) {
        prod.id = 0
    } else {
        const idPosterior = products[products.length - 1].id
        prod.id = idPosterior + 1
    }

    products.push(prod)
    console.log(products);
    res.redirect('/productos')
})

app.post('/productos', (req, res) => {

})

app.delete('/productos', async (req, res) => {
    const { id } = req.params
    const prodDelete = products.splice(parseInt(id) - 1, 1)
    res.json({ prodDelete })
})


/* CARRITO */
app.get('/carrito', (req, res) => {
    res.render('carrito', { prodCarrito })
})

app.post('/carrito', (req, res) => {
    const { nombre, precio, img } = req.body
    const prod = { nombre: nombre, precio: precio, img: img }
    prodCarrito.push(prod)
    res.redirect('/carrito')
})

app.delete('/carrito',(req,res)=>{

})



/* PUESTA EN MARCHA DEL SERVER */
httpServer.listen(PORT, () => {
    console.log(`Server corriendo en ${PORT}`);
})