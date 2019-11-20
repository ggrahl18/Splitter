pragma solidity ^0.5.12;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "./Pausable.sol";

contract Splitter is Pausable {
	using SafeMath for uint;

	address public _alice = msg.sender;
	bytes public fail;

	mapping (address => uint) public owedBalances;

	event LogSplitBalance(address indexed from, address indexed bob, address indexed carol, uint amount);
	event LogWithdraw(address indexed from, uint amount);
	event LogFail(bytes amount, address indexed from);

	constructor() public {}
	
	function () external payable {
		fail = msg.data;
		emit LogFail(msg.data, msg.sender);
	}
	
	function splitBalance(address bob, address carol) public payable currentlyRunning onlyAlice {
		// Security checks
		require(msg.value > 0);
		require(msg.value % 2 == 0, "Must send an amount divisible by two.");
		require(bob != carol);
		require(msg.sender != bob && msg.sender != carol);

        // Splits funds and allocates to bob & carol.
		uint amountToSend = msg.value.div(2);
		owedBalances[bob] = owedBalances[bob].add(msg.value - amountToSend);
		owedBalances[carol] = owedBalances[carol].add(amountToSend);
		emit LogSplitBalance(msg.sender, bob, carol, msg.value);
	}

	function withdraw() public currentlyRunning returns(bool success) {
		uint amount = owedBalances[msg.sender];
	    require (owedBalances[msg.sender] > 0, "There are no available funds to withdraw");
		owedBalances[msg.sender] = 0;
		msg.sender.transfer(amount);
		emit LogWithdraw(msg.sender, amount);
		return true;
	}
}