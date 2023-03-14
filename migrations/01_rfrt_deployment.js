const RFRToken = artifacts.require("RFRToken");
const RoadmapFeatureRequest = artifacts.require("RoadmapFeatureRequest");

module.exports = async function (deployer) {
  await deployer.deploy(RFRToken);
  const token = await RFRToken.deployed();

  await deployer.deploy(RoadmapFeatureRequest, token.address);
  const receiver = await RoadmapFeatureRequest.deployed();

  const funds = await web3.utils.toWei("100000000", "ether");
  await token.transfer(receiver.address, funds);
  await token.approve(receiver.address, funds);
};
