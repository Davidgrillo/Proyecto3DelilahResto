const express = require('express');
const helmet = require('helmet');

const OrderRouter = require('./backend/api/components/ordersComp');
const productRouter = require('./backend/api/components/productsComp');
const userRouter = require('./backend/api/components/usersComp');


const app = express();
app.use(helmet());
app.use(express.json());



//Usuarios

app.use('/', userRouter);

//Órdenes

app.use('/', OrderRouter);

//Productos
app.use('/', productRouter);

//Servidor

app.listen(3000, () => {
    console.log(`Servidor iniciado en http://localhost:3000`);
});