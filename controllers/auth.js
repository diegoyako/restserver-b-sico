const { response, json } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');

const { generarJWT } = require('../helpers/generar-JWT');
const { googleVerify } = require('../helpers/google-verify');

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
// Controlador de google sign in
const googleSignIn = async (req, res = response) => {
    // Pedimos el token
    const { id_token } = req.body;
    // utilizamos googleVerify para checkear si el token es real
    try {
        // desestructuro y espero la respuesta con await
        const { correo, nombre, img } = await googleVerify(id_token);

        // Voy a dar la referencia si el correo ya existe en la Base de datos
        let usuario = await Usuario.findOne({ correo });

        if (!usuario) {
            // Tengo que crearlo
            const data = {
                nombre,
                correo,
                password: ':)',
                img,
                rol: 'USER_ROLE',
                google: true
            };
            // se le manda la data a la creacion de usuario
            usuario = new Usuario(data);
            // lo guardamos en la base de datos
            await usuario.save();
        }

        //Si el usuario en Base de datos tiene el estado en false voy a negar su autentificación
        // en mi app porque puede que alguien lo borrara o bloqueara
        if (!usuario.estado) {
            return res.status(401).json({
                msg: 'Hable con el administrador, usuario bloqueado'
            });
        }

        // Generar el JWT
        //Creado en helpers generarJWT  // usuario.id de mongo
        const token = await generarJWT(usuario.id);

        // Mensaje de que todo salió bien
        res.json({
            usuario,
            token
        });

    } catch (error) {
        res.status(400).json({
            msg: 'El token no se pudo verificar'
        })

    }
}

module.exports = {
    login,
    googleSignIn
}