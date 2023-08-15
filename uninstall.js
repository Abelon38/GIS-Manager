/* * Copyright (c) 2023 MundoGIS
 *
 * This file is licensed under the GNU General Public License (GPL) version 3.
 * You can obtain a copy of the license at https://www.gnu.org/licenses/gpl-3.0.html#license-text. */


const Service = require('node-windows').Service;

// Crea un nuevo objeto de servicio
const svc = new Service({
  name: 'GIS-Manager-1.0',
  description: 'GIS Manager Service',
  script: 'app.js' // Ruta al archivo principal de tu aplicación
});

// Define eventos para el servicio
svc.on('uninstall', function() {
  console.log('Servicio desinstalado correctamente.');
});

// Desinstala el servicio
svc.uninstall();
