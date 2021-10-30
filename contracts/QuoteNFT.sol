// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract QuoteNFT is ERC721 {
    using Counters for Counters.Counter;
    Counters.Counter private _counter;

    address public _owner = msg.sender;

    constructor() ERC721("Quote NFT", "QFT") {}

    modifier restricted() {
        require(msg.sender == _owner,
                "This function is restricted to the contract's owner");
        _;
    }

    function mint(address to) external restricted returns (uint256 tokenId) {
        _counter.increment();

        uint256 id = _counter.current();
        _mint(to, id);

        return id;
    }
}
