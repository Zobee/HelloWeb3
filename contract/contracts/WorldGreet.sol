// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract WorldGreet {
  uint256 private randomSeed;

  uint256 totalHellos;
  uint256 prizeAmount = 0.0001 ether;

  address[] uniqueAddresses;

  mapping(address => uint256) addressesToHellos;
  mapping(address => uint256) public lastHelloAt;

  struct Greeters {
    address greeterAddress;
    string message;
    uint256 timestamp;
    bool isWinner;
  }

  Greeters[] greeters;

  event NewGreeting(address indexed from, uint256 timestamp, string message);

  constructor() payable {
    console.log("What's poppin ETH network?");
    randomSeed = (block.timestamp + block.difficulty) % 100;

  }

  function sayHello(string memory _message) public {

    require(lastHelloAt[msg.sender] + 15 seconds < block.timestamp, "Wait 15m to send another message");

    bool isWinner = false;
    totalHellos += 1;

    if(addressesToHellos[msg.sender] == 0) {
      uniqueAddresses.push(msg.sender);
    }

    lastHelloAt[msg.sender] = block.timestamp;
    addressesToHellos[msg.sender] += 1;

    randomSeed = (block.difficulty + block.timestamp + randomSeed) % 100;
    if (randomSeed <= 50) {
      isWinner = true;
      require(prizeAmount <= address(this).balance, "We're broke. No money left in the contract :(");
      (bool success, ) = (msg.sender).call{value: prizeAmount}("");
      require(success, "Failed to withdraw");
    }
    greeters.push(Greeters(msg.sender, _message, block.timestamp, isWinner));
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