const express = require('express');
const cors = require('cors');
const router = require('../routes/usuarios');

const { dbConnection } = require('../database/config');
const usuario = require('./usuario');

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;

        this.paths = {
            // path para Autentificación
            auth: '/api/auth',
            categorias: '/api/categorias',
            // cualquier persona que vea mi servidor vea cuales son las rutas que dispone
            usuarios: '/api/usuarios',
        }


        //Conectar a base de datos
        this.conectarDB();

        // Middlewares (funciones que siempre se van a ejecutar cuando levantemos servidor)
        this.middlewares();

        //Rutas de mi aplicación
        this.routes();
    }

    async conectarDB() {
        await dbConnection();
    }

    middlewares() {

        // CORS
        this.app.use(cors());

        // Lectura y parseo del body
        this.app.use(express.json());

        // Directorio Público
        this.app.use(express.static('public'));

    }

    routes() {
        // defino ruta haciendo require la importacion por defecto de auth y usuarios
        this.app.use(this.paths.auth, require('../routes/auth'));
        this.app.use(this.paths.categorias, require('../routes/categorias'));
        this.app.use(this.paths.usuarios, require('../routes/usuarios'));

    }

    listen() {
        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en puerto', this.port);
        });
    }
}

module.exports = Server;