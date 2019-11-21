const Splitter = artifacts.require("./Splitter.sol");

contract('Splitter', (accounts) => {
    let splitterInstance;
    let splitterAddress;

    const [alice, bob, carol] = accounts;

    const { BN, toWei } = web3.utils;

    beforeEach("create new instance", async () => {
        splitterInstance = await Splitter.new({ from: alice });
        splitterAddress = splitterInstance.address;
    });

    it('Test deployed contract properly.', async () => {
        const splitterInstance = await Splitter.deployed();
    });

    it('The contract has an initial balance of ether equaling zero.', async () => {
        const balance = await web3.eth.getBalance(splitterInstance.address);

        assert.strictEqual(
            balance,
            "0",
            "Contract had a balance of ether before send"
        );
    });

    it("This contract has no fallback function.", async () => {
        try {
            await web3.eth.sendTransaction({ 
                from: alice, 
                to: splitterAddress, 
                value: toWei("0.1", "ether")
            });

            assert.fail("Allowed fallback call");
        } catch (err) {
            assert.include(err.message, "revert", "");
        }
    });

    it("Contact rejects odd amounts of ether sent.", async function () {
        try {
            await splitterInstance.splitBalance(bob, carol, {
                from: alice,
                value: 3
            });

            assert.fail("3 ether is unacceptable!");
        } catch (err) {
            assert.include(err.message, "revert", "")
        };
    });

    it("Contract should reject 0 ether from alice.", async () => {
        try {
            await splitterInstance.splitBalance(bob, carol, {
                from: alice,
                value: 0
            });

            assert.fail("0 ether is unacceptable!");
            } catch (err) {
                assert.include(err.message, "revert", "")
            };
    });

    it("Contract emits the LogSplitBalance event.", async () => {
        const txObj = await splitterInstance.splitBalance(bob, carol, {
            from: alice,
            value: toWei("0.1", "ether")
        });

        assert.strictEqual(
            txObj.receipt.logs.length,
            1,
            "There should be one event emmited."
        );

        assert.strictEqual(
            txObj.receipt.logs[0].args["0"],
            alice,
            "LogWithdraw emitted with wrong alice address."
        );

        assert.strictEqual(
            txObj.receipt.logs[0].args.from,
            alice,
            "LogWithdraw emitted with incorrect alice address."
        );

        assert.strictEqual(
            txObj.receipt.logs[0].args[1],
            bob,
            "LogWithdraw emitted with wrong bob address."
        );

        assert.strictEqual(
            txObj.receipt.logs[0].args[2],
            carol,
            "LogWithdraw emitted with wrong carol address."
        );

        assert.strictEqual(
            txObj.receipt.logs[0].args[3].toString(),
            toWei("0.1", "ether"),
            "LogWithdraw emitted with incorrect amount".
        );
        
        assert.strictEqual(
            txObj.receipt.logs[0].event,
            "LogSplitBalance",
            "LogSplitBalance not emitted."
        );
    });

    it("Splitter allows receiver to withdraw 0.05 ether (gas considered).", async () => {
        const startBalance = new BN(await web3.eth.getBalance(bob));

        await splitterInstance.splitBalance(bob, carol, {
            from: alice,
            value: toWei("0.1", "ether")
        });

        const txObj = await splitterInstance.withdraw({
            from: bob,
            gasPrice: 50
        });

        const tx = await web3.eth.getTransaction(txObj.tx);
        const gasPrice = new BN(tx.gasPrice);

        const gasUsed = new BN(txObj.receipt.gasUsed);
        const allowedGas = gasPrice.mul(gasUsed);

        const endBalance = new BN(await web3.eth.getBalance(bob));

        assert.strictEqual(
            endBalance.toString(10),
            startBalance
                .add(new BN(toWei("0.05", "ether")))
                .sub(allowedGas)
                .toString(10),
            "bob did not get enough ether from the 0.05 ETH"
        );
    });

    it("Test allows bob to withdraw 0.05 ether and then checks that 0 is left.", async () => {
        const startBalance = await splitterInstance.owedBalances(bob);

        await splitterInstance.splitBalance(bob, carol, {
            from: alice,
            value: toWei("0.1", "ether")
        });

        const midBalance = await splitterInstance.owedBalances(bob);

        await splitterInstance.withdraw({
            from: bob
        });

        const endBalance = await splitterInstance.owedBalances(bob);

        assert(endBalance.isZero, "Bob has a remaining balance on the contract.");
    });

    it("Testing the LogWithdraw event", async () => {
        await splitterInstance.splitBalance(bob, carol, {
            from: alice,
            value: toWei("0.1", "ether")
        });

        const txObj = await splitterInstance.withdraw({
            from: bob
        });

        assert.strictEqual(
            txObj.receipt.logs.length,
            1,
            "There should be one emitted event."
        );

        assert.strictEqual(
            txObj.receipt.logs[0].args[0],
            bob,
            "LogWithdraw emitted an incorrect address."
        );

        assert.strictEqual(
            txObj.receipt.logs[0].args[1].toString(),
            toWei("0.05", "ether").toString(),
            "LogWithdraw emitted an incorrect withdrawal amount."
        );

        assert.strictEqual(
            txObj.receipt.logs[0].event,
            "LogWithdraw",
            "LogWithdraw never emitted."
        );
    });
});