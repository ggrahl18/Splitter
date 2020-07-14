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

	function split(address bob, address carol) public payable currentlyRunning {
		// Security checks
		require(msg.value > 0 && bob != carol, "split rejected, please try again");

		// IF theirs a remainder, refund it back to the sender
		if (msg.value % 2 != 0) {
			owedBalances[msg.sender] = owedBalances[msg.sender].add(1);
		}

		// Split funds
		balance = msg.value.div(2);
		// Allocates funds to bob & carol.
		owedBalances[bob] = owedBalances[bob].add(balance);
		owedBalances[carol] = owedBalances[carol].add(balance);
		emit LogSplitBalance(msg.sender, bob, carol, msg.value);
	}

	// Only bob and carol can each withdraw their share of the split amount.
	function withdraw() public currentlyRunning returns(bool success) {
		uint splitBalance = owedBalances[msg.sender];
		owedBalances[msg.sender] = 0;
		emit LogWithdraw(msg.sender, splitBalance);
    msg.sender.call.value(splitBalance)
		return true;
	}
}
