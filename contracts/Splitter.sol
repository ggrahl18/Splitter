pragma solidity ^0.5.12;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/ownership/Ownable.sol";
import "@openzeppelin/contracts/lifecycle/Pausable.sol";

contract Splitter is Pausable, Ownable {
	using SafeMath for uint;

	mapping (address => uint) public owedBalances;

	event LogSplit(address indexed caller, address indexed address1, address indexed address2, uint amount);
	event LogWithdraw(address indexed caller, uint amount);

	constructor() public whenNotPaused {
        // Haven't found a use for this yet.
    }
	
	function splitBalance(address addr1, address addr2) whenNotPaused onlyOwner public payable {
		// Security checks
		require (msg.value > 0);
		require(addr1 != addr2);
		require(addr2 != address(0));
		require(msg.sender != addr1 && msg.sender != addr2);

        // Splits funds and allocates to addr1 & addr2.
		uint amountToSend = msg.value.div(2);
		owedBalances[addr1] = owedBalances[addr1].add(msg.value - amountToSend);
		owedBalances[addr2] = owedBalances[addr2].add(amountToSend);
		
		// Checks for remainder, if true, adds to msg.sender
		uint remainder = msg.value.mod(2);
        if(remainder != 0) {
            owedBalances[msg.sender] = owedBalances[msg.sender].add(remainder);
        }
		emit LogSplit(msg.sender, addr1, addr2, msg.value);
	}
	
	// Withdraws funds.
	function withdraw() public payable whenNotPaused {
		uint amount = owedBalances[msg.sender];
	    // require (amount > 0);
		owedBalances[msg.sender] = 0;
		msg.sender.transfer(amount);
		emit LogWithdraw(msg.sender, amount);
	}
}