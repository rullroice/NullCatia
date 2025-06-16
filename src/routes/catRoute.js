const express = require('express');
const router = express.Router();
const catController = require('../controllers/catController');

// Listar
router.get('/', catController.listCats);
// Formulario nuevo
router.get('/nuevo', catController.showCatForm);
// Crear
router.post('/', catController.createCat);
// Formulario editar
router.get('/:id/editar', catController.showEditCat);
// Actualizar
router.post('/:id/editar', catController.updateCat);
// Eliminar
router.post('/:id/eliminar', catController.deleteCat);

module.exports = router;