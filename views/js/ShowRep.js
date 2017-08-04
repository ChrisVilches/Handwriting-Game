const electron = require('electron');
const db = electron.remote.require('./db');
const InputService = require('./InputService');

var currentWord = null;

function setCurrentWord(doc){
  currentWord = doc;
  $('#word-display').html(doc.word);
}

function getRandomElement(array){
  return array[Math.floor(Math.random() * array.length)];
}

var ways = [
  function(){
    db.getRandom(function(err, doc){
      if(err){
        $.notify(err, "warn");
        return;
      }
      console.log("Using a random doc")
      setCurrentWord(doc);
    });
  },

  function(){
    db.getLeastReps(20, function(err, docs){
      if(err){
        $.notify(err, "warn");
        return;
      }
      console.log("Using least reps")
      setCurrentWord(getRandomElement(docs));
    });
  }
];


module.exports.getNextWord = function(){

  db.getScheduledForNow(function(err, docs){

    if(err){
      $.notify(err, "warn");
      return;
    }

    if(docs.length == 0){
      console.log("No docs are scheduled for now");
      getRandomElement(ways)();

    } else {
      console.log("Scheduled for now");
      setCurrentWord(getRandomElement(docs));
    }

  });
}

module.exports.tryAnswer = function(response, callback){

  if(currentWord.word == response){
    db.updateWordSchedule(currentWord._id, 100, module.exports.getNextWord, { fromNow: true });
    $.notify("(^_^;) " + currentWord.word + "==" + response, "success");
    callback(true);
  } else {
    db.updateWordSchedule(currentWord._id, 25, module.exports.getNextWord, { fromNow: true });
    $.notify("(T_T) " + currentWord.word + "!=" + response, "warn");
    callback(false);
  }

}


module.exports.notNow = function(callback){
  db.updateWordSchedule(currentWord._id, 80, module.exports.getNextWord, { fromNow: true });
  $.notify("(´・ω・｀)", "success");
  callback();
}


$(document).ready(function(){
  module.exports.getNextWord();

});
