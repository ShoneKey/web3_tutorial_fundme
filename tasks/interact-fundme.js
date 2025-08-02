const { task } = require("hardhat/config")

task("interact-fundme","interact with fundMe contract")
    .addParam("addr", "fundMe contract address.").
    setAction(async(taskArgs,hre)=>{
    const fundMeFactory = await ethers.getContractFactory("FundMe")
    const fundMe = fundMeFactory.attach(taskArgs.addr)
    // init 2 acounts
    const [firstAccount, secondAccount] = await ethers.getSigners();

    // fund contract with first account
    const fundTx = await fundMe.fund({value: ethers.parseEther("0.1")})
    await fundTx.wait()

    // check balance of contract
    const balanceOfContract = await ethers.provider.getBalance(fundMe.target)
    await fundTx.wait()
    console.log(`Balance of the contact is ${balanceOfContract}`)

    // fund contract with second account
    const fundTxWithSecondAccount = await fundMe.connect(secondAccount).fund({value: ethers.parseEther("0.1")})
    await fundTxWithSecondAccount.wait()

    // check balance of contract
    const balanceOfContractAfterSecondAccount = await ethers.provider.getBalance(fundMe.target)
    console.log(`Balance of the contact is ${balanceOfContractAfterSecondAccount}`)

    // check mapping 
    const firstAccountBalanceInFundMe = await fundMe.fundersToAmount(firstAccount.address)
    const secondAccountBalanceInFundMe = await fundMe.fundersToAmount(secondAccount.address)
    console.log(`Balance of first account ${firstAccount.address} is ${firstAccountBalanceInFundMe}`)
    console.log(`Balance of second account ${secondAccount.address} is ${secondAccountBalanceInFundMe}`)
})


module.exports = {}