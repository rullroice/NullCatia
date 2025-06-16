const Cat = require('../models/catModel');

exports.listCats = async (req, res) => {
  try {
    const cats = await Cat.getAll();
    res.render('index', { cats, title: 'Lista de Gatitos' });
  } catch (err) {
    res.status(500).send('Error al listar los gatitos');
  }
};

exports.showCatForm = (req, res) => {
  res.render('catForm', { title: 'Agregar Gatito' });
};

exports.createCat = async (req, res) => {
  try {
    await Cat.create(req.body);
    res.redirect('/');
  } catch (err) {
    res.status(500).send('Error al crear el gatito');
  }
};

exports.deleteCat = async (req, res) => {
  try {
    await Cat.delete(req.params.id);
    res.redirect('/');
  } catch (err) {
    res.status(500).send('Error al eliminar el gatito');
  }
};