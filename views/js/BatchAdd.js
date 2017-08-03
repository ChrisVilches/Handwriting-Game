const electron = require('electron');
const db = electron.remote.require('./db');

$(document).ready(function(){

  function updateTotalCount(){
    db.getTotalCount(function(err, count){
      if(err){
        $.notify("Error: " + err, "warn");
        return;
      }
      $("#total-count").html(count);
    });
  }

  function collapseTextarea(){
    $('#batch-add').animate({ height: textareaInitHeight }, 100);
  }

  var textareaInitHeight = $('#batch-add').height();
  var textareaLargeHeight = textareaInitHeight + 150;
  updateTotalCount();


  $('#batch-add').click(function(){
    $('#batch-add').animate({ height: textareaLargeHeight }, 100);
  });

  $('#batch-add').on('focusout', function(){
    if($('#batch-add').val() != '') return;
    collapseTextarea();
  });


  $('#batch-add-btn').click(function(e){

    var text = $('#batch-add').val();
    var lines = text.split(/\n/g);

    for(i in lines){
      lines[i] = lines[i].trim();
    }

    lines = lines.filter(el => el.length > 0);

    db.insertBatch(lines, function(err, newDocs){
      if(err){
        $.notify("Error: " + err, "warn");
        return;
      }

      $.notify("Added " + newDocs.length + " words.", "success");
      collapseTextarea();
      updateTotalCount();
      $('#batch-add').val('');


    });

  });
});
