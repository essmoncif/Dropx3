const File = artifacts.require("File");

module.exports = function(deployer, network, accounts) {
    deployer.deploy(File, "test.txt", "Hello world", "64ec88ca00b268e5ba1a35678a1b5316d212f4f366b2477232534a8aeca37f3c", "txt", 11200, accounts[0]);
}