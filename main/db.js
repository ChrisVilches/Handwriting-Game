const Datastore = require('nedb');
const fs = require('fs');
const path = require('path');
const dbDir = '.data';
const dbFileName = 'data.db';
const _ = require('lodash');

var ds = null;

// Random number with a distribution where lower numbers (close to 0)
// are more prone to appear.
function randomLow(iMax){
  if(!iMax){
    iMax = 5;
  }
  var r = Math.random();
  for(var i=0; i<iMax; i++)
    r = Math.min(r, Math.random());
  return r;
}

function getDS(){
  if(ds == null){
    if (!fs.existsSync(dbDir)){
      fs.mkdirSync(dbDir);
    }
    ds = new Datastore({
  		filename: path.join(dbDir, dbFileName),
  		autoload: true,
  		timestampData: true
  	});
    ds.ensureIndex({ fieldName: 'word', unique: true }, function (err) {
      if(err){
        console.log(err);
      }
    });
  }
  return ds;
}

module.exports = {

  getTotalCount: function(callback){
    getDS().count({}, callback);
  },

  setDS(differentDS){
    ds = differentDS;
  },


  insertBatch: function(words, callback){
    var objs = [];
    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    for(i in words){
      objs.push({
        word: words[i],
        nextRep: tomorrow,
        lastInterval: 24 * 60 * 60,
        repCount: 0,
        lastRepDate: new Date()
      });
    }
    getDS().insert(objs, callback);
  },


  getNearestWords: function(n, callback){
    getDS().find({ }).sort({ nextRep: 1 }).limit(n).exec(callback);
  },


  rescheduleDoc: function(doc, score, options = {}){

    var newDoc = _.cloneDeep(doc);
    if(options.alwaysReschedule || newDoc.nextRep.getTime() < new Date().getTime()){

      var multiplier = 2 * score / 100;
      // [0, 100) interval is reduced
      // 100 interval is kept the same
      // (100, 200] interval is enlarged

      var interval = Math.floor(newDoc.lastInterval * multiplier);
      if(options.fromNow){
        newDoc.nextRep = new Date();
      }
      newDoc.nextRep.setSeconds(newDoc.nextRep.getSeconds() + interval);
      newDoc.lastInterval = interval;
    }

    newDoc.lastRepDate = new Date();
    newDoc.repCount++;
    return newDoc;
  },

  getScheduledForNow: function(callback, date){
    if(!date){
      date = new Date();
    }
    getDS().find({ nextRep: { $lt: date } }).sort({ nextRep: 1 }).exec(callback);
  },

  getRandomLeastRep: function(callback, randomWeight = null){
    getDS().count({}, function(err, count){
      if(err || count == 0){
        callback(err);
      }

      var skipCount = Math.floor(randomLow(randomWeight) * count);
      getDS().find({}).sort({ repCount: 1 }).skip(skipCount).limit(1).exec(function(err2, docs){
          callback(err2, docs[0]);
      });
    });
  },

  getRandom: function(callback){
    getDS().count({}, function (err, count) {

      if(err || count == 0){
        callback(err);
      }     

      // skip a random number between 0 to count-1
      var skipCount = Math.floor(Math.random() * count);

      getDS().find({}).skip(skipCount).limit(1).exec(function(err2, docs) {
        callback(err2, docs[0]);
      });

    });
  },

  updateWordSchedule: function(wordId, score, callback, options = {}){

    if(score < 0 || score > 100){
      throw new Error('Score must be 0-100 inclusive.');
    }

    getDS().findOne({ _id: wordId }, function(err, doc) {
      if(err){
        callback(err);
      }

      getDS().update({ _id: wordId }, module.exports.rescheduleDoc(doc, score, options), {}, callback);

    });
  }
};
