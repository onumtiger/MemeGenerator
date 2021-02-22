var Jimp = require('jimp');

  async function execute () {
    const resultingImage = await Jimp.read('/images/jan_domi_punch.png')    
  }

  export default{
    execute
  }