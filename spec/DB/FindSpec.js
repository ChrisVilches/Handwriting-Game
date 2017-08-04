const Datastore = require('nedb');
var db = require('../../main/db');

describe("Find queries", function(){

  beforeAll(function(){
    db.setDS(new Datastore({
      filename: 'spec/mock.db',
      autoload: true,
      timestampData: true
    }));
  });


  it("gets nearest words correctly 1", function(done) {
    db.getNearestWords(3, function(err, docs){
      expect(err).toEqual(null);
      expect(docs[0].word).toEqual('超');
      expect(docs[1].word).toEqual('嗚呼');
      expect(docs[2].word).toEqual('世界');
      done();
    });
  }, 1000);

  it("gets nearest words correctly 2", function(done) {
    db.getNearestWords(10, function(err, docs){
      expect(err).toEqual(null);
      expect(docs[0].word).toEqual('超');
      expect(docs[1].word).toEqual('嗚呼');
      expect(docs[2].word).toEqual('世界');
      expect(docs[3].word).toEqual('猫');
      expect(docs[4].word).toEqual('喋');
      expect(docs[5].word).toEqual('犬');
      expect(docs[6].word).toEqual('地獄');
      expect(docs[7].word).toEqual('王国');
      expect(docs[8].word).toEqual('想像');
      expect(docs[9].word).toEqual('日本');
      done();
    });
  }, 1000);

  it("gets scheduled for now (or another date) 1", function(done) {
    db.getScheduledForNow(function(err, docs){
      expect(err).toEqual(null);
      expect(docs.length).toEqual(4);
      done();
    }, new Date("Tue Jul 04 2017 00:00:01"));
  }, 1000);

  it("gets scheduled for now (or another date) 2", function(done) {
    db.getScheduledForNow(function(err, docs){
      expect(err).toEqual(null);
      expect(docs.length).toEqual(5);
      expect(docs[0].word).toEqual('超');
      expect(docs[1].word).toEqual('嗚呼');
      expect(docs[2].word).toEqual('世界');
      expect(docs[3].word).toEqual('猫');
      expect(docs[4].word).toEqual('喋');
      done();
    }, new Date(1500820040503));
  }, 1000);

  it("gets a random doc", function(done) {
    db.getRandom(function(err, doc){
      expect(err).toEqual(null);
      expect(doc.word != '').toEqual(true);
      done();
    });
  }, 1000);

  it("gets docs sorted by rep count 1", function(done) {
    db.getLeastReps(3, function(err, docs){
      expect(err).toEqual(null);
      expect(docs.length).toEqual(3);
      expect(docs[0].word).toEqual('想像');
      expect(docs[1].word).toEqual('嗚呼');
      expect(docs[2].word).toEqual('日本');
      done();
    });
  }, 1000);

  it("gets docs sorted by rep count 2", function(done) {
    db.getLeastReps(7, function(err, docs){
      expect(err).toEqual(null);
      expect(docs.length).toEqual(7);
      expect(docs[0].word).toEqual('想像');
      expect(docs[1].word).toEqual('嗚呼');
      expect(docs[2].word).toEqual('日本');
      expect(docs[3].word).toEqual('喋');
      expect(docs[4].word).toEqual('超');
      expect(docs[5].word).toEqual('猫');
      expect(docs[6].word).toEqual('不思議');
      done();
    });
  }, 1000);

});
