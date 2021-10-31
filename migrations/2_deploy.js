const QuoteNFT = artifacts.require("QuoteNFT");

module.exports = function(_deployer) {
    _deployer.deploy(QuoteNFT);
};
