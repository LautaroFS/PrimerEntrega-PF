const ERROR = { error: "Producto no encontrado" }
const ceroCarrito = "Carrito vacio."
const prodCarrito = require('../../db/carrito.json')

class Container {
    constructor() {
    }

    getAll(req, res) {
        try {
            // res.render('carrito', { prodCarrito })
            res.send(prodCarrito)
        } catch (error) {
            res.render('carrito', ceroCarrito)
        }
    }


    getById(req, res) {
        const { id } = req.params
        if (isNaN(id)) {
            res.send('El id ingresado no es valido. Pruebe ingresando un numero.')
        }
        const product = prodCarrito.filter(prod => prod.id === Number(id))
        if (!product[0]) {
            res.send(ERROR)
        } else {
            res.json(product)
        }
    }

    create(req, res) {
        const { nombre, precio, img, id } = req.body
        const prod = { nombre: nombre, precio: precio, img: img, id: id }

        if (prodCarrito.length === 0) {
            prod.id = 1
        } else {
            const idPosterior = prodCarrito[prodCarrito.length - 1].id
            prod.id = idPosterior + 1
        }

        prodCarrito.push(prod)
        res.send(prodCarrito)
        // console.log(prodCarrito);
        res.redirect('/carrito')
    }

    updateById(req, res) {
        try {
            const { id } = req.params
            const { nombre, precio, cantidad } = req.body
            if (isNaN(id)) {
                res.send('El id ingresado no es valido. Pruebe ingresando un numero.')
            }
            const product = prodCarrito.filter(prod => prod.id === Number(id))
            if (!product[0]) {
                res.send(ERROR)
            }
            const prodUpdate = { nombre: nombre, precio: precio, cantidad: cantidad, id: (prodCarrito.length + 1) }
            prodCarrito.push(prodUpdate)
            res.json(prodUpdate)
        } catch {
            res.send(ERROR)
        }
    }

    deleteById(req, res) {
        const { id } = req.params
        prodCarrito.splice(parseInt(id) - 1, 1)
        // res.render(prodCarrito)
        res.send(prodCarrito)
    }
}
module.exports = Container