// public/game.js

class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }
  
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

class MainScene extends Phaser.Scene {
  constructor() {
    super('MainScene');
  }
  
  init(data) {
    // Save the scene configuration passed from BootScene.
    this.sceneConfig = data.sceneConfig;
  }
  
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

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: 'phaser-example',
  // Register both scenes with the BootScene coming first.
  scene: [BootScene, MainScene],
};

const game = new Phaser.Game(config);
