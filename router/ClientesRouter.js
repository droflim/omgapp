const express = require('express');
const router = express.Router();
const bodyParser = require("body-parser");

// parse application/x-www-form-urlencoded
router.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
router.use(bodyParser.json())

const Inventario = require('../models/inventario');
const { array } = require('@hapi/joi');

router.get('/', async (request,response) => {
    try {
        const arrayClientesDB =await Inventario.find()
    
        response.render("inventario", {
            arrayClientes: arrayClientesDB
        })
    } 
    catch (e) {
     console.log(e)
     }
    
})

module.exports = router;

router.get("/agregarMaterial",(request,response) => {
response.render("agregarMaterial")
})



router.post("/agregarMaterial", async (request,response) => {
const body = request.body;
console.log(body)

try {
const clienteBD = new Inventario(body)
await clienteBD.save()

response.redirect("/inventario")
} catch(error) {
  console.log(error)
}
})
//codigo para ver el cliente y despues modificarlo

// Código para ver el cliente (y posteriormente, modificarlo)
router.get('/verMaterial/:id', async (request, response) => {
console.log("********** verCliente **************");
const id = request.params.id;

try {
    const clienteBD = await Inventario.findOne({_id: id})

    response.render("editarMaterial", {
        nombreMaterial: clienteBD.nombreMaterial,
        Cantidad: clienteBD.Cantidad,
        Precio: clienteBD.Precio,
        Fecha: clienteBD.Fecha,
        id: id
    });
} 
catch (e) {
 console.log(e)
 }




})

// Código para modificar a un cliente
router.post('/verMaterial/editarMaterial', async (request, response) => 
{
console.log("********** editarCliente ************");
const body = request.body;
const id = request.body.id;
console.log(body);

try {

   const clienteDB = await Inventario.findByIdAndUpdate(
    id, body, { userFindAndModify: false}
   )

   response.redirect('/inventario');

} catch (error) {
    console.log(error);
}

})
// metodo para eliminar con delete

router.delete("/:id", async (request,response) => {
const id =request.params.id;
const clienteBD = await Inventario.findByIdAndRemove({_id: id});

response.redirect('/inventario');
})
