'use strict';

const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require('path');

app.on('window-all-closed', function() {
	if (process.platform != 'darwin')
		app.quit();
});

app.on('ready', function() {

	var mainWindow = new BrowserWindow({width: 1300, height: 800});
	mainWindow.loadURL(path.join('file://', __dirname, '../views/index.html'));
	require('./menu');

	mainWindow.on('closed', function() {
		mainWindow = null;
	});

});
