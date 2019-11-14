pragma solidity ^0.5.12;

import "@openzeppelin/contracts/math/SafeMath.sol";

contract Splitter {
	using SafeMath for uint;

	address public alice = msg.sender;

	mapping (address => uint) public owedBalances;

	event LogSplit(address indexed caller, address indexed address1, address indexed address2, uint amount);
	event LogWithdraw(address indexed caller, uint amount);

	constructor() public {
        // Haven't found a use for this yet.
    }

	modifier onlyAlice(address _account) {
		require(
			msg.sender == _account,
			"You are not Alice!"
		);
		_;
	}

	function changeAlice(address _newAlice) public onlyAlice(alice) {
		alice = _newAlice;
	}
	
	function splitBalance(address bob, address carol) public payable {
		// Security checks
		require(msg.value > 0);
		require(bob != carol);
		require(msg.sender != bob && msg.sender != carol);

        // Splits funds and allocates to bob & carol.
		uint amountToSend = msg.value.div(2);
		owedBalances[bob] = owedBalances[bob].add(msg.value - amountToSend);
		owedBalances[carol] = owedBalances[carol].add(amountToSend);
		
		// Checks for remainder, if true, adds to msg.sender
		uint remainder = msg.value.mod(2);
        if(remainder > 0) {
            owedBalances[msg.sender] = owedBalances[msg.sender].add(remainder);
        }
		emit LogSplit(msg.sender, bob, carol, msg.value);
	}
	
	function withdraw() public returns(bool success) {
		uint amount = owedBalances[msg.sender];
	    require (owedBalances[msg.sender] > 0);
		owedBalances[msg.sender] = 0;
		msg.sender.transfer(amount);
		emit LogWithdraw(msg.sender, amount);
		return true;
	}
}