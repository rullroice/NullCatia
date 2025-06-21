const Cat = require('../models/catModel');
const Clan = require('../models/clanModel');
const Territory = require('../models/territoryModel');
const { body, validationResult } = require('express-validator'); // Asegúrate de importar 'body'

const ITEMS_PER_PAGE = 5;

// Controlador para manejar las operaciones relacionadas con los gatitos (cats)
exports.listCats = async (req, res) => {
    const searchTerm = req.query.search;
    const page = parseInt(req.query.page) || 1;
    const offset = (page - 1) * ITEMS_PER_PAGE;

    try {
        console.log(`[Controller] Intentando listar gatitos. Búsqueda: '${searchTerm || 'N/A'}', Página: ${page}`);

        let cats;
        let totalCats;
        let countResult;

        if (searchTerm) {
            countResult = await Cat.countSearchResults(searchTerm);
            console.log("DEBUG: countResult for search:", countResult);
            totalCats = countResult[0].count; // Aquí ya sabemos que countResult[0] existe gracias a los logs
            cats = await Cat.searchByNamePaginated(searchTerm, ITEMS_PER_PAGE, offset);
            console.log(`[Controller] Se encontraron ${cats.length} gatitos para la búsqueda '${searchTerm}'. Total: ${totalCats}.`);
        } else {
            countResult = await Cat.countAll();
            console.log("DEBUG: countResult for all:", countResult);
            totalCats = countResult[0].count; // Aquí ya sabemos que countResult[0] existe gracias a los logs
            cats = await Cat.getAllPaginated(ITEMS_PER_PAGE, offset);
            console.log(`[Controller] Se encontraron ${cats.length} gatitos en la página ${page}. Total: ${totalCats}.`);
        }

        const totalPages = Math.ceil(totalCats / ITEMS_PER_PAGE);

        res.render('cats/list', {
            title: 'Listado de Gatitos',
            cats, // Los gatitos de la página actual
            currentPage: page,
            totalPages,
            searchTerm: searchTerm || '' // Pasa el término de búsqueda para mantenerlo en el formulario
        });

    } catch (err) {
        console.error('Error detallado al listar los gatitos:', err);
        res.status(500).render('error', {
            title: 'Error al cargar gatitos',
            message: 'No pudimos cargar la lista de gatitos. Por favor, inténtalo de nuevo más tarde.',
        });
    }
};

// Muestra el formulario para crear un nuevo gatito.
// Este formulario se usa tanto para crear como para editar gatitos.

exports.showCatForm = async (req, res) => {
    try {
        console.log('[Controller] Mostrando formulario para nuevo gatito.');
        const clans = await Clan.getAll();
        const territories = await Territory.getAll();
        res.render('cats/form', {
            title: 'Nuevo Gatito',
            cat: {}, // Objeto vacío para un formulario nuevo
            clans,
            territories,
            errors: [] // Inicializa errores como un array vacío para la primera carga
        });
    } catch (err) {
        console.error('Error detallado al cargar el formulario de gatito:', err);
        res.status(500).render('error', {
            title: 'Error del servidor',
            message: 'No pudimos cargar el formulario para crear un gatito. Por favor, inténtalo de nuevo más tarde.',
        });
    }
};

// Valida los datos del gatito antes de crear o actualizar.
exports.validateCat = [
    body('name')
        .notEmpty().withMessage('El nombre del gatito es obligatorio.')
        .isLength({ max: 100 }).withMessage('El nombre no puede exceder los 100 caracteres.'),
    body('birth_date')
        .isISO8601().toDate().withMessage('La fecha de nacimiento no es válida.'),
    body('clan_id')
        .notEmpty().withMessage('El clan es obligatorio.')
        .isInt().withMessage('El ID del clan debe ser un número entero.'),
    
    //Validaciones para 'role' y 'special_ability' como obligatorios
    body('role')
        .notEmpty().withMessage('El rol es obligatorio.')
        .isLength({ max: 50 }).withMessage('El rol no puede exceder los 50 caracteres.'),
    body('special_ability')
        .notEmpty().withMessage('La habilidad especial es obligatoria.')
        .isLength({ max: 255 }).withMessage('La habilidad especial no puede exceder los 255 caracteres.'),

    //Manejo de territory_id para convertir cadena vacía a null
    body('territory_id').custom((value, { req }) => {
        if (value === '') { // Si el valor es una cadena vacía del select
            req.body.territory_id = null; // Cámbialo a null para la base de datos
        } else if (value && !Number.isInteger(parseInt(value))) { // Si no es vacío pero tampoco un número válido
            throw new Error('El ID de territorio debe ser un número entero o estar vacío.');
        }
        return true;
    }),
];


// Crea un nuevo gatito en la base de datos, incluyendo validación.
exports.createCat = async (req, res) => {
    // 1. Validar los datos de entrada
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log('[Controller] Errores de validación al crear gatito:', errors.array());
        // Si hay errores, re-renderiza el formulario con los datos antiguos y los mensajes de error
        try {
            const clans = await Clan.getAll();
            const territories = await Territory.getAll();
            return res.render('cats/form', {
                title: 'Nuevo Gatito',
                cat: req.body, // Mantiene los datos que el usuario ingresó
                clans,
                territories,
                errors: errors.array() // Pasa los errores a la vista
            });
        } catch (err) {
            console.error('Error al recuperar datos para re-renderizar formulario de creación:', err);
            return res.status(500).render('error', {
                title: 'Error del servidor',
                message: 'Error al procesar el formulario. Por favor, inténtalo de nuevo.',
            });
        }
    }

    // Si la validación pasa, procede con la creación
    try {
        console.log('[Controller] Intentando crear gatito con datos:', req.body);
        await Cat.create(req.body);
        console.log('[Controller] Gatito creado exitosamente. Redirigiendo...');
        res.redirect('/gatitos');
    } catch (err) {
        console.error('Error detallado al crear el gatito:', err);
        // Manejo específico del error de clave foránea si se desea un mensaje más amigable
        if (err.code === 'ER_NO_REFERENCED_ROW_2') {
            return res.status(400).render('error', {
                title: 'Error de Datos',
                message: 'El ID de territorio o clan seleccionado no es válido o no existe. Por favor, verifica tus selecciones.',
                isErrorPage: true
            });
        }
        res.status(500).render('error', {
            title: 'Error del servidor',
            message: 'No pudimos crear el gatito. Por favor, revisa los datos e inténtalo de nuevo.',
        });
    }
};

// Muestra el formulario para editar un gatito existente.
exports.showEditCat = async (req, res) => {
    try {
        const catId = req.params.id;
        console.log(`[Controller] Buscando gatito con ID: ${catId} para edición.`);
        const cat = await Cat.getById(catId);

        if (!cat) {
            console.warn(`[Controller] Gatito con ID: ${catId} no encontrado para edición.`);
            return res.status(404).render('404', {
                title: 'Gatito no encontrado',
                message: 'El gatito que intentas editar no existe en NullCatia.',
            });
        }

        const clans = await Clan.getAll();
        const territories = await Territory.getAll();
        res.render('cats/form', {
            title: 'Editar Gatito',
            cat,
            clans,
            territories,
            errors: [] // Inicializa errores como un array vacío para la primera carga
        });
    } catch (err) {
        console.error('Error detallado al buscar el gatito para edición:', err);
        res.status(500).render('error', {
            title: 'Error del servidor',
            message: 'No pudimos cargar los detalles del gatito para edición. Por favor, inténtalo de nuevo más tarde.',
        });
    }
};

// Actualiza un gatito existente en la base de datos, incluyendo validación.
exports.updateCat = async (req, res) => {
    const catId = req.params.id;

    // 1. Validar los datos de entrada
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log('[Controller] Errores de validación al actualizar gatito:', errors.array());
        // Si hay errores, re-renderiza el formulario con los datos antiguos y los mensajes de error
        try {
            const clans = await Clan.getAll();
            const territories = await Territory.getAll();
            // Asegúrate de pasar el 'id' del gatito para que el formulario sepa que es una edición
            return res.render('cats/form', {
                title: 'Editar Gatito',
                cat: { id: catId, ...req.body }, // Combina el ID con los datos enviados
                clans,
                territories,
                errors: errors.array()
            });
        } catch (err) {
            console.error('Error al recuperar datos para re-renderizar formulario de actualización:', err);
            return res.status(500).render('error', {
                title: 'Error del servidor',
                message: 'Error al procesar el formulario de actualización. Por favor, inténtalo de nuevo.',
            });
        }
    }

    // Si la validación pasa, procede con la actualización
    try {
        console.log(`[Controller] Intentando actualizar gatito con ID: ${catId} y datos:`, req.body);

        const updateResult = await Cat.update(catId, req.body);

        if (!updateResult || updateResult.affectedRows === 0) {
            console.warn(`[Controller] No se actualizó ningún gatito con ID: ${catId}. Puede que el ID no exista o no hubo cambios.`);
            return res.status(404).render('404', {
                title: 'Gatito no encontrado',
                message: 'El gatito que intentaste actualizar no fue encontrado o no se realizaron cambios.',
            });
        }

        console.log(`[Controller] Gatito con ID: ${catId} actualizado exitosamente. Filas afectadas: ${updateResult.affectedRows}`);
        res.redirect('/gatitos');
    } catch (err) {
        console.error('Error detallado al actualizar el gatito:', err);
         // Manejo específico del error de clave foránea si se desea un mensaje más amigable
         if (err.code === 'ER_NO_REFERENCED_ROW_2') {
            return res.status(400).render('error', {
                title: 'Error de Datos',
                message: 'El ID de territorio o clan seleccionado no es válido o no existe. Por favor, verifica tus selecciones.',
                isErrorPage: true
            });
        }
        res.status(500).render('error', {
            title: 'Error del servidor',
            message: 'Hubo un error interno al intentar actualizar el gatito. Por favor, revisa los logs del servidor.',
            isErrorPage: true
        });
    }
};

// Elimina un gatito de la base de datos.
exports.deleteCat = async (req, res) => {
    try {
        const catId = req.params.id;
        console.log(`[Controller] Intentando eliminar gatito con ID: ${catId}.`);
        // Verifica si el gatito existe antes de intentar eliminarlo

        const deleteResult = await Cat.delete(catId);

        // Si no se eliminó ningún gatito, puede que el ID no exista
        if (!deleteResult || deleteResult.affectedRows === 0) {
            console.warn(`[Controller] No se eliminó ningún gatito con ID: ${catId}. Puede que el ID no exista.`);
            return res.status(404).render('404', {
                title: 'Gatito no encontrado',
                message: 'El gatito que intentaste eliminar no fue encontrado.',
            });
        }

        console.log(`[Controller] Gatito con ID: ${catId} eliminado exitosamente. Filas afectadas: ${deleteResult.affectedRows}`);
        res.redirect('/gatitos'); // Redirige a la lista de gatitos después de eliminar
    } catch (err) {
        console.error('Error detallado al eliminar el gatito:', err); // Log detallado del error
        // Manejo específico del error de clave foránea si se desea un mensaje más amigable
        if (err.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(400).render('error', {
                title: 'Error de Integridad',
                message: 'No se puede eliminar el gatito porque está asociado a otros datos (ej. pergaminos o scrolls).',
                isErrorPage: true 
            });
        }
        res.status(500).render('error', {
            title: 'Error del servidor',
            message: 'Hubo un error interno al intentar eliminar el gatito. Por favor, revisa los logs del servidor.',
            isErrorPage: true
        });
    }
};