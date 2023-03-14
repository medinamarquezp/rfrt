// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./Swap.sol";

contract RoadmapFeatureRequest is Swap {
    constructor(address _token) Swap(_token) {}
}
