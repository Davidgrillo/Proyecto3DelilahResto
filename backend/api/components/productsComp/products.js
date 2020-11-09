const sequelize = require('../../../store/conexion');
const { is_numeric } = require('../../auth/security');

const addProducts = async(req, res, next) => {
    let { name, price, img_url, description } = req.body;
    if (!name || !price || !img_url || !description) {
        res.status(400).json('Información incompleta');
        next();
    } else {
        await sequelize.query(`INSERT INTO products (name, price, img_url, description) 
        VALUES ('${name}',${price},'${img_url}','${description}')`)
            .then(result => {
                console.log("Número de registros insertados: " + result[1]);
            }).catch(err => {
                console.error(err)
            });
        res.status(201).json('Producto agregado correctamente');
        next();
    }
};

const getProducts = async(req, res, next) => {
    let id = req.query.id ? is_numeric(req.query.id) : 'allproducts';
    if (id == 'allproducts') {

        await sequelize.query('SELECT * FROM products', {
                type: sequelize.QueryTypes.SELECT,
            })
            .then(result => {
                res.status(200).json(result);
            }).catch(err => {
                console.error(err)
                res.status(400).json('Error en la búsqueda de la información');
            });
        return
    };
    if (id != false) {

        await sequelize.query(`SELECT * FROM products WHERE product_id=${id}`, {
                type: sequelize.QueryTypes.SELECT,
            })
            .then(result => {
                res.status(200).json(result);
            }).catch(err => {
                console.error(err)
                res.status(400).json('Error buscando informacion');
            });
        console.log('Busqueda por una id');
        next();
    } else {
        return res.status(400).json('El query de la ruta solo admite números');
    };
    next();
};

const updateProducts = async(req, res, next) => {
    let id = req.query.id ? is_numeric(req.query.id) : console.log('Falta parámetro id');
    let { name, price, img_url, description } = req.body;
    if (!id || !name || !price || !img_url || !description) {
        res.status(400).json('Información incompleta');
        next();
    } else {
        if (id != false) {
            await sequelize.query(`UPDATE products SET name='${name}', price=${price}, img_url='${img_url}', description='${description}' 
        WHERE  product_id=${id}`)
                .then(result => {
                    console.log("Number of records update: " + result[1]);
                }).catch(err => {
                    console.error(err)
                });

            res.status(200).json('Actualización satisfactoria');
        }

        next();
    }
};

const deleteProducts = async(req, res) => {
    let id = req.query.id ? is_numeric(req.query.id) : console.log('Falta parametro id');
    console.log(id);
    if (!id) {
        res.status(406).json('Falta identificación');
    } else {
        if (id != false) {
            await sequelize.query(`SELECT * FROM orders_products WHERE product_id=${id}`)
                .then(result => {
                    if (result[0] == null || result[0] == [] || result[0] == "") {
                        sequelize.query(`SELECT * FROM products WHERE product_id=${id}`, {
                                type: sequelize.QueryTypes.SELECT,
                            })
                            .then(result => {
                                if (result == null || result == [] || result == "") {
                                    res.status(400).json(`No se puede eliminar producto con id:${id}`);
                                    console.log('no existe el producto');
                                } else {
                                    sequelize.query(`DELETE FROM products WHERE product_id =${id}`)
                                        .then(result => {
                                            if (result[1] != 0) {
                                                res.status(200).json(`Producto eliminado por id ${id}`);
                                            } else {
                                                res.status(406).json(`No se puede eliminar`);
                                            }
                                            console.log("Number of rows delete: " + result[1]);
                                        }).catch(err => {
                                            console.error(err)
                                        });
                                }
                            }).catch(err => {
                                console.error(err)
                                res.status(400).json('Error buscando informacion');
                            });

                    } else {
                        sequelize.query(`DELETE FROM orders_products WHERE product_id=${id}`)
                            .then(result => {
                                console.log(result);
                                sequelize.query(`DELETE FROM products WHERE product_id =${id}`)
                                    .then(result => {
                                        if (result[1] != 0) {
                                            res.status(200).json(`Producto eliminado por id ${id}`);
                                        } else {
                                            res.status(406).json(`No se puede eliminar`);
                                        }
                                        console.log("Number of rows delete: " + result[1]);
                                    }).catch(err => {
                                        console.error(err)
                                    });
                            }).catch(err => {
                                console.error(err)
                            });
                    }
                    console.log("Number of rows delete: " + result[1]);
                }).catch(err => {
                    console.error(err)
                });
        }
    }
};

module.exports = {
    addProducts,
    getProducts,
    updateProducts,
    deleteProducts,
}