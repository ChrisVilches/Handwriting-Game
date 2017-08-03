const DotCanvas = require('./DotCanvas');
const InputService = require('./InputService');
const ShowRep = require('./ShowRep');

var squareWidth = 5;

function copyCanvas(prettyLines, canvas){

  var ctx = canvas.getContext("2d");

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for(i in prettyLines){
    ctx.beginPath();
    ctx.moveTo(prettyLines[i][0].x, prettyLines[i][0].y);
    for(j in prettyLines[i]){
      ctx.lineTo(prettyLines[i][j].x, prettyLines[i][j].y);
      ctx.fillRect(prettyLines[i][j].x - (squareWidth/2), prettyLines[i][j].y - (squareWidth/2), squareWidth, squareWidth);
    }
    ctx.stroke();
  }
}

$(document).ready(function(){

  // Copy width & height
  $('#canvas-mirror').attr('height', $('#canvas-main').attr('height'));
  $('#canvas-mirror').attr('width', $('#canvas-main').attr('width'));

  var canvasMirror = $('#canvas-mirror')[0];

  var canvas = new DotCanvas($('#canvas-main')[0], {
    period: 5,
    lineWidth: 6,
    color: "#404769"
  },
  function(){
    copyCanvas(canvas.getPrettyLines(), canvasMirror);
  },
  function(){
    canvasMirror.getContext("2d").clearRect(0, 0, canvasMirror.width, canvasMirror.height);
  });

  var service = new InputService({
    width: Number($('#canvas-main').attr('width')),
    height: Number($('#canvas-main').attr('height')),
    lang: "ja"
  });

  $("#canvas-clear").click(() => canvas.clear());

  $("#canvas-answer").click(function(){

    var lines = canvas.getLines();
    service.getCharacters(lines, data => {

      if(data == null || data.length == 0) return;
      var answer = data[0];
      ShowRep.tryAnswer(answer, function(success){
        canvas.clear();
      });


    }, e => { console.log("Error:", e); });



  });

  $("#canvas-get").click(function(){
    var lines = canvas.getLines();
    service.getCharacters(lines, data => {

      $("#result").html('');
      for(i in data){
        $("#result").append(data[i] + ', ');
      }

    }, e => { console.log("Error:", e); });
  });

});
