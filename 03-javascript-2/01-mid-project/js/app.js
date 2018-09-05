var Enemy = function() {
  this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
  // You should multiply any movement by the dt parameter
  // which will ensure the game runs at the same speed for
  // all computers.
  console.log('updating enemy position.');
};

// Draw the enemy on the screen
Enemy.prototype.render = function() {
  console.log('rendering player.');
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


var Player = function() {
  this.sprite = 'images/char-boy.png';
};

Player.prototype.update = function(dt) {
  console.log('updating player position.');
};

Player.prototype.render = function() {
  console.log('rendering player.');
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function(action_name) {
  console.log('handling player input.');
};

// Object instantiation
const allEnemies = [
  new Enemy()
];

const player = new Player();

// Event listeners
document.addEventListener('keyup', function(e) {
  var allowedKeys = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down'
  };

  player.handleInput(allowedKeys[e.keyCode]);
});
