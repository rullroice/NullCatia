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
const catRoute = require('./src/routes/catRoute'); // nombre plural para seguir el patrón
const clanRoute = require('./src/routes/clanRoute');
const territoryRoute = require('./src/routes/territoryRoute');
const scrollRoute = require('./src/routes/scrollRoute');

app.use('/gatitos', catRoute);
app.use('/clanes', clanRoute);
app.use('/territorios', territoryRoute);
app.use('/scrolls', scrollRoute);

// Middleware para rutas no encontradas (404)
app.use((req, res, next) => {
  res.status(404).render('404', { title: 'Página no encontrada' });
});

// Levantar servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});