const express = require('express');
const router = express.Router();
const clanController = require('../controllers/clanController');

// Listar clanes
router.get('/', clanController.listClans);

// Mostrar formulario para nuevo clan
router.get('/nuevo', clanController.showClanForm);

// Crear nuevo clan
router.post('/', clanController.createClan);

// Mostrar formulario para editar un clan
router.get('/:id/editar', clanController.showEditClan);

// Actualizar un clan (CAMBIO A PUT para usar method-override)
router.put('/:id/editar', clanController.updateClan); // <-- CAMBIO AQUÍ

// Eliminar un clan (CAMBIO A DELETE para usar method-override)
router.delete('/:id/eliminar', clanController.deleteClan); // <-- CAMBIO AQUÍ

module.exports = router;