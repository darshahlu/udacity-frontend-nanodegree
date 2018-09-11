// TODO: move constants to some common place and use them in engine.js too
const GAMEBOARD_WIDTH = 505;
const GAMEBOARD_HEIGHT = 606;
const GAMEBOARD_ROWS = 6;
const GAMEBOARD_COLS = 5;
const PIXELS_PER_ROW = 83;
const PIXELS_PER_COL = GAMEBOARD_WIDTH / GAMEBOARD_COLS;
// Don't place enemies on first row (0) or last row (5)
const ENEMY_ROWS = [1, 2, 3, 4];
const INITIAL_ENEMY_POSITION = -PIXELS_PER_COL;
// TODO: actually calculate these based on gameboard width and height
const INITIAL_PLAYER_POSITION_X = 200;
const INITIAL_PLAYER_POSITION_Y = 430;
// const GAME_DIFFICULTIES = {
//   1: {
//     min_enemy_speed: 50,
//     max_enemy_speed: 99,
//     min_enemies_per_row: 0,
//     max_enemies_per_row: 2,
//     min_enemies: 2,
//     max_enemies: 3
//   },
//   2: {
//     min_enemy_speed: 100,
//     max_enemy_speed: 199,
//     min_enemies_per_row: 1,
//     max_enemies_per_row: 3,
//     min_enemies: 4,
//     max_enemies: 5
//   },
//   3: {
//     min_enemy_speed: 300,
//     max_enemy_speed: 399,
//     min_enemies_per_row: 1,
//     max_enemies_per_row: 3,
//     min_enemies: 5,
//     max_enemies: 7
//   }
// };
//
//
class EnemyCreator {
  constructor() {
    this.enemies = [];
  }
  createEnemy() {
    let max_enemy_speed = 400;
    let min_enemy_speed = 300;
    let speed = (Math.random() * (max_enemy_speed - min_enemy_speed + 1)) + min_enemy_speed;
    let row_index = Math.floor(Math.random() * ENEMY_ROWS.length);
    let row = ENEMY_ROWS[row_index];
    console.log(`Enemy created: speed=${speed}, row=${row}`);
    let enemy = new Enemy('images/enemy-bug.png', speed, row);
    return enemy;
  }
  createEnemies() {
    let max_enemies = 4;
    let min_enemies = 1;
    let num_enemies = Math.floor(Math.random() * (max_enemies - min_enemies + 1)) + min_enemies;
    for (let i = 0; i < num_enemies; i++) {
      let enemy = this.createEnemy();
      this.enemies.push(enemy);
    }
    return this.enemies;
  }
}


class Enemy {
  constructor(sprite, speed, row) {
    this.sprite = sprite;
    this.speed = speed;
    this.row = row;
    this.x_location = INITIAL_ENEMY_POSITION;
  }
  // Update the enemy's position
  // Parameter: dt, a time delta between ticks
  update(dt) {
    console.log('updating enemy position.');
    if (this.x_location >= GAMEBOARD_WIDTH) {
      this.x_location = INITIAL_ENEMY_POSITION;
    } else {
      this.x_location = this.x_location + this.speed * dt;
    }
  }
  render() {
    console.log('rendering enemy.');
    ctx.drawImage(Resources.get(this.sprite), this.x_location, this.row * PIXELS_PER_ROW);
  }
}


class Player {
  constructor() {
    this.x = INITIAL_PLAYER_POSITION_X;
    this.y = INITIAL_PLAYER_POSITION_Y;
    this.sprite = 'images/char-boy.png';
  }
  update(dt) {
    console.log('updating player position.');
  }
  render() {
    console.log('rendering player.');
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }
  handleInput(action_name) {
    console.log('handling player input.');
  }
}


const player = new Player();
const enemyCreator = new EnemyCreator();
const allEnemies = enemyCreator.createEnemies();


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
