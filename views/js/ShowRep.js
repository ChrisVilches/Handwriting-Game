const electron = require('electron');
const website = electron.remote.require('./website');
const config = electron.remote.require('./config');
const db = electron.remote.require('./db');
const InputService = require('./InputService');

var currentWord = null;

function setCurrentWord(doc){

  if(!doc){
    currentWord = null;
    $('#word-display').html('');
    $('#canvas-answer').prop('disabled', true);
    $('#canvas-not-now').prop('disabled', true);
    return;
  }

  if(currentWord == null || currentWord.word != doc.word){
    if(config.getAutoDict()){
      website.googleWord(doc.word);
    }
  }

  currentWord = doc;
  $('#word-display').html(doc.word);
  $('#canvas-answer').prop('disabled', false);
  $('#canvas-not-now').prop('disabled', false);
  $('#hidden-word-display').data('bs.tooltip').options.title = doc.word;

}

function getRandomElement(array){
  return array[Math.floor(Math.random() * array.length)];
}

// All functions must return ONE document unless there are no documents in the database.
var ways = [
  function(){
    db.getRandom(function(err, doc){
      if(err){
        $.notify(err, "warn");
        return;
      }

      if(doc){
        console.log("Using a random doc");
      }
      setCurrentWord(doc);
    });
  },

  function(){
    db.getRandomLeastReps(function(err, doc){
      if(err){
        $.notify(err, "warn");
        return;
      }

      if(doc){
        console.log("Using least reps (reps: " + doc.repCount + ")");
      }

      setCurrentWord(doc);
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
      getRandomElement(ways)();
    } else {
      var doc = getRandomElement(docs);
      console.log("Scheduled for now (date: " + doc.nextRep + ")");
      setCurrentWord(doc);
    }
  });
}

module.exports.tryAnswer = function(response, callback){

  if(currentWord.word == response){
    db.updateWordSchedule(currentWord._id, 100, module.exports.getNextWord, { fromNow: true });
    $.notify("(^_^) " + currentWord.word + " = " + response, "success");
    callback(true);
  } else {
    db.updateWordSchedule(currentWord._id, 25, module.exports.getNextWord, { fromNow: true });
    $.notify("(T_T) " + currentWord.word + " ≠ " + response, "warn");
    callback(false);
  }
}

module.exports.notNow = function(callback){
  db.updateWordSchedule(currentWord._id, 50, module.exports.getNextWord, { fromNow: true });
  $.notify("(´・ω・｀)", "success");
  callback();
}

module.exports.getCurrentWord = function(){
  return currentWord;
}

module.exports.hideWord = function(){
  $('#word-display').hide();
  $('#hidden-word-display').show();
}

module.exports.unHideWord = function(){
  $('#word-display').show();
  $('#hidden-word-display').hide();
}


$(document).ready(function(){
  module.exports.getNextWord();
  $('#hidden-word-display').html(config.hiddenText);

});
