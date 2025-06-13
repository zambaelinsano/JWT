//lo primero es empezar a definir el servidor que se encargara de realizar el almacenamiento de la app

const express = require('express');
//express es el servidor
const cors = require('cors');
//es un modulo que se encarga de crear accesos a las rutas de los metodos 
//esos metodos son las rutas de acceso get, post, put, delete, etc
//como vamos a utilizar un jwt para poder acceder por medio de una autenticacion 
const authRouters = require('./routes/auth');

//necesitaremos los elementos de mi variable
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRouters);
const PORT = process.env.PORT || 3001; 

app.listen(PORT, () => {
    console.log(`Servidor en local`); 
    console.log(`Escuchando en http://localhost:${PORT}`); 
}).on('error', (err) => { 
    if (err.code === 'EADDRINUSE') {
        console.error(`ERROR: El puerto ${PORT} ya está en uso. Por favor, libera el puerto o usa uno diferente.`);
    } else {
        console.error(`ERROR al iniciar el servidor:`, err);
    }
});

