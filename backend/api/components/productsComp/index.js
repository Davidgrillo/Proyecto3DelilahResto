const productRouter = require('express').Router();
const { addProducts, getProducts, updateProducts, deleteProducts } = require('./products');
const { validateToken, validateUser } = require('../../auth/security');

productRouter.put('/updateProducts', validateToken, validateUser, updateProducts);
productRouter.post('/addProducts', validateToken, validateUser, addProducts);
productRouter.delete('/deleteProducts', validateToken, validateUser, deleteProducts);
productRouter.get('/getProducts', validateToken, getProducts);

module.exports = productRouter;