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

  setHide: function(bool){
    configObj.hide = bool;
    saveConfigJson();
  },

  getHide: function(){
    return configObj.hide;
  },

  setEasiness: function(number){
    configObj.easiness = number;
    saveConfigJson(true);
  },

  getEasiness: function(){
    return configObj.easiness;
  },

  dataDir: '.data',

  hiddenText: '・・・',

  lowestScore: 25,

  highestScore: 100,

  passScore: 50,

  minInterval: 3 * 60 * 60,

  icon: path.join(__dirname, '../icons/icon64x64.png')
};

var pathConfigJson = path.join(module.exports.dataDir, 'config.json');
var configObj = {};
var saveTimer = null;

function saveConfigJson(timer = false){

  clearTimeout(saveTimer);

  var write = () => {
    console.log("Saving config...");
    fs.writeFileSync(pathConfigJson, JSON.stringify(configObj));
  };

  if(timer){
    saveTimer = setTimeout(write, 1500);
  } else {
    write();
  }
}


(function(){

  if(!fs.existsSync(module.exports.dataDir)){
    fs.mkdirSync(module.exports.dataDir);
  }
  if(!fs.existsSync(pathConfigJson)){
    configObj = {
      autoDict: false,
      hide: false,
      easiness: 2
    };
    fs.writeFileSync(pathConfigJson, JSON.stringify(configObj));
  } else {
    var json = fs.readFileSync(pathConfigJson);
    configObj = JSON.parse(json);
  }




}());
