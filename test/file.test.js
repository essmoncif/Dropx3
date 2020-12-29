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
})