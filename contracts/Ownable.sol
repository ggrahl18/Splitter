pragma solidity ^0.5.12;

contract Ownable {

    address payable public alice;

    event LogNewOwner(address indexed sender, address indexed originalAlice, address indexed newAlice);

    constructor() public {
        alice = msg.sender;
    }

    modifier onlyAlice() {
        require(
            msg.sender == alice,
            "Only owner can call this function."
        );
        _;
    }

    function changeAlice(address payable _newAlice) public onlyAlice returns(bool success) {
        require(_newAlice != address(0), "The new Alice cannot be the same as the original Alice.");
        emit LogNewOwner(msg.sender, alice, _newAlice);
        alice = _newAlice;
        return true;
	}

    function getAlice() public view returns (address) {
        return alice;
    }
}