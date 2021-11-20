// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract WorldGreet {
  uint256 totalHellos;
  mapping(address => uint256) addressesToHellos;
  address[] uniqueAddresses;

  struct Greeters {
    address greeterAddress;
    string message;
    uint256 timestamp;
  }

  Greeters[] greeters;

  event NewGreeting(address indexed from, uint256 timestamp, string message);

  constructor() {
    console.log("What's poppin ETH network?");
  }

  function sayHello(string memory _message) public {
    totalHellos += 1;

    if(addressesToHellos[msg.sender] == 0) {
      uniqueAddresses.push(msg.sender);
    }

    addressesToHellos[msg.sender] += 1;

    greeters.push(Greeters(msg.sender, _message, block.timestamp));

    uint256 numHellosFromSender = addressesToHellos[msg.sender];
    console.log("%s has said hello!", msg.sender);
    console.log("This address has said hello %s time(s).", numHellosFromSender);

    emit NewGreeting(msg.sender, block.timestamp, _message);
  }

  function getAllHellos() public view returns (Greeters[] memory) {
    return greeters;
  }

  function getTotalHellos() public view returns(uint256) {
    console.log("%s total hellos from %s unique addresses", totalHellos, uniqueAddresses.length);
    return totalHellos;
  }
}