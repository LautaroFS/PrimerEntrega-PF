const express = require('express')
const Container = require('../container/productos')
const router = express.Router()
const container = new Container()

router.get('/', container.getAll)

router.get('/:id', container.getById)

router.post('/', container.create)

router.post('/', container.addProdCarrito)

router.put('/:id', container.updateById)

router.delete("/:id", container.deleteById)

module.exports = router