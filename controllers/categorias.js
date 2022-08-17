const { response } = require("express");
const { Categoria } = require('../models');





const crearCategoria = async (req, res = response) => {
    // capitalizo el nombre en el body en mayuscula
    const nombre = req.body.nombre.toUpperCase();
    // pregunto si existe una categoria con ese nombre
    const categoriaDB = await Categoria.findOne({ nombre });
    // si existe mando el error:
    if (categoriaDB) {
        return res.status(400).json({
            msg: `La categoria ${categoriaDB.nombre}, ya existe`
        });
    }

    // Generar la data a guardar (Usuario tiene que ser un Id de mongo y validado por JWT)
    const data = {
        nombre,
        usuario: req.usuario._id
    }
    // se crea una nueva categoría
    const categoria = new Categoria(data);

    // Guardar en DB
    await categoria.save();
    // repuesta de creación
    res.status(201).json(categoria);

}


module.exports = {
    crearCategoria
}