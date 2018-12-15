class Manager {
  create(consts, components, fps, sensitivity) {
    const wrap = document.getElementById('wrapper');
    const  html = `<canvas id='${consts.id}' width='${consts.width}' height='${consts.height}'></canvas>`;
    wrap.insertAdjacentHTML('afterbegin', html);

    this.fps = fps;
    this.screen = new Screen(consts, {
      sensitivity: sensitivity
    });
    this.resourceLoader= new ResourceLoader(this.start.bind(this));
    this.resourceLoader.preload();
    this.components = components;
    this.start();
  }

  start() {
    this.screen.initialize(this.resourceLoader.imageTable, this.components);
    setInterval(this.update.bind(this), 1000/this.fps);
  } 

  update() {
    this.screen.update();
  } 
}
