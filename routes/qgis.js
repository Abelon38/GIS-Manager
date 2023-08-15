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


const upload = multer({ dest: 'data/' });



router.get('/qgis', isAuthenticated,(req, res) => {
  const dataFolderPath = path.join(__dirname, '..', 'data');

  const folderNames = fs.readdirSync(dataFolderPath);

  res.render('qgis', { folderNames, user: req.user });
});

// Obtener lista de archivos
router.get('/api/files', (req, res) => {
  const files = [];

  fs.readdirSync('data/').forEach((file) => {
    const filePath = path.join('data/', file);
    const stats = fs.statSync(filePath);

    files.push({
      name: file,
      extension: path.extname(file),
      isDirectory: stats.isDirectory(),
    });
  });

  res.json(files);
});


const allowedFormats = ['.qgz', '.qgs'];

// Subir archivos
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
      const filePath = path.join('data/', originalName);

      // Verificar si el archivo ya existe y reemplazarlo si es necesario
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      // Mover el nuevo archivo desde la ubicación temporal a la ubicación final
      fs.renameSync(file.path, filePath);

      uploadedFiles.push(originalName);
    }
  });

  res.redirect('/qgis');
});

// Eliminar archivo
router.delete('/api/files/:fileName', (req, res) => {
  const filePath = path.join('data/', req.params.fileName);

  // Verificar si el archivo existe y eliminarlo si es necesario
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    res.json({ message: 'File deleted successfully' });
  } else {
    res.status(404).json({ message: 'File not found' });
  }
});


// Descargar archivo
router.get('/api/files/:fileName', (req, res) => {
  const filePath = path.join('data/', req.params.fileName);

  res.download(filePath);
});


module.exports = router;