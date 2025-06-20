const express = require('express');
const router = express.Router();
const territoryController = require('../controllers/territoryController');

// Listar territorios
router.get('/', territoryController.listTerritories);

// Mostrar formulario para nuevo territorio
router.get('/nuevo', territoryController.showTerritoryForm);

// Crear nuevo territorio
router.post('/', territoryController.createTerritory);

// Mostrar formulario para editar un territorio
router.get('/:id/editar', territoryController.showEditTerritory);

// Actualizar un territorio (CAMBIO A PUT para usar method-override)
router.put('/:id/editar', territoryController.updateTerritory); // <-- CAMBIO AQUÍ

// Eliminar un territorio (CAMBIO A DELETE para usar method-override)
router.delete('/:id/eliminar', territoryController.deleteTerritory); // <-- CAMBIO AQUÍ

module.exports = router;