const swatches = ['#fe0002','#01ff00','#00b3fe','orange','purple'];

/**
 * @todo - Create destroy methods
 */
class Swatcher {

  static GENERATION_DEFAULTS = {
    class: 'swatcher'
  };
  
  static DEFAULTS = {
    startColor: '#161616',
    minButtonWidth: 35,
    minButtonHeight: 35
  };
  
  static children = [];
  
  /**
   * Generates instances of Swatcher from elements containing class.
   * @param {Object} options - Settings for the instances.
   */
  static generateFromClass(options) {
    const settings = {...Swatcher.GENERATION_DEFAULTS, ...options};
    const containers = document.querySelectorAll(`.${settings.class}`);
    
    for (let container of containers) {
      const swatches = options.swatches || container.dataset.swatches;
      Swatcher.children.push(new Swatcher(container, swatches, settings));
    }
  }
  
  /**
   * Creates an instance of the Swatcher class.
   * @param {Element} element - The element containing the swatcher.
   * @param {string[]} swatches - Colors for the swatch buttons.
   * @param {Object} options - Settings for the instance.
   */
  constructor(element, swatches, options) {
    this.element = element;
    this.swatches = swatches;
    this.options = {...Swatches.DEFAULTS, ...options};
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
}
