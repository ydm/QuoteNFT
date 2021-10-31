/*jslint node */
/*global artifacts, assert, contract, it, then, web3 */

const QuoteNFT = artifacts.require("QuoteNFT");

contract("QuoteNFT", function (accounts) {
    it("should have the deployer set as owner", async function () {
        await QuoteNFT.deployed().then(
            (instance) => instance.owner()
        ).then(
            (owner) => assert.strictEqual(owner, accounts[0])
        );
    });

    it("should complain when minting without a fee", async function () {
        await QuoteNFT.deployed().then(
            (instance) => instance.mint("One.")
        ).then(
            () => assert.fail("unexpected success"),
            function (reason) {
                assert.strictEqual(reason.reason, "Minting costs 0.1 ETH");
            }
        );
    });

    it("should complain when minting with a lower fee", async function () {
        await QuoteNFT.deployed().then(
            (instance) => instance.mint(
                "Two.",
                {value: web3.utils.toWei("0.0999", "ether")}
            )
        ).then(
            () => assert.fail("unexpected success"),
            function (reason) {
                assert.strictEqual(reason.reason, "Minting costs 0.1 ETH");
            }
        );
    });

    it("should mint for a fee", async function () {
        await QuoteNFT.deployed().then(
            (instance) => instance.mint(
                "Three.",
                {
                    from: accounts[1],
                    value: web3.utils.toWei("0.1", "ether")
                }
            )
        ).then(async function (tx) {
            // Assert our NFT contract received the payment.
            const contractAddress = tx.receipt.to;
            const actual = await web3.eth.getBalance(contractAddress);
            const expected = web3.utils.toWei("0.1", "ether");
            assert.strictEqual(actual, expected);

            // Check the transaction.
            const event = tx.logs[0];
            const { from, to, tokenId } = event.args;
            assert.strictEqual(from, "0x0000000000000000000000000000000000000000");
            assert.strictEqual(to, accounts[1]);
            assert.strictEqual(tokenId.toNumber(), 1);
        });
    });

    it("should embed the quote on mint", async function() {
        await QuoteNFT.deployed().then(
            (instance) => instance.quote(1)
        ).then((text) => assert.strictEqual(text, "Three."));
    });
});

contract("QuoteNFT", function (accounts) {
    it("should mint as well for a greater fee", async function () {
        await QuoteNFT.deployed().then(
            (instance) => instance.mint(
                "Four.",
                {value: web3.utils.toWei("0.2", "ether")}
            )
        ).then(
            (tx) => web3.eth.getBalance(tx.receipt.to)
        ).then((actual) => assert.strictEqual(
            actual,
            web3.utils.toWei("0.2", "ether")
        ));
    });

    it("should send everything to owner on withdraw", async function() {
        // This is a bit ugly.  Is there a prettier way to pass that?
        let before = "0";

        await web3.eth.getBalance(accounts[0]).then(function (balance) {
            before = balance;
            return QuoteNFT.deployed();
        }).then(
            // Funny thing: the withdraw() can be called by everyone,
            // but it send available balance just to its owner.  To
            // make it easier to compute the difference, let's use
            // account #1 to pay for the gas.
            (instance) => instance.withdraw({from: accounts[1]})
        ).then(
            (tx) => web3.eth.getBalance(accounts[0])
        ).then(function (after) {
            const b = web3.utils.toBN(before);
            const a = web3.utils.toBN(after);
            const d = a.sub(b).toString();
            const e = web3.utils.toWei("0.2", "ether");
            assert.strictEqual(d, e);
        });
    });
});
