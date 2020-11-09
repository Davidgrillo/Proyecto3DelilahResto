const userRouter = require('express').Router();
const { validateCreateUser, loginUser, deleteUser, getUser, updateUser } = require('./users');

userRouter.post('/createUser', validateCreateUser);
userRouter.post('/login', loginUser);
userRouter.delete('/deleteUser', deleteUser);
userRouter.get('/getUser', getUser);
userRouter.put('/updateUser', updateUser);

module.exports = userRouter;