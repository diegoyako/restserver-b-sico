const { OAuth2Client } = require('google-auth-library');
// le ponemos nuestro id de env
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
//  debe recibir el token con un string vacio para que si hay error, sea controlado
async function googleVerify(token = '') {
// utiliza el cliente para verificar el token
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    // Extraer la información que queremos con desesctructuración en el backend (Consola)
    const { name, picture, email } = ticket.getPayload();

    return {
        nombre: name, 
        img: picture, 
        correo: email
    }

}

module.exports = {
    googleVerify
}