import React, { useState } from 'react'
import {ethers} from 'ethers'
export default function OwnerDashboard(props) {
  const [winner,setWinner] = useState('NA');
  async function parseBytes(arg){
      const name = ethers.decodeBytes32String(arg);
           return name;
  }
  const showWinner = async () =>{
    //calls getWinner function of smart contract
    const res = await props.contract.methods.getWinner().call({from : props.account});
    const winner =  parseBytes(res);
    setWinner(winner);
    console.log("changed")
 }
  return (
    <div>
    <div>
      <button className='btn btn-success' onClick={showWinner}>Show Winner</button>
    </div>
    {
      winner != 'NA' && <p className='fw-bold p-3'>Winner : {winner}</p>
    }
    </div>
  )
}
