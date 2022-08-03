const { response } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');

const { generarJWT } = require('../helpers/generar-JWT');

// controlador que llamo luego en routes /login
const login = async (req, res = response) => {
    // Login de usuario
    const { correo, password } = req.body;

    try {

        // Verificar si el email existe
        // que busque un usuario
        const usuario = await Usuario.findOne({ correo });
        // si no lo encuentra
        if (!usuario) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - correo'
            });
        }
        // Si el usuario no está activo
        if (!usuario.estado) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - estado: false'
            });
        }
        // Verificar la contraseña
        const validPassword = bcryptjs.compareSync(password, usuario.password);
        // si no es correcto
        if (!validPassword) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - estado: password'
            });
        }

        // Generar el JWT
        //Creado en helpers generarJWT
        const token = await generarJWT(usuario.id);

        // ultimo paso regreso el usuario que se acaba de logear y cual es el token
        res.json({
            usuario,
            token
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: 'Hable con el administrador'
        })
    }

}

module.exports = {
    login
}