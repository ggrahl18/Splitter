# Splitter
Splitter project for B9lab.

The OpenZeppelin SafeMath contract is used in this project.

Contract Splitter is used to split funds from alice and then distribute them equally to bob and carol. [For now] The remainder will be negligible and will remain in the contract. Another odd amount will make the remainder even, allowing it to be split and withdrawn.

A push, pull method has been used for security purposes in regards to calling the splitBalance function and then withdrawing the funds to bob and carol.

Unit tests will follow in the next couple of days.
Splitter.sol has been tested in Remix succesfully.

