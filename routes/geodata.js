/* * Copyright (c) 2023 MundoGIS
 *
 * This file is licensed under the GNU General Public License (GPL) version 3.
 * You can obtain a copy of the license at https://www.gnu.org/licenses/gpl-3.0.html#license-text. */


const multer = require('multer');
const express = require('express');
const fs = require('fs');
const path = require('path');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const isAuthenticated = require('../auth/isAuthenticated');


const router = express.Router();


const upload2 = multer({ dest: 'data/geodata' });

router.get('/geodata', isAuthenticated,(req, res) => {
  const dataFolderPath = path.join(__dirname,'../data/geodata');

  const folderNames = fs.readdirSync(dataFolderPath);

  res.render('geodata', { folderNames, user: req.user });
});

// Obtener lista de archivos
router.get('/api/geodata', (req, res) => {
  const files = [];

  fs.readdirSync('data/geodata/').forEach((file) => {
    const filePath = path.join('data/geodata/', file);
    const stats = fs.statSync(filePath);

    files.push({
      name: file,
      extension: path.extname(file),
      isDirectory: stats.isDirectory(),
    });
  });

  res.json(files);
});

const allowedFormats = ['.jpg', '.jpeg', '.png', '.cpg', '.dbf', '.prj', '.qmd', '.shx', '.gpkg', '.shp', '.json', '.geotif', '.tiff', '.ecw', '.kml', '.kmz', '.geojson'];

// Subir archivos
router.post('/api/geodata', upload2.array('file'), (req, res) => {
  const files = req.files;
  const uploadedFiles = [];
  const unsupportedFiles = [];

  files.forEach((file) => {
    const originalName = file.originalname;
    const fileExtension = path.extname(originalName);

    if (!allowedFormats.includes(fileExtension)) {
      unsupportedFiles.push(originalName);
    } else {
      const filePath = path.join('data/geodata/', originalName);

      // Verificar si el archivo ya existe y reemplazarlo si es necesario
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      // Mover el nuevo archivo desde la ubicación temporal a la ubicación final
      fs.renameSync(file.path, filePath);

      uploadedFiles.push(originalName);
    }
  });

  res.redirect('/geodata');
});

// Eliminar archivo
router.delete('/api/geodata/:fileName', (req, res) => {
  const filePath = path.join('data/geodata/', req.params.fileName);

  // Verificar si el archivo existe y eliminarlo si es necesario
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    res.json({ message: 'File deleted successfully' });
  } else {
    res.status(404).json({ message: 'File not found' });
  }
});

// Descargar archivo
router.get('/api/geodata/:fileName', (req, res) => {
  const filePath = path.join('data/geodata/', req.params.fileName);

  res.download(filePath);
});


module.exports = router;