const electron = require('electron');
const BrowserWindow = electron.BrowserWindow;

var dictionaryWindow = null;

var mobileAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3 like Mac OS X) AppleWebKit/602.1.50 (KHTML, like Gecko) CriOS/56.0.2924.75 Mobile/14E5239e Safari/602.1';

function showFocus(){
  dictionaryWindow.focus();
  dictionaryWindow.show();
}

function ensureWindowIsOpen(){
  if(dictionaryWindow == null){
    dictionaryWindow = new BrowserWindow({ width: 500, height: 600 });
    dictionaryWindow.on('closed', () => { dictionaryWindow = null; });
    dictionaryWindow.on('did-finish-load', showFocus);
  }
}

module.exports.showPage = function(URL){
  ensureWindowIsOpen();
  dictionaryWindow.loadURL(URL, { userAgent: mobileAgent });
}

module.exports.googleWord = function(word){
  var url = "https://www.google.com/search?hl=ja&q=" + encodeURIComponent(word + ' 意味');
  module.exports.showPage(url);
}
