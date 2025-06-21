const Territory = require('../models/territoryModel'); // Asegúrate de que la ruta al modelo sea correcta

// Constantes para paginación
const ITEMS_PER_PAGE = 5; // Define cuántos territorios mostrar por página

exports.listTerritories = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const searchTerm = req.query.search ? req.query.search.trim() : ''; // Elimina espacios en blanco
        const offset = (page - 1) * ITEMS_PER_PAGE;

        let territories;
        let totalTerritories;

        console.log(`[Controller] Intentando listar territorios. Búsqueda: '${searchTerm}', Página: ${page}`);

        if (searchTerm) {
            // Si hay un término de búsqueda
            const countResult = await Territory.countSearchResults(searchTerm);
            totalTerritories = countResult[0].count;
            territories = await Territory.searchByNamePaginated(searchTerm, ITEMS_PER_PAGE, offset);
        } else {
            // Si no hay término de búsqueda (listar todos)
            const countResult = await Territory.countAll();
            totalTerritories = countResult[0].count;
            territories = await Territory.getAllPaginated(ITEMS_PER_PAGE, offset);
        }

        const totalPages = Math.ceil(totalTerritories / ITEMS_PER_PAGE);

        console.log(`[Controller] Se encontraron ${territories.length} territorios en la página ${page}. Total: ${totalTerritories}.`);

        res.render('territories/list', {
            territories,
            title: 'Lista de Territorios',
            currentPage: page,
            totalPages,
            searchTerm,
            totalItems: totalTerritories // Añadimos esto para depuración o información en la vista
        });
    } catch (err) {
        console.error('[Controller] Error al listar los territorios:', err);
        res.status(500).send('Error al listar los territorios: ' + err.message);
    }
};
// Muestra el formulario para crear un nuevo territorio
exports.showTerritoryForm = (req, res) => {
    try {
        console.log('[Controller] Mostrando formulario para nuevo territorio.');
        res.render('territories/form', {
            title: 'Nuevo Territorio',
            territory: {},
            errors: {} // Para mensajes de validación
        });
    } catch (err) {
        console.error('[Controller] Error al mostrar el formulario de nuevo territorio:', err);
        res.status(500).send('Error al cargar el formulario de territorio: ' + err.message);
    }
};
// Crea un nuevo territorio
exports.createTerritory = async (req, res) => {
    try {
        const { name, description } = req.body;
        const errors = {};

        // Validaciones
        if (!name || name.trim() === '') {
            errors.name = 'El nombre del territorio no puede estar vacío.';
        } else if (name.trim().length > 100) {
            errors.name = 'El nombre no puede exceder los 100 caracteres.';
        }
        if (description && description.length > 500) {
            errors.description = 'La descripción no puede exceder los 500 caracteres.';
        }

        if (Object.keys(errors).length > 0) {
            console.warn('[Controller] Errores de validación al crear territorio:', errors);
            return res.render('territories/form', {
                title: 'Nuevo Territorio',
                territory: { name, description }, // Para prellenar el formulario
                errors
            });
        }

        console.log('[Controller] Intentando crear territorio con datos:', { name, description });
        await Territory.create({ name: name.trim(), description: description ? description.trim() : null });
        console.log('[Controller] Territorio creado exitosamente. Redirigiendo...');
        // Mensaje flash eliminado para evitar TypeError
        res.redirect('/territorios');
    } catch (err) {
        console.error('[Controller] Error al crear el territorio:', err);
        // Mensaje flash eliminado para evitar TypeError
        res.status(500).send('Error al crear el territorio: ' + err.message);
    }
};
// Muestra el formulario para editar un territorio existente
exports.showEditTerritory = async (req, res) => {
    try {
        const territoryId = req.params.id;
        console.log(`[Controller] Buscando territorio con ID: ${territoryId} para edición.`);
        const territory = await Territory.getById(territoryId);
        if (!territory) {
            console.warn(`[Controller] Territorio con ID: ${territoryId} no encontrado para edición.`);
            // Mensaje flash eliminado para evitar TypeError
            return res.status(404).send('Territorio no encontrado.'); // Envía un mensaje simple
        }
        res.render('territories/form', {
            title: 'Editar Territorio',
            territory,
            errors: {} // Sin errores al cargar por primera vez
        });
    } catch (err) {
        console.error('[Controller] Error al buscar el territorio para edición:', err);
        // Mensaje flash eliminado para evitar TypeError
        res.status(500).send('Error al cargar el territorio para edición: ' + err.message);
    }
};

// Actualiza un territorio existente
exports.updateTerritory = async (req, res) => {
    try {
        const territoryId = req.params.id;
        const { name, description } = req.body;
        const errors = {};

        // Validaciones
        if (!name || name.trim() === '') {
            errors.name = 'El nombre del territorio no puede estar vacío.';
        } else if (name.trim().length > 100) {
            errors.name = 'El nombre no puede exceder los 100 caracteres.';
        }
        if (description && description.length > 500) {
            errors.description = 'La descripción no puede exceder los 500 caracteres.';
        }

        if (Object.keys(errors).length > 0) {
            console.warn(`[Controller] Errores de validación al actualizar territorio ID: ${territoryId}:`, errors);
            return res.render('territories/form', {
                title: 'Editar Territorio',
                territory: { id: territoryId, name, description }, // Pasa el ID para la acción del formulario
                errors
            });
        }

        console.log(`[Controller] Inicia updateTerritory para ID: ${territoryId} con datos:`, { name, description });
        const updateResult = await Territory.update(territoryId, { name: name.trim(), description: description ? description.trim() : null });

        if (updateResult && updateResult.affectedRows > 0) {
            console.log(`[Controller] Territorio con ID: ${territoryId} actualizado exitosamente. Filas afectadas: ${updateResult.affectedRows}`);
            // Mensaje flash eliminado para evitar TypeError
            res.redirect('/territorios');
        } else {
            console.warn(`[Controller] No se actualizó ningún territorio con ID: ${territoryId}. Puede que el ID no exista o no hubo cambios.`);
            // Mensaje flash eliminado para evitar TypeError
            res.status(404).send('Territorio no encontrado o no se pudo actualizar.');
        }

    } catch (err) {
        console.error('[Controller] ERROR al actualizar el territorio:', err);
        // Mensaje flash eliminado para evitar TypeError
        res.status(500).send('Error al actualizar el territorio: ' + err.message);
    }
};

exports.deleteTerritory = async (req, res) => {
    try {
        const territoryId = req.params.id;
        console.log(`[Controller] Inicia deleteTerritory para ID: ${territoryId}`);

        if (!territoryId) {
            console.error('[Controller] Error: ID del territorio no proporcionado para eliminar.');
            // Mensaje flash eliminado para evitar TypeError
            return res.status(400).send('ID del territorio no proporcionado para eliminar.');
        }

        const deleteResult = await Territory.delete(territoryId);

        if (deleteResult && deleteResult.affectedRows > 0) {
            console.log(`[Controller] Territorio con ID: ${territoryId} eliminado exitosamente. Filas afectadas: ${deleteResult.affectedRows}`);
            // Mensaje flash eliminado para evitar TypeError
            res.redirect('/territorios');
        } else {
            console.warn(`[Controller] No se eliminó ningún territorio con ID: ${territoryId}. Puede que el ID no exista o no tenga permisos.`);
            // Mensaje flash eliminado para evitar TypeError
            res.status(404).send('Territorio no encontrado o no se pudo eliminar.');
        }

    } catch (err) {
        console.error('[Controller] ERROR al eliminar el territorio:', err);
        if (err.code === 'ER_ROW_IS_REFERENCED_2') {
            // Mensaje flash eliminado para evitar TypeError
            res.status(409).send('No se puede eliminar el territorio porque tiene gatitos asociados. Por favor, reasigna o elimina los gatitos primero.');
        } else {
            // Mensaje flash eliminado para evitar TypeError
            res.status(500).send('Error al eliminar el territorio: ' + err.message);
        }
    }
};