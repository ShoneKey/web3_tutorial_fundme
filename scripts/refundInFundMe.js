// import ethers.js library
// create main function
// execute main function
require("@chainlink/env-enc").config()


const ETHERSCAN_APIKEY = process.env.ETHERSCAN_APIKEY

const { ethers } = require("hardhat")

async function main(){
    // get contract factory
    const fundMeFactory = await ethers.getContractFactory("FundMe")
    // attach to existing contract
    const fundMe = await fundMeFactory.attach("0xdA290F147826875D84E02343B3F46d3dd9A5D3dF")
    console.log(`Connected to contract at address: ${fundMe.target}`)
    
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

    // getfund from contract with first account
    const fundTx = await fundMe.getFund()
    await fundTx.wait()

    // check balance of contract
    const balanceOfContract = await ethers.provider.getBalance(fundMe.target)
    await fundTx.wait()
    console.log(`Balance of the contact is ${balanceOfContract}`)

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