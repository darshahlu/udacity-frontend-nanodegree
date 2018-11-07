// Model
class Kitten {
  constructor(name, imgSrc) {
    this.name = name;
    this.imgSrc = imgSrc;
    this.clickCount = 0;
  }
}
class Model {
  constructor() {
    this.cats = [];
    this.currentCat = null;
  }
  addCat(name, imgSrc) {
    this.cats.push(new Kitten(name=name, imgSrc=imgSrc));
  }
}

// Views
class CatView {
  constructor() {
    this.catNameElem = document.getElementById('cat-name');
    this.catImageElem = document.getElementById('cat-img');
    this.catClickCountElem = document.getElementById('cat-click-count');
    this.catImageElem.addEventListener('click', function() {
      octopus.incrementCounter();
    });
  }
  render() {
    // display that cat
    let kitten = octopus.getCurrentCat();
    this.catNameElem.textContent = kitten.name;
    this.catImageElem.src = kitten.imgSrc;
    this.catClickCountElem.textContent = kitten.clickCount;
  }
}
class CatListView {
  constructor() {
    this.catListElem = document.querySelector('#cat-list');
  }
  createNewCatListItem(kitten) {
    const li = document.createElement('li');
    li.classList.add('cat-item');
    const a = document.createElement('a');
    a.href = '#' + kitten.name;
    a.textContent = kitten.name;
    li.appendChild(a);
    // Each cat list item has its own listener bound to its specific kitten.
    li.addEventListener('click', function(kittenCopy) {
      return function() {
        octopus.setCurrentCat(kittenCopy);
        catView.render();
      };
    }(kitten));
    return li;
  }
  populateCatListWithKitten(kitten) {
    let newCatListItem = this.createNewCatListItem(kitten);
    this.catListElem.appendChild(newCatListItem);
  }
  render() {
    let cats = octopus.getCats();
    for (let cat of cats) {
      this.populateCatListWithKitten(cat);
    }
  }
}

// Octopus
class Octopus {
  constructor(model, catView, catListView) {
    this.model = model;
    this.catView = catView;
    this.catListView = catListView;
  }
  setCurrentCat(kitten) {
    this.model.currentCat = kitten;
  }
  getCurrentCat() {
    return this.model.currentCat;
  }
  getCats() {
    return this.model.cats;
  }
  incrementCounter() {
    let cat = this.getCurrentCat();
    cat.clickCount = cat.clickCount + 1;
    catView.render();
  }
  main() {
    this.catListView.render();
  }
}

// Constants
const model = new Model();
const catView = new CatView();
const catListView = new CatListView();
const octopus = new Octopus(model, catView, catListView);
model.addCat('Bob', 'bob.jpg');
model.addCat('Fuzzy', 'fuzzy.jpg');
model.addCat('Smoky', 'smoky.jpg');
model.addCat('Stinky', 'stinky.jpg');
model.addCat('Mobius', 'mobius.jpg');

document.addEventListener("DOMContentLoaded", function(event) {
  octopus.main();
});
