// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// https://goerli.etherscan.io/address/0xC523272107420Fd55915B69d5E3FcDbBF133A4c8#writeContract

contract Staking {
    IERC20 public token;
    uint public rewardRatePerMinute = 1;

    mapping(address => uint) public stakingAmount; // address => staking amount of this address
    mapping(address => uint) public lockTimeInMinutes; // address => number of minutes in staking
    mapping(address => uint) public endTimeOfStaking; // address => end time of staking
    mapping(address => uint) public rewardAmountPerMinute; // address => reward amount in one minute

    event NewDepositor(address sender, uint amount, uint startsAt, uint endsAt);

    constructor(IERC20 _token) {
        token = _token;
    }

    function putInStaking(
        uint _amount,
        uint _lockTimeInMinutes
    ) public payable {
        require(stakingAmount[msg.sender] == 0, "already in staking");

        stakingAmount[msg.sender] = _amount;
        lockTimeInMinutes[msg.sender] = _lockTimeInMinutes;

        endTimeOfStaking[msg.sender] =
            block.timestamp +
            _lockTimeInMinutes *
            60;
        rewardAmountPerMinute[msg.sender] =
            (_amount * rewardRatePerMinute) /
            100;

        token.transferFrom(msg.sender, address(this), _amount); // need approve

        emit NewDepositor(
            msg.sender,
            _amount,
            block.timestamp,
            lockTimeInMinutes[msg.sender]
        );
    }

    function pullOutOfStaking() public {
        require(
            block.timestamp >= endTimeOfStaking[msg.sender],
            "Staking time is not over"
        );

        uint pullOut = stakingAmount[msg.sender] +
            rewardAmountPerMinute[msg.sender] *
            lockTimeInMinutes[msg.sender];
        stakingAmount[msg.sender] = 0;
        endTimeOfStaking[msg.sender] = 0;
        rewardAmountPerMinute[msg.sender] = 0;
        lockTimeInMinutes[msg.sender] = 0;

        token.transfer(msg.sender, pullOut);
    }

    fallback() external payable {}

    receive() external payable {}
}
