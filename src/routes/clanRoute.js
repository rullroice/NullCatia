const express = require('express');
const router = express.Router();
const clanController = require('../controllers/clanController');
const { body } = require('express-validator'); 

//Reglas de validación para los formularios de clanes
const clanValidationRules = [
    body('name')
        .trim() 
        .notEmpty().withMessage('El nombre del clan es obligatorio.') 
        .isLength({ min: 3, max: 100 }).withMessage('El nombre debe tener entre 3 y 100 caracteres.'), // Longitud mínima y máxima

    // Validar el campo 'description' (descripción del clan)
    body('description')
        .trim()
        .optional({ nullable: true, checkFalsy: true }) 
        .isLength({ max: 1000 }).withMessage('La descripción no puede exceder los 1000 caracteres.'), // Límite razonable para texto largo
];

// Listar clanes (soporta búsqueda y paginación a través de `req.query`)
router.get('/', clanController.listClans);

// Mostrar formulario para nuevo clan
router.get('/nuevo', clanController.showClanForm);

// Crear nuevo clan (aplica las reglas de validación)
router.post('/', clanValidationRules, clanController.createClan);

// Mostrar formulario para editar un clan
router.get('/:id/editar', clanController.showEditClan);

// Actualizar un clan (aplica las reglas de validación)
router.put('/:id/editar', clanValidationRules, clanController.updateClan);

// Eliminar un clan
router.delete('/:id/eliminar', clanController.deleteClan);

module.exports = router;