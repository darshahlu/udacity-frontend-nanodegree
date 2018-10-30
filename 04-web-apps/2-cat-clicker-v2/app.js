// Model
class Kitten {
  constructor(id, name, src) {
    this.element = document.querySelector(id);
    this.name = name;
    this.src = src;

    this.img_element = this.element.querySelector('img');
    this.name_element = this.element.querySelector('.name');
    this.count_element = this.element.querySelector('.click-count');

    // See: https://medium.freecodecamp.org/this-is-why-we-need-to-bind-event-handlers-in-class-components-in-react-f7ea1a6f93eb
    this.updateCount = this.updateCount.bind(this);
  }
  updateImage() {
    this.img_element.setAttribute('src', this.src);
  }
  updateName() {
    this.name_element.textContent = this.name;
  }
  updateCount() {
    this.count_element.textContent = parseInt(this.count_element.textContent, 10) + 1
  }
  addEvents() {
    this.img_element.addEventListener('click', this.updateCount);
  }
  initialize() {
    this.updateImage();
    this.updateName();
    this.addEvents();
  }
}


function main() {
  // Constants
  const kittens = [
    new Kitten('#kitten-1-figure', 'Bob', 'kitten-2.jpg'),
    new Kitten('#kitten-2-figure', 'Fuzzy', 'kitten-1.jpg'),
  ];

  // Logic
  kittens.forEach(function(kitten) {
    kitten.initialize();
  });
}

document.addEventListener("DOMContentLoaded", function(event) {
   main();
 });
