// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract WorldGreet {
  uint256 totalHellos;
  mapping(address => uint256) addressesToHellos;
  address[] uniqueAddresses;

  constructor() {
    console.log("What's poppin ETH network?");
  }

  function sayHello() public {
    totalHellos += 1;

    if(addressesToHellos[msg.sender] == 0) {
      uniqueAddresses.push(msg.sender);
    }

    addressesToHellos[msg.sender] += 1;
    uint256 numHellosFromSender = addressesToHellos[msg.sender];
    console.log("%s has waved!", msg.sender);
    console.log("This address has waved %s time(s).", numHellosFromSender);
  }

  function getTotalHellos() public view returns(uint256) {
    console.log("%s total hellos from %s unique addresses", totalHellos, uniqueAddresses.length);
    return totalHellos;
  }
}