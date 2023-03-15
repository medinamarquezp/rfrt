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
    mapping(address => bool) public admins;
    mapping(uint256 => FeatureRequest) public features;
    mapping(Status => uint256[]) public roadmap;

    constructor(address _token) Swap(_token) {
        featureId = block.timestamp;
        admins[msg.sender] = true;
    }

    function getNextFeatureID() internal view returns (uint256) {
        return featureId + 1;
    }

    function getLastPendingFeature()
        public
        view
        returns (FeatureRequest memory)
    {
        uint256 _lastIndex = roadmap[Status.Pending].length - 1;
        uint256 _featureId = roadmap[Status.Pending][_lastIndex];
        return features[_featureId];
    }

    function createFeatureRequest(
        string memory _title,
        string memory _description
    ) public returns (uint256) {
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
        roadmap[Status.Pending].push(_id);
        return _id;
    }

    function vote(uint256 _featureId) public payable returns (bool) {
        require(msg.value == 1 ether, "Votes costs 1 RFRT");
        features[_featureId].votes += 1;
        return true;
    }

    function changeFeatureRequestStatus(
        uint256 _featureId,
        Status _status
    ) public onlyadmins returns (bool) {
        features[_featureId].status = _status;
        return true;
    }

    function manageAdmins(
        address _userAddress,
        bool _status
    ) public onlyowner returns (bool) {
        admins[_userAddress] = _status;
        return true;
    }

    modifier onlyadmins() {
        require(
            admins[msg.sender] == true,
            "This operation is only available for admins"
        );
        _;
    }
}
