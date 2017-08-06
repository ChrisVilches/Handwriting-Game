const electron = require('electron');
const Website = electron.remote.require('./website');
const config = electron.remote.require('./config');
const ShowRep = require('../ShowRep');

$(document).ready(function(){

  $('#auto-dict-switch').prop('checked', config.getAutoDict());

  $('#auto-dict-switch').click(function(){
    var checked = $('#auto-dict-switch').prop('checked');
    config.setAutoDict(checked);
    if(checked && ShowRep.getCurrentWord()){
      Website.googleWord(ShowRep.getCurrentWord().word);
    }
  });

  $('#hide-switch').click(function(){
    var checked = $('#hide-switch').prop('checked');
    config.setHide(checked);
  });


});
