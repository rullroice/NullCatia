const express = require('express');
const router = express.Router();
const catController = require('../controllers/catController');

// Listar gatitos
router.get('/', catController.listCats);

// Mostrar formulario para nuevo gatito
router.get('/nuevo', catController.showCatForm);

// Crear nuevo gatito
router.post('/', catController.createCat);

// Mostrar formulario para editar un gatito
router.get('/:id/editar', catController.showEditCat);

// Actualizar un gatito (CAMBIO A PUT)
router.put('/:id/editar', catController.updateCat); // <-- CAMBIO AQUÍ

// Eliminar un gatito (CAMBIO A DELETE)
router.delete('/:id/eliminar', catController.deleteCat); // <-- CAMBIO AQUÍ

module.exports = router;