pragma solidity ^0.5.12;

contract Ownable {

    address private _alice;

    event LogNewOwner(address originalAlice, address newAlice);

    constructor() internal {
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
		emit LogNewOwner(_alice, _newAlice);
		_alice = _newAlice;
        return true;
	}

    function isAlice() public view returns (bool) {
        return _alice == msg.sender;
    }
}