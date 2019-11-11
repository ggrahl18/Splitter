# Splitter
Splitter project for B9lab.

The OpenZeppelin library is used in this contract.

Contract Splitter is used to split funds from the sender and distributed equally to two recipients, refunding the remainder to the sender.

A push, pull method has been used for security purposes in regards to calling the splitBalance function and then withdrawing the funds to addr1 and addr2.

Unit tests will follow in the next couple of days.
Splitter.sol has been tested in Remix succesfully with adjusting the import files:

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/math/SafeMath.sol";
<br>import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/ownership/Ownable.sol";
<br>import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/lifecycle/Pausable.sol";


