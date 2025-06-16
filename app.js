const express = require('express');
const path = require('path');
const methodOverride = require('method-override');

const app = express();
const port = process.env.PORT || 3000;

// Configuración EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares esenciales
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// Ruta principal
app.get('/', (req, res) => {
  res.render('index', { title: 'Inicio' });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

const catRoutes = require('./src/routes/catRoutes');
app.use('/gatitos', catRoutes);