const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos');


const { login, googleSignIn } = require('../controllers/auth');


const router = Router();
// defino la ruta post al login y luego mando la información en la ruta con los custom middelwares y custom validations
router.post('/login', [
    check('correo', 'El correo es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validarCampos
], login);
// defino la ruta post a google sign in
router.post('/google', [
    check('id_token', 'el ID Token es necesario').not().isEmpty(),
    validarCampos
], googleSignIn);


module.exports = router;