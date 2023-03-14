// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract RFRToken is ERC20 {
    constructor() ERC20("Roadmap Feature Request Token", "RFRT") {
        _mint(_msgSender(), 100000000 * 10 ** 18);
    }
}
