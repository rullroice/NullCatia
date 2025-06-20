const Clan = require('../models/clanModel');

/**
 * Muestra la lista de todos los clanes.
 */
exports.listClans = async (req, res) => {
    try {
        console.log('[Controller] Intentando listar clanes...');
        const clans = await Clan.getAll();
        console.log(`[Controller] Se encontraron ${clans.length} clanes.`);
        res.render('clans/list', { clans, title: 'Lista de Clanes' });
    } catch (err) {
        console.error('[Controller] Error detallado al listar los clanes:', err);
        // Envía un error 500 como texto plano si no hay vista de error
        res.status(500).send('Error del servidor: No pudimos cargar la lista de clanes.');
    }
};

/**
 * Muestra el formulario para crear un nuevo clan.
 */
exports.showClanForm = (req, res) => {
    try {
        console.log('[Controller] Mostrando formulario para nuevo clan.');
        res.render('clans/form', { title: 'Nuevo Clan', clan: {} });
    } catch (err) {
        console.error('[Controller] Error al mostrar el formulario de nuevo clan:', err);
        // Envía un error 500 como texto plano
        res.status(500).send('Error del servidor: No pudimos cargar el formulario para crear un clan.');
    }
};

/**
 * Crea un nuevo clan en la base de datos.
 */
exports.createClan = async (req, res) => {
    try {
        console.log('[Controller] Intentando crear clan con datos:', req.body);
        await Clan.create(req.body);
        console.log('[Controller] Clan creado exitosamente. Redirigiendo...');
        res.redirect('/clanes');
        return; // Detener la ejecución después de la redirección
    } catch (err) {
        console.error('[Controller] Error detallado al crear el clan:', err);
        // Envía un error 500 como texto plano
        res.status(500).send('Error del servidor: No pudimos crear el clan.');
        return; // Detener la ejecución
    }
};

/**
 * Muestra el formulario para editar un clan existente.
 */
exports.showEditClan = async (req, res) => {
    try {
        const clanId = req.params.id;
        console.log(`[Controller] Buscando clan con ID: ${clanId} para edición.`);
        const clan = await Clan.getById(clanId);

        if (!clan) {
            console.warn(`[Controller] Clan con ID: ${clanId} no encontrado para edición.`);
            // Si 404.ejs tampoco existe, esto también fallará. Considera cambiar a .send()
            // Pero por ahora, mantenemos el 404.ejs si ya lo tienes y funciona.
            return res.status(404).render('404', {
                title: 'Clan no encontrado',
                message: 'El clan que intentas editar no existe.',
            });
        }
        res.render('clans/form', { title: 'Editar Clan', clan });
    } catch (err) {
        console.error('[Controller] Error detallado al buscar el clan para edición:', err);
        // Envía un error 500 como texto plano
        res.status(500).send('Error del servidor: No pudimos cargar los detalles del clan para edición.');
        return; // Detener la ejecución
    }
};

/**
 * Actualiza un clan existente en la base de datos.
 */
exports.updateClan = async (req, res) => {
    try {
        const clanId = req.params.id;
        console.log(`[Controller] Inicia updateClan para ID: ${clanId} con datos:`, req.body);
        const updateResult = await Clan.update(clanId, req.body);
        
        // Si updateResult es nulo/falso o su affectedRows es 0,
        // el clan no fue encontrado o no hubo cambios.
        if (!updateResult || updateResult.affectedRows === 0) {
            console.warn(`[Controller] No se actualizó ningún clan con ID: ${clanId}. Puede que el ID no exista o no hubo cambios.`);
            // Si 404.ejs tampoco existe, esto también fallará. Considera cambiar a .send()
            res.status(404).render('404', {
                title: 'Clan no encontrado',
                message: 'El clan que intentaste actualizar no fue encontrado o no se realizaron cambios.',
            });
            return; // Detener la ejecución aquí
        }

        // Si llegamos a este punto, la actualización fue exitosa.
        console.log(`[Controller] Clan con ID: ${clanId} actualizado exitosamente. Filas afectadas: ${updateResult.affectedRows}`);
        res.redirect('/clanes'); // Redirige a la lista de clanes.
        return; // Detener la ejecución después de la redirección
    } catch (err) {
        console.error('[Controller] ERROR detallado al actualizar el clan:', err);
        // Envía un error 500 como texto plano
        res.status(500).send('Error del servidor: Hubo un error interno al intentar actualizar el clan.');
        return;
    }
};

/**
 * Elimina un clan de la base de datos.
 */
exports.deleteClan = async (req, res) => {
    try {
        const clanId = req.params.id;
        console.log(`[Controller] Inicia deleteClan para ID: ${clanId}`);

        if (!clanId) {
            console.error('[Controller] Error: ID del clan no proporcionado para eliminar.');
            // Envía un error 400 como texto plano
            return res.status(400).send('Error de solicitud: El ID del clan no fue proporcionado para eliminarlo.');
        }

        const deleteResult = await Clan.delete(clanId);
        
        // Si deleteResult es nulo/falso o 0 filas afectadas, el clan no se encontró.
        if (!deleteResult || deleteResult.affectedRows === 0) {
            console.warn(`[Controller] No se eliminó ningún clan con ID: ${clanId}. Puede que el ID no exista.`);
            // Si 404.ejs tampoco existe, esto también fallará. Considera cambiar a .send()
            res.status(404).render('404', {
                title: 'Clan no encontrado',
                message: 'El clan que intentaste eliminar no fue encontrado.',
            });
            return; // Detener la ejecución aquí
        }
        
        // Si llegamos a este punto, la eliminación fue exitosa.
        console.log(`[Controller] Clan con ID: ${clanId} eliminado exitosamente. Filas afectadas: ${deleteResult.affectedRows}`);
        res.redirect('/clanes'); // Redirige a la lista de clanes.
        return; // Detener la ejecución después de la redirección
        
    } catch (err) {
        console.error('[Controller] ERROR detallado al eliminar el clan:', err);
        // Podría ser un error de restricción de clave foránea (ej. si hay gatos asociados a este clan)
        if (err.code === 'ER_ROW_IS_REFERENCED_2') { // Código de error MySQL para FK constraint
            // Envía un error 409 como texto plano
            res.status(409).send('Conflicto: No se puede eliminar el clan porque tiene gatitos asociados. Por favor, reasigna o elimina los gatitos de este clan primero.');
        } else {
            // Envía un error 500 como texto plano
            res.status(500).send('Error del servidor: Hubo un error interno al intentar eliminar el clan.');
        }
        return; // Detener la ejecución
    }
};