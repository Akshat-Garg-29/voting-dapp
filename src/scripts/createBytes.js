const ethers = require('ethers');

async function createBytes(args){
     const name = args;
     const bytes = ethers.encodeBytes32String(name);
     console.log(bytes);
}
// createBytes("Akshat")
module.exports = createBytes;
