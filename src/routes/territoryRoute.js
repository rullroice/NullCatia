const express = require('express');
const router = express.Router();
const territoryController = require('../controllers/territoryController');

// Listar
router.get('/', territoryController.listTerritories);
// Formulario nuevo
router.get('/nuevo', territoryController.showTerritoryForm);
// Crear
router.post('/', territoryController.createTerritory);
// Formulario editar
router.get('/:id/editar', territoryController.showEditTerritory);
// Actualizar
router.post('/:id/editar', territoryController.updateTerritory);
// Eliminar
router.post('/:id/eliminar', territoryController.deleteTerritory);

module.exports = router;
