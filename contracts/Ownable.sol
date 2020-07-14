pragma solidity ^0.5.12;

contract Ownable {

    address private owner;

    event LogNewOwner(address indexed sender, address indexed originalOwner, address indexed newOwner);

    constructor() public {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(
            msg.sender == owner,
            "Only owner can call this function."
        );
        _;
    }

    function changeOwner(address payable _newOwner) public onlyOwner returns(bool success) {
        require(_newOwner != address(0), "The new Owner cannot be the same as the original Owner.");
        emit LogNewOwner(msg.sender, owner, _newOwner);
        owner = _newOwner;
        return true;
	}

    function getOwner() public view returns (address) {
        return owner;
    }
}
