const path = require('path');
const fs = require('fs');

module.exports = {

  setAutoDict: function(bool){
    configObj.autoDict = bool;
    saveConfigJson();
  },

  getAutoDict: function(){
    return configObj.autoDict;
  },

  getHide: function(){
    return configObj.hide;
  },

  setHide: function(bool){
    configObj.hide = bool;
    saveConfigJson();
  },

  dataDir: '.data',

  icon: path.join(__dirname, '../icons/icon64x64.png')
};

var pathConfigJson = path.join(module.exports.dataDir, 'config.json');
var configObj = {};

function saveConfigJson(){
  console.log("Saving config...");
  fs.writeFileSync(pathConfigJson, JSON.stringify(configObj));
}


(function(){

  if(!fs.existsSync(module.exports.dataDir)){
    fs.mkdirSync(module.exports.dataDir);
  }
  if(!fs.existsSync(pathConfigJson)){
    configObj = {
      autoDict: false,
      hide: false
    };
    fs.writeFileSync(pathConfigJson, JSON.stringify(configObj));
  } else {
    var json = fs.readFileSync(pathConfigJson);
    configObj = JSON.parse(json);
  }




}());
