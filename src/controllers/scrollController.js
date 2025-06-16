const Scroll = require('../models/scrollModel');

exports.listScrolls = async (req, res) => {
  try {
    const scrolls = await Scroll.getAll();
    res.render('scrolls/list', { scrolls, title: 'Lista de Pergaminos' });
  } catch (err) {
    res.status(500).send('Error al listar los pergaminos');
  }
};

exports.showScrollForm = (req, res) => {
  res.render('scrolls/form', { title: 'Nuevo Pergamino', scroll: {} });
};

exports.createScroll = async (req, res) => {
  try {
    await Scroll.create(req.body);
    res.redirect('/scrolls');
  } catch (err) {
    res.status(500).send('Error al crear el pergamino');
  }
};

exports.showEditScroll = async (req, res) => {
  try {
    const scroll = await Scroll.getById(req.params.id);
    res.render('scrolls/form', { title: 'Editar Pergamino', scroll });
  } catch (err) {
    res.status(500).send('Error al buscar el pergamino');
  }
};

exports.updateScroll = async (req, res) => {
  try {
    await Scroll.update(req.params.id, req.body);
    res.redirect('/scrolls');
  } catch (err) {
    res.status(500).send('Error al actualizar el pergamino');
  }
};

exports.deleteScroll = async (req, res) => {
  try {
    await Scroll.delete(req.params.id);
    res.redirect('/scrolls');
  } catch (err) {
    res.status(500).send('Error al eliminar el pergamino');
  }
};
