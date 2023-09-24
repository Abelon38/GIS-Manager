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
router.use((req, res, next) => {
  const filePath = path.resolve(__dirname, '..', 'data', 'geodata.json');
  let data = [];
  try {
    data = JSON.parse(fs.readFileSync(filePath));
  } catch (error) {
    console.error('Error al leer el archivo qgis.json:', error);
  }
  req.pathToQgisProjekt = data[0];
  next();
});
router.post('/guardar-geodata', isAuthenticated,(req, res) => {
  const direccion = req.body.direccion;
  const filePath = path.resolve(__dirname, '..', 'data', 'geodata.json');
  let data = [];
  try {
    data = JSON.parse(fs.readFileSync(filePath));
  } catch (error) {
    console.error('Error al leer el archivo geodata.json:', error);
  }
  data = [direccion];
  try {
    fs.writeFileSync(filePath, JSON.stringify(data));
    console.log('Dirección guardada exitosamente en geodata.json');
    res.redirect('/geodata');
  } catch (error) {
    console.error('Error al guardar el archivo geodata.json:', error);
    res.sendStatus(500);
  }
});

const upload2 = multer({ dest: 'data/geodata' });

router.get('/geodata', isAuthenticated,(req, res) => {
  const dataFolderPath = req.pathToQgisProjekt;
  const folderNames = fs.readdirSync(dataFolderPath);
  res.render('geodata', { folderNames, user: req.user });
});
router.get('/api/geodata', isAuthenticated,(req, res) => {
  const files = [];
  fs.readdirSync(req.pathToQgisProjekt).forEach((file) => {
    const filePath = path.join(req.pathToQgisProjekt, file);
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
router.post('/api/geodata', isAuthenticated, upload2.array('file'), (req, res) => {
  const files = req.files;
  const uploadedFiles = [];
  const unsupportedFiles = [];
  files.forEach((file) => {
    const originalName = file.originalname;
    const fileExtension = path.extname(originalName);
    if (!allowedFormats.includes(fileExtension)) {
      unsupportedFiles.push(originalName);
    } else {
      const filePath = path.join(req.pathToQgisProjekt, originalName);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      fs.renameSync(file.path, filePath);
      uploadedFiles.push(originalName);
    }
  });
  res.redirect('/geodata');
});
router.delete('/api/geodata/:fileName', isAuthenticated,(req, res) => {
  const filePath = path.join(req.pathToQgisProjekt, req.params.fileName);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    res.json({ message: 'File deleted successfully' });
  } else {
    res.status(404).json({ message: 'File not found' });
  }
});
router.get('/api/geodata/:fileName', isAuthenticated,(req, res) => {
  const filePath = path.join(req.pathToQgisProjekt, req.params.fileName);
  res.download(filePath);
});
module.exports = router;