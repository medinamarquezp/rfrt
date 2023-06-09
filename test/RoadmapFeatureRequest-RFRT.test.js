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

  it("Should validate admin management", async () => {
    await truffleAssert.fails(
      instance.manageAdmins(accounts[3], true, {
        from: accounts[4],
      }),
      truffleAssert.ErrorType.REVERT,
      "This operation is only available for contract owner"
    );
  });

  it("Should manage admin accounts", async () => {
    const isAdmin = await instance.admins(accounts[3]);
    assert.equal(isAdmin, false, "Account should not to be an admin");
    const { receipt: first } = await instance.manageAdmins(accounts[3], true);
    assert.equal(first.status, true, "Receipt status should be truthy");
    const admin = await instance.admins(accounts[3]);
    assert.equal(admin, true, "Account should be an admin");
    const { receipt: second } = await instance.manageAdmins(accounts[3], false);
    assert.equal(second.status, true, "Receipt status should be truthy");
    const adminUpdated = await instance.admins(accounts[3]);
    assert.equal(adminUpdated, false, "Account should not to be an admin");
  });

  it("Should validate feature request status changes", async () => {
    const feature = await instance.getLastPendingFeature();
    await truffleAssert.fails(
      instance.changeFeatureRequestStatus(feature.id, 1, {
        from: accounts[4],
      }),
      truffleAssert.ErrorType.REVERT,
      "This operation is only available for admins"
    );
  });

  it("Should update feature request status", async () => {
    const feature = await instance.getLastPendingFeature();
    const { receipt } = await instance.changeFeatureRequestStatus(
      feature.id,
      1
    );
    assert.equal(receipt.status, true, "Receipt status should be truthy");
    const featureUpdated = await instance.getLastPendingFeature();
    assert.equal(
      featureUpdated.status,
      "1",
      "Feature updated should have status 1"
    );
  });

  it("Should validate voted features rejections", async () => {
    const feature = await instance.getLastPendingFeature();
    await truffleAssert.fails(
      instance.rejectsFeatureRequest(feature.id),
      truffleAssert.ErrorType.REVERT,
      "Cannot rejects feature request with votes"
    );
  });

  it("Should validate not expired features rejections", async () => {
    const title = "Not expired feature";
    const description = "Not expired feature description";
    await instance.createFeatureRequest(title, description, {
      from: accounts[1],
    });
    const feature = await instance.getLastPendingFeature();
    await truffleAssert.fails(
      instance.rejectsFeatureRequest(feature.id),
      truffleAssert.ErrorType.REVERT,
      "Feature request not expired yet"
    );
  });
  it("Should rejects a feature expired without votes", async () => {
    const title = "Expired feature";
    const description = "Expired feature description";
    const status = 0;
    const votes = 0;
    const createdAt = new Date("2020-01-01").getTime() / 1000;
    await instance.createInternalFeatureRequest(
      title,
      description,
      status,
      votes,
      createdAt
    );
    const feature = await instance.getLastPendingFeature();
    await instance.rejectsFeatureRequest(feature.id);
    const rejectedFeature = await instance.features(feature.id);
    assert.equal(
      rejectedFeature.status.toString(),
      "4",
      "Feature status should be rejected (4)"
    );
    assert.equal(
      Number(rejectedFeature.rejectedAt.toString()) > 0,
      true,
      "Feature rejectedAt should not be 0"
    );
  });
});
