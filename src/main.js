class Runner {
  start() {
    this.manager = new Manager();
    this.manager.create();
  } 
}

runner = new Runner();
window.onload = runner.start; 
