const Scroll = require('../models/scrollModel');

exports.listScrolls = async (req, res) => {
    try {
        console.log('[Controller] Intentando listar pergaminos...');
        const scrolls = await Scroll.getAll();
        console.log(`[Controller] Se encontraron ${scrolls.length} pergaminos.`);
        res.render('scrolls/list', { scrolls, title: 'Lista de Pergaminos' });
    } catch (err) {
        console.error('Error detallado al listar los pergaminos:', err);
        res.status(500).send('Error al listar los pergaminos: ' + err.message);
    }
};

exports.showScrollForm = (req, res) => {
    try {
        console.log('[Controller] Mostrando formulario para nuevo pergamino.');
        res.render('scrolls/form', { title: 'Nuevo Pergamino', scroll: {} });
    } catch (err) {
        console.error('Error al mostrar el formulario de nuevo pergamino:', err);
        res.status(500).send('Error al cargar el formulario del pergamino: ' + err.message);
    }
};

exports.createScroll = async (req, res) => {
    try {
        console.log('[Controller] Intentando crear pergamino con datos:', req.body);
        let { title, content, cat_id } = req.body;
        if (cat_id === '' || isNaN(parseInt(cat_id))) {
            cat_id = null;
            console.log('[Controller] cat_id es nulo o inválido, se establecerá a null.');
        } else {
            cat_id = parseInt(cat_id);
            console.log(`[Controller] cat_id válido: ${cat_id}`);
        }
        await Scroll.create({ title, content, cat_id });
        console.log('[Controller] Pergamino creado exitosamente. Redirigiendo...');
        res.redirect('/scrolls');
    } catch (err) {
        console.error('Error al crear el pergamino:', err);
        res.status(500).send('Error al crear el pergamino: ' + err.message);
    }
};

exports.showEditScroll = async (req, res) => {
    try {
        const scrollId = req.params.id;
        console.log(`[Controller] Buscando pergamino con ID: ${scrollId} para edición.`);
        const scroll = await Scroll.getById(scrollId);
        if (!scroll) {
            console.warn(`[Controller] Pergamino con ID: ${scrollId} no encontrado para edición.`);
            return res.status(404).render('404', { title: 'Pergamino no encontrado' });
        }
        res.render('scrolls/form', { title: 'Editar Pergamino', scroll });
    } catch (err) {
        console.error('Error al buscar el pergamino para edición:', err);
        res.status(500).send('Error al buscar el pergamino: ' + err.message);
    }
};

exports.updateScroll = async (req, res) => {
    try {
        const scrollId = req.params.id;
        console.log(`[Controller] Inicia updateScroll para ID: ${scrollId} con datos:`, req.body);
        let { title, content, cat_id } = req.body;
        if (cat_id === '' || isNaN(parseInt(cat_id))) {
            cat_id = null;
            console.log('[Controller] cat_id es nulo o inválido, se establecerá a null para actualización.');
        } else {
            cat_id = parseInt(cat_id);
            console.log(`[Controller] cat_id válido para actualización: ${cat_id}`);
        }
        const updateResult = await Scroll.update(scrollId, { title, content, cat_id });
        
        if (updateResult && updateResult.affectedRows > 0) {
            console.log(`[Controller] Pergamino con ID: ${scrollId} actualizado exitosamente. Filas afectadas: ${updateResult.affectedRows}`);
            res.redirect('/scrolls');
        } else {
            console.warn(`[Controller] No se actualizó ningún pergamino con ID: ${scrollId}. Puede que el ID no exista o no hubo cambios.`);
            res.status(404).send('Pergamino no encontrado o no se pudo actualizar.');
        }
    } catch (err) {
        console.error('Error al actualizar el pergamino:', err);
        res.status(500).send('Error al actualizar el pergamino: ' + err.message);
    }
};

// Función deleteScroll con logs de depuración
exports.deleteScroll = async (req, res) => {
    try {
        const scrollId = req.params.id;
        console.log(`[Controller] Inicia deleteScroll para ID: ${scrollId}`); // Log de entrada al controlador

        if (!scrollId) {
            console.error('[Controller] Error: ID del pergamino no proporcionado para eliminar.');
            return res.status(400).send('ID del pergamino no proporcionado para eliminar.');
        }

        const deleteResult = await Scroll.delete(scrollId);
        
        if (deleteResult && deleteResult.affectedRows > 0) {
            console.log(`[Controller] Pergamino con ID: ${scrollId} eliminado exitosamente. Filas afectadas: ${deleteResult.affectedRows}`);
            res.redirect('/scrolls');
        } else {
            console.warn(`[Controller] No se eliminó ningún pergamino con ID: ${scrollId}. Puede que el ID no exista.`);
            res.status(404).send('Pergamino no encontrado o no se pudo eliminar.');
        }
        
    } catch (err) {
        console.error('[Controller] ERROR en deleteScroll:', err); // Log el error completo
        res.status(500).send('Error al eliminar el pergamino: ' + err.message);
    }
};