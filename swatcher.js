class Swatcher {
  
  /**
   * Generates instances of Swatcher from elements containing class.
   * @param {Object} [options] - Settings for the instances. (optional)
   */
  static generateFromClass(options) {
    
    // Merge in user options with defaults
    const settings = {...Swatcher.GENERATION_DEFAULTS, ...options || {}};
    const containers = document.querySelectorAll(`.${settings.class}`);
    
    for (let container of containers) {
      
      if (!settings.swatches && !container.dataset.swatches) {
        // If there are no swatches, we'll ignore this instance
        // and skip ahead to the next container
        console.error('A class-generated swatcher cannot be generated: missing swatch array');
        continue;
      }
      
      const swatchColors = container.dataset.swatches
        // Parse the array in data attribute
        // replace the single-quotes with double-quotes for valid JSON
        ? JSON.parse(container.dataset.swatches.replace(/'/g, '"'))
        : settings.swatches;
      
      // Create a new `Swatcher` instance and add to `Swatcher.children` array
      Swatcher.children.push(new Swatcher(container, swatchColors, settings));
    }
  }

  /**
   * Destroys all stored statically stored instances of `Swatcher`
   */
  static destroyAll() {
    while (Swatcher.children.length > 0) {
      const swatcherInstance = Swatcher.children.pop();
      swatcherInstance.destroy();
    }
  }
  
  /**
   * Creates an instance of the Swatcher class.
   * @param {Element} element - The element containing the swatcher.
   * @param {string[]} swatches - Colors for the swatch buttons.
   * @param {Object} [options] - Settings for the instance. (optional)
   */
  constructor(element, swatches, options) {
    this.element = element;
    this.swatches = swatches;
    this.options = {...Swatcher.DEFAULTS, ...options};
    this.buttons = [];
    this.active = null;
    this.handleClick = this.handleClick.bind(this);
    this.updateView = this.updateView.bind(this);
    this.init();
  }
  
  /**
   * Initializes the instance, creates and appends to swatcher necessary elements.
   */
  init() {
    const ctrl = document.createElement('div');
    const ctrlList = document.createElement('ul');
    this.view = document.createElement('div');
    
    this.view.className = 'swatcher__view';
    this.view.style.backgroundColor = this.options.startColor;
    this.view.setAttribute('aria-label', this.options.startColor);
    
    ctrl.className = 'swatcher__ctrl';
    ctrlList.className = 'swatcher__color-list';
    ctrl.appendChild(ctrlList);
    
    for (let val of this.swatches) {
      const ctrlItem = document.createElement('li');
      const ctrlBtn = document.createElement('button');
      
      ctrlItem.className = 'swatcher__color-list-item';
      ctrlBtn.className = 'swatcher__color-button';
      ctrlBtn.setAttribute('type', 'button');
      
      ctrlItem.appendChild(ctrlBtn);
      ctrlList.appendChild(ctrlItem);
      
      this.buttons.push({
        elem: ctrlBtn,
        color: val
      });
    }
  }
  
  /**
   * Toggles the active states of the buttons.
   * @param {Element} previousButton - Previously active button.
   * @param {Element} currentButton - Button to make active.
   */
  updateButtons(previousButton, currentButton) {
    this.active = currentButton;
    if (previousButton) {
      previousButton.classList.remove('active');
    }
    currentButton.classList.add('active');
  }
  
  /**
   * Updates the view with the currently selected color.
   * @param {string} color - The color to set the background of the view to.
   */
  updateView(color) {
    this.view.style.backgroundColor = color;
    this.view.setAttribute('aria-label', color);
  }
  
  /**
   * Handles clicks on the buttons of `this.buttons`.
   * @param {EventObject} e - The event object.
   */
  handleClick(e) {
    const btnObj = this.buttons.find((obj) => obj.elem === e.target);
    this.updateButtons(this.active.elem, btnObj.elem);
    this.updateView(btnObj.color);
  }
  
  /**
   * Adds event listeners to the buttons of `this.buttons`.
   */
  listen() {
    for (let btn of this.buttons) {
      btn.elem.addEventListener('click', this.handleClick, false);
    }
  }
  
  /**
   * Removes event listeners to the buttons of `this.buttons`.
   */
  unlisten() {
    for (let btn of this.buttons) {
      btn.elem.removeEventListener('click', this.handleClick);
    }
  }
  
  /**
   * Removes listeners and removes child from DOM
   */
  destroy() {
    this.unlisten();
    this.element.parentNode.removeChild(this.element);
  }
}

/**
 * Swatcher defaults, changeable by setting options when instantiating
 */
Swatcher.GENERATION_DEFAULTS = {class: 'swatcher'};
Swatcher.EFAULTS = {startColor: '#161616'};
