const Cat = require('../models/catModel');
const Clan = require('../models/clanModel');
const Territory = require('../models/territoryModel');

exports.listCats = async (req, res) => {
  try {
    const cats = await Cat.getAll();
    res.render('cats/list', { cats, title: 'Lista de Gatitos' });
  } catch (err) {
    res.status(500).send('Error al listar los gatitos');
  }
};

exports.showCatForm = async (req, res) => {
  try {
    const clans = await Clan.getAll();
    const territories = await Territory.getAll();
    res.render('cats/form', { title: 'Nuevo Gatito', cat: {}, clans, territories });
  } catch (err) {
    res.status(500).send('Error al cargar el formulario');
  }
};

exports.createCat = async (req, res) => {
  try {
    await Cat.create(req.body);
    res.redirect('/gatitos');
  } catch (err) {
    res.status(500).send('Error al crear el gatito');
  }
};

exports.showEditCat = async (req, res) => {
  try {
    const cat = await Cat.getById(req.params.id);
    const clans = await Clan.getAll();
    const territories = await Territory.getAll();
    res.render('cats/form', { title: 'Editar Gatito', cat, clans, territories });
  } catch (err) {
    res.status(500).send('Error al buscar el gatito');
  }
};

exports.updateCat = async (req, res) => {
  try {
    await Cat.update(req.params.id, req.body);
    res.redirect('/gatitos');
  } catch (err) {
    res.status(500).send('Error al actualizar el gatito');
  }
};

exports.deleteCat = async (req, res) => {
  try {
    await Cat.delete(req.params.id);
    res.redirect('/gatitos');
  } catch (err) {
    res.status(500).send('Error al eliminar el gatito');
  }
};
