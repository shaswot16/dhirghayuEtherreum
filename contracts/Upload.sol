// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract Upload{
    struct Access{
        address user;//which user the connected user has given access to
        bool access;//true or false
    }

     mapping(address=>string[]) value;//address is the address of the connected wallet and string array takes the url of images stored in IPFS
     mapping(address=>mapping(address=>bool)) ownership;
     mapping(address=>Access[]) accessList;//address-connected smart contract
     mapping(address=>mapping(address=>bool)) previousData;

     function add(address _user,string memory url) external{
         value[_user].push(url);
     }
     function allow(address user) external{
         ownership[msg.sender][user]=true;
         if(previousData[msg.sender][user]){
             for (uint i = 0;i<accessList[msg.sender].length;i++){
                 if(accessList[msg.sender][i].user==user){
                     accessList[msg.sender][i].access=true;
                 }
             }
         }else{

         accessList[msg.sender].push(Access(user,true));
         previousData[msg.sender][user]=true;
         }
           

     }
     function disallow(address user) public {
         ownership[msg.sender][user]=false;
         for(uint i=0;i<accessList[msg.sender].length;i++){
             if(accessList[msg.sender][i].user==user){
                 accessList[msg.sender][i].access=false;
             }
         }
     }

     function display (address _user) external view returns(string[] memory){
         require(_user==msg.sender || ownership[_user][msg.sender],"You Donot Have Access");
         return value[_user];
     }

     function shareAccess() public view returns (Access[] memory){
         return accessList[msg.sender];
     }
}