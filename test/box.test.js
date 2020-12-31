const Box = artifacts.require("Box");

contract("Box", (accounts) => {
    var boxInstance ;
    const ownerAddress = accounts[0];
    const myfiles = [];

    it("Upload file", () => {
        return Box.deployed().then((instance) => {
            boxInstance = instance;
            return boxInstance.uploadFile("test.txt", "Hello world", "64ec88ca00b268e5ba1a35678a1b5316d212f4f366b2477232534a8aeca37f3c", "txt", 11200);
        }).then((receipt) => {
            assert.equal(receipt.logs[0].event, "Upload");
            assert.notEqual(receipt.logs[0].args.file, "0x0");
            myfiles.push(receipt.logs[0].args.file);
            assert.equal(receipt.logs[0].args.creator, ownerAddress);
        })
    })

    it("Share file with address", ()=> {
        return Box.deployed().then((instance) => {
            boxInstance = instance;
            return boxInstance.addUserToFile(accounts[1], myfiles[0]);
        }).then((receipt) => {
            console.log(receipt.logs[0]);
            assert.equal(receipt.logs[0].event, "Share");
            assert.equal(receipt.logs[0].args.file, myfiles[0]);
            assert.equal(receipt.logs[0].args.creator, ownerAddress);
            assert.equal(receipt.logs[0].args.with, accounts[1]);
            return boxInstance.addUserToFile(accounts[1], myfiles[0]);
        }).then(assert.fail).catch((error) => {
            assert.equal(error.reason, "ALREADY AUTHORIZED!");
        })
    })
})