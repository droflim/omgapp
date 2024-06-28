const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const mascotasSchema = new Schema(
    {
        nombreMaterial: String,
        cantidad: String
      
    
    }
);

// Crear el modelo

const Inventario = mongoose.model('inventario', mascotasSchema);

module.exports = Inventario;

