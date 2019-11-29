# Splitter
Splitter project for B9lab.

Contract Splitter is used to split funds from alice in two equal parts and then distribute them to bob and carol. If amount sent to be split is not devisible by 2, then the remainder will be refunded back to alices address.

A push, pull method has been used for security purposes in regards to calling the split function and then withdrawing the funds to bob and carol.

Unit tests are included and a work in progress.

Splitter.sol has been tested in Remix succesfully.

The OpenZeppelin SafeMath contract is used in this project.

