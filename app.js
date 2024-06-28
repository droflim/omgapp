
var MongoClient = require('mongodb').MongoClient;
const mongoose = require('mongoose');
const express = require("express");
const Joi = require('@hapi/joi');
const jwt = require('jsonwebtoken');
const Inventario = require('./models/inventario');
const app = express();
const bcrypt = require('bcrypt');
require('dotenv').config();
const bodyParser = require('body-parser');


app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Datos para la conexión a MongoDB
const user = 'droflim';
const password = 'master666';
const dbname = 'inventario';



const connect = async function () {
    const uri = `mongodb+srv://${user}:${password}@cluster0.9swkajv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;// Will return DB URI 
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

  app.post('/agregarMaterial', async (req, res) => {
    const datosMaterial = req.body;

    try {
        // Crea una instancia del modelo Material con los datos recibidos
        const nuevoMaterial = new Inventario({
            nombreMaterial: datosMaterial.nombreMaterial,
            cantidad: datosMaterial.cantidad
         
        });

        // Guarda el nuevo material en la base de datos
        await nuevoMaterial.save();

        // Responde con un mensaje de éxito
        res.json({ message: 'Material agregado correctamente a MongoDB' });
    } catch (error) {
        console.error('Error al guardar el material en MongoDB:', error);
        res.status(500).json({ error: 'Hubo un error al guardar el material en MongoDB' });
    }
});


// Configurar body-parser para manejar datos JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Ruta para obtener todos los materiales
app.get('/inventarios', async (req, res) => {
    try {
        const materiales = await Inventario.find();
        res.json(materiales);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al obtener materiales' });
    }
});


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

