// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.19;

import "./AnonAadhaarVote.sol";

contract AadhaarVote {
    
    address public anonAadhaarVerifierAddr;
    address[] public allVotes;

    constructor(address _verifierAddr){
        anonAadhaarVerifierAddr = _verifierAddr;
    }

    function launchVote(string memory _votingQuestion, string[] memory _proposalDescription) public{
        // Deploy a new AnonAadhaarVote contract
        AnonAadhaarVote newContract = new AnonAadhaarVote(_votingQuestion, _proposalDescription, anonAadhaarVerifierAddr);
        allVotes.push(address(newContract));
    }

    function getAllVotes() public view returns(address[] memory) {
        return allVotes;
    }

    function getAnonAadharVerifierAddress() public view returns(address) {
        return anonAadhaarVerifierAddr;
    }
}
