const path = require('path');
const fs = require('fs');

module.exports = {

  setAutoDict: function(bool){
    configObj.autoDict = bool;
    console.log("Saving config...");
    saveConfigJson();
  },

  getAutoDict: function(){
    return configObj.autoDict;
  },

  dataDir: '.data',

  icon: path.join(__dirname, '../icons/icon.ico')
};

var pathConfigJson = path.join(module.exports.dataDir, 'config.json');
var configObj = {};

function saveConfigJson(){
  fs.writeFileSync(pathConfigJson, JSON.stringify(configObj));
}


(function(){

  if(!fs.existsSync(module.exports.dataDir)){
    fs.mkdirSync(module.exports.dataDir);
  }
  if(!fs.existsSync(pathConfigJson)){
    configObj = {
      autoDict: false
    };
    fs.writeFileSync(pathConfigJson, JSON.stringify(configObj));
  } else {
    var json = fs.readFileSync(pathConfigJson);
    configObj = JSON.parse(json);
  }




}());
