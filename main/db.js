const Datastore = require('nedb');
const dbFileName = '.data/data.db';
const _ = require('lodash');

var ds = null;

function getDS(){
  if(ds == null){
    //console.log("Starting DB...");
    ds = new Datastore({
  		filename: dbFileName,
  		autoload: true,
  		timestampData: true
  	});
    ds.ensureIndex({ fieldName: 'word', unique: true }, function (err) {
      if(err){
        console.log(err);
      }
    });
  } else {
    //console.log("DB is already open.");
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

  getLeastReps: function(n, callback){
    getDS().find({}).sort({ repCount: 1}).limit(n).exec(callback);
  },

  getRandom: function(callback){
    getDS().count({}, function (err, count) {
      if (!err && count > 0) {
        // skip a random number between 0 to count-1
        var skipCount = Math.floor(Math.random() * count);

        getDS().find({}).skip(skipCount).limit(1).exec(function(err2, docs) {
          callback(err2, docs[0]);
        });
      }
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
