# Splitter
Splitter project for B9lab

The OpenZeppelin library is used in this contract.

Contract Splitter is used to split funds from the sender and distributed equally to two recipients, refunding the remainder to the sender.

A push, pull method has been used for security purposes in regards to calling the splitBalance function and then withdrawing the funds to addr1 and addr2.



