// public/game.js

/**
 * BootScene is responsible for loading the initial configuration and assets.
 * It displays a loading bar and transitions to the MainScene once loading is complete.
 */
class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }
  
  /**
   * Preloads the scene configuration and updates the loading bar.
   */
  preload() {
    // Show the loading bar element
    const loadingBar = document.getElementById('loading-bar');
    loadingBar.style.display = 'block';

    // Load the scene configuration JSON via Phaser’s loader.
    this.load.json('sceneConfig', '/assets/scene-config.json');

    // Update the loading bar progress.
    this.load.on('progress', (value) => {
      loadingBar.innerHTML = `Loading: ${Math.round(value * 100)}%`;
    });
  }
  
  /**
   * Creates the scene by hiding the loading bar and starting the MainScene.
   */
  create() {
    // Hide the loading bar once JSON is loaded.
    const loadingBar = document.getElementById('loading-bar');
    loadingBar.style.display = 'none';

    // Retrieve the scene config from the cache.
    const sceneConfig = this.cache.json.get('sceneConfig');
    if (!sceneConfig) {
      console.error('Scene configuration is missing.');
      return;
    }
    console.log('Scene configuration loaded:', sceneConfig);
    
    // Start MainScene, passing the loaded configuration.
    this.scene.start('MainScene', { sceneConfig });
  }
}

/**
 * MainScene is responsible for rendering the game map and handling player interactions.
 */
class MainScene extends Phaser.Scene {
  constructor() {
    super('MainScene');
  }
  
  /**
   * Initializes the scene with data passed from BootScene.
   * @param {Object} data - The data object containing scene configuration.
   */
  init(data) {
    // Save the scene configuration passed from BootScene.
    this.sceneConfig = data.sceneConfig;
  }
  
  /**
   * Preloads assets based on the scene configuration and updates the loading bar.
   */
  preload() {
    // Show the loading bar again while assets load.
    const loadingBar = document.getElementById('loading-bar');
    loadingBar.style.display = 'block';

    // Update loading progress.
    this.load.on('progress', (value) => {
      loadingBar.innerHTML = `Loading: ${Math.round(value * 100)}%`;
    });

    // Queue all image assets using the legends in the configuration.
    Object.values(this.sceneConfig.legends).forEach((url) => {
      // Derive a key from the filename (e.g., "player" from "/assets/player.png")
      const key = url.split('/').pop().replace('.png', '');
      console.log(`Queueing asset: key="${key}" from url="${url}"`);
      this.load.image(key, url);
    });
    
    // When asset loading is complete, hide the loading bar.
    this.load.once('complete', () => {
      loadingBar.style.display = 'none';
      console.log('All assets in MainScene have been loaded.');
    });
  }
  
  /**
   * Creates the game map and sets up player controls.
   */
  create() {
    const { map, legends } = this.sceneConfig;
    
    // Build the game map based on the loaded configuration.
    map.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        const x = colIndex * 64;
        const y = rowIndex * 64;
        const assetUrl = legends[cell];
        if (assetUrl) {
          const key = assetUrl.split('/').pop().replace('.png', '');
          const sprite = this.add.sprite(x, y, key);
          if (cell === 'S') {  // "S" indicates the player's start.
            this.player = sprite;
          }
        } else {
          console.warn(`No asset found for map cell "${cell}" at [${rowIndex}, ${colIndex}]`);
        }
      });
    });
    
    // Set up keyboard cursors for player movement.
    this.cursors = this.input.keyboard.createCursorKeys();
    
    // Resume the Web Audio API on a user gesture (useful for mobile browsers).
    this.input.on('pointerdown', () => {
      if (this.sound.context.state === 'suspended') {
        this.sound.context.resume();
      }
    });
  }
  
  /**
   * Updates the player's position based on keyboard input.
   */
  update() {
    // Update player movement based on keyboard input.
    if (this.player) {
      if (this.cursors.left.isDown) this.player.x -= 2;
      if (this.cursors.right.isDown) this.player.x += 2;
      if (this.cursors.up.isDown) this.player.y -= 2;
      if (this.cursors.down.isDown) this.player.y += 2;
    }
  }
}

// Configuration for the Phaser game instance.
const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: 'phaser-example',
  // Register both scenes with the BootScene coming first.
  scene: [BootScene, MainScene],
};

// Create a new Phaser game instance with the specified configuration.
const game = new Phaser.Game(config);
