const Territory = require('../models/territoryModel');

exports.listTerritories = async (req, res) => {
    try {
        console.log('[Controller] Intentando listar territorios...');
        const territories = await Territory.getAll();
        console.log(`[Controller] Se encontraron ${territories.length} territorios.`);
        res.render('territories/list', { territories, title: 'Lista de Territorios' });
    } catch (err) {
        console.error('[Controller] Error al listar los territorios:', err);
        res.status(500).send('Error al listar los territorios: ' + err.message);
    }
};

exports.showTerritoryForm = (req, res) => {
    try {
        console.log('[Controller] Mostrando formulario para nuevo territorio.');
        // Aseguramos que 'territory' se pase vacío para que EJS no intente acceder a propiedades inexistentes
        res.render('territories/form', { title: 'Nuevo Territorio', territory: {} }); 
    } catch (err) {
        console.error('[Controller] Error al mostrar el formulario de nuevo territorio:', err);
        res.status(500).send('Error al cargar el formulario de territorio: ' + err.message);
    }
};

exports.createTerritory = async (req, res) => {
    try {
        // Si solo se espera name y description desde el formulario
        const { name, description } = req.body;
        console.log('[Controller] Intentando crear territorio con datos:', { name, description });
        await Territory.create({ name, description }); // Enviamos solo los datos relevantes
        console.log('[Controller] Territorio creado exitosamente. Redirigiendo...');
        res.redirect('/territorios');
    } catch (err) {
        console.error('[Controller] Error al crear el territorio:', err);
        res.status(500).send('Error al crear el territorio: ' + err.message);
    }
};

exports.showEditTerritory = async (req, res) => {
    try {
        const territoryId = req.params.id;
        console.log(`[Controller] Buscando territorio con ID: ${territoryId} para edición.`);
        const territory = await Territory.getById(territoryId);
        if (!territory) {
            console.warn(`[Controller] Territorio con ID: ${territoryId} no encontrado para edición.`);
            return res.status(404).render('404', { title: 'Territorio no encontrado' });
        }
        res.render('territories/form', { title: 'Editar Territorio', territory });
    } catch (err) {
        console.error('[Controller] Error al buscar el territorio para edición:', err);
        res.status(500).send('Error al buscar el territorio: ' + err.message);
    }
};

exports.updateTerritory = async (req, res) => {
    try {
        const territoryId = req.params.id;
        const { name, description } = req.body;
        console.log(`[Controller] Inicia updateTerritory para ID: ${territoryId} con datos:`, { name, description });
        const updateResult = await Territory.update(territoryId, { name, description }); // Enviamos solo los datos relevantes
        
        if (updateResult && updateResult.affectedRows > 0) {
            console.log(`[Controller] Territorio con ID: ${territoryId} actualizado exitosamente. Filas afectadas: ${updateResult.affectedRows}`);
            res.redirect('/territorios');
        } else {
            console.warn(`[Controller] No se actualizó ningún territorio con ID: ${territoryId}. Puede que el ID no exista o no hubo cambios.`);
            res.status(404).send('Territorio no encontrado o no se pudo actualizar.');
        }

    } catch (err) {
        console.error('[Controller] ERROR al actualizar el territorio:', err);
        res.status(500).send('Error al actualizar el territorio: ' + err.message);
    }
};

exports.deleteTerritory = async (req, res) => {
    try {
        const territoryId = req.params.id;
        console.log(`[Controller] Inicia deleteTerritory para ID: ${territoryId}`);

        if (!territoryId) {
            console.error('[Controller] Error: ID del territorio no proporcionado para eliminar.');
            return res.status(400).send('ID del territorio no proporcionado para eliminar.');
        }

        const deleteResult = await Territory.delete(territoryId);
        
        if (deleteResult && deleteResult.affectedRows > 0) {
            console.log(`[Controller] Territorio con ID: ${territoryId} eliminado exitosamente. Filas afectadas: ${deleteResult.affectedRows}`);
            res.redirect('/territorios');
        } else {
            console.warn(`[Controller] No se eliminó ningún territorio con ID: ${territoryId}. Puede que el ID no exista o no tenga permisos.`);
            res.status(404).send('Territorio no encontrado o no se pudo eliminar.');
        }
        
    } catch (err) {
        console.error('[Controller] ERROR al eliminar el territorio:', err);
        if (err.code === 'ER_ROW_IS_REFERENCED_2') {
            res.status(409).send('No se puede eliminar el territorio porque tiene gatitos asociados. Por favor, reasigna o elimina los gatitos primero.');
        } else {
            res.status(500).send('Error al eliminar el territorio: ' + err.message);
        }
    }
};