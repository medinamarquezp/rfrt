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

    function getNextFeatureID() public view returns (uint256) {
        return featureId + 1;
    }

    function getLastPendingFeature()
        public
        view
        returns (FeatureRequest memory)
    {
        uint256 lastIndex = roadmap[Status.Pending].length - 1;
        return roadmap[Status.Pending][lastIndex];
    }

    function createFeatureRequest(
        string memory _title,
        string memory _description
    ) public returns (bool) {
        require(
            token.balanceOf(msg.sender) > 0,
            "You must have some RFRT tokens in your wallet"
        );
        uint256 _id = getNextFeatureID();
        FeatureRequest memory feature = FeatureRequest({
            id: _id,
            owner: msg.sender,
            title: _title,
            description: _description,
            status: Status.Pending,
            votes: 0,
            createdAt: block.timestamp,
            rejectedAt: 0
        });
        features[_id] = feature;
        roadmap[Status.Pending].push(feature);
        return true;
    }
}
