pragma solidity ^0.5.12;

contract Ownable {

    address private _alice;

    event LogNewOwner(address indexed sender, address indexed originalAlice, address indexed newAlice);

    constructor() public {
        _alice = msg.sender;
    }

    modifier onlyAlice() {
        require(
            msg.sender == _alice,
            "Only owner can call this function."
        );
        _;
    }

    function changeAlice(address _newAlice) public onlyAlice returns(bool success) {
		require(_newAlice != address(0), "The new Alice cannot be the same as the original Alice.");
        emit LogNewOwner(msg.sender, _alice, _newAlice);
		_alice = _newAlice;
        return true;
	}

    function getAlice() public view returns (address) {
        return _alice;
    }
}