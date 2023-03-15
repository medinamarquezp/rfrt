const truffleAssert = require("truffle-assertions");
const RFRToken = artifacts.require("RFRToken");
const RoadmapFeatureRequest = artifacts.require("RoadmapFeatureRequest");

contract("RoadmapFeatureRequest RFRT methods", (accounts) => {
  let token, instance;

  before(async () => {
    token = await RFRToken.deployed();
    instance = await RoadmapFeatureRequest.deployed();
  });

  it("Should validate create feature request", async () => {
    const title = "Feature title";
    const description = "Feature description";
    await truffleAssert.fails(
      instance.createFeatureRequest(title, description, {
        from: accounts[1],
      }),
      truffleAssert.ErrorType.REVERT,
      "You must have some RFRT tokens in your wallet"
    );
  });

  it("Should create a new feature request", async () => {
    const title = "Feature title";
    const description = "Feature description";
    await instance.buy({
      from: accounts[1],
      value: web3.utils.toWei("1", "ether"),
    });
    const { receipt } = await instance.createFeatureRequest(
      title,
      description,
      {
        from: accounts[1],
      }
    );
    assert.equal(receipt.status, true, "Receipt status should be truthy");
    const feature = await instance.getLastPendingFeature();
    assert.equal(feature.title, title, "Feature title should match");
    assert.equal(
      feature.description,
      description,
      "Feature description should match"
    );
  });
  it("Should validate votes cost", async () => {
    const feature = await instance.getLastPendingFeature();
    await truffleAssert.fails(
      instance.vote(feature.id),
      truffleAssert.ErrorType.REVERT,
      "Votes costs 1 RFRT"
    );
  });
  it("Should vote for a feature request", async () => {
    const feature = await instance.getLastPendingFeature();
    const { receipt } = await instance.vote(feature.id, {
      from: accounts[1],
      value: web3.utils.toWei("1", "ether"),
    });
    assert.equal(receipt.status, true, "Receipt status should be truthy");
    const featureUpdated = await instance.getLastPendingFeature();
    assert.equal(featureUpdated.votes, "1", "Feature votes should be 1");
  });
});
