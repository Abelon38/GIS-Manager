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
  const filePath = path.resolve(__dirname, '..', 'data', 'qgis.json');
  let data = [];
  try {
    data = JSON.parse(fs.readFileSync(filePath));
  } catch (error) {
    console.error('Error al leer el archivo qgis.json:', error);
  }
  req.pathToQgisProjekt = data[0];
  next();
});

router.post('/guardar-direccion', isAuthenticated,(req, res) => {
  const direccion = req.body.direccion;
  const filePath = path.resolve(__dirname, '..', 'data', 'qgis.json');
  let data = [];
  try {
    data = JSON.parse(fs.readFileSync(filePath));
  } catch (error) {
    console.error('Error al leer el archivo qgis.json:', error);
  }
  data = [direccion];
  try {
    fs.writeFileSync(filePath, JSON.stringify(data));
    console.log('Dirección guardada exitosamente en qgis.json');
    //res.sendStatus(200);
    res.redirect('/qgis');
  } catch (error) {
    console.error('Error al guardar el archivo qgis.json:', error);
    res.sendStatus(500);
  }
});
const upload = multer({ dest: 'data/' });

router.post('/qgis-projekt', (req, res) => {
  const { direccionProyectos } = req.body;
  const filePath = req.pathToQgisProjekt;
  const qgisprojektData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  qgisprojektData.direccionProyectos = direccionProyectos;
  fs.writeFileSync(filePath, JSON.stringify(qgisprojektData, null, 2), 'utf-8');
  res.status(200).json({ message: 'Dirección de proyectos guardada correctamente' });
});

router.get('/qgis', isAuthenticated, (req, res) => {
  const dataFolderPath = path.join(req.pathToQgisProjekt);
  const folderNames = fs.readdirSync(dataFolderPath);
  res.render('qgis', { folderNames, user: req.user });
});

router.get('/api/files', isAuthenticated,(req, res) => {
  const files = [];
  const folderPath = path.join(req.pathToQgisProjekt);
  fs.readdirSync(folderPath).forEach((file) => {
    const filePath = path.join(folderPath, file);
    const stats = fs.statSync(filePath);
    const extension = path.extname(file);
    if (extension === '.qgs' || extension === '.qgz') {
      files.push({
        name: file,
        extension: extension,
        isDirectory: stats.isDirectory(),
      });
    }
  });
  res.json(files);
});

const allowedFormats = ['.qgz', '.qgs'];
router.post('/api/files', upload.array('files'), (req, res) => {
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
  res.redirect('/qgis');
});

router.delete('/api/files/:fileName', isAuthenticated,(req, res) => {
  const filePath = path.join(req.pathToQgisProjekt, req.params.fileName);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    res.json({ message: 'File deleted successfully' });
  } else {
    res.status(404).json({ message: 'File not found' });
  }
});

router.get('/api/files/:fileName', isAuthenticated,(req, res) => {
  const filePath = path.join(req.pathToQgisProjekt, req.params.fileName);
  res.download(filePath);
});

module.exports = router;