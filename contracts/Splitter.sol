pragma solidity ^0.5.12;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "./Pausable.sol";

contract Splitter is Pausable {
	using SafeMath for uint;

	mapping (address => uint) public owedBalances;

	event LogSplitBalance(address indexed from, address indexed bob, address indexed carol, uint amount);
	event LogWithdraw(address indexed from, uint amount);

	constructor() public {}

	// Any ether sent inproperly to the contract is reverted, sent back.
	function () external {
		revert("Clean your act up!");
	}

	function split(address bob, address carol) public payable currentlyRunning onlyAlice {
		require(msg.value > 0, "Amount sent must be larger than zero eth.");
		require(bob != carol, "bob cannot be carol");

		uint balance = msg.value;

		// Remainder
		if (balance % 2 != 0) {
			balance = balance.sub(1);
			owedBalances[msg.sender] = owedBalances[msg.sender].add(1);
		}

		// Split funds
		uint splitBalance = balance.div(2);
		// Allocates funds to bob & carol.
		owedBalances[bob] = owedBalances[bob].add(splitBalance);
		owedBalances[carol] = owedBalances[carol].add(splitBalance);
		emit LogSplitBalance(msg.sender, bob, carol, msg.value);
	}

	// Only bob and carol can each withdraw their share of the split amount.
	function withdraw() public currentlyRunning returns(bool success) {
		uint splitBalance = owedBalances[msg.sender];
		owedBalances[msg.sender] = 0;
		emit LogWithdraw(msg.sender, splitBalance);
		msg.sender.transfer(splitBalance);
		return true;
	}
}