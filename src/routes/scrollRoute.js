const express = require('express');
const router = express.Router();
const scrollController = require('../controllers/scrollController');

// Listar
router.get('/', scrollController.listScrolls);
// Formulario nuevo
router.get('/nuevo', scrollController.showScrollForm);
// Crear
router.post('/', scrollController.createScroll);
// Formulario editar
router.get('/:id/editar', scrollController.showEditScroll);
// Actualizar
router.post('/:id/editar', scrollController.updateScroll);
// Eliminar
router.post('/:id/eliminar', scrollController.deleteScroll);

module.exports = router;