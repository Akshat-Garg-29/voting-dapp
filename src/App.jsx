import { useEffect, useState } from 'react'
import './App.css'
import Web3 from 'web3'
import VotingForm from './assets/VotingForm'
import Voting from './truffle_abis/Voting.json'
import VoteSubmitted from './assets/VoteSubmitted'
import OwnerDashboard from './assets/OwnerDashboard'
function App() {
  const [account,setAccount] = useState('0x0');
  const [contract,setContract] = useState();
  const [Votestatus,setVotestatus] = useState(false);
  useEffect(()=>{
    //load both web3 and contract data
    async function runIt() {
      await loadWeb3();
      await loadBlockchainData();
    }
    runIt();
  },[])
  async function loadWeb3(){
    //loads web3
    if(window.ethereum){
       window.web3 = new Web3(window.ethereum);
       await window.ethereum.enable();
    } else if(window.web3){
        window.web3 = new Web3(window.web3.currentProvider);
    }
    else{
      alert('Error!! No ehereuem browser detected');
    }
}
async function loadBlockchainData() {
  //loads blockchain data
  const web3 = window.web3
  const account = await web3.eth.getAccounts();
  setAccount(account[0]);
  const networkId = await web3.eth.net.getId();
  const ContractData = Voting.networks[networkId]

  if(ContractData){
    const contract = new web3.eth.Contract(Voting.abi,ContractData.address)
    setContract(contract);
  }
  else{
    alert('Contract Not found on this network');
  }
}
  return (
      <>
      {
        //note -> check owner address 
        account == '//past owner address here' ? <OwnerDashboard account = {account} contract = {contract}/> : Votestatus == false ? 
        <VotingForm account = {account} contract = {contract} setVotestatus = {setVotestatus}/>:<VoteSubmitted/>
      }
      </>
  )
}

export default App
