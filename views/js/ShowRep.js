const electron = require('electron');
const db = electron.remote.require('./db');
const InputService = require('./InputService');

var currentWord = null;

module.exports.getNextWord = function(){

  db.getNearestWords(70, function(err, docs){

    if(err){
      $.notify("Error: " + err, "warn");
      return;
    }

    var doc = docs[Math.floor(Math.random() * docs.length)];
    currentWord = doc;
    $('#word-display').html(doc.word);

  });
}

module.exports.tryAnswer = function(response, callback){

  if(currentWord.word == response){
    db.updateWordSchedule(currentWord._id, 80, module.exports.getNextWord);
    $.notify("(^_^;) " + currentWord.word + "==" + response, "success");
    callback(true);
  } else {
    db.updateWordSchedule(currentWord._id, 20, module.exports.getNextWord);
    $.notify("(T_T) " + currentWord.word + "!=" + response, "warn");
    callback(false);
  }

}

$(document).ready(function(){
  module.exports.getNextWord();

});
