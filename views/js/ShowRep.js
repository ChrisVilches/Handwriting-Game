const electron = require('electron');
const Website = electron.remote.require('./website');
const Config = electron.remote.require('./config');
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
    if(Config.getAutoDict()){
      Website.googleWord(doc.word);
    }
  }

  currentWord = doc;
  $('#word-display').html(doc.word);
  $('#canvas-answer').prop('disabled', false);
  $('#canvas-not-now').prop('disabled', false);
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
    db.getRandomLeastRep(function(err, doc){
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
  $('#word-display').html('XXXX');
}

module.exports.unHideWord = function(){
  setCurrentWord(currentWord);
}


$(document).ready(function(){
  module.exports.getNextWord();

});
