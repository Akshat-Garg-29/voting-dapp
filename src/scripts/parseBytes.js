const ethers = require('ethers');
require('dotenv').config({ path:'/.env'});
async function parseBytes(args){
     const name = await ethers.decodeBytes32String(args);
     console.log(name);
}
// parseBytes('0x42686176696b6100000000000000000000000000000000000000000000000000')
module.exports = parseBytes;