const Datastore = require('nedb');
var db = require('../../main/db');

describe("Database", function() {

  describe("Update queries", function(){
    var fs = require('fs');

    afterAll(function(){
      fs.unlinkSync('spec/DB/mock.temp.db');
    });

    beforeEach(function(){
      fs.writeFileSync('spec/DB/mock.temp.db', fs.readFileSync('spec/DB/mock.db'));
      db.setDS(new Datastore({
        filename: 'spec/DB/mock.temp.db',
        autoload: true,
        timestampData: true
      }));
    });

    it("gets nearest words correctly after updating schedules 1", function(done) {
      db.updateWordSchedule('xC3dntcuX1EvTtJk', 18.5, function(){
        db.getNearestWords(3, function(err, docs){
          expect(err).toEqual(null);
          expect(docs[0].word).toEqual('嗚呼');
          expect(docs[1].word).toEqual('超');
          expect(docs[2].word).toEqual('世界');
          done();
        });
      });
    }, 1000);

    it("gets nearest words correctly after updating schedules 2", function(done) {
      db.updateWordSchedule('xC3dntcuX1EvTtJk', 18.49999999, function(){
        db.getNearestWords(3, function(err, docs){
          expect(err).toEqual(null);
          expect(docs[0].word).toEqual('超');
          expect(docs[1].word).toEqual('嗚呼');
          expect(docs[2].word).toEqual('世界');
          done();
        });
      });
    }, 1000);

  });

});
