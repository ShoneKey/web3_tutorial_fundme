const { task } = require("hardhat/config")

task("refund-fundme","refund when balance is not reached")
    .addParam("addr", "fundMe contract address.")
    .setAction(async(taskArgs,hre)=>{
    const fundMeFactory = await ethers.getContractFactory("FundMe")
    const fundMe = fundMeFactory.attach(taskArgs.addr)
    // init 2 acounts
    const [firstAccount, secondAccount] = await ethers.getSigners();
    // check balance of contract
    const balanceOfContractBefore = await ethers.provider.getBalance(fundMe.target)
    console.log(`Balance of the contact before first account refund is ${balanceOfContractBefore}`)
    
    // check first
    const firstAccountBalanceInFundMe = await fundMe.fundersToAmount(firstAccount.address)
    console.log(`First account balance before refund is ${firstAccountBalanceInFundMe}`)

    // refund from contract with first account when target is not reached
    const fundTx = await fundMe.refund()
    await fundTx.wait()
    // check balance of contract of first account
    const balanceOfContractAfter = await ethers.provider.getBalance(fundMe.target)
    await fundTx.wait()
    console.log(`Balance of the contact after first account refund is ${balanceOfContractAfter}`)

    const AccountBalanceInFundMeAfter = await fundMe.fundersToAmount(firstAccount.address)
    await fundTx.wait()
    console.log(`First account balance after refund is ${AccountBalanceInFundMeAfter}`)
    

    // check second
    const secondAccountBalanceInFundMe = await fundMe.fundersToAmount(secondAccount.address)
    console.log(`Second account balance before refund is ${secondAccountBalanceInFundMe}`)

    // refund from contract with first account when target is not reached
    const fundTx_2 = await fundMe.connect(secondAccount).refund()
    await fundTx_2.wait()
    // check balance of contract after second account refund
    const balanceOfContractAfter_2 = await ethers.provider.getBalance(fundMe.target)
    await fundTx_2.wait()
    console.log(`Balance of the contact after second acccount refund is ${balanceOfContractAfter_2}`)

    const SecondAccountBalanceInFundMeAfter = await fundMe.fundersToAmount(secondAccount.address)
    await fundTx_2.wait()
    console.log(`Second account balance after refund is ${SecondAccountBalanceInFundMeAfter}`)
    
})


module.exports = {}