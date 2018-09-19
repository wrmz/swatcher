const swatches = ['#fe0002','#01ff00','#00b3fe','orange','purple'];

// Creating a single `Swatcher` instance
let swatcherElemA = document.getElementById('swatcherA');
let swatcherA = new Swatcher(swatcherElemA, swatches, {
  class: 'swatchteraptor', // optional
  startColor: '#161616' // optional
});

// Creating multiple instances of `Swatcher` by class name
Swatcher.generateFromClass();

// Destroy swatcher instances and prepare for GC
// swatcherA.destroy();
// swatcherA = null;
// swatcherElemA = null;
// Swatcher.destroyAll();
