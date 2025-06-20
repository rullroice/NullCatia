const Cat = require('../models/catModel');
const Clan = require('../models/clanModel');
const Territory = require('../models/territoryModel');

/**
 * Muestra la lista de todos los gatitos.
 */
exports.listCats = async (req, res) => {
    try {
        console.log('[Controller] Intentando listar gatitos...');
        const cats = await Cat.getAll();
        console.log(`[Controller] Se encontraron ${cats.length} gatitos.`);
        res.render('cats/list', { cats, title: 'Lista de Gatitos' });
    } catch (err) {
        console.error('Error detallado al listar los gatitos:', err);
        // En caso de error, renderiza una vista de error 500
        res.status(500).render('error', {
            title: 'Error del servidor',
            message: 'No pudimos cargar la lista de gatitos. Por favor, inténtalo de nuevo más tarde.',
        });
    }
};

/**
 * Muestra el formulario para crear un nuevo gatito.
 */
exports.showCatForm = async (req, res) => {
    try {
        console.log('[Controller] Mostrando formulario para nuevo gatito.');
        const clans = await Clan.getAll();
        const territories = await Territory.getAll();
        res.render('cats/form', { title: 'Nuevo Gatito', cat: {}, clans, territories });
    } catch (err) {
        console.error('Error detallado al cargar el formulario de gatito:', err);
        // En caso de error, renderiza una vista de error 500
        res.status(500).render('error', {
            title: 'Error del servidor',
            message: 'No pudimos cargar el formulario para crear un gatito. Por favor, inténtalo de nuevo más tarde.',
        });
    }
};

/**
 * Crea un nuevo gatito en la base de datos.
 */
exports.createCat = async (req, res) => {
    try {
        console.log('[Controller] Intentando crear gatito con datos:', req.body);
        await Cat.create(req.body);
        console.log('[Controller] Gatito creado exitosamente. Redirigiendo...');
        res.redirect('/gatitos');
        return; // Detener la ejecución después de la redirección
    } catch (err) {
        console.error('Error detallado al crear el gatito:', err);
        // En caso de error, renderiza una vista de error 500
        res.status(500).render('error', {
            title: 'Error del servidor',
            message: 'No pudimos crear el gatito. Por favor, revisa los datos e inténtalo de nuevo.',
        });
    }
};

/**
 * Muestra el formulario para editar un gatito existente.
 */
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
        res.render('cats/form', { title: 'Editar Gatito', cat, clans, territories });
    } catch (err) {
        console.error('Error detallado al buscar el gatito para edición:', err);
        // En caso de error, renderiza una vista de error 500
        res.status(500).render('error', {
            title: 'Error del servidor',
            message: 'No pudimos cargar los detalles del gatito para edición. Por favor, inténtalo de nuevo más tarde.',
        });
    }
};

/**
 * Actualiza un gatito existente en la base de datos.
 */
exports.updateCat = async (req, res) => {
    try {
        const catId = req.params.id;
        console.log(`[Controller] Intentando actualizar gatito con ID: ${catId} y datos:`, req.body);

        const updateResult = await Cat.update(catId, req.body);

        // Si updateResult es nulo/falso o su affectedRows es 0,
        // el gatito no fue encontrado o no hubo cambios.
        if (!updateResult || updateResult.affectedRows === 0) {
            console.warn(`[Controller] No se actualizó ningún gatito con ID: ${catId}. Puede que el ID no exista o no hubo cambios.`);
            res.status(404).render('404', {
                title: 'Gatito no encontrado',
                message: 'El gatito que intentaste actualizar no fue encontrado o no se realizaron cambios.',
            });
            return; // Detener la ejecución aquí
        }

        // Si llegamos a este punto, la actualización fue exitosa.
        console.log(`[Controller] Gatito con ID: ${catId} actualizado exitosamente. Filas afectadas: ${updateResult.affectedRows}`);
        res.redirect('/gatitos'); // Redirige a la lista para ver el cambio
        return; // Detener la ejecución después de la redirección
    } catch (err) {
        console.error('Error detallado al actualizar el gatito:', err);
        // En caso de un error inesperado (ej. problema de base de datos), muestra un error 500.
        res.status(500).render('error', {
            title: 'Error del servidor',
            message: 'Hubo un error interno al intentar actualizar el gatito. Por favor, revisa los logs del servidor.',
        isErrorPage: true // Indicador para la vista de error si necesitas un estilo diferente
        });
        return;
    }
};

/**
 * Elimina un gatito de la base de datos.
 */
exports.deleteCat = async (req, res) => {
    try {
        const catId = req.params.id;
        console.log(`[Controller] Intentando eliminar gatito con ID: ${catId}.`);
        
        const deleteResult = await Cat.delete(catId);
        
        // Si deleteResult es nulo/falso o 0 filas afectadas, el gatito no se encontró.
        if (!deleteResult || deleteResult.affectedRows === 0) {
            console.warn(`[Controller] No se eliminó ningún gatito con ID: ${catId}. Puede que el ID no exista.`);
            res.status(404).render('404', {
                title: 'Gatito no encontrado',
                message: 'El gatito que intentaste eliminar no fue encontrado.',
            });
            return; // Detener la ejecución aquí
        }

        // Si llegamos a este punto, la eliminación fue exitosa.
        console.log(`[Controller] Gatito con ID: ${catId} eliminado exitosamente. Filas afectadas: ${deleteResult.affectedRows}`);
        res.redirect('/gatitos'); // Redirige a la lista
        return; // Detener la ejecución después de la redirección
    } catch (err) {
        console.error('Error detallado al eliminar el gatito:', err);
        // En caso de un error inesperado, muestra un error 500.
        res.status(500).render('error', {
            title: 'Error del servidor',
            message: 'Hubo un error interno al intentar eliminar el gatito. Por favor, revisa los logs del servidor.',
        isErrorPage: true
        });
        return;
    }
};