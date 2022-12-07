const express = require('express')
const Container = require('../container/carrito')
const router = express.Router()
const container = new Container()

router.get('/', container.getAll)

router.get('/:id', container.getById)

router.post('/', container.create)

router.put('/:id', container.updateById)

router.delete("/:id", container.deleteById)

module.exports = router