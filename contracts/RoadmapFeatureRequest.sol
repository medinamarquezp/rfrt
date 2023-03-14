// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./Swap.sol";

contract RoadmapFeatureRequest is Swap {
    enum Status {
        Pending,
        Accepted,
        InProgress,
        Shipped,
        Rejected
    }

    struct FeatureRequest {
        uint256 id;
        address owner;
        string title;
        string description;
        Status status;
        uint256 votes;
        uint256 createdAt;
        uint256 rejectedAt;
    }

    uint256 featureId;
    mapping(uint256 => FeatureRequest) public features;
    mapping(Status => FeatureRequest[]) public roadmap;

    constructor(address _token) Swap(_token) {
        featureId = block.timestamp;
    }
}
