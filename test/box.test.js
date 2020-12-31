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
            assert.equal(receipt.logs[0].event, "Share");
            assert.equal(receipt.logs[0].args.file, myfiles[0]);
            assert.equal(receipt.logs[0].args.creator, ownerAddress);
            assert.equal(receipt.logs[0].args.with, accounts[1]);
            return boxInstance.addUserToFile(accounts[1], myfiles[0]);
        }).then(assert.fail).catch((error) => {
            assert.equal(error.reason, "ALREADY AUTHORIZED!");
            return boxInstance.addUserToFile(accounts[2], "0x0");
        }).then(assert.fail).catch((error) => {
            assert.equal(error.reason, "invalid address");
            assert.equal(error.arg, "file");
            return boxInstance.addUserToFile(accounts[1], myfiles[0], {from: accounts[1]});
        }).then(assert.fail).catch((error)=> {
            assert.equal(error.reason, "CANNOT USE THIS METHOD!");
        })
    })

    it("Users of a file", () => {
        return Box.deployed().then((instance) => {
            boxInstance = instance;
            return boxInstance.fileUsers(myfiles[0]);
        }).then((addresses) => {
            assert.equal(addresses.includes(ownerAddress), true);
            assert.equal(addresses.includes(accounts[1]), true);
            return boxInstance.fileUsers("0x0");
        }).then(assert.fail).catch((error) => {
            assert.equal(error.reason, "invalid address");
            assert.equal(error.arg, 'file');
            return boxInstance.fileUsers(accounts[9]);
        }).then(assert.fail).catch((error) => {
            assert.notEqual(error, undefined);
        })
    })

    it("Get file", () => {
        return Box.deployed().then((instance) => {
            boxInstance = instance;
            return boxInstance.getFile(myfiles[0], {from: ownerAddress});
        }).then((receipt)=> {
            assert.equal(receipt.filename, "test.txt");
            assert.equal(receipt.hash, "64ec88ca00b268e5ba1a35678a1b5316d212f4f366b2477232534a8aeca37f3c");
            assert.equal(receipt.description, "Hello world");
            assert.notEqual(Number(receipt.created), 0);
            return boxInstance.getFile(myfiles[0], {from: accounts[1]});
        }).then(assert.fail).catch((error) => {
            assert.notEqual(error, undefined);
        })
    })

    it("Owner of the file", ()=> {
        return Box.deployed().then((instance) => {
            boxInstance = instance;
            return boxInstance.getFileOwner(myfiles[0], {from: ownerAddress});
        }).then((address) => {
            assert.notEqual(address, "0x0");
            assert.equal(address, ownerAddress);
            return boxInstance.getFileOwner(accounts[2]);
        }).then(assert.fail).catch((error) => {
            assert.notEqual(error, undefined);
        })
    })

    it("Remove someone", ()=> {
        return Box.deployed().then((instance) => {
            boxInstance = instance;
            return boxInstance.fileUsers(myfiles[0]);
        }).then((receipt) => {
            assert.equal(receipt.includes(accounts[1]), true);
            assert.equal(receipt.includes(ownerAddress), true);
            return boxInstance.removeUser(1, myfiles[0]);
        }).then((receipt)=> {
            assert.equal(receipt.logs[0].event, "Remove");
            assert.equal(receipt.logs[0].args.file, myfiles[0]);
            assert.equal(receipt.logs[0].args.creator, ownerAddress);
            assert.equal(receipt.logs[0].args.with, accounts[1]);
            return boxInstance.removeUser(0, myfiles[0]);
        }).then(assert.fail).catch((error)=> {
            assert.equal(error.reason, "CANNOT DELETE YOURSELF!");
            return boxInstance.removeUser.call(999999999999, myfiles[0]);
        }).catch(assert.fail).catch((error)=>{
            assert.notEqual(error, undefined);
        })
    })
})