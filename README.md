 ![Splitter GUI](/img/Screenshot_20200210_110200 1 (1).png)


# Splitter
Splitter project for B9lab.

Contract Splitter is used to split funds from alice in two equal parts and then distribute them to bob and carol. If amount sent to be split is not devisible by 2, then the remainder will be refunded back to alices address.

A push, pull method has been used for security purposes in regards to calling the split function and then withdrawing the funds to bob and carol.

Unit tests are included and a work in progress.

Splitter.sol has been tested in Remix succesfully.

The OpenZeppelin SafeMath contract is used in this project.

## Instructions

> $ cd Splitter

> $ npm install @openzeppelin/contracts

> $ cd client

> $ npm install

> $ npm start

Then you must start a local blockchain to connect to, Ganache, truffle develop, a custom local chain, or even infura. One of the easiest ways would be to install truffles Ganache GUI. Set the project settings to match your projects truffle-config settings. And then inject Ganaches mnemonic into MetaMask to interact with it's wallet. You will also have to copy and paste the private keys from Ganache into MetaMasks "Import Accounts".

Don't forget to deploy your contract.

> $ truffle migrate
