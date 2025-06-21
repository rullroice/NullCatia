const express = require('express');
const router = express.Router();
const catController = require('../controllers/catController');
const { body } = require('express-validator'); 

const catValidationRules = [
    // Validar el campo 'name' (nombre del gatito)
    body('name')
        .trim() // Elimina espacios en blanco al inicio y al final
        .notEmpty().withMessage('El nombre del gatito es obligatorio.') // No puede estar vacío
        .isLength({ min: 2, max: 100 }).withMessage('El nombre debe tener entre 2 y 100 caracteres.'), // Longitud mínima y máxima

    // Validar el campo 'birth_date' (fecha de nacimiento)
    body('birth_date')
        .optional({ nullable: true, checkFalsy: true }) // Es opcional, puede ser nulo o vacío
        .isISO8601().toDate().withMessage('La fecha de nacimiento no es válida. Usa formato YYYY-MM-DD.'), // Debe ser una fecha ISO 8601 válida

    // Validar el campo 'clan_id'
    body('clan_id')
        .notEmpty().withMessage('El clan es obligatorio.') // No puede estar vacío
        .isInt({ min: 1 }).withMessage('El ID del clan debe ser un número entero positivo.'), // Debe ser un entero positivo

    // Validar el campo 'territory_id'
    body('territory_id')
        .optional({ nullable: true, checkFalsy: true }) // Es opcional, puede ser nulo o vacío
        .isInt({ min: 1 }).withMessage('El ID del territorio debe ser un número entero positivo si se proporciona.'),

    // Validar el campo 'rol'
    body('rol')
        .trim()
        .optional({ nullable: true, checkFalsy: true }) // Es opcional
        .isLength({ max: 255 }).withMessage('El rol no puede exceder los 255 caracteres.'),

    // Validar el campo 'habilidad_especial'
    body('habilidad_especial')
        .trim()
        .optional({ nullable: true, checkFalsy: true }) // Es opcional
        .isLength({ max: 1000 }).withMessage('La habilidad especial no puede exceder los 1000 caracteres.') // Se asume un límite razonable para TEXT
];

// Listar gatos (soporta búsqueda y paginación a través de `req.query`)
router.get('/', catController.listCats);

// Mostrar formulario para nuevo gato
router.get('/nuevo', catController.showCatForm);

// Crear nuevo gato (aplica las reglas de validación)
router.post('/', catValidationRules, catController.createCat);

// Mostrar formulario para editar un gato
router.get('/:id/editar', catController.showEditCat);

// Actualizar un gato (aplica las reglas de validación)
router.put('/:id/editar', catValidationRules, catController.updateCat);

// Eliminar un gato
router.delete('/:id/eliminar', catController.deleteCat);

module.exports = router;