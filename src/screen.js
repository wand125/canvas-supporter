class Screen {
  constructor(consts, option) {
    this.width = consts.width;
    this.height = consts.height;
    this.canvas = document.querySelector('#'+consts.id);
    this.ctx = this.canvas.getContext('2d');
    this.diff = 0;
    this.time = 0;
    this.mousePosition = Pt(0,0);
    this.flicked = false;
    this.doubleFlicked = false;
    this.sensitivity = option.sensitivity || 30;
  }

  initialize(imageTable, components) { 
    this.frameCount = 0;
    const now = (new Date()).getTime() / 1000;
    this.diff = 0;
    this.time = now;
    this.components = components || [];

    this.canvas.addEventListener('touchstart', (e) => this.onTouchStart(e)); 
    this.canvas.addEventListener('touchmove', (e) => this.onTouchMove(e));
    this.canvas.addEventListener('touchend', (e) => this.onTouchEnd(e)); 
  }

  getState() {
    return {
      canvas: this.canvas,
      ctx: this.ctx,
      width: this.width,
      height: this.height,
      time: this.time,
      diff: this.diff,
      mousePosition: this.mousePosition
    }
  }

  onClick(e) { 
    e.preventDefault();
    　const rect = e.target.getBoundingClientRect() ;
    const mouse = Pt(
      　e.clientX - rect.left,
      　e.clientY - rect.top
    );

    if (this.finished) {
      return;
    }
    for (const component of this.components) {
      if (component.onClick != null) {
        component.onClick(mouse); 
      }
    }
    return false; 
  }

  onTouchStart(e) {
    e.preventDefault();
    this.flicked = false;
    this.doubleFlicked = false;
    const rect = e.target.getBoundingClientRect();
    this.touchStartPosition = Pt(
      　e.touches[0].pageX - rect.left,
      　e.touches[0].pageY - rect.top
    );
  }
  
  onTouchMove(e) {
    e.preventDefault();
    const rect = e.target.getBoundingClientRect();
    this.touchMovePosition = Pt(
      　e.touches[0].pageX - rect.left,
      　e.touches[0].pageY - rect.top
    );
    const diff = this.touchMovePosition.minus(this.touchStartPosition);
    const doubleFlickThrethord = 62.5;
    if (this.flicked && !this.doubleFlicked) {
      if ((this.dirPoint.x !== 0 
        && diff.x / this.dirPoint.x > doubleFlickThrethord)
        || (this.dirPoint.y !== 0
          && diff.y / this.dirPoint.y > doubleFlickThrethord))
      {
        const data = { 
          pos: this.touchStartPosition,
          dirPoint: this.dirPoint
        };
        for (const component of this.components) {
          if (component.onDoubleFlick != null) {
            component.onDoubleFlick(data); 
          }
        }
        this.doubleFlicked = true;
      }
      return;
    }

    if (this.flicked) {
      return;
    }
    let dirPoint = Pt(0,0);
    const threshold = this.sensitivity;

    if (Math.abs(diff.x) > threshold || Math.abs(diff.y) > threshold) {
      if (Math.abs(diff.x) > Math.abs(diff.y)) {
        dirPoint = Pt( diff.x > 0 ? 1 : -1 ,0);
      }
      else {
        dirPoint = Pt(0, diff.y > 0 ? 1 : -1 );
      }
    }
    else {
      return;
    }

    const data = { 
      pos: this.touchStartPosition,
      dirPoint: dirPoint
    };

    this.dirPoint = dirPoint;
    for (const component of this.components) {
      if (component.onFlick != null) {
        component.onFlick(data); 
      }
    }
    this.flicked = true;
  }

  onTouchEnd(e) {
    e.preventDefault();
    this.flicked = false;
  }

  onMouseMove(e) {
    e.preventDefault();
    const rect = e.target.getBoundingClientRect();
    this.mousePosition.x = e.clientX - rect.left;
    this.mousePosition.y = e.clientY - rect.top;
    return false; 
  }

  update() {
    const now = (new Date()).getTime() / 1000;
    this.diff = now - this.time;
    this.time = now;

    if (this.finished) {
      return;
    }
    this.ctx.clearRect(0,0,this.width, this.rect);
    const state = this.getState();
    for (const component of this.components) {
      if (component.update != null) {
        component.update(state);
      }
    }
  }
} 
