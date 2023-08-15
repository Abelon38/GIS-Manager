
/* * Copyright (c) 2023 MundoGIS
 *
 * This file is licensed under the GNU General Public License (GPL) version 3.
 * You can obtain a copy of the license at https://www.gnu.org/licenses/gpl-3.0.html#license-text. */

function deleteFile(fileName) {
  fetch(`/api/geodata/${fileName}`, { method: 'DELETE' })
    .then(response => response.json())
    .then(result => {
      console.log(result);
      loadFiles();
    })
    .catch(error => {
      console.error(error);
    });
}

function downloadFile(fileName) {
  const fileExtension = fileName.split('.').pop();

  // Verificar si el tipo de archivo es una carpeta o no
  if (fileExtension !== 'folder') {
    window.location.href = `/api/geodata/${fileName}`;
  }
}

function getIconClass(extension) {
  // Código de la función getIconClass existente...
}

function showBackupFolderContents(fileName) {
  // Código de la función showBackupFolderContents existente...
}

function addFileToList(file) {
  if (file && typeof file.name === 'string' && file.type !== 'folder' && file.name !== 'geodata') {
    const fileList = document.getElementById('fileList');
    const defaultFileList = document.getElementById('defaultFileList');
    const listItem = document.createElement('li');
    const fileName = file.name;
    const fileExtension = fileName.split('.').pop();
    const fileNameElement = document.createElement('span');
    const deleteButton = document.createElement('button');
    const downloadButton = document.createElement('button');

    fileNameElement.textContent = fileName;

    deleteButton.textContent = 'Delete';
    deleteButton.classList.add('button-min');
    deleteButton.addEventListener('click', () => {
      deleteFile(file.name);
    });
    downloadButton.textContent = 'Download';
    downloadButton.classList.add('button-min');
    downloadButton.addEventListener('click', () => {
      downloadFile(file.name);
    });

    const iconElement = document.createElement('img');
    iconElement.classList.add('file-icon');

    // Asignar el icono según la extensión del archivo
    if (fileExtension === 'qgz' || fileExtension === 'qgs') {
      iconElement.src = '/css/icons/qgis.png';
      listItem.classList.add('qgis-files');
    } else {
      // Si la extensión no coincide con ninguna de las anteriores
      iconElement.src = '/css/icons/box.png';
      listItem.classList.add('default-files');
    }

    const processedFileName = fileName.replace(/^\./, ''); // Eliminar el punto del nombre del archivo

    fileNameElement.textContent = processedFileName;

    deleteButton.textContent = 'Delete';
    deleteButton.classList.add('button-min');
    deleteButton.addEventListener('click', () => {
      deleteFile(file.name);
    });
    downloadButton.textContent = 'Download';
    downloadButton.classList.add('button-min');
    downloadButton.addEventListener('click', () => {
      downloadFile(file.name);
    });

    // Verificar la extensión del archivo y mostrar u ocultar los botones según corresponda
    if (fileExtension === 'qgz' || fileExtension === 'qgs') {
   
     

      listItem.appendChild(iconElement);
      listItem.appendChild(fileNameElement);
      listItem.appendChild(deleteButton);
      listItem.appendChild(downloadButton);
    } else {
      listItem.appendChild(iconElement);
      listItem.appendChild(fileNameElement);
      listItem.appendChild(deleteButton);
      listItem.appendChild(downloadButton);
    }

    fileList.appendChild(listItem);
  }
}

function loadFiles() {
  fetch('/api/geodata')
    .then(response => response.json())
    .then(files => {
      const fileList = document.getElementById('fileList');
      fileList.innerHTML = '';

      if (Array.isArray(files)) {
        files.forEach(file => {
          addFileToList(file);
        });
      }
    })
    .catch(error => {
      console.error(error);
    });
}

loadFiles();

//geodata



