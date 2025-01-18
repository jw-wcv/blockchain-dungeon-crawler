// index.js
import express from 'express';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { config } from './config.js';
import { generateAssets } from './assetGenerator.js';
import { getBlockchainData } from './blockchainData.js';

dotenv.config();

const app = express();
const port = config.port;
const assetsFullPath = path.resolve(config.assetsPath);

// Ensure the assets directory exists
if (!fs.existsSync(assetsFullPath)) {
  fs.mkdirSync(assetsFullPath, { recursive: true });
}

// Serve static files from the public directory
app.use(express.static('public'));

// Serve the index.html file
app.get('/', (req, res) => {
  res.sendFile(path.resolve('public/index.html'));
});

/**
 * Generates assets from blockchain data and writes a scene configuration file.
 * 
 * @returns {Promise<void>}
 */
async function generateSceneAssets() {
  try {
    const blockchainData = getBlockchainData();
    const gameConfig = blockchainData.blockchainData.gameConfig;
    const legends = gameConfig.legends;
    const assets = await generateAssets(legends);

    const sceneConfig = {
      map: gameConfig.map,
      legends: assets,
      version: new Date().getTime(),
    };

    fs.writeFileSync(
      path.join(assetsFullPath, 'scene-config.json'),
      JSON.stringify(sceneConfig, null, 2)
    );
    console.log('Assets generated successfully.');
  } catch (error) {
    console.error('Error generating assets:', error.message);
  }
}

// Generate assets at startup
generateSceneAssets();

// Start the Express server
const server = app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Closing server...');
  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Closing server...');
  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
});
