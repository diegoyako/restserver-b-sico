const { Router } = require('express');
const { check } = require('express-validator');
const { crearCategoria } = require('../controllers/categorias');

const { validarJWT, validarCampos } = require('../middlewares/');


const router = Router();
/**
 * {{url}}/api/categorias
 */

//Obtener todas las categorias - publico (cualquiera que tenga el url va a conocer todas las categorias)
router.get('/', (req, res) => {
    res.json('get');
});

// Obtener una categoria por id - publico
router.get('/:id', (req, res) => {
    res.json('get - id');
});

// Crear categoria - privado (cualquier persona con un token válido)
router.post('/', [
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    validarCampos
], crearCategoria);

// Para actualizar el ID - privado - cualquiera con token valido
router.put('/:id', (req, res) => {
    res.json('put');
});

// Borrar una categoría - Admin -
router.delete('/:id', (req, res) => {
    res.json('delete');
});






module.exports = router;