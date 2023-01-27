const express = require('express')
const Product = require('../models/product')
const Auth = require('../middleware/auth')

const router = new express.Router()

//fetch all products
router.get('/products', Auth, async(req, res) => {
  
    if(req.query.user == 1) {
        try {
           const products = await Product.find({ owner: req.user._id})
            res.status(200).send(products)
        } catch (error) {
            console.log(error)
            res.status(500).send('something went wrong')
        }
    } else {
    try {
        const products = await Product.find({})
        res.status(200).send(products)
    } catch (error) {
        res.status(400).send(error)
    }
}
})

//fetch an product
router.get('/products/:id', Auth, async(req, res) => {
    try{
        const product = await Product.findOne({_id: req.params.id})
        if(!product) {
            res.status(404).send({error: "Product not found"})
        }
        res.status(200).send(product) 
    } catch (error) {
        res.status(400).send(error)
    }
})

//create an product
router.post('/products',Auth, async(req, res) => {
    try {
        const newProduct = new Product({
            ...req.body,
            owner: req.user._id
        })
        await newProduct.save()
        res.status(201).send(newProduct)
    } catch (error) {
        console.log({error})
        res.status(400).send({message: "error"})
    }
})

//update an product

router.patch('/products/:id', Auth, async(req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'description', 'category', 'price']

    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if(!isValidOperation) {
        return res.status(400).send({ error: 'invalid updates'})
    }

    try {
        const product = await Product.findOne({ _id: req.params.id})
    
        if(!product){
            return res.status(404).send()
        }

        updates.forEach((update) => product[update] = req.body[update])
        await product.save()
        res.send(product)
    } catch (error) {
        res.status(400).send(error)
    }
})

//delete product
router.delete('/products/:id', Auth, async(req, res) => {
    try {
        const deletedProduct = await Product.findOneAndDelete( {_id: req.params.id} )
        if(!deletedProduct) {
            res.status(404).send({error: "Product not found"})
        }
        res.send(deletedProduct)
    } catch (error) {
        res.status(400).send(error)
    }
})


module.exports = router
