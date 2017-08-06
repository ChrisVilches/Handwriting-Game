class DotCanvas {

  constructor(canvasDOM, options, finishLineCallback, clearCallback){
    this.canvas = canvasDOM;
    this.context = this.canvas.getContext('2d');
    this.started = false;
    this.context.lineJoin = 'round';
    this.context.lineCap = 'round';
    this.memCanvas = document.createElement('canvas');
    this.memCanvas.width = this.canvas.width;
    this.memCanvas.height = this.canvas.height;
    this.memCtx = this.memCanvas.getContext('2d');
    this.undoHistory = [];

    this.init();
    this.setOptions(options);
    this.finishLineCallback = finishLineCallback? finishLineCallback : () => {};
    this.clearCallback = clearCallback? clearCallback : () => {};
    this.canvas.addEventListener('mousedown', this.ev_canvas.bind(this), false);
    this.canvas.addEventListener('mousemove', this.ev_canvas.bind(this), false);
    this.canvas.addEventListener('mouseup', this.ev_canvas.bind(this), false);
    this.canvas.addEventListener('mouseout', this.ev_canvas.bind(this), false);
  }

  setOptions(options){

    this.context.strokeStyle = "#5c6379";
    this.context.lineWidth = 5;
    this.period = 10;

    if(typeof options !== 'object' || options == null) return;

    if(typeof options.color === 'string')
      this.context.strokeStyle = options.color;

    if(typeof options.lineWidth === 'number')
      this.context.lineWidth = options.lineWidth;

    if(typeof options.period === 'number')
      this.period = options.period;
  }

  isEmpty(){
    return this.lines.length == 0;
  }

  getLines(){
    return this.lines;
  }

  undo(){
    this.undoHistory.pop();

    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.memCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    if(this.undoHistory.length > 0){
      var prev = this.undoHistory[this.undoHistory.length - 1];
      this.context.drawImage(prev, 0, 0);
      this.memCtx.drawImage(prev, 0, 0);
    }

    this.lines.pop();
    this.finishLineCallback();
  }

  getPrettyLines(){
    var list = [];
    for(var i=0; i<this.lines.length; i++){
      var dots = [];
      for(var j=0; j<this.lines[i][0].length; j++){
        dots.push({
          x: this.lines[i][0][j],
          y: this.lines[i][1][j],
          timestamp: this.lines[i][2][j]
        });
      }
      list.push(dots);
    }
    return list;
  }

  init(){
    this.points = [];
    this.count = 0;
    this.temp = [[], [], []];
    this.lines = [];
    this.firstTimestamp = -1;
  }

  ev_canvas(ev) {
    if (ev.offsetX || ev.offsetX == 0) {
      ev._x = ev.offsetX;
      ev._y = ev.offsetY;
    }

    ev._x = ev._x + 0.5;
    var func = this[ev.type].bind(this);
    if (func)
      func(ev);
  }

  addDot(x, y){
    this.temp[0].push(x);
    this.temp[1].push(y);
    if(this.temp[2].length == 0 && this.lines.length == 0){
      this.temp[2].push(0);
      this.firstTimestamp = new Date().getTime();
    } else {
      this.temp[2].push(new Date().getTime() - this.firstTimestamp);
    }
  }

  finishLine(){
    var canvasCopy = document.createElement('canvas');
    canvasCopy.width = this.canvas.width;
    canvasCopy.height = this.canvas.height;
    var canvasCopyCtx = canvasCopy.getContext('2d');
    canvasCopyCtx.drawImage(this.canvas, 0, 0);
    this.undoHistory.push(canvasCopy);

    this.lines.push(this.temp);
    this.temp = [[], [], []];
    this.finishLineCallback();
  }

  mousedown(ev) {
    this.count = 0;
    this.addDot(ev.offsetX, ev.offsetY, 0);
    this.drawDot(this.context, ev.offsetX, ev.offsetY);
    this.memCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.memCtx.drawImage(this.canvas, 0, 0);
    this.points.push({
        x: ev._x,
        y: ev._y
    });
    this.started = true;
    this.drawPoints(this.context, this.points);
  }

  mousemove(ev) {
    if (this.started) {
        this.count++;
        if(this.count == this.period){
          this.addDot(ev.offsetX, ev.offsetY);
          this.count = 0;
        }
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.drawImage(this.memCanvas, 0, 0);
        this.points.push({
            x: ev._x,
            y: ev._y
        });
        this.drawPoints(this.context, this.points);
    }
  }

  mouseup(ev) {
    if (this.started) {
        this.started = false;
        this.memCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.memCtx.drawImage(this.canvas, 0, 0);
        this.points = [];
        this.addDot(ev.offsetX, ev.offsetY);
        this.finishLine();
    }
  }

  mouseout(ev){
    this.mouseup(ev);
  }

  clear() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.memCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.undoHistory = [];
    this.init();
    this.clearCallback();
  }

  drawDot(ctx, x, y){
    ctx.beginPath();
    ctx.arc(x, y, ctx.lineWidth/2, 0, 2 * Math.PI, false);
    ctx.fillStyle = ctx.strokeStyle;
    ctx.fill();
  }

  drawPoints(ctx, points) {
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (var i = 1; i < points.length - 2; i++) {
        var c = (points[i].x + points[i + 1].x) / 2,
            d = (points[i].y + points[i + 1].y) / 2;
        ctx.quadraticCurveTo(points[i].x, points[i].y, c, d);
    }
    if(i < points.length - 1)
      ctx.quadraticCurveTo(points[i].x, points[i].y, points[i + 1].x, points[i + 1].y);
    ctx.stroke();
  }

}

module.exports = DotCanvas;
