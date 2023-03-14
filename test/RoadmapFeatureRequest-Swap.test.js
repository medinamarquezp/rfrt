const RFRToken = artifacts.require("RFRToken");
const RoadmapFeatureRequest = artifacts.require("RoadmapFeatureRequest");

contract("RoadmapFeatureRequest SWAP methods", (accounts) => {
  let token, instance;

  before(async () => {
    token = await RFRToken.deployed();
    instance = await RoadmapFeatureRequest.deployed();
  });

  const getBalance = async (address) => {
    return web3.utils.fromWei(
      (await token.balanceOf(address)).toString(),
      "ether"
    );
  };

  it("Should validate initial swap rate", async () => {
    const rate = await instance.rate();
    assert.equal(rate, 100, "Initial rate should be 10");
  });

  it("Should process a buy transaction", async () => {
    const preBalance = await getBalance(accounts[0]);
    const { receipt } = await instance.buy({
      from: accounts[0],
      value: web3.utils.toWei(".01", "ether"),
    });
    const postBalance = await getBalance(accounts[0]);
    assert.equal(receipt.status, true, "Receipt status should be truthy");
    assert.equal(preBalance, "0", "Pre balance should be 0");
    assert.equal(postBalance, "1", "Post balance should be 1");
  });

  it("Should process a sell transaction", async () => {
    const preBalance = await getBalance(accounts[0]);
    const { receipt } = await instance.sell(web3.utils.toWei("1", "ether"), {
      from: accounts[0],
    });
    const postBalance = await getBalance(accounts[0]);
    assert.equal(receipt.status, true, "Receipt status should be truthy");
    assert.equal(preBalance, "1", "Pre balance should be 1");
    assert.equal(postBalance, "0", "Post balance should be 0");
  });

  it("Should update swap rate", async () => {
    await instance.updateRate(20);
    const rate = await instance.rate();
    assert.equal(rate, 20, "Updated rate should be 20");
    await instance.updateRate(100);
  });
});
