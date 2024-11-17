import express from 'express'
import {createProduct, getProducts,getProductById } from '../controllers/product.controller.js';


const router=express.Router()

router.get('/',getProducts)
router.get('/:productId',getProductById)
router.post('/createProduct',createProduct)

export default router;