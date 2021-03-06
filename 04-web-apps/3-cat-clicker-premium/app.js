// Model
class Kitten {
  constructor(id, name, src) {
    this.id = id;
    this.name = name;
    this.src = src;
    this.count = 0;
    this.figure = null;
    this.updateCount = this.updateCount.bind(this);
  }
  updateCount() {
    this.count = this.count + 1;
    console.log('updating', this.name, 'to', this.count);
    this.figure.querySelector('.click-count').textContent = this.count;
  }
  setFigure(figure) {
    this.figure = figure;
  }
}

class CatClickerPremium {
  constructor(kittens) {
    this.kittens = kittens;

    this.cat_list_element = document.querySelector('.cat-list')

    // See: https://medium.freecodecamp.org/this-is-why-we-need-to-bind-event-handlers-in-class-components-in-react-f7ea1a6f93eb
    // or, alternatively, a closure is needed.
    this.createNewCatListItem = this.createNewCatListItem.bind(this);
    this.populateCatListWithKitten = this.populateCatListWithKitten.bind(this);
    this.populateCatList = this.populateCatList.bind(this);
    this.catItemClickedEvent = this.catItemClickedEvent.bind(this);
    this.catClicked = this.catClicked.bind(this);
    this.createNewCatFigure = this.createNewCatFigure.bind(this);
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
    clickCount.textContent = kitten.count;
    caption.appendChild(name);
    caption.appendChild(clickCount);
    fig.appendChild(img);
    fig.appendChild(caption);
    return fig;
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
  populateCatList() {
    for(let catId in this.kittens) {
      let kitten = this.kittens[catId];
      this.populateCatListWithKitten(kitten);
      this.cat_list_element.addEventListener("click", this.catItemClickedEvent);
    }
  }
  catItemClickedEvent(event) {
    if (event.target.nodeName === 'A') {
      let catId = event.target.getAttribute('id');
      console.log(catId, 'selected');
      this.catClicked(catId);
    }
  }
  catClicked(catId) {
    // display that cat
    const catFigure = this.createNewCatFigure(this.kittens[catId]);
    const catDisplayArea = document.querySelector('#cat-display-area');
    const catFigureOld = document.querySelector('.cat-figure');
    catFigureOld.replaceWith(catFigure);
  }
}

function main() {
  // Constants
  const kittens = {
    'bob': new Kitten('bob', 'Bob', 'bob.jpg'),
    'fuzzy': new Kitten('fuzzy', 'Fuzzy', 'fuzzy.jpg'),
    'smoky': new Kitten('smoky', 'Smoky', 'smoky.jpg'),
    'stinky': new Kitten('stinky', 'Stinky', 'stinky.jpg'),
    'mobius': new Kitten('mobius', 'Mobius', 'mobius.jpg'),
  };
  const catClicker = new CatClickerPremium(kittens);

  // Logic
  catClicker.populateCatList();
}

document.addEventListener("DOMContentLoaded", function(event) {
   main();
 });
