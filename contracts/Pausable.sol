pragma solidity ^0.5.12;

import "./Ownable.sol";

contract Pausable is Ownable {

    event LogPaused(address indexed sender);
    event LogResumed(address indexed sender);

    bool private _isPaused;

    modifier currentlyRunning() {
        require(!_isPaused, "The contract is currently paused");
        _;
    }

    modifier currentlyPaused() {
        require(_isPaused, "The contract is currently running");
        _;
    }

    function paused() public view returns(bool _paused) {
        return _isPaused;
    }

    function pause() public onlyAlice currentlyRunning {
        _isPaused = true;
        emit LogPaused(msg.sender);
    }

    function resume() public onlyAlice currentlyPaused {
        _isPaused = false;
        emit LogResumed(msg.sender);
    }


}