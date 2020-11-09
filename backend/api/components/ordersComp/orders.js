const { response } = require('express');
const sequelize = require('../../../store/conexion');
const { validateToken, is_numeric, validateAdmin } = require('../../auth/security');


const addOrder = async(req, res, next) => {
    const user_id = req.token_info.user_id;
    let { payment_method, products } = req.body;
    if (typeof(products) != "object") {
        products = false;
    }
    if (!payment_method || !products) {
        res.status(400).json('Información incompleta');
        console.log('Datos incompletos');
    } else {
        let desiredProducts = [];
        products.forEach((element) => {
            desiredProducts.push(element.product_id)
        });
        await sequelize.query(`SELECT * FROM products WHERE product_id IN (${desiredProducts})`, {
                type: sequelize.QueryTypes.SELECT,
            })
            .then(async result => {
                let total = 0;
                let description = "";
                let ord_id;
                result.forEach((product, index) => {
                    total += product.price * products[index].amount;
                    description += `${products[index].amount}x ${product.name}, `;
                });
                description = description.substring(0, description.length - 2);
                const order = await sequelize.query(
                    `INSERT INTO orders (status, date, description, payment_method, total, user_id) 
                    VALUES (:status, :date, :description, :payment_method, :total, :user_id)`, {
                        replacements: {
                            status: "new",
                            date: new Date(),
                            description,
                            payment_method: payment_method,
                            total,
                            user_id,
                        },
                    }
                ).then(result => {
                    ord_id = result;
                }).catch(err => {
                    console.error(err)
                });
                products.forEach(async(product) => {
                    const order_products = await sequelize.query(
                            `INSERT INTO orders_products (order_id, product_id, product_amount) 
                        VALUES (${ord_id[0]}, ${product.product_id}, ${product.amount})`)
                        .then(result => {
                            console.log("Number de filas insertadas: " + result[1] + " en tabla Orders_Products");
                        }).catch(err => {
                            console.error(err)
                        });
                })

                res.status(200).json('Orden agregada con éxito');
                console.log('Datos completos');
            }).catch(err => {
                console.error(err)
            });
    };
}

const updateOrder = async(req, res) => {
    const user_id = req.token_info.user_id;
    if (is_numeric(user_id) == false) {
        res.status(403).json('El parámetro id (identificación) debe ser valor numérico');
    }
    let id = req.query.id ? is_numeric(req.query.id) : console.log('Falta parámetro id');
    let { status } = req.body;
    if (!status) {
        res.status(400).json('No se envió identificación');
    } else {

        try {
            const order = await sequelize.query("SELECT * FROM orders WHERE order_id = :order_id;", {
                replacements: { order_id: id },
                type: sequelize.QueryTypes.SELECT,
            });

            if (!!order.length) {
                const update = await sequelize.query("UPDATE orders SET status = :status WHERE order_id = :order_id", {
                    replacements: {
                        order_id: id,
                        status: status,
                    },
                });
                res.status(200).json(`Orden ${id} fue modificada con éxito`);
            } else {
                res.status(404).json("No se encontraron resultados");
            }
        } catch (error) {
            console.log(error);
        }
    }
};

const deleteOrder = async(req, res, next) => {
    let id = req.query.id ? is_numeric(req.query.id) : console.log('Falta parametro id');
    if (!id) {
        res.status(400).json('No se envio identificación, debe ser un valor numérico');
        next();
    } else {
        if (id != false) {
            await sequelize.query(`DELETE FROM orders_products WHERE order_id =${id}`)
                .then(result => {
                    console.log("Número de filas eliminadas: " + result[0].affectedRows + " de la tabla órdernes_productos");
                    sequelize.query(`DELETE FROM orders WHERE order_id =${id}`)
                        .then(result => {
                            console.log("Número de filas eliminadas: " + result[0].affectedRows + " de la tabla órdernes");

                        }).catch(err => {
                            console.error(err)
                        });
                }).catch(err => {
                    console.error(err)
                });

            res.status(200).json(`Se eliminó la orden ${id} con éxito`);
        }
        next();
    }
};

const getOrder = async(req, res, next) => {
    let is_admin = validateAdmin(req, res);
    if (is_admin == 'is_admin') {
        await sequelize.query('SELECT * FROM orders', {
                type: sequelize.QueryTypes.SELECT,
            })
            .then(result => {
                res.status(200).json(result);
            }).catch(err => {
                console.error(err)
                res.status(400).json('Error al buscar información');
            });
        return
    } else {
        await sequelize.query(`SELECT * FROM orders WHERE user_id=${is_admin}`, {
                type: sequelize.QueryTypes.SELECT,
            })
            .then(result => {
                res.status(200).json(result);
            }).catch(err => {
                console.error(err)
                res.status(400).json('Error al buscar la información');
            });
    };
    next();
};

module.exports = {
    addOrder,
    updateOrder,
    deleteOrder,
    getOrder,
}