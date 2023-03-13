// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./RFRToken.sol";

contract Swap {
    RFRToken token;
    uint256 public rate;
    address public owner;
    address public tokenAddress;

    constructor(address _token) payable {
        rate = 10;
        owner = msg.sender;
        tokenAddress = _token;
        token = RFRToken(address(tokenAddress));
    }

    function buy() public payable returns (bool) {
        uint256 amountTobuy = msg.value * rate;
        uint256 balance = token.balanceOf(address(this));
        require(amountTobuy > 0, "You must send ETH to swap tokens");
        require(
            amountTobuy <= balance,
            "Insufficient available RFRT tokens to sell. Try it again later."
        );
        token.transfer(msg.sender, amountTobuy);
        return true;
    }

    function sell(uint256 amount) public returns (bool) {
        require(amount > 0, "Amount required to sell tokens");
        uint256 amountConverted = amount / rate;
        token.transferFrom(msg.sender, payable(address(this)), amountConverted);
        payable(msg.sender).transfer(amountConverted);
        return true;
    }

    function updateRate(uint256 _rate) public onlyowner returns (uint256) {
        rate = _rate;
        return rate;
    }

    modifier onlyowner() {
        require(
            msg.sender == owner,
            "This operation is only available for contract owner"
        );
        _;
    }
}
