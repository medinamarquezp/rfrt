// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract RFRToken is ERC20 {
    constructor() ERC20("RFRT", "Roadmap Feature Request Token") {
        _mint(msg.sender, 1000000);
    }
}
