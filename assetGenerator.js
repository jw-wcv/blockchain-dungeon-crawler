// assetGenerator.js
import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import { config } from './config.js';
import { OpenAI } from 'openai';

const openai = new OpenAI({ apiKey: config.openaiApiKey });

// Generate image using DALL·E
async function generateDalleImage(value) {
  try {
    const response = await openai.images.generate({
      prompt: `A detailed fantasy-style ${value} sprite for a dungeon crawler game.`,
      n: 1,
      size: '256x256',
    });
    const imageUrl = response.data[0].url;
    const imageResponse = await fetch(imageUrl);
    const buffer = await imageResponse.arrayBuffer();
    return Buffer.from(buffer);
  } catch (error) {
    console.error(`Failed to generate DALL·E image for ${value}:`, error);
    throw error;
  }
}

// Generate image using a Stable Diffusion endpoint
async function generateStableDiffusionImage(value) {
  try {
    const response = await fetch(config.stableDiffusionUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: `A detailed fantasy-style ${value} sprite for a dungeon crawler game.`,
        size: '256x256',
      }),
    });
    const data = await response.json();
    const base64String = data.base64Image;
    return Buffer.from(base64String, 'base64');
  } catch (error) {
    console.error(`Failed to generate Stable Diffusion image for ${value}:`, error);
    throw error;
  }
}

// Main function to generate assets based on legends
export async function generateAssets(legends) {
  const assets = {};
  for (const [key, value] of Object.entries(legends)) {
    const imagePath = path.join(config.assetsPath, `${value}.png`);
    if (!fs.existsSync(imagePath)) {
      console.log(`Generating asset for: ${value}`);
      let imageBuffer;
      try {
        if (config.imageProvider === 'dalle') {
          imageBuffer = await generateDalleImage(value);
        } else if (config.imageProvider === 'stable_diffusion') {
          imageBuffer = await generateStableDiffusionImage(value);
        } else {
          throw new Error(`Unknown image provider: ${config.imageProvider}`);
        }
      } catch (err) {
        console.error(`Error generating asset for ${value}:`, err);
        continue;
      }
      fs.writeFileSync(imagePath, imageBuffer);
    }
    assets[key] = `/assets/${value}.png`;
  }
  return assets;
}
