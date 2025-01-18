// config.js
import dotenv from 'dotenv';
dotenv.config();

function validateConfig(config) {
  if (!config.openaiApiKey) {
    throw new Error('OPENAI_API_KEY is not set in the environment.');
  }
  if (config.imageProvider === 'stable_diffusion' && !config.stableDiffusionUrl) {
    throw new Error('STABLE_DIFFUSION_URL is required for Stable Diffusion image provider.');
  }
}

/**
 * Configuration object for the application.
 * 
 * @property {number} port - The port on which the server will run. Defaults to 3000 if not specified in the environment.
 * @property {string} imageProvider - The image provider to use for generating images. Can be 'dalle' or 'stable_diffusion'. Defaults to 'dalle'.
 * @property {string} openaiApiKey - The API key for accessing OpenAI services. Must be set in the environment.
 * @property {string} stableDiffusionUrl - The URL endpoint for the Stable Diffusion image generation service. Must be set in the environment if using 'stable_diffusion'.
 * @property {string} assetsPath - The path where generated assets will be stored. Defaults to 'public/assets'.
 */
export const config = {
  port: process.env.PORT || 3000,
  imageProvider: process.env.IMAGE_PROVIDER || 'dalle', // or 'stable_diffusion'
  openaiApiKey: process.env.OPENAI_API_KEY,
  stableDiffusionUrl: process.env.STABLE_DIFFUSION_URL,
  assetsPath: 'public/assets',
};

validateConfig(config);
