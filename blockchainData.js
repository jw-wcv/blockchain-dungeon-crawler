/**
 * Retrieves blockchain data for game configuration.
 * 
 * @returns {Object} The blockchain data containing game configuration.
 */
export function getBlockchainData() {
  return {
    blockchainData: {
      gameConfig: {
        map: [
          ['S', '.', '.', 'T'],
          ['.', '#', '.', '.'],
          ['.', '.', '.', 'M'],
          ['T', '.', '.', 'E'],
        ],
        legends: {
          S: 'player',
          E: 'exit',
          T: 'treasure',
          M: 'monster',
          '#': 'wall',
          '.': 'path',
        },
      },
    },
  };
}