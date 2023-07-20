
var MongoClient = require('mongodb').MongoClient;
const mongoose = require('mongoose');
const express = require("express");
const Joi = require('@hapi/joi');
const jwt = require('jsonwebtoken');

const app = express();
const bcrypt = require('bcrypt');
require('dotenv').config();


app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Datos para la conexión a MongoDB
const user = 'OMG';
const password = 'carlos123';
const dbname = 'inventario';



const connect = async function () {
    const uri = `mongodb+srv://${user}:${password}@cluster0.ccfjitf.mongodb.net/${dbname}?retryWrites=true&w=majority`;// Will return DB URI 
    console.log(`Connecting to DB - uri: ${uri}`);
    return mongoose.connect(uri, {useNewUrlParser: true});
  };
// Me conecto a MongoDB
(async () => {
    try {
     const connected = await connect();
    } catch(e) {
     console.log('Error happend while connecting to the DB: ', e.message)
    }
  })();


// Motor de plantillas, definición de rutas
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.use(express.static(__dirname + "/public"));

// Importación de router
const authRoutes = require('./router/ClientesRouter')

// Código de los router
app.use('/api/user', authRoutes);

// Especificación de las rutas a ocupar
app.use('/', require('./router/RutasWeb'));
app.use('/inventario', require('./router/ClientesRouter'));


app.use('/user', require('./router/ClientesRouter'))

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});

