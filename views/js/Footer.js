const db = require('electron').remote.require('./db');

module.exports.updateTotalCount = function(){
  db.getTotalCount(function(err, count){
    if(err){
      $.notify(err, "warn");
      return;
    }
    $("#total-count").html(count);
  });
}


module.exports.updateScheduledCount = function(){
  db.getScheduledNowCount(function(err, count){
    if(err){
      $.notify(err, "warn");
      return;
    }
    $("#scheduled-count").html(count);
  });
}

$(document).ready(function(){
  module.exports.updateTotalCount();
  module.exports.updateScheduledCount();
});
