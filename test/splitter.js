const Splitter = artifacts.require("Splitter");

contract('Splitter', (accounts) => {
    it('Should deploy contract properly', async () => {
        const splitterInstance = await Splitter.deployed();
    });
});