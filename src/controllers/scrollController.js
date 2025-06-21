const Scroll = require('../models/scrollModel');
const Cat = require('../models/catModel'); // Necesario para el dropdown de cat_id en el formulario
const { validationResult } = require('express-validator'); // Importa validationResult para las validaciones

// Definir la cantidad de elementos por página para la paginación
const ITEMS_PER_PAGE = 5; 

//Muestra la lista de pergaminos, con paginación y búsqueda por título
exports.listScrolls = async (req, res) => {
    const searchTerm = req.query.search; // Término de búsqueda desde la URL (para el título del pergamino)
    const page = parseInt(req.query.page) || 1; // Número de página actual, por defecto 1
    const offset = (page - 1) * ITEMS_PER_PAGE; // Cálculo del offset para la consulta SQL

    try {
        console.log(`[Controller] Intentando listar pergaminos. Búsqueda: '${searchTerm || 'N/A'}', Página: ${page}`);

        let scrolls;
        let totalScrolls;
        let countResult; // Declarar countResult aquí

        if (searchTerm) {
            // Si hay un término de búsqueda, obtenemos el conteo y los pergaminos filtrados
            countResult = await Scroll.countSearchResults(searchTerm);
            console.log("DEBUG: countResult for search (scrolls):", countResult); // Para depuración
            totalScrolls = countResult[0].count;
            scrolls = await Scroll.searchByTitlePaginated(searchTerm, ITEMS_PER_PAGE, offset);
            console.log(`[Controller] Se encontraron ${scrolls.length} pergaminos para la búsqueda '${searchTerm}'. Total: ${totalScrolls}.`);
        } else {
            // Si no hay término de búsqueda, obtenemos el conteo total y todos los pergaminos paginados
            countResult = await Scroll.countAll();
            console.log("DEBUG: countResult for all (scrolls):", countResult); // Para depuración
            totalScrolls = countResult[0].count;
            scrolls = await Scroll.getAllPaginated(ITEMS_PER_PAGE, offset);
            console.log(`[Controller] Se encontraron ${scrolls.length} pergaminos en la página ${page}. Total: ${totalScrolls}.`);
        }

        const totalPages = Math.ceil(totalScrolls / ITEMS_PER_PAGE); // Calcula el total de páginas

        res.render('scrolls/list', {
            scrolls,
            title: 'Lista de Pergaminos',
            searchTerm: searchTerm || '', // Pasa el término de búsqueda para mantenerlo en el input
            currentPage: page,          // Pasa la página actual a la vista
            totalPages: totalPages,     // Pasa el total de páginas a la vista
            itemsPerPage: ITEMS_PER_PAGE // Puede ser útil para mostrar información al usuario
        });
    } catch (err) {
        console.error('Error detallado al listar los pergaminos:', err);
        // Renderiza una vista de error 500 en lugar de solo enviar texto
        res.status(500).render('error', {
            title: 'Error del servidor',
            message: 'No pudimos cargar la lista de pergaminos. Por favor, inténtalo de nuevo más tarde.',
        });
    }
};

//Muestra el formulario para crear un nuevo pergamino
//También se utiliza para re-renderizar el formulario en caso de errores de validación
exports.showScrollForm = async (req, res) => {
    try {
        console.log('[Controller] Mostrando formulario para nuevo pergamino.');
        const cats = await Cat.getAll(); // Necesario para el dropdown de cat_id
        res.render('scrolls/form', {
            title: 'Nuevo Pergamino',
            scroll: {}, // Objeto vacío para un formulario nuevo
            cats, // Pasa los gatitos a la vista
            errors: [] // Inicializa errores como un array vacío para la primera carga
        });
    } catch (err) {
        console.error('Error al mostrar el formulario de nuevo pergamino:', err);
        res.status(500).render('error', {
            title: 'Error del servidor',
            message: 'No pudimos cargar el formulario para crear un pergamino. Por favor, inténtalo de nuevo más tarde.',
        });
    }
};

//Crea un nuevo pergamino en la base de datos, incluyendo validación
exports.createScroll = async (req, res) => {
    // 1. Validar los datos de entrada
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log('[Controller] Errores de validación al crear pergamino:', errors.array());
        // Si hay errores, re-renderiza el formulario con los datos antiguos y los mensajes de error
        try {
            const cats = await Cat.getAll(); // Vuelve a obtener los gatos para el dropdown
            return res.render('scrolls/form', {
                title: 'Nuevo Pergamino',
                scroll: req.body, // Mantiene los datos que el usuario ingresó
                cats,
                errors: errors.array() // Pasa los errores a la vista
            });
        } catch (err) {
            console.error('Error al recuperar datos para re-renderizar formulario de creación de pergamino:', err);
            return res.status(500).render('error', {
                title: 'Error del servidor',
                message: 'Error al procesar el formulario. Por favor, inténtalo de nuevo.',
            });
        }
    }

    // Si la validación pasa, procede con la creación
    try {
        console.log('[Controller] Intentando crear pergamino con datos:', req.body);
        let { title, content, cat_id } = req.body;
        // La validación en routes/scrollRoutes.js ya debería manejar si es entero o nulo.
        // Aquí solo nos aseguramos de que sea null si viene vacío, por seguridad.
        if (cat_id === '' || cat_id === undefined) {
             cat_id = null;
        } else {
             cat_id = parseInt(cat_id); // Convertir a entero si no es nulo
        }

        await Scroll.create({ title, content, cat_id });
        console.log('[Controller] Pergamino creado exitosamente. Redirigiendo...');
        // Considera usar mensajes flash aquí en el futuro para feedback al usuario
        res.redirect('/scrolls');
    } catch (err) {
        console.error('Error al crear el pergamino:', err);
        res.status(500).render('error', {
            title: 'Error del servidor',
            message: 'No pudimos crear el pergamino. Por favor, revisa los datos e inténtalo de nuevo.',
        });
    }
};

//Muestra el formulario para editar un pergamino existente
//También se utiliza para re-renderizar el formulario en caso de errores de validación
exports.showEditScroll = async (req, res) => {
    try {
        const scrollId = req.params.id;
        console.log(`[Controller] Buscando pergamino con ID: ${scrollId} para edición.`);
        const scroll = await Scroll.getById(scrollId);

        if (!scroll) {
            console.warn(`[Controller] Pergamino con ID: ${scrollId} no encontrado para edición.`);
            return res.status(404).render('404', {
                title: 'Pergamino no encontrado',
                message: 'El pergamino que intentas editar no existe en NullCatia.',
            });
        }
        const cats = await Cat.getAll(); // Necesario para el dropdown de cat_id
        res.render('scrolls/form', {
            title: 'Editar Pergamino',
            scroll,
            cats, // Pasa los gatitos a la vista
            errors: [] // Inicializa errores como un array vacío para la primera carga
        });
    } catch (err) {
        console.error('Error al buscar el pergamino para edición:', err);
        res.status(500).render('error', {
            title: 'Error del servidor',
            message: 'No pudimos cargar los detalles del pergamino para edición. Por favor, inténtalo de nuevo más tarde.',
        });
    }
};

//Actualiza un pergamino existente en la base de datos, incluyendo validación
exports.updateScroll = async (req, res) => {
    const scrollId = req.params.id;

    // 1. Validar los datos de entrada
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log('[Controller] Errores de validación al actualizar pergamino:', errors.array());
        // Si hay errores, re-renderiza el formulario con los datos antiguos y los mensajes de error
        try {
            const cats = await Cat.getAll(); // Vuelve a obtener los gatos para el dropdown
            return res.render('scrolls/form', {
                title: 'Editar Pergamino',
                scroll: { id: scrollId, ...req.body }, // Combina el ID con los datos enviados
                cats,
                errors: errors.array()
            });
        } catch (err) {
            console.error('Error al recuperar datos para re-renderizar formulario de actualización de pergamino:', err);
            return res.status(500).render('error', {
                title: 'Error del servidor',
                message: 'Error al procesar el formulario de actualización. Por favor, inténtalo de nuevo.',
            });
        }
    }

    // Si la validación pasa, procede con la actualización
    try {
        console.log(`[Controller] Inicia updateScroll para ID: ${scrollId} con datos:`, req.body);
        let { title, content, cat_id } = req.body;
        // La validación en routes/scrollRoutes.js ya debería manejar si es entero o nulo.
        if (cat_id === '' || cat_id === undefined) {
             cat_id = null;
        } else {
             cat_id = parseInt(cat_id); // Convertir a entero si no es nulo
        }

        const updateResult = await Scroll.update(scrollId, { title, content, cat_id });

        if (updateResult && updateResult.affectedRows > 0) {
            console.log(`[Controller] Pergamino con ID: ${scrollId} actualizado exitosamente. Filas afectadas: ${updateResult.affectedRows}`);
            res.redirect('/scrolls');
        } else {
            console.warn(`[Controller] No se actualizó ningún pergamino con ID: ${scrollId}. Puede que el ID no exista o no hubo cambios.`);
            res.status(404).render('404', {
                title: 'Pergamino no encontrado',
                message: 'El pergamino que intentaste actualizar no fue encontrado o no se realizaron cambios.',
            });
        }
    } catch (err) {
        console.error('Error al actualizar el pergamino:', err);
        res.status(500).render('error', {
            title: 'Error del servidor',
            message: 'Hubo un error interno al intentar actualizar el pergamino. Por favor, revisa los logs del servidor.',
            isErrorPage: true
        });
    }
};

// Elimina un pergamino de la base de datos
exports.deleteScroll = async (req, res) => {
    try {
        const scrollId = req.params.id;
        console.log(`[Controller] Inicia deleteScroll para ID: ${scrollId}`);

        if (!scrollId) { // Verifica si se proporcionó un ID
            console.error('[Controller] Error: ID del pergamino no proporcionado para eliminar.');
            return res.status(400).render('error', {
                title: 'Error de Solicitud',
                message: 'ID del pergamino no proporcionado para eliminar.',
            });
        }

        const deleteResult = await Scroll.delete(scrollId);

        if (deleteResult && deleteResult.affectedRows > 0) { // Verifica si se eliminó al menos un pergamino
            console.log(`[Controller] Pergamino con ID: ${scrollId} eliminado exitosamente. Filas afectadas: ${deleteResult.affectedRows}`);
            res.redirect('/scrolls');
        } else {
            console.warn(`[Controller] No se eliminó ningún pergamino con ID: ${scrollId}. Puede que el ID no exista.`);
            res.status(404).render('404', {
                title: 'Pergamino no encontrado',
                message: 'El pergamino que intentaste eliminar no fue encontrado o no se pudo eliminar.',
            });
        }

    } catch (err) {
        console.error('[Controller] ERROR en deleteScroll:', err);
        // Aunque Scroll.cat_id es SET NULL, es buena práctica mantener este manejo genérico.
        // Si hubiera otras relaciones RESTRICT, aquí se capturaría el error.
        if (err.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(400).render('error', {
                title: 'Error de Integridad',
                message: 'No se puede eliminar el pergamino porque está referenciado en otro lugar (ej. tabla cat_parchment).',
                isErrorPage: true
            });
        }
        res.status(500).render('error', {
            title: 'Error del servidor',
            message: 'Hubo un error interno al intentar eliminar el pergamino. Por favor, revisa los logs del servidor.',
            isErrorPage: true
        });
    }
};
