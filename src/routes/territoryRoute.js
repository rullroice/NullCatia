const express = require('express');
const router = express.Router();
const territoryController = require('../controllers/territoryController');
const { body } = require('express-validator'); // Importa 'body' para definir las reglas de validación

//Reglas de validación para los formularios de territorios
const territoryValidationRules = [
    // Validar el campo 'name' (nombre del territorio)
    body('name')
        .trim() // Elimina espacios en blanco al inicio y al final
        .notEmpty().withMessage('El nombre del territorio es obligatorio.') // No puede estar vacío
        .isLength({ min: 3, max: 100 }).withMessage('El nombre debe tener entre 3 y 100 caracteres.'), // Longitud mínima y máxima

    // Validar el campo 'description' (descripción del territorio)
    body('description')
        .trim()
        .optional({ nullable: true, checkFalsy: true }) // Es opcional, puede ser nulo o vacío
        .isLength({ max: 1000 }).withMessage('La descripción no puede exceder los 1000 caracteres.'), // Límite razonable para texto largo
];

// Listar territorios (soporta búsqueda y paginación a través de `req.query`)
router.get('/', territoryController.listTerritories);

// Mostrar formulario para nuevo territorio
router.get('/nuevo', territoryController.showTerritoryForm);

// Crear nuevo territorio (aplica las reglas de validación)
router.post('/', territoryValidationRules, territoryController.createTerritory);

// Mostrar formulario para editar un territorio
router.get('/:id/editar', territoryController.showEditTerritory);

// Actualizar un territorio (aplica las reglas de validación)
router.put('/:id/editar', territoryValidationRules, territoryController.updateTerritory);

// Eliminar un territorio
router.delete('/:id/eliminar', territoryController.deleteTerritory);

module.exports = router;