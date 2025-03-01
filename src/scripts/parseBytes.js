const ethers = require('ethers');
require('dotenv').config({ path:'/.env'});
async function parseBytes(args){
     const name = await ethers.decodeBytes32String(args);
     console.log(name);
}
parseBytes('0x6b726973686e6176000000000000000000000000000000000000000000000000')