const Box = artifacts.require("Box");

contract("Box", (accounts) => {
    var boxInstance ;
    const ownerAddress = accounts[0];

    it("Upload file", () => {
        return Box.deployed().then((instance) => {
            boxInstance = instance;
            return boxInstance.uploadFile("test.txt", "Hello world", "64ec88ca00b268e5ba1a35678a1b5316d212f4f366b2477232534a8aeca37f3c", "txt", 11200);
        }).then((receipt) => {
            assert.equal(receipt.logs[0].event, "Upload");
            assert.notEqual(receipt.logs[0].args.file, "0x0");
            assert.equal(receipt.logs[0].args.creator, ownerAddress);
        })
    })
})