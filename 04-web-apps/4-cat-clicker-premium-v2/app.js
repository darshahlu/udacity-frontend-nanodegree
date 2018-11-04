// Model
class Kitten {
  constructor(id, name, src) {
    this.id = id;
    this.name = name;
    this.src = src;
    this.clickCount = 0;
    this.figure = null;
    this.updateCount = this.updateCount.bind(this);
  }
  updateCount() {
    this.clickCount = this.clickCount + 1;
    console.log('updating', this.name, 'to', this.clickCount);
    this.figure.querySelector('.click-count').textContent = this.clickCount;
  }
  setFigure(figure) {
    this.figure = figure;
  }
}

class Model {
  constructor() {
    this.cats = {};
  }
  addCat(name, src) {
    // TODO: ensure unique ID
    let id = name
    this.cats[id] = new Kitten(id=id, name=name, src=src);
  }
  getCat(id) {
    return this.cats[id];
  }
}

// Views
class CatView {
  constructor() {
  }
  createNewCatFigure(kitten) {
    const fig = document.createElement('figure');
    fig.setAttribute('class', 'cat-figure');
    fig.setAttribute('id', kitten.id);
    const img = document.createElement('img');
    img.setAttribute('src', kitten.src);
    img.addEventListener('click', kitten.updateCount);
    kitten.setFigure(fig);
    const caption = document.createElement('figcaption');
    const name = document.createElement('i');
    name.classList.add('name');
    name.textContent = kitten.name;
    const clickCount = document.createElement('i');
    clickCount.classList.add('click-count');
    clickCount.textContent = kitten.clickCount;
    caption.appendChild(name);
    caption.appendChild(clickCount);
    fig.appendChild(img);
    fig.appendChild(caption);
    return fig;
  }
  render(kitten) {
    // display that cat
    const catFigure = this.createNewCatFigure(kitten);
    const catDisplayArea = document.querySelector('#cat-display-area');
    const catFigureOld = document.querySelector('.cat-figure');
    catFigureOld.replaceWith(catFigure);
  }
}

class CatListView {
  constructor() {
    this.cat_list_element = document.querySelector('.cat-list');
  }
  createNewCatListItem(kitten) {
    const li = document.createElement('li');
    li.classList.add('cat-item');
    const a = document.createElement('a');
    a.setAttribute('href', '#' + kitten.name);
    a.setAttribute('id', kitten.id);
    a.textContent = kitten.name;
    li.appendChild(a);
    return li
  }
  populateCatListWithKitten(kitten) {
    let new_cat_last_item = this.createNewCatListItem(kitten);
    this.cat_list_element.appendChild(new_cat_last_item);
  }
  render(cats) {
    for(let catId in cats) {
      let kitten = cats[catId];
      this.populateCatListWithKitten(kitten);
    }
  }
  addEventListeners(fn) {
    this.cat_list_element.addEventListener("click", fn);
  }
}

// Octopus
class Octopus {
  constructor(model, catView, catListView) {
    this.model = model;
    this.catView = catView;
    this.catListView = catListView;

    // See: https://medium.freecodecamp.org/this-is-why-we-need-to-bind-event-handlers-in-class-components-in-react-f7ea1a6f93eb
    // or, alternatively, a closure is needed.
    this.catItemClickedEvent = this.catItemClickedEvent.bind(this);
  }
  catItemClickedEvent(event) {
    if (event.target.nodeName === 'A') {
      let catId = event.target.getAttribute('id');
      console.log(catId, 'selected');
      let kitten = this.model.getCat(catId)
      this.catView.render(kitten);
    }
  }
  main() {
    this.catListView.render(this.model.cats);
    // Not sure how to get around doing this funkiness.
    this.catListView.addEventListeners(this.catItemClickedEvent);
  }
}

function main() {
  // Constants
  const model = new Model();
  model.addCat('Bob', 'bob.jpg');
  model.addCat('Fuzzy', 'fuzzy.jpg');
  model.addCat('Smoky', 'smoky.jpg');
  model.addCat('Stinky', 'stinky.jpg');
  model.addCat('Mobius', 'mobius.jpg');
  const catView = new CatView();
  const catListView = new CatListView();
  const octopus = new Octopus(model, catView, catListView);

  // Logic
  octopus.main();
}

document.addEventListener("DOMContentLoaded", function(event) {
   main();
 });
