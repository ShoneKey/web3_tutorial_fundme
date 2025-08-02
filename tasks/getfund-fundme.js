const { task } = require("hardhat/config")

task("getfund-fundme","getfund in fundMe contract")
    .addParam("addr", "fundMe contract address.")
    .setAction(async(taskArgs,hre)=>{
    const fundMeFactory = await ethers.getContractFactory("FundMe")
    const fundMe = fundMeFactory.attach(taskArgs.addr)
    // init 2 acounts
    const [firstAccount, secondAccount] = await ethers.getSigners();

    // getfund from contract with first account
    const fundTx = await fundMe.getFund()
    await fundTx.wait()

    // check balance of contract
    const balanceOfContract = await ethers.provider.getBalance(fundMe.target)
    await fundTx.wait()
    console.log(`Balance of the contact is ${balanceOfContract}`)
    
})


module.exports = {}