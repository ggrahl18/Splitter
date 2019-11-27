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
	    address alice = msg.sender;
	    
		// Security checks
		require(msg.value > 0);
		require(bob != carol);
		require(msg.sender != bob && msg.sender != carol);

        // Remainder
        if (msg.value % 2 != 0) {
            uint remainder = 1;
            // Splits funds.
            uint amountToSend = (msg.value - 1) / 2;
            require((amountToSend % 2 == 0), "Uneven amount trying to be split."); // Will remove once checked
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