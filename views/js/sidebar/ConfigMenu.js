const electron = require('electron');
const Website = electron.remote.require('./website');
const config = electron.remote.require('./config');
const ShowRep = require('../ShowRep');
const CanvasPanel = require('../CanvasPanel');

$(document).ready(function(){

  $('#auto-dict-switch').prop('checked', config.getAutoDict());
  $('#hide-switch').prop('checked', config.getHide());

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
    if(!checked){
      ShowRep.unHideWord();
    } else if(!CanvasPanel.canvasEmpty()){
      ShowRep.hideWord();
    }
  });


});
