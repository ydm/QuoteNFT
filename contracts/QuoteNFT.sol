// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

interface IQuoteNFT is IERC721 {
    function mint(address to, string memory quote)
        external
        returns (uint256 tokenId);

    function exists(uint256 tokenId) external view returns (bool);

    function quote(uint256 tokenId) external view returns (string memory);
}

contract QuoteNFT is ERC721, IQuoteNFT {
    using Counters for Counters.Counter;
    Counters.Counter private _counter;

    address public owner;
    mapping(uint256 => string) private _quotes;

    modifier restricted() {
        require(msg.sender == owner, "Function is restricted");
        _;
    }

    constructor() ERC721("Quote NFT", "QFT") {
        owner = msg.sender;
    }

    function mint(address to, string memory quote_)
        external
        override
        restricted
        returns (uint256 tokenId)
    {
        _counter.increment();
        uint256 id = _counter.current();
        _quotes[id] = quote_;
        _mint(to, id);
        return id;
    }

    function exists(uint256 tokenId) external view override returns (bool) {
        return _exists(tokenId);
    }

    function quote(uint256 tokenId)
        external
        view
        override
        returns (string memory)
    {
        return _quotes[tokenId];
    }
}
