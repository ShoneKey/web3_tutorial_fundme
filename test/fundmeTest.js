const {ethers} = require("hardhat")
const {assert} = require("chai")

describe("test fundme contract", async function(){
    it("test if the owner is msg.sender", async function(){
        const fundmeFactorey = await ethers.getContractFactory("FundMe")
        const fundMe = await fundmeFactorey.deploy(180)
        await fundMe.waitForDeployment()
        const [firstAccount] = await ethers.getSigners()
        assert.equal((await fundMe.owner()),firstAccount.address)
    })
})