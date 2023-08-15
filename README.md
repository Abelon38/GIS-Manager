# GIS-Manager
The aplication to manage your QGIS projects and layers on QGIS-server.

## Overview
GIS-Manager is a web application that allows users to manage QGIS-servers projects and local-geodata as well. It provides the possibility of uploading, delete, getCapabilties for WMS, WMTS and WFS and check WMS on map. On the frontend of GIS-Manager, after authenticated you will be able to see all your projects and layers organized in a tree-view. 

GIS-Manager is built on NodeJS, Express and Leaflet JS for the frontend.

## Installation
To install GIS-Manager, follow these steps:

1. Install NodeJS on your server or where GIS-Manager will be installed.
2. Clone the repository or download.
3. Configure your file script.js and script_data.js and add your link to your QGIS-server WMS. For exempel change: 
  `http://localhost:12000/qgis/qgis_mapserv.fcgi.exe?map=/QGISM1.0/projects/${fileName}&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetCapabilities`;
To: 
`http://YourGIS-server-Adress?map=/QGISM1.0/projects/${fileName}&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetCapabilities`;

5. Change the user and password on app.js to yours. As default is 'admin' and 'popelle123' the admin user.

To Install as a service:

6. Open cmd (as administrator) and navigate to where you have GIS-Manager and run node .\service.js to install it as a Windows-service on por 3000. 

7. Enjoy!
