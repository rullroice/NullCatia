const express = require('express');
const router = express.Router();
const catController = require('../controllers/catController');

// Listar todos los gatos
router.get('/', catController.listCats);

// Mostrar formulario para crear un gato
router.get('/nuevo', catController.showCatForm);

// Crear gato
router.post('/', catController.createCat);

// Eliminar gato
router.post('/:id/eliminar', catController.deleteCat);

module.exports = router;