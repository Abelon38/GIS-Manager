
/* * Copyright (c) 2023 MundoGIS
 *
 * This file is licensed under the GNU General Public License (GPL) version 3.
 * You can obtain a copy of the license at https://www.gnu.org/licenses/gpl-3.0.html#license-text. */

function deleteFile(fileName) {
  fetch(`/api/files/${fileName}`, { method: 'DELETE' })
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
    window.location.href = `/api/files/${fileName}`;
  }
}

function getIconClass(extension) {
  // Código de la función getIconClass existente...
}

function showBackupFolderContents(fileName) {
  // Código de la función showBackupFolderContents existente...
}

function openWMS(fileName) {
  const fileExtension = fileName.split('.').pop();
  const link = `http://localhost:12000/qgis/qgis_mapserv.fcgi.exe?map=/QGISM1.0/projects/${fileName}&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetCapabilities`;

  // Abrir el enlace en una nueva página
  window.open(link);
}

function openWMTS(fileName) {
  const fileExtension = fileName.split('.').pop();
  const link = `http://localhost:12000/qgis/qgis_mapserv.fcgi.exe?map=/QGISM1.0/projects/${fileName}&SERVICE=WMTS&VERSION=1.0.0&REQUEST=GetCapabilities`;

  // Abrir el enlace en una nueva página
  window.open(link);
}

function openWFS(fileName) {
  const fileExtension = fileName.split('.').pop();
  const link = `http://localhost:12000/qgis/qgis_mapserv.fcgi.exe?map=/QGISM1.0/projects/${fileName}&SERVICE=WFS&VERSION=1.1.0&REQUEST=GetCapabilities`;

  // Abrir el enlace en una nueva página
  window.open(link);
}

function openWMSMap(fileName) {
  const fileExtension = fileName.split('.').pop();
  const link = `http://localhost:12000/qgis/qgis_mapserv.fcgi.exe?map=/QGISM1.0/projects/${fileName}&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetCapabilities`;
  window.open(`/map?wmsLink=${encodeURIComponent(link)}`);
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
      const wmsButton = document.createElement('button');
      wmsButton.textContent = 'WMS';
      wmsButton.classList.add('button-min');
      wmsButton.addEventListener('click', () => {
        openWMS(file.name);
      });
      const wmtsButton = document.createElement('button');
      wmtsButton.textContent = 'WMTS';
      wmtsButton.classList.add('button-min');
      wmtsButton.addEventListener('click', () => {
        openWMTS(file.name);
      });
      const wfsButton = document.createElement('button');
      wfsButton.textContent = 'WFS';
      wfsButton.classList.add('button-min');
      wfsButton.addEventListener('click', () => {
        openWFS(file.name);
      });

      const openWMSMapButton = document.createElement('button');
      openWMSMapButton.textContent = 'Open WMS Map';
      openWMSMapButton.classList.add('button-min');
      openWMSMapButton.addEventListener('click', () => {
        openWMSMap(file.name);
      });

      listItem.appendChild(iconElement);
      listItem.appendChild(fileNameElement);
      listItem.appendChild(deleteButton);
      listItem.appendChild(downloadButton);
      listItem.appendChild(wmsButton);
      listItem.appendChild(wmtsButton);
      listItem.appendChild(wfsButton);
      listItem.appendChild(openWMSMapButton);
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
  fetch('/api/files')
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



