const electron = require('electron');
const website = electron.remote.require('./website');
const config = electron.remote.require('./config');
const db = electron.remote.require('./db');
const InputService = require('./InputService');
const Footer = require('./Footer');
const lib = electron.remote.require('./lib');

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
        console.log("("+doc.word+") Using a random doc");
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
        console.log("("+doc.word+") Using least reps (reps: " + doc.repCount + ")");
      }

      setCurrentWord(doc);
    });
  },

  function(){
    db.getRandomLastRep(function(err, doc){
      if(err){
        $.notify(err, "warn");
        return;
      }

      if(doc){
        console.log("("+doc.word+") Using last rep (last rep date: " + doc.lastRepDate + ")");
      }

      setCurrentWord(doc);
    });
  }

];


module.exports.getNextWord = function(){

  Footer.updateScheduledCount();

  db.getScheduledForNow(function(err, docs){

    if(err){
      $.notify(err, "warn");
      return;
    }

    if(docs.length == 0){
      getRandomElement(ways)();
    } else {
      var doc = getRandomElement(docs);
      console.log("("+doc.word+") Scheduled for now (date: " + doc.nextRep + ")");
      setCurrentWord(doc);
    }
  });
}


module.exports.tryAnswer = function(response, callback){

  var i;
  var correct = false;

  for(i=0; i<response.length && i<config.getEasiness(); i++){
    if(currentWord.word == response[i]){
      correct = true;
      break;
    }
  }

  // Get N first elements
  response.splice(config.getEasiness());

  if(correct){

    var score = correct ? lib.calculateScore(
      config.lowestScore,
      config.highestScore,
      config.getEasiness(),
      i) : config.lowestScore;

    console.assert(score >= config.lowestScore);
    console.assert(score <= config.highestScore);

    db.updateWordSchedule(currentWord._id, score, module.exports.getNextWord, { fromNow: true });
    $.notify("Correct!", "success");
    console.log("Correct answer (score: "+score+", max score: "+config.highestScore+", lowest: "+config.lowestScore+", i: "+i+", easiness: "+config.getEasiness()+")");
    callback(true);
  } else {
    db.updateWordSchedule(currentWord._id, config.lowestScore, module.exports.getNextWord, { fromNow: true });

    let looksLike;

    if(response.hasOwnProperty('length')){
      looksLike = response[0];
    } else {
      looksLike = response;
    }

    $.notify("Incorrect! Your answer looks more like " + looksLike, "warn");
    callback(false);
  }
}

module.exports.notNow = function(callback){
  db.updateWordSchedule(currentWord._id, config.passScore, module.exports.getNextWord, { fromNow: true });
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
