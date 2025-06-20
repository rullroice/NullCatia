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
// Actualizar (Cambio de POST a PUT, para usar method-override)
router.put('/:id/editar', scrollController.updateScroll);
// Eliminar (Cambio de POST a DELETE, para usar method-override)
router.delete('/:id/eliminar', scrollController.deleteScroll);

module.exports = router;