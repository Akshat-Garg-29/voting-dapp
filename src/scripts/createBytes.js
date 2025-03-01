const ethers = require('ethers');

async function createBytes(args){
     const name = args;
     const bytes = ethers.encodeBytes32String(name);
     console.log(bytes);
}
module.exports = createBytes;
