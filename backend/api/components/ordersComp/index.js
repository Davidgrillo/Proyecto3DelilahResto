const OrderRouter = require('express').Router();
const { addOrder, updateOrder, deleteOrder, getOrder } = require('./orders');
const { validateToken, validateUser } = require('../../auth/security');

OrderRouter.post('/addOrder', validateToken, addOrder);
OrderRouter.put('/updateOrder', validateToken, validateUser, updateOrder);
OrderRouter.delete('/deleteOrder', validateToken, validateUser, deleteOrder);
OrderRouter.get('/getOrder', validateToken, getOrder);

module.exports = OrderRouter;