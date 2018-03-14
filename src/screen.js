class Screen {
  constructor() {
    this.Width = 960;
    this.Height = 540;
    this.CellSize = 36;
    this.canvas = document.querySelector('#screen');
    this.ctx = this.canvas.getContext('2d');
  }

  initialize(imageTable, model) { 
    this.frameCount = 0;
  }

  update() {
    if (this.finished) {
      return;
    }
    ++this.frameCount;
    this.ctx.fillStyle = '#fff';
    this.ctx.fillRect(0,0,this.Width, this.Height);
  }
} 
