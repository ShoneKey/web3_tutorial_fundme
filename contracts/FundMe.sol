// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

//创建一个收款函数

//记录一个投资人并查看

//在锁定期内，达到目标值，生产商可以提款

//锁定期内， 没有达到目标值 投资人可以在锁定期之后退款


contract FundMe{
    mapping (address => uint256) public fundersToAmount;
    uint256 constant MIN_VALUE = 100*10**18;
    AggregatorV3Interface internal dataFeed;
    uint256 constant TARGET = 1000*10**18;
    address public owner;

    uint256 deploymentTimestamp;
    uint256 lockTime;

    address public erc20addr;
    bool public getFundSuccess = false;

    constructor(uint256 _lockTime){
        // sepolia testnet
        dataFeed = AggregatorV3Interface(0x694AA1769357215DE4FAC081bf1f309aDC325306);
        owner = msg.sender;
        deploymentTimestamp = block.timestamp;
        lockTime = _lockTime;
    }
    function fund() external payable {
        require(convertETHToUSD(msg.value) >= MIN_VALUE,"At least 1 ETH");
        require(block.timestamp < deploymentTimestamp+lockTime,"window is closed");
        fundersToAmount[msg.sender] = msg.value;
    }

    function getChainlinkDataFeedLatestAnswer() public view returns (int) {
        // prettier-ignore
        (
            /* uint80 roundId */,
            int256 answer,
            /*uint256 startedAt*/,
            /*uint256 updatedAt*/,
            /*uint80 answeredInRound*/
        ) = dataFeed.latestRoundData();
        return answer;
    }

    function convertETHToUSD(uint256 ethAmount) internal view returns(uint256){
        uint256 ethPrice = uint256(getChainlinkDataFeedLatestAnswer());
        return ethAmount * ethPrice / (10**8);
    }

     function transferOwnerShip(address newOwner) public onlyOwner{
        owner = newOwner;
    }

    function getFund() external windowClose onlyOwner{
        require(convertETHToUSD(address(this).balance) >= TARGET, "Target is not reached");
        //payable(msg.sender).transfer(address(this).balance);
        //bool success = payable(msg.sender).send(address(this).balance);
        //require(success,"transaction failed!");
        bool success;
        (success, ) = payable(msg.sender).call{value:address(this).balance}("msg");
        require(success,"transaction failed!");
        getFundSuccess = true;
    }
    
    function refund() external windowClose{
        require(convertETHToUSD(address(this).balance) < TARGET, "Target is reached");
        uint256 amount = fundersToAmount[msg.sender];
        require(amount !=0, "there is no fund for you");
        bool success;
        (success, ) = payable(msg.sender).call{value:amount}("msg");
        require(success,"transaction failed!");
        fundersToAmount[msg.sender] = 0;
    }

    function setFunderToAmount(address funder, uint256 amountToUpdate) external{
        require(msg.sender == erc20addr,"You do not have permision to call this function");
        fundersToAmount[funder] = amountToUpdate;
    }

    function setERC20addr(address _erc20addr) public onlyOwner{
        erc20addr = _erc20addr;
    }

    modifier windowClose(){
        require(block.timestamp >= deploymentTimestamp+lockTime,"window is not closed");
        _;
    }

    modifier onlyOwner(){
        require(msg.sender == owner, "this fucntion can onlyu be called by owner");
        _;
    }
} 