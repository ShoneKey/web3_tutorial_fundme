// import ethers.js library
// create main function
// execute main function
require("@chainlink/env-enc").config()


const ETHERSCAN_APIKEY = process.env.ETHERSCAN_APIKEY

const { ethers } = require("hardhat")

async function main(){
    // create factory
    const fundMeFactory = await ethers.getContractFactory("FundMe")
    // deploy contact from factory
    const fundMe = await fundMeFactory.deploy(180)
    await fundMe.waitForDeployment()
    console.log(`contract has benn deploy successfully, contract address is ${fundMe.target}`)
    
    // verify fundme
    if (hre.network.config.chainId == 11155111 && ETHERSCAN_APIKEY){
        console.log("waitting fo r 5 blocks confirmations")
        await fundMe.deploymentTransaction().wait(5)
        await verifyFundMe(fundMe.target,[30])
    } else{
        console.log("Verification skipped..")
    }

    // init 2 acounts
    const [firstAccount, secondAccount] = await ethers.getSigners();

    // fund contract with first account
    const fundTx = await fundMe.fund({value: ethers.parseEther("0.2")})
    await fundTx.wait()

    // check balance of contract
    const balanceOfContract = await ethers.provider.getBalance(fundMe.target)
    await fundTx.wait()
    console.log(`Balance of the contact is ${balanceOfContract}`)

    // fund contract with second account
    const fundTxWithSecondAccount = await fundMe.connect(secondAccount).fund({value: ethers.parseEther("0.2")})
    await fundTxWithSecondAccount.wait()

    // check balance of contract
    const balanceOfContractAfterSecondAccount = await ethers.provider.getBalance(fundMe.target)
    console.log(`Balance of the contact is ${balanceOfContractAfterSecondAccount}`)

    // check mapping 
    const firstAccountBalanceInFundMe = await fundMe.fundersToAmount(firstAccount.address)
    const secondAccountBalanceInFundMe = await fundMe.fundersToAmount(secondAccount.address)
    console.log(`Balance of first account ${firstAccount.address} is ${firstAccountBalanceInFundMe}`)
    console.log(`Balance of second account ${secondAccount.address} is ${secondAccountBalanceInFundMe}`)
}

async function verifyFundMe(contractAddr,args){
    await hre.run("verify:verify", {
    address: contractAddr,
    constructorArguments: args}); 
}

main().then().catch((error) => {
    console.error(error)
    process.exit(1)
})