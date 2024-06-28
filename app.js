const express = require("express");
const mongoose = require('mongoose');
const Inventario = require('./models/inventario');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

// Configurar body-parser para manejar datos JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Datos para la conexión a MongoDB
const user = 'droflim';
const password = 'master666';
const dbname = 'inventario';
const uri = `mongodb+srv://${user}:${password}@cluster0.9swkajv.mongodb.net/${dbname}`;

// Conexión a MongoDB
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Conectado a MongoDB');
    // Crear índice TTL después de la conexión
    return Inventario.createIndexes({ "createdAt": 1 }, { expireAfterSeconds: 3600 });
  })
  .then(() => {
    console.log('Índice TTL creado correctamente');
  })
  .catch(err => console.error('Error al conectar o crear índice TTL:', err));

// Definición de rutas y middleware
app.post('/agregarMaterial', async (req, res) => {
  const datosMaterial = req.body;

  try {
    // Crea una instancia del modelo Material con los datos recibidos
    const nuevoMaterial = new Inventario({
      nombreMaterial: datosMaterial.nombreMaterial,
      cantidad: datosMaterial.cantidad,
      createdAt: new Date() // Asegúrate de tener createdAt en el documento
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

app.get('/inventarios', async (req, res) => {
  try {
    const materiales = await Inventario.find();
    res.json(materiales);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al obtener materiales' });
  }
});

// Configuración de otras rutas y middleware...
// ...

// Configuración del servidor
const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
