const ERROR = { error: "Producto no encontrado" }
const stockCero = "Noy hay productos cargados."
const prodCarrito = require('../../db/carrito.json')
const products = [
    {
        nombre: "Fanta",
        precio: 12,
        cantidad: 2,
        img: "https://ardiaprod.vtexassets.com/arquivos/ids/228472/Gaseosa-CocaCola-Sabor-Original-225-Lts-_2.jpg?v=637959903979400000",
        id: 1
    }
]

class Container {
    constructor() {
    }

    getAll(req, res) {
        try {
            res.render('inicio', { products })
        } catch (error) {
            res.render('inicio', stockCero)
        }
    }


    getById(req, res) {
        const { id } = req.params
        if (isNaN(id)) {
            res.send('El id ingresado no es valido. Pruebe ingresando un numero.')
        }
        const product = products.filter(prod => prod.id === Number(id))
        if (!product[0]) {
            res.send(ERROR)
        } else {
            res.json(product)
        }
    }

    create(req, res) {
        const { nombre, precio, cantidad, img, id } = req.body
        const prod = { nombre: nombre, precio: precio, cantidad: cantidad, img: img, id: id }
        if (products.length === 0) {
            prod.id = 0
        } else {
            const idPosterior = products[products.length - 1].id
            prod.id = idPosterior + 1
        }

        products.push(prod)
        console.log(products);
        res.redirect('/productos')
    }

    updateById(req, res) {
        try {
            const { nombre, precio, cantidad, id } = req.body
            if (isNaN(id)) {
                res.render('El id ingresado no es valido. Pruebe ingresando un numero.')
            }
            const product = products.filter(prod => prod.id === Number(id))
            if (!product[0]) {
                res.render(ERROR)
            }
            const prodUpdate = { nombre: nombre, precio: precio, cantidad: cantidad, id: (products.length + 1) }
            products.push(prodUpdate)
            res.render(products)
        } catch {
            res.send(ERROR)
        }
    }

    deleteById(req, res) {
        const { id } = req.params
        products.splice(parseInt(id) - 1, 1)
        res.render(products)
    }

    addProdCarrito(req, res) {
        const { nombre, precio, cantidad, img, id } = req.body
        const prod = { nombre: nombre, precio: precio, cantidad: cantidad, img: img, id: id }
        prodCarrito.push(prod)
    }
}
module.exports = Container