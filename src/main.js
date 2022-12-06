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

/* PUESTA EN MARCHA DEL SERVER */
httpServer.listen(PORT, () => {
    console.log(`Server corriendo en ${PORT}`);
})