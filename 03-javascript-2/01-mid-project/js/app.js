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


/**
 * @description Holds game statistics.
 */
class GameStats {
  constructor() {
    this.wins = 0;
    this.losses = 0;
    this.current_level = 1;
    this.max_level_reached = 0;
    this.enemies_dodged = 0;
    this.enemies_max_speed = 0;
  }
  /**
   * @description Add to this instance's stats using another GameStats instance.
   * @param {GameStats} otherGameStats the other stats, e.g. a prior game's stats.
   * @returns {null}
   */
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
  /**
   * @description Record a win: add to the game stats and increase the level by one.
   * @param {Array} all_enemies an Array of Enemy instances. Used to calculate stats about the enemies.
   * @returns {null}
   */
  recordWin(all_enemies) {
    this.current_level += 1;
    this.wins += 1;
    this.enemies_dodged += all_enemies.length;
    for (let enemy of all_enemies) {
      if (enemy.speed > this.enemies_max_speed) {
        this.enemies_max_speed = enemy.speed;
      }
    }
    if (this.current_level > this.max_level_reached) {
      this.max_level_reached = this.current_level;
    }
  }
  /**
   * @description Record a loss: add to the game stats.
   * @param {Array} all_enemies an Array of Enemy instances. Used to calculate stats about the enemies.
   * @returns {null}
   */
  recordLoss(all_enemies) {
    this.losses += 1;
    if (this.current_level > this.max_level_reached) {
      this.max_level_reached = this.current_level;
    }
  }
}


/**
 * @description Creates a random number of enemies with different speeds.
 */
class EnemyCreator {
  /**
   * @description Instantiate an EnemyCreator
   * @param {number} enemy_speed_min Minimum speed of the enemies, e.g. 50.
   * @param {number} enemy_speed_max Maximum speed of the enemies, e.g. 100.
   * @param {number} enemies_min Minimum amount of enemies to randomly create.
   * @param {number} enemies_max Maximum amount of enemies to randomly create.
   * @returns {null}
   */
  constructor(enemy_speed_min, enemy_speed_max, enemies_min, enemies_max) {
    this.enemy_speed_min = enemy_speed_min;
    this.enemy_speed_max = enemy_speed_max;
    this.enemies_min = enemies_min;
    this.enemies_max = enemies_max;
    this.enemies = [];
  }
  /**
   * @description Create a single Enemy.
   * @returns {Enemy}
   */
  createEnemy() {
    let speed = (Math.random() * (this.enemy_speed_max - this.enemy_speed_min + 1)) + this.enemy_speed_min;
    let row_index = Math.floor(Math.random() * ENEMY_ROWS.length);
    let row = ENEMY_ROWS[row_index];
    // Stagger start the enemies on different columns.
    let col = PIXELS_PER_COL * (Math.floor(Math.random() * GAMEBOARD_COLS + 1) + 1);
    console.log(`Enemy created: speed=${speed}, row=${row}, col=${col}`);
    let enemy = new Enemy('images/enemy-bug.png', speed, row, col);
    return enemy;
  }
  /**
   * @description Create a random amount of Enemy instances and add them to the enemies member.
   * @returns {Array}
   */
  createEnemies() {
    let num_enemies = Math.floor(Math.random() * (this.enemies_max - this.enemies_min + 1)) + this.enemies_min;
    for (let i = 0; i < num_enemies; i++) {
      let enemy = this.createEnemy();
      this.enemies.push(enemy);
    }
    return this.enemies;
  }
}


/**
 * @description An enemy, which has an image, a speed, and moves left-to-right across a single row.
 */
class Enemy {
  /**
   * @description Instantiate an Enemy
   * @param {string} sprite the Enemy's image, e.g. 'images/enemy-bug.png', should be 101x171 px.
   * @param {number} speed how quickly the enemy moves, e.g. 100.
   * @param {number} row the index of the row the enemy moves across (e.g. 0, 1, 2, 3, etc.)
   * @param {number} col the index of the col the enemy starts on.
   * @returns {null}
   */
  constructor(sprite, speed, row, col) {
    this.sprite = sprite;
    this.speed = speed;
    this.row_index = row;
    this.x = col;
    this.y = this.row_index * PIXELS_PER_ROW + -23;
    // image begins at 2; ends at pixel 99
  }
  /**
   * @description Return the first horizontal pixel the Enemy occupies (i.e. the enemy rear).
   * @returns {number}
   */
  occupiedXMin() {
    // Enemy rear begins at about pixel 2 but allowing player to occupy some space behind enemy
    return this.x + 20;
  }
  /**
   * @description Return the last horizontal pixel the Enemy occupies (i.e. the enemy front).
   * @returns {number}
   */
  occupiedXMax() {
    // Enemy front ends at about pixel 99, but allowing some space for player in front of enemy
    return this.x + 95;
  }
  /**
   * @description Return the center pixel the Enemy occupies.
   * @returns {number}
   */
  occupiedXCenter() {
    return this.occupiedXMin() + (this.occupiedXMax() - this.occupiedXMin()) / 2;
  }
  /**
   * @description Update the enemy's position; if the enemy goes off the board, return it to the front.
   * @param {number} dt a time delta between ticks
   * @returns {null}
   */
  update(dt) {
    if (this.x >= GAMEBOARD_WIDTH) {
      this.x = INITIAL_ENEMY_POSITION;
    } else {
      this.x = this.x + this.speed * dt;
    }
  }
  /**
   * @description Draw the Enemy's image on the board.
   * @returns {null}
   */
  render() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }
}


/**
 * @description A player, which has an image and can move up, down, left and right.
 */
class Player {
  constructor() {
    this.sprite = 'images/char-boy.png';
    this.movement_enabled = true;
    this.reset();
    // image begins at 17; ends at pixel 84
  }
  /**
   * @description Reset the player's position to it's starting position.
   * @returns {null}
   */
  reset() {
    this.row_index = 5;
    this.col_index = 2;
    this.x = INITIAL_PLAYER_POSITION_X;
    this.y = INITIAL_PLAYER_POSITION_Y;
  }
  /**
   * @description Return the first horizontal pixel the Player occupies (i.e. the Player rear).
   * @returns {number}
   */
  occupiedXMin() {
    return this.x + 17;
  }
  /**
   * @description Return the last horizontal pixel the Player occupies (i.e. the Player front).
   * @returns {number}
   */
  occupiedXMax() {
    return this.x + 84; // 101 - 17
  }
  // update(dt) {}
  /**
   * @description Return True if the front part of the Enemy touches the player.
   (Assumes the enemy and player are on the same row.)
   * @param {Enemy} enemy the Enemy to check if is touching the player.
   * @returns {bool}
   */
  frontTouches(enemy) {
    return enemy.occupiedXMax() >= this.occupiedXMin() && enemy.occupiedXMax() <= this.occupiedXMax();
  }
  /**
   * @description Return True if the rear part of the Enemy touches the player.
   (Assumes the enemy and player are on the same row.)
   * @param {Enemy} enemy the Enemy to check if is touching the player.
   * @returns {bool}
   */
  rearTouches(enemy) {
    return enemy.occupiedXMin() >= this.occupiedXMin() && enemy.occupiedXMin() <= this.occupiedXMax();
  }
  /**
   * @description Return True if the center part of the Enemy touches the player.
   (Assumes the enemy and player are on the same row.)
   * @param {Enemy} enemy the Enemy to check if is touching the player.
   * @returns {bool}
   */
  centerTouches(enemy) {
    return enemy.occupiedXCenter() >= this.occupiedXMin() && enemy.occupiedXCenter() <= this.occupiedXMax();
  }
  /**
   * @description Return True if the Enemy touches the player.
   * @param {Enemy} enemy the Enemy to check if is touching the player.
   * @returns {bool}
   */
  isTouchedBy(enemy) {
    if (enemy.row_index == this.row_index && (this.frontTouches(enemy) || this.rearTouches(enemy) || this.centerTouches(enemy))) {
      return true;
    }
    return false;
  }
  /**
   * @description Return True if the Player is in the winning row.
   * @returns {bool}
   */
  isInWinningPosition() {
    return this.row_index == 0;
  }
  /**
   * @description Draw the Player's image on the board.
   * @returns {null}
   */
  render() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    // console.log(`${this.x}, ${this.y}`)
  }
  /**
   * @description Move the player up one row.
   * @returns {null}
   */
  moveUp() {
    if (this.row_index > 0) {
      this.y -= PIXELS_PER_ROW;
      this.row_index -= 1;
    }
  }
  /**
   * @description Move the player down one row.
   * @returns {null}
   */
  moveDown() {
    if (this.row_index < GAMEBOARD_ROWS - 1) {
      this.y += PIXELS_PER_ROW;
      this.row_index += 1;
    }
  }
  /**
   * @description Move the player right one column.
   * @returns {null}
   */
  moveRight() {
    if (this.col_index < GAMEBOARD_COLS - 1) {
      this.x += PIXELS_PER_COL;
      this.col_index += 1;
    }
  }
  /**
   * @description Move the player left one column.
   * @returns {null}
   */
  moveLeft() {
    if (this.col_index > 0) {
      this.x -= PIXELS_PER_COL;
      this.col_index -= 1;
    }
  }
  /**
   * @description Disable the player from being able to move.
   * @returns {null}
   */
  disableMovement() {
    this.movement_enabled = false;
  }
  /**
   * @description If movement is enabled, move the player according to the input action.
   * @param {string} action_name a player action: up, down, left or right.
   * @returns {null}
   */
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


/**
 * @description A GameState has a stats, player and enemies.
 */
class GameState {
  constructor() {
    this.gameStats = new GameStats();
    this.player = new Player();
    this.allEnemies = [];
  }
  /**
   * @description Remove all the enemies from the world.
   * @returns {null}
   */
  clearEnemies() {
    while (this.allEnemies.length > 0) {
      this.allEnemies.pop();
    }
  }
  /**
   * @description Stop all the enemies.
   * @returns {null}
   */
  stopEnemies() {
    for (let enemy of this.allEnemies) {
      enemy.speed = 0;
    }
  }
  /**
   * @description Create all the enemies for the current level.
   * @returns {null}
   */
  populateEnemies() {
    let level = this.gameStats.current_level;
    let enemy_creator = new EnemyCreator(level * 50, level * 50 + 100, level * 1.25, level * 1.5);
    enemy_creator.createEnemies();
    for (let enemy of enemy_creator.enemies) {
      this.allEnemies.push(enemy);
    }
  }
  /**
   * @description Start a new game, either after beating a level (a win) or for the first time.
   * @param {string} gameResult If this game is started as a result of beating a level, set to "win".
   * @returns {null}
   */
  startNewGame(gameResult = null) {
    if (gameResult == 'win') {
      this.gameStats.recordWin(this.allEnemies);
    }
    this.clearEnemies();
    this.populateEnemies();
    this.player.reset();
    this.updateStatsBoard();
  }
  /**
   * @description End a game because the player lost.
   * @returns {null}
   */
  gameOver() {
    this.gameStats.recordLoss(this.allEnemies);
    this.stopEnemies();
    this.player.disableMovement();
    // Save the long-running game's stats to the session storage so lose page can access it
    // and so they can be loaded if player plays again.
    allGameStats.update(this.gameStats);
    sessionStorage.setItem("gameStats", JSON.stringify(allGameStats));
    // Transition to the lose page
    setTimeout(function() {
      window.location.href = 'lose.html';
    }, 2000, )
  }
  /**
   * @description Update the stats on the page.
   * @returns {null}
   */
  updateStatsBoard() {
    document.querySelector("#level-display").textContent = this.gameStats.current_level;
    document.querySelector("#wins-display").textContent = this.gameStats.wins;
    document.querySelector("#enemies-num-display").textContent = this.gameStats.enemies_dodged;
    document.querySelector("#enemies-speed-display").textContent = this.gameStats.enemies_max_speed;
  }
}

// Instantiate game objects.
// TODO: Probably should move some of these constants to GameState class.
// TODO: Could make sessionStorage access (getItem and setItem) as methods in GameStats.
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
// Necessary to do this so DOM is fully loaded before trying to update DOM elements.
window.onload = main;
