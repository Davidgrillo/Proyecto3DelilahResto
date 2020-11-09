const { createToken, is_numeric } = require('../../auth/security');
const sequelize = require('../../../store/conexion');



const validateCreateUser = async(req, res, next) => {
    let { username, password, fullname, email, phone, address } = req.body;
    validateUsername(req, res, username);
    if (!username || !password || !fullname || !email || !phone || !address) {
        res.status(400).json('Información incompleta');
        console.log('faltan datos');
        next();
    } else {
        await sequelize.query(`INSERT INTO users ( username, password, full_name, email, phone, delivery_address ) 
        VALUES ('${username}','${password}','${fullname}','${email}',${phone},'${address}')`)
            .then(response => {
                console.log(response);
                console.log("número de registros insertados: " + response[1]);
            }).catch(err => {
                console.error(err)
            });
        res.status(200).json('Usuario registrado correctamente');
        next();
    }
}

function validateUsername(req, res, username) {
    sequelize.query(`SELECT username FROM users WHERE username=:user_name`, {
            replacements: { user_name: username },
            type: sequelize.QueryTypes.SELECT,
        })
        .then(result => {
            if (result != "") {
                res.status(200).json('Elija un nombre de usuario distinto');
            }
        }).catch(err => {
            console.error(err)
        });
}

const loginUser = async(req, res) => {
    let { username, password } = req.body;
    if (!username || !password) {
        res.status(400).json('La información ingresada está incompleta');
        console.log('faltan datos');
    } else {
        sequelize.query(`SELECT * FROM users WHERE username='${username}' and password='${password}'`, {
                type: sequelize.QueryTypes.SELECT,
            })
            .then((result) => {
                if (result != "") {

                    sequelize.query(`SELECT user_id, full_name, email, is_admin FROM users WHERE username='${username}'`, {
                            type: sequelize.QueryTypes.SELECT,
                        })
                        .then(payload => {
                            const sendPayload = {
                                user_id: payload[0].user_id,
                                fullname: payload[0].full_name,
                                email: payload[0].email,
                                is_admin: payload[0].is_admin
                            }
                            console.log(sendPayload);
                            createToken(req, res, sendPayload);
                        }).catch(err => {
                            console.error(err)
                        });
                } else {
                    console.log('no tiene información');
                    res.status(401).json('Usuario o contraseña no validos');
                }
            }).catch(err => {
                console.error(err)
            });
        console.log('todos los datos');
    }
}

const getUser = async(req, res) => {
    let id = req.query.id ? is_numeric(req.query.id) : 'allproducts';
    if (id == 'allproducts') {

        await sequelize.query('SELECT * FROM users', {
                type: sequelize.QueryTypes.SELECT,
            })
            .then(result => {
                res.status(200).json(result);
            }).catch(err => {
                console.error(err)
                res.status(400).json('Error al buscar la información');
            });
        return
    };
    if (id != false) {

        await sequelize.query(`SELECT * FROM users WHERE user_id=${id}`, {
                type: sequelize.QueryTypes.SELECT,
            })
            .then(result => {
                res.status(200).json(result);
            }).catch(err => {
                console.error(err)
                res.status(400).json('Error buscando informacion');
            });
        console.log('Busqueda por una id');
    } else {
        return res.status(400).json('El query de la ruta solo admite números');
    };
};

const updateUser = async(req, res) => {
    let id = req.query.id ? is_numeric(req.query.id) : console.log('Falta el ID');
    let { username, password, fullname, email, phone, address } = req.body;
    if (!username || !password || !fullname || !email || !phone || !address) {
        res.status(400).json('La información ingresada está incompleta o mal redactada');
    } else {
        if (id != false) {
            await sequelize.query(`UPDATE users SET username='${username}', password='${password}', full_name='${fullname}', email='${email}', phone=${phone}, delivery_address='${address}'
        WHERE user_id=${id}`)
                .then(result => {
                    console.log("Numero de registros actualizados: " + result[1]);
                }).catch(err => {
                    console.error(err)
                });
            res.status(200).json(`El usuario identificado con el id: ${id} fue actualizado correctamente`);
        }
    }
};

const deleteUser = async(req, res) => {
    let id = req.query.id ? is_numeric(req.query.id) : console.log('Falta el ID');
    console.log(id);
    if (!id) {
        res.status(406).json('Falta la identificación');
    } else {
        if (id != false) {
            await sequelize.query(`SELECT * FROM users WHERE user_id=${id}`, {
                    type: sequelize.QueryTypes.SELECT,
                })
                .then(result => {
                    if (result[0] !== null || result[0] !== [] || result[0] !== "") {

                        sequelize.query(`DELETE FROM users WHERE user_id =${id}`)
                            .then(result => {
                                if (result[1] != 0) {
                                    res.status(200).json(`Se ha eliminado el usuario ${id} de manera correcta`);
                                } else {
                                    res.status(406).json(`No se ha podido eliminar el usuario`);
                                }
                                console.log("Número de filas eliminadas: " + result[1]);
                            }).catch(err => {
                                console.error(err);
                                res.status(400).json(`No se puede eliminar usuario ya que tiene órdenes asociadas`);
                            });
                    } else {
                        res.status(400).json('No se ha podido eliminar usuario')
                    }
                    console.log("Numeros de filas eliminadas: " + result[1]);
                }).catch(err => {
                    console.error(err)
                });
        }
    }
};

module.exports = {
    validateCreateUser,
    loginUser,
    getUser,
    deleteUser,
    updateUser,
}