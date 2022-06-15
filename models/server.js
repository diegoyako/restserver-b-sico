const express = require('express');
const cors = require('cors');
const router = require('../routes/usuarios');

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        // cualquier persona que vea mi servidor vea cuales son las rutas que dispone
        this.usuariosPath = '/api/usuarios';
        // Middlewares (funciones que siempre se van a ejecutar cuando levantemos servidor)
        this.middlewares();

        //Rutas de mi aplicación
        this.routes();
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

        this.app.use(this.usuariosPath, require('../routes/usuarios'));
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en puerto', this.port);
        });
    }
}

module.exports = Server;