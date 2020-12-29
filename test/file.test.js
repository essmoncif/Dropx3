const File = artifacts.require("File");

contract("File", (accounts) => {
    var fileInstance;
    const ownerAddress = accounts[0];
    
    it("Initialize file contract", ()=> {
        return File.deployed().then( (instance) => {
            fileInstance = instance;
            return fileInstance.address;
        }).then( (address) => {
            assert.notEqual(address, "0x0", "Address of File contract must be not null");
        })
    })

    it("Share file with someone", ()=>{
        return File.deployed().then( (instance) => {
            fileInstance = instance;
            return fileInstance.share(accounts[1], {from: ownerAddress});
        }).then( (receipt) => {
            assert.equal(receipt.logs.length, 0, "Any error");
        })
    })

    it("Share file with someone already authorized", ()=> {
        return File.deployed().then( (instance) => {
            fileInstance = instance;
            return fileInstance.share(accounts[1], {from: ownerAddress});
        }).then( (receipt) => {
            assert.equal(receipt.logs.length, 0, "Any error");
            return fileInstance.share(accounts[1], {from: ownerAddress});
        }).then( assert.fail).catch( (error) => {
            assert.equal(error.reason, "ALREADY AUTHORIZED!");
        })
    })

    it("Users of file", ()=> {
        return File.deployed().then( (instance) => {
            fileInstance = instance;
            fileInstance.share(accounts[2], {from: ownerAddress});
            fileInstance.share(accounts[3], {from: ownerAddress});
            return fileInstance.users();
        }).then( (addresses)=> {
            assert.equal(addresses.includes(ownerAddress), true);
            assert.equal(addresses.includes(accounts[1]), true);
            assert.equal(addresses.includes(accounts[2]), true);
            assert.equal(addresses.includes(accounts[3]), true);
        })
    })

    it("Get user by id", ()=> {
        return File.deployed().then( (instance) => {
            fileInstance = instance;
            return fileInstance.getUser(0);
        }).then((address) => {
            assert.equal(address, ownerAddress);
            return fileInstance.getUser(999999999999);
        }).then(assert.fail).catch((error) => {
            assert.notEqual(error, undefined);
            return fileInstance.getUser(1);
        }).then((address) => {
            assert.equal(address, accounts[1]);
            return fileInstance.getUser(2);
        }).then((address) => {
            assert.equal(address, accounts[2]);
            return fileInstance.getUser(3);
        }).then((address) => {
            assert.equal(address, accounts[3]);
        })
    })

    it("Remove someone", ()=> {
        return File.deployed().then((instance) => {
            fileInstance = instance;
            return fileInstance.users();
        }).then((address) => {
            assert.equal(address.includes(accounts[1]), true);
            return fileInstance.remove_user(1);
        }).then(() => {
            return fileInstance.users();
        }).then((address) => {
            assert.equal(address.includes(accounts[1]), false);
            return fileInstance.remove_user(0);
        }).then(assert.fail).catch((error)=> {
            assert.equal(error.reason, 'CANNOT DELETE YOURSELF!');
        })
    })
    
    
})