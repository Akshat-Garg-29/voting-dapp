// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.21;

contract Voting{
      address public owner;
      uint maxVotes;
      bytes32 winner;
     struct candidateInfo{
        bytes32 name;
        uint voteCount;
     }
     mapping(address => bool) voted;
     mapping (uint =>candidateInfo) candidates;
     constructor(bytes32[] memory names){
       owner = msg.sender;
       maxVotes = 0;
       winner = 0x4e6f2077696e6e65720000000000000000000000000000000000000000000000;
       for(uint i = 0;i<names.length;i++){
            candidates[i] = candidateInfo({
               name : names[i],
               voteCount : 0
            });
       }
     }

     function vote(uint cno) public returns (bool){
        require(!voted[msg.sender],'Your Vote has been recorded already');
         voted[msg.sender] = true;
         candidates[cno].voteCount += 1;
         if(maxVotes < candidates[cno].voteCount){
            maxVotes = candidates[cno].voteCount;
            winner = candidates[cno].name;
         }
         return voted[msg.sender];
     }
      
     function getWinner() public view returns (bytes32){
          require(msg.sender == owner,"Owner required");
          return winner;
     }
    
}