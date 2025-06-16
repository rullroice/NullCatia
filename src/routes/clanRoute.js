const express = require('express');
const router = express.Router();
const clanController = require('../controllers/clanController');

// Listar
router.get('/', clanController.listClans);
// Formulario nuevo
router.get('/nuevo', clanController.showClanForm);
// Crear
router.post('/', clanController.createClan);
// Formulario editar
router.get('/:id/editar', clanController.showEditClan);
// Actualizar
router.post('/:id/editar', clanController.updateClan);
// Eliminar
router.post('/:id/eliminar', clanController.deleteClan);

module.exports = router;