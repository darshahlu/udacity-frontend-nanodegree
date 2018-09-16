// TODO: move constants to some common place and use them in engine.js too
// images are 101 * 171
const GAMEBOARD_WIDTH = 505;
const GAMEBOARD_HEIGHT = 606;
const GAMEBOARD_ROWS = 6;
const GAMEBOARD_COLS = 5;
const PIXELS_PER_ROW = 83; // Not sure how this is calculated; found in engine.js
const PIXELS_PER_COL = GAMEBOARD_WIDTH / GAMEBOARD_COLS;
// Don't place enemies on first row (0) or last row (5)
const ENEMY_ROWS = [1, 2, 3, 4];
const INITIAL_ENEMY_POSITION = -PIXELS_PER_COL;
const INITIAL_PLAYER_POSITION_X = PIXELS_PER_COL * 2; // col index 2 is third col
const INITIAL_PLAYER_POSITION_Y = 404; // TODO: actually calculate based on gameboard width and height


class GameStats {
  constructor() {
    this.wins = 0;
    this.losses = 0;
    this.current_level = 1;
    this.max_level_reached = 0;
    this.enemies_dodged = 0;
    this.enemies_max_speed = 0;
  }
  update(otherGameStats) {
    this.wins += otherGameStats.wins;
    this.losses += otherGameStats.losses;
    this.current_level = otherGameStats.current_level;
    if (otherGameStats.max_level_reached > this.max_level_reached) {
      this.max_level_reached = otherGameStats.max_level_reached;
    }
    this.enemies_dodged += otherGameStats.enemies_dodged;
    if (otherGameStats.enemies_max_speed > this.enemies_max_speed) {
      this.enemies_max_speed = otherGameStats.enemies_max_speed;
    }
  }
  recordStats(all_enemies) {
    if (this.current_level > this.max_level_reached) {
      this.max_level_reached = this.current_level;
    }
  }
  recordWin(all_enemies) {
    this.current_level += 1;
    this.wins += 1;
    this.enemies_dodged += all_enemies.length;
    for (let enemy of all_enemies) {
      if (enemy.speed > this.enemies_max_speed) {
        this.enemies_max_speed = enemy.speed;
      }
    }
    this.recordStats(all_enemies);
  }
  recordLoss(all_enemies) {
    this.losses += 1;
    this.recordStats(all_enemies);
  }
}

class EnemyCreator {
  constructor(enemy_speed_min, enemy_speed_max, enemies_min, enemies_max) {
    this.enemy_speed_min = enemy_speed_min;
    this.enemy_speed_max = enemy_speed_max;
    this.enemies_min = enemies_min;
    this.enemies_max = enemies_max;
    this.enemies = [];
  }
  createEnemy(num_enemies) {
    let speed = (Math.random() * (this.enemy_speed_max - this.enemy_speed_min + 1)) + this.enemy_speed_min;
    let row_index = Math.floor(Math.random() * ENEMY_ROWS.length);
    let row = ENEMY_ROWS[row_index];
    let col = PIXELS_PER_COL * (Math.floor(Math.random() * num_enemies) + 1);
    console.log(`Enemy created: speed=${speed}, row=${row}, col=${col}`);
    let enemy = new Enemy('images/enemy-bug.png', speed, row, col);
    return enemy;
  }
  createEnemies() {
    let num_enemies = Math.floor(Math.random() * (this.enemies_max - this.enemies_min + 1)) + this.enemies_min;
    for (let i = 0; i < num_enemies; i++) {
      let enemy = this.createEnemy(num_enemies);
      this.enemies.push(enemy);
    }
    return this.enemies;
  }
}


class Enemy {
  constructor(sprite, speed, row, col) {
    this.sprite = sprite;
    this.speed = speed;
    this.row_index = row;
    this.x = col;
    this.y = this.row_index * PIXELS_PER_ROW + -23;
    // image begins at 2; ends at pixel 99
  }
  occupiedXMin() {
    // Enemy rear begins at about pixel 2 but allowing player to occupy some space behind enemy
    return this.x + 20;
  }
  occupiedXMax() {
    // Enemy front ends at about pixel 99, but allowing some space for player in front of enemy
    return this.x + 95;
  }
  occupiedXCenter() {
    return this.occupiedXMin() + (this.occupiedXMax() - this.occupiedXMin()) / 2;
  }
  // Update the enemy's position
  // Parameter: dt, a time delta between ticks
  update(dt) {
    if (this.x >= GAMEBOARD_WIDTH) {
      this.x = INITIAL_ENEMY_POSITION;
    } else {
      this.x = this.x + this.speed * dt;
    }
  }
  render() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }
}


class Player {
  constructor() {
    this.sprite = 'images/char-boy.png';
    this.movement_enabled = true;
    this.reset();
    // image begins at 17; ends at pixel 84
  }
  reset() {
    this.row_index = 5;
    this.col_index = 2;
    this.x = INITIAL_PLAYER_POSITION_X;
    this.y = INITIAL_PLAYER_POSITION_Y;
  }
  occupiedXMin() {
    return this.x + 17;
  }
  occupiedXMax() {
    return this.x + 84; // 101 - 17
  }
  update(dt) {}
  frontTouches(enemy) {
    return enemy.occupiedXMax() >= this.occupiedXMin() && enemy.occupiedXMax() <= this.occupiedXMax();
  }
  rearTouches(enemy) {
    return enemy.occupiedXMin() >= this.occupiedXMin() && enemy.occupiedXMin() <= this.occupiedXMax();
  }
  centerTouches(enemy) {
    return enemy.occupiedXCenter() >= this.occupiedXMin() && enemy.occupiedXCenter() <= this.occupiedXMax();
  }
  isTouchedBy(enemy) {
    if (enemy.row_index == this.row_index && (this.frontTouches(enemy) || this.rearTouches(enemy) || this.centerTouches(enemy))) {
      return true;
    }
    return false;
  }
  isInWinningPosition() {
    return this.row_index == 0;
  }
  render() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    // console.log(`${this.x}, ${this.y}`)
  }
  moveUp() {
    if (this.row_index > 0) {
      this.y -= PIXELS_PER_ROW;
      this.row_index -= 1;
    }
  }
  moveDown() {
    if (this.row_index < GAMEBOARD_ROWS - 1) {
      this.y += PIXELS_PER_ROW;
      this.row_index += 1;
    }
  }
  moveRight() {
    if (this.col_index < GAMEBOARD_COLS - 1) {
      this.x += PIXELS_PER_COL;
      this.col_index += 1;
    }
  }
  moveLeft() {
    if (this.col_index > 0) {
      this.x -= PIXELS_PER_COL;
      this.col_index -= 1;
    }
  }
  disableMovement() {
    this.movement_enabled = false;
  }
  handleInput(action_name) {
    if (this.movement_enabled) {
      if (action_name == 'up') {
        this.moveUp();

      } else if (action_name == 'down') {
        this.moveDown();
      } else if (action_name == 'right') {
        this.moveRight();
      } else if (action_name == 'left') {
        this.moveLeft();
      }
    }
  }
}


class GameState {
  constructor() {
    this.gameStats = new GameStats();
    this.player = new Player();
    this.allEnemies = [];
  }
  clearEnemies() {
    while (this.allEnemies.length > 0) {
      this.allEnemies.pop();
    }
  }
  stopEnemies() {
    for (let enemy of this.allEnemies) {
      enemy.speed = 0;
    }
  }
  populateEnemies() {
    let level = this.gameStats.current_level;
    let enemy_creator = new EnemyCreator(level * 50, level * 50 + 100, level * 1.25, level * 1.5);
    enemy_creator.createEnemies();
    for (let enemy of enemy_creator.enemies) {
      this.allEnemies.push(enemy);
    }
  }
  startNewGame(gameResult = null) {
    if (gameResult == 'win') {
      this.gameStats.recordWin(this.allEnemies);
    }
    this.clearEnemies();
    this.populateEnemies();
    this.player.reset();
    this.updateStatsBoard();
  }
  gameOver() {
    this.gameStats.recordLoss(this.allEnemies);
    this.stopEnemies();
    this.player.disableMovement();

    allGameStats.update(this.gameStats);

    sessionStorage.setItem("gameStats", JSON.stringify(allGameStats));

    setTimeout(function() {
      window.location.href = 'lose.html';
    }, 2000, )
  }
  updateStatsBoard() {
    document.querySelector("#level-display").textContent = this.gameStats.current_level;
    document.querySelector("#wins-display").textContent = this.gameStats.wins;
    document.querySelector("#enemies-num-display").textContent = this.gameStats.enemies_dodged;
    document.querySelector("#enemies-speed-display").textContent = this.gameStats.enemies_max_speed;
  }
}

// Instantiate game objects.
// fixme: this is ugly with allGameStats as a global?
const priorGameStats = sessionStorage.getItem("gameStats");
const allGameStats = new GameStats();
if (priorGameStats) {
  allGameStats.update(JSON.parse(priorGameStats));
}
const gameState = new GameState();
const player = gameState.player;
const allEnemies = gameState.allEnemies;

function main(event) {
  gameState.startNewGame();
}

// Event listeners.
document.addEventListener('keyup', function(e) {
  let allowedKeys = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down'
  };

  player.handleInput(allowedKeys[e.keyCode]);
});
window.onload = main;
