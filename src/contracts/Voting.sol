// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.21;

contract Voting{
      address public owner;
     mapping(address => bool) voted;
     uint [] votes;
     uint total;
     constructor(uint val){
         owner = msg.sender;
         total = 0;
         for(uint i = 0;i<val;i++){
         votes.push(0);
         }
      }

     function vote(uint cno) public {
         require(!voted[msg.sender],'Your Vote has been recorded already');
         voted[msg.sender] = true;
         total++;
         votes[cno-1]++;
      }
     function getVotes() public view returns (uint [] memory){
         require(msg.sender == owner,"Owner required");
         return votes;
     }
    function totalVotes() public view returns (uint){
        require(msg.sender == owner,"Owner required");
        return total;
    }
}