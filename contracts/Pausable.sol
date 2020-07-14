pragma solidity ^0.5.12;

import "./Ownable.sol";

contract Pausable is Ownable {

    bool private isPaused;

    event Paused(address indexed sender);
    event Unpaused(address indexed sender);

    constructor() internal {
        isPaused = false;
    }

    // returns true if contract is paused, false if not paused
    function paused() public view returns (bool) {
      return _isPaused;
    }

    modifier currentlyRunning() {
        require(!isPaused, "The contract is currently paused");
        _;
    }

    modifier currentlyPaused() {
        require(isPaused, "The contract is currently running");
        _;
    }

    function pause() public onlyOwner currentlyRunning {
        isPaused = true;
        emit Paused(msg.sender);
    }

    function resume() public onlyOwner currentlyPaused {
        isPaused = false;
        emit Unpaused(msg.sender);
    }
}
