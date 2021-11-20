// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract WorldGreet {
  uint256 totalHellos;
  uint256 prizeAmount = 0.0001 ether;
  mapping(address => uint256) addressesToHellos;
  address[] uniqueAddresses;

  struct Greeters {
    address greeterAddress;
    string message;
    uint256 timestamp;
  }

  Greeters[] greeters;

  event NewGreeting(address indexed from, uint256 timestamp, string message);

  constructor() payable {
    console.log("What's poppin ETH network?");
  }

  function sayHello(string memory _message) public {
    totalHellos += 1;

    if(addressesToHellos[msg.sender] == 0) {
      uniqueAddresses.push(msg.sender);
    }

    addressesToHellos[msg.sender] += 1;

    greeters.push(Greeters(msg.sender, _message, block.timestamp));

    emit NewGreeting(msg.sender, block.timestamp, _message);

    require(prizeAmount <= address(this).balance, "We broke. No money left in the contract :(");
    (bool success, ) = (msg.sender).call{value: prizeAmount}("");
    require(success, "Failed to withdraw");
  }

  function getAllHellos() public view returns (Greeters[] memory) {
    return greeters;
  }

  function getTotalHellos() public view returns(uint256) {
    console.log("%s total hellos from %s unique addresses", totalHellos, uniqueAddresses.length);
    return totalHellos;
  }
}