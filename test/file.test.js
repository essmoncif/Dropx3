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
})