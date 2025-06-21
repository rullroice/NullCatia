const express = require('express');
const router = express.Router();
const scrollController = require('../controllers/scrollController');
const { body } = require('express-validator'); // Importa 'body' para definir las reglas de validación

//Reglas de validación para los formularios de pergaminos
const scrollValidationRules = [
    // Validar el campo 'title' (título del pergamino)
    body('title')
        .trim() // Elimina espacios en blanco al inicio y al final
        .notEmpty().withMessage('El título del pergamino es obligatorio.') // No puede estar vacío
        .isLength({ min: 3, max: 150 }).withMessage('El título debe tener entre 3 y 150 caracteres.'), // Longitud mínima y máxima

    // Validar el campo 'content' (contenido del pergamino)
    body('content')
        .trim()
        .optional({ nullable: true, checkFalsy: true }) // Es opcional, puede ser nulo o vacío
        .isLength({ max: 5000 }).withMessage('El contenido no puede exceder los 5000 caracteres.'), // Límite razonable para texto largo

    // Validar el campo 'cat_id' (ID del gato asociado)
    body('cat_id')
        .optional({ nullable: true, checkFalsy: true }) // Es opcional, puede ser nulo o vacío
        .isInt({ min: 1 }).withMessage('El ID del gato debe ser un número entero positivo si se proporciona.')
        .bail() // Detiene la validación si la anterior falla
];

// Listar pergaminos (soporta búsqueda y paginación a través de `req.query`)
router.get('/', scrollController.listScrolls);

// Mostrar formulario para nuevo pergamino
router.get('/nuevo', scrollController.showScrollForm);

// Crear nuevo pergamino (aplica las reglas de validación)
router.post('/', scrollValidationRules, scrollController.createScroll);

// Mostrar formulario para editar un pergamino
router.get('/:id/editar', scrollController.showEditScroll);

// Actualizar un pergamino (aplica las reglas de validación)
router.put('/:id/editar', scrollValidationRules, scrollController.updateScroll);

// Eliminar un pergamino
router.delete('/:id/eliminar', scrollController.deleteScroll);

module.exports = router;