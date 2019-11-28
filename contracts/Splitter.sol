pragma solidity ^0.5.12;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "./Pausable.sol";

contract Splitter is Pausable {
	using SafeMath for uint;

	mapping (address => uint) public owedBalances;

	event LogSplitBalance(address indexed from, address indexed bob, address indexed carol, uint amount);
	event LogWithdraw(address indexed from, uint amount);

	constructor() public {}

	// Any ether sent inproperlly to the contract is reverted, sent back.
	function () external {
		revert("Clean your act up!");
	}

	function splitBalance(address bob, address carol) public payable currentlyRunning onlyAlice {
		// Security checks
		require(msg.value > 0, "Amount sent must be larger than zero eth.");
		require(bob != carol, "bob cannot be carol");
		require(alice != bob && alice != carol, "alice cannot be bob and alice cannot be carol");

        // Remainder
        if (msg.value % 2 != 0) {
            uint remainder = msg.value % 2;
            // Splits funds.
            uint amountToSend = (msg.value - remainder) / 2;
            // Allocates funds to bob & carol.
		    owedBalances[bob] = owedBalances[bob].add(msg.value - amountToSend);
		    owedBalances[carol] = owedBalances[carol].add(amountToSend);
		    owedBalances[alice] = owedBalances[alice].add(remainder);
		    emit LogSplitBalance(msg.sender, bob, carol, msg.value);
        } else {
            // Splits funds.
            uint amountToSend = msg.value.div(2);
            // Allocates funds to bob & carol.
		    owedBalances[bob] = owedBalances[bob].add(msg.value - amountToSend);
		    owedBalances[carol] = owedBalances[carol].add(amountToSend);
		    emit LogSplitBalance(msg.sender, bob, carol, msg.value);
        }
	}

	// Only bob and carol can each withdraw
	// their 50% share of the split amount.
	function withdraw() public currentlyRunning returns(bool success) {
		uint amount = owedBalances[msg.sender];
	    require (owedBalances[msg.sender] > 0, "There are no available funds to withdraw");
		owedBalances[msg.sender] = 0;
		emit LogWithdraw(msg.sender, amount);
		msg.sender.transfer(amount);
		return true;
	}
}