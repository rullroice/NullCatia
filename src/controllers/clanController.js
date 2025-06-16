const Clan = require('../models/clanModel');

exports.listClans = async (req, res) => {
  try {
    const clans = await Clan.getAll();
    res.render('clans/list', { clans, title: 'Lista de Clanes' });
  } catch (err) {
    res.status(500).send('Error al listar los clanes');
  }
};

exports.showClanForm = (req, res) => {
  res.render('clans/form', { title: 'Nuevo Clan', clan: {} });
};

exports.createClan = async (req, res) => {
  try {
    await Clan.create(req.body);
    res.redirect('/clanes');
  } catch (err) {
    res.status(500).send('Error al crear el clan');
  }
};

exports.showEditClan = async (req, res) => {
  try {
    const clan = await Clan.getById(req.params.id);
    res.render('clans/form', { title: 'Editar Clan', clan });
  } catch (err) {
    res.status(500).send('Error al buscar el clan');
  }
};

exports.updateClan = async (req, res) => {
  try {
    await Clan.update(req.params.id, req.body);
    res.redirect('/clanes');
  } catch (err) {
    res.status(500).send('Error al actualizar el clan');
  }
};

exports.deleteClan = async (req, res) => {
  try {
    await Clan.delete(req.params.id);
    res.redirect('/clanes');
  } catch (err) {
    res.status(500).send('Error al eliminar el clan');
  }
};