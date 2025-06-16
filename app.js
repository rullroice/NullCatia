const express = require('express');
const path = require('path');
const methodOverride = require('method-override');

const app = express();
const port = process.env.PORT || 3000;

// Configuración EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));

// Middlewares esenciales
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// Ruta principal
app.get('/', (req, res) => {
  res.render('index', { title: 'Inicio' });
});

// Rutas de las entidades
const catRoutes = require('./src/routes/catRoutes'); // nombre plural para seguir el patrón
const clanRoutes = require('./src/routes/clanRoutes');
const territoryRoutes = require('./src/routes/territoryRoutes');
const scrollRoutes = require('./src/routes/scrollRoutes');

app.use('/gatitos', catRoutes);
app.use('/clanes', clanRoutes);
app.use('/territorios', territoryRoutes);
app.use('/scrolls', scrollRoutes);

// Middleware para rutas no encontradas (404)
app.use((req, res, next) => {
  res.status(404).render('404', { title: 'Página no encontrada' });
});

// Levantar servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});