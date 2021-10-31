#!/bin/bash

# Assign and create destination directory.
DEST=./sources
mkdir -p $DEST

# Copies to destination.
function copy() {
    cp "$1" "$DEST"
}

# Collect sources.
CONTRACTS=../contracts
NODE=../node_modules

copy $CONTRACTS/QuoteNFT.sol
copy "$NODE/@openzeppelin/contracts/token/ERC721/ERC721.sol"
copy "$NODE/@openzeppelin/contracts/token/ERC721/IERC721.sol";
copy "$NODE/@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
copy "$NODE/@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol";
copy "$NODE/@openzeppelin/contracts/utils/Address.sol";
copy "$NODE/@openzeppelin/contracts/utils/Context.sol";
copy "$NODE/@openzeppelin/contracts/utils/Counters.sol"
copy "$NODE/@openzeppelin/contracts/utils/Strings.sol";
copy "$NODE/@openzeppelin/contracts/utils/introspection/ERC165.sol";
copy "$NODE/@openzeppelin/contracts/utils/introspection/IERC165.sol";

# TODO: Flatten imports!
