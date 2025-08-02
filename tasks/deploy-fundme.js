const {task} = require("hardhat/config")

const ETHERSCAN_APIKEY = process.env.ETHERSCAN_APIKEY

task("deploy-fundme","deploy fundme contract and verify").addParam("tw","time window of fund").
    setAction(async(taskArgs,hre)=>{
     // create factory
    const fundMeFactory = await ethers.getContractFactory("FundMe")
    // deploy contact from factory
    const fundMe = await fundMeFactory.deploy(taskArgs.tw)
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
})

async function verifyFundMe(contractAddr,args){
    await hre.run("verify:verify", {
    address: contractAddr,
    constructorArguments: args}); 
}

module.exports = {}