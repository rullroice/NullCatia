const Clan = require('../models/clanModel');
const { validationResult } = require('express-validator'); // Importa validationResult para las validaciones

// Definir la cantidad de elementos por página para la paginación
const ITEMS_PER_PAGE = 5;

// Controlador para manejar las operaciones relacionadas con los clanes
exports.listClans = async (req, res) => {
    const searchTerm = req.query.search; // Término de búsqueda desde la URL (para el nombre del clan)
    const page = parseInt(req.query.page) || 1; // Número de página actual, por defecto 1
    const offset = (page - 1) * ITEMS_PER_PAGE; // Cálculo del offset para la consulta SQL

    try {
        console.log(`[Controller] Intentando listar clanes. Búsqueda: '${searchTerm || 'N/A'}', Página: ${page}`);

        let clans;
        let totalClans;
        let countResult; // Declarar countResult aquí

        if (searchTerm) {
            // Si hay un término de búsqueda, obtenemos el conteo y los clanes filtrados
            countResult = await Clan.countSearchResults(searchTerm);
            console.log("DEBUG: countResult for search (clans):", countResult); // Para depuración
            totalClans = countResult[0].count;
            clans = await Clan.searchByNamePaginated(searchTerm, ITEMS_PER_PAGE, offset);
            console.log(`[Controller] Se encontraron ${clans.length} clanes para la búsqueda '${searchTerm}'. Total: ${totalClans}.`);
        } else {
            // Si no hay término de búsqueda, obtenemos el conteo total y todos los clanes paginados
            countResult = await Clan.countAll();
            console.log("DEBUG: countResult for all (clans):", countResult); // Para depuración
            totalClans = countResult[0].count;
            clans = await Clan.getAllPaginated(ITEMS_PER_PAGE, offset);
            console.log(`[Controller] Se encontraron ${clans.length} clanes en la página ${page}. Total: ${totalClans}.`);
        }

        const totalPages = Math.ceil(totalClans / ITEMS_PER_PAGE); // Calcula el total de páginas

        res.render('clans/list', {
            clans,
            title: 'Lista de Clanes',
            searchTerm: searchTerm || '', // Pasa el término de búsqueda para mantenerlo en el input
            currentPage: page,          // Pasa la página actual a la vista
            totalPages: totalPages,     // Pasa el total de páginas a la vista
            itemsPerPage: ITEMS_PER_PAGE // Puede ser útil para mostrar información al usuario
        });
    } catch (err) {
        console.error('[Controller] Error detallado al listar los clanes:', err);
        // Renderiza una vista de error 500 en lugar de solo enviar texto
        res.status(500).render('error', {
            title: 'Error del servidor',
            message: 'No pudimos cargar la lista de clanes. Por favor, inténtalo de nuevo más tarde.',
        });
    }
};

// Controlador para mostrar el formulario de creación de un nuevo clan
exports.showClanForm = (req, res) => {
    try {
        console.log('[Controller] Mostrando formulario para nuevo clan.');
        res.render('clans/form', {
            title: 'Nuevo Clan',
            clan: {}, // Objeto vacío para un formulario nuevo
            errors: [] // Inicializa errores como un array vacío para la primera carga
        });
    } catch (err) {
        console.error('[Controller] Error al mostrar el formulario de nuevo clan:', err);
        res.status(500).render('error', {
            title: 'Error del servidor',
            message: 'No pudimos cargar el formulario para crear un clan. Por favor, inténtalo de nuevo más tarde.',
        });
    }
};

// Crea un nuevo clan en la base de datos, incluyendo validación de los datos de entrada
exports.createClan = async (req, res) => {
    // 1. Validar los datos de entrada
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log('[Controller] Errores de validación al crear clan:', errors.array());
        // Si hay errores, re-renderiza el formulario con los datos antiguos y los mensajes de error
        return res.render('clans/form', {
            title: 'Nuevo Clan',
            clan: req.body, // Mantiene los datos que el usuario ingresó
            errors: errors.array() // Pasa los errores a la vista
        });
    }

    // Si la validación pasa, procede con la creación
    try {
        console.log('[Controller] Intentando crear clan con datos:', req.body);
        await Clan.create(req.body);
        console.log('[Controller] Clan creado exitosamente. Redirigiendo...');
        // Considera usar mensajes flash aquí en el futuro para feedback al usuario
        res.redirect('/clanes');
    } catch (err) {
        console.error('[Controller] Error detallado al crear el clan:', err);
        res.status(500).render('error', {
            title: 'Error del servidor',
            message: 'No pudimos crear el clan. Por favor, revisa los datos e inténtalo de nuevo.',
        });
    }
};

//Muestra el formulario de edición de un clan existente
exports.showEditClan = async (req, res) => {
    try {
        const clanId = req.params.id;
        console.log(`[Controller] Buscando clan con ID: ${clanId} para edición.`);
        const clan = await Clan.getById(clanId);

        if (!clan) {
            console.warn(`[Controller] Clan con ID: ${clanId} no encontrado para edición.`);
            return res.status(404).render('404', {
                title: 'Clan no encontrado',
                message: 'El clan que intentas editar no existe.',
            });
        }
        res.render('clans/form', {
            title: 'Editar Clan',
            clan,
            errors: [] // Inicializa errores como un array vacío para la primera carga
        });
    } catch (err) {
        console.error('[Controller] Error detallado al buscar el clan para edición:', err);
        res.status(500).render('error', {
            title: 'Error del servidor',
            message: 'No pudimos cargar los detalles del clan para edición. Por favor, inténtalo de nuevo más tarde.',
        });
    }
};

// Actualiza un clan existente en la base de datos, incluyendo validación de los datos de entrada
exports.updateClan = async (req, res) => {
    const clanId = req.params.id;

    // 1. Validar los datos de entrada
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log('[Controller] Errores de validación al actualizar clan:', errors.array());
        // Si hay errores, re-renderiza el formulario con los datos antiguos y los mensajes de error
        return res.render('clans/form', {
            title: 'Editar Clan',
            clan: { id: clanId, ...req.body }, // Combina el ID con los datos enviados
            errors: errors.array()
        });
    }

    // Si la validación pasa, procede con la actualización
    try {
        console.log(`[Controller] Inicia updateClan para ID: ${clanId} con datos:`, req.body);
        const updateResult = await Clan.update(clanId, req.body);

        if (!updateResult || updateResult.affectedRows === 0) { // Verifica si se actualizó al menos un clan
            console.warn(`[Controller] No se actualizó ningún clan con ID: ${clanId}. Puede que el ID no exista o no hubo cambios.`);
            res.status(404).render('404', {
                title: 'Clan no encontrado',
                message: 'El clan que intentaste actualizar no fue encontrado o no se realizaron cambios.',
            });
            return;
        }

        console.log(`[Controller] Clan con ID: ${clanId} actualizado exitosamente. Filas afectadas: ${updateResult.affectedRows}`);
        res.redirect('/clanes');
    } catch (err) { // Manejo de errores detallado para la actualización
        console.error('[Controller] ERROR detallado al actualizar el clan:', err);
        res.status(500).render('error', { // Error genérico del servidor
            title: 'Error del servidor',
            message: 'Hubo un error interno al intentar actualizar el clan. Por favor, revisa los logs del servidor.',
            isErrorPage: true
        });
    }
};

// Elimina un clan de la base de datos
exports.deleteClan = async (req, res) => {
    try {
        const clanId = req.params.id;
        console.log(`[Controller] Inicia deleteClan para ID: ${clanId}`);

        if (!clanId) { // Verifica si se proporcionó un ID de clan
            console.error('[Controller] Error: ID del clan no proporcionado para eliminar.');
            return res.status(400).render('error', { // Renderiza una vista de error 400 si no se proporcionó el ID
                title: 'Error de Solicitud',
                message: 'ID del clan no proporcionado para eliminar.',
            });
        }

        const deleteResult = await Clan.delete(clanId);

        if (deleteResult && deleteResult.affectedRows > 0) { // Verifica si se eliminó al menos un clan
            console.log(`[Controller] Clan con ID: ${clanId} eliminado exitosamente. Filas afectadas: ${deleteResult.affectedRows}`);
            res.redirect('/clanes');
        } else {
            console.warn(`[Controller] No se eliminó ningún clan con ID: ${clanId}. Puede que el ID no exista.`);
            res.status(404).render('404', { // Renderiza una vista 404 si no se encontró el clan
                title: 'Clan no encontrado',
                message: 'El clan que intentaste eliminar no fue encontrado o no se pudo eliminar.',
            });
        }
        // Manejo de errores detallado para la eliminación

    } catch (err) {
        console.error('[Controller] ERROR detallado al eliminar el clan:', err);
        if (err.code === 'ER_ROW_IS_REFERENCED_2') { // Error de integridad referencial, el clan tiene gatos asociados
            res.status(409).render('error', {
                title: 'Error de Integridad',
                message: 'No se puede eliminar el clan porque tiene gatos asociados. Por favor, reasigna o elimina los gatos de este clan primero.',
                isErrorPage: true
            });
        } else {
            res.status(500).render('error', { // Error genérico del servidor
                title: 'Error del servidor',
                message: 'Hubo un error interno al intentar eliminar el clan. Por favor, revisa los logs del servidor.',
                isErrorPage: true
            });
        }
    }
};
