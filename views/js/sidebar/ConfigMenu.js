const electron = require('electron');
const Website = electron.remote.require('./website');
const Config = electron.remote.require('./config');
const ShowRep = require('../ShowRep');

$(document).ready(function(){

  $('#auto-dict-switch').prop('checked', Config.getAutoDict());

  $('#auto-dict-switch').click(function(){
    var checked = $('#auto-dict-switch').prop('checked');
    Config.setAutoDict(checked);
    if(checked && ShowRep.getCurrentWord()){
      Website.googleWord(ShowRep.getCurrentWord().word);
    }
  });


});
