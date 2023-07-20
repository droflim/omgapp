const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const mascotasSchema = new Schema(
    {
        nombreMaterial: String,
        Cantidad: Number,
        Precio : Number,
        Fecha: String
    
    }
);

// Crear el modelo

const Inventario = mongoose.model('inventario', mascotasSchema);

module.exports = Inventario;

