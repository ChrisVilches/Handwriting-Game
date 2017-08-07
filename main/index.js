'use strict';

require('./config');
const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require('path');
const config = require('./config');

app.on('window-all-closed', function() {
	if (process.platform != 'darwin')
		app.quit();
});

app.on('ready', function() {

	var mainWindow = new BrowserWindow({width: 850, height: 750, icon: config.icon });
	mainWindow.loadURL(path.join('file://', __dirname, '../views/index.html'));
	require('./menu');

	mainWindow.on('closed', function() {
		app.quit();
	});

});
