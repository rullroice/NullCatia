const Territory = require('../models/territoryModel');

exports.listTerritories = async (req, res) => {
  try {
    const territories = await Territory.getAll();
    res.render('territories/list', { territories, title: 'Lista de Territorios' });
  } catch (err) {
    res.status(500).send('Error al listar los territorios');
  }
};

exports.showTerritoryForm = (req, res) => {
  res.render('territories/form', { title: 'Nuevo Territorio', territory: {} });
};

exports.createTerritory = async (req, res) => {
  try {
    await Territory.create(req.body);
    res.redirect('/territorios');
  } catch (err) {
    res.status(500).send('Error al crear el territorio');
  }
};

exports.showEditTerritory = async (req, res) => {
  try {
    const territory = await Territory.getById(req.params.id);
    res.render('territories/form', { title: 'Editar Territorio', territory });
  } catch (err) {
    res.status(500).send('Error al buscar el territorio');
  }
};

exports.updateTerritory = async (req, res) => {
  try {
    await Territory.update(req.params.id, req.body);
    res.redirect('/territorios');
  } catch (err) {
    res.status(500).send('Error al actualizar el territorio');
  }
};

exports.deleteTerritory = async (req, res) => {
  try {
    await Territory.delete(req.params.id);
    res.redirect('/territorios');
  } catch (err) {
    res.status(500).send('Error al eliminar el territorio');
  }
};
