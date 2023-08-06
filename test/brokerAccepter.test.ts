import { expect } from 'chai'
import hre, { artifacts } from 'hardhat'
import { BrokerAccepter, MockToken } from '../typechain-types'
import { Wallet, ethers } from 'ethers'

import { parseEther, toUtf8Bytes, keccak256, solidityPacked } from 'ethers'
import { ec as EC } from 'elliptic'
import { arrayify } from '@ethersproject/bytes'
const BROKER_ROLE = keccak256(toUtf8Bytes('BROKER_ROLE'))
const WITNESS_ROLE = keccak256(toUtf8Bytes('WITNESS_ROLE'))
const FUND_ROLE = keccak256(toUtf8Bytes('FUND_ROLE'))

describe('BrokerAccepter', function () {
  let broker: BrokerAccepter
  let token: MockToken
  let brokerAddress
  let tokenAddress
  beforeEach(async function () {
    const zklink = await hre.ethers.deployContract('ZkLink')
    broker = await hre.ethers.deployContract('BrokerAccepter', [
      await zklink.getAddress(),
      1, //second
    ])
    brokerAddress = await broker.getAddress()
    token = await hre.ethers.deployContract('MockToken')
    tokenAddress = await token.getAddress()
  })
  it('withdraw and withdrawETH should be ok', async function () {
    const [owner, Alice, Bob] = await hre.ethers.getSigners()
    await token.transfer(brokerAddress, parseEther('1'))
    expect(await token.balanceOf(brokerAddress)).to.equal(parseEther('1'))
    await broker.withdraw(tokenAddress, Alice, parseEther('0.5'))
    expect(await token.balanceOf(brokerAddress)).to.equal(parseEther('0.5'))
    expect(await token.balanceOf(Alice)).to.equal(parseEther('0.5'))

    const signer = await hre.ethers.provider.getSigner()
    await signer.sendTransaction({
      to: brokerAddress,
      value: parseEther('0.1'),
    })
    expect(await hre.ethers.provider.getBalance(brokerAddress)).to.equal(
      parseEther('0.1')
    )

    let oldbalance = await hre.ethers.provider.getBalance(Alice)
    await broker.withdrawETH(Alice, parseEther('0.001'))
    expect(await hre.ethers.provider.getBalance(Alice)).to.equal(
      parseEther('0.001') + oldbalance
    )

    await expect(
      broker.connect(Alice).withdrawETH(Bob, parseEther('0.0001'))
    ).to.be.revertedWith('must fund role')

    await broker.grantFundRole(Alice)
    oldbalance = await hre.ethers.provider.getBalance(Bob)
    await broker.connect(Alice).withdrawETH(Bob, parseEther('0.0001'))
    expect(await hre.ethers.provider.getBalance(Bob)).to.equal(
      parseEther('0.0001') + oldbalance
    )
  })

  it('changeZkLinkInstance should be ok', async function () {
    const newzklink = await hre.ethers.deployContract('ZkLink')
    await broker.changeZkLinkInstance(newzklink)
    expect(await broker.zkLinkInstance()).to.equal(await newzklink.getAddress())
  })

  it('owner access control should be ok', async function () {
    const [owner, Alice, Bob] = await hre.ethers.getSigners()
    expect(await broker.owner()).to.equal(await owner.address)
    await broker.beginDefaultAdminTransfer(Alice)
    await expect(
      broker.connect(Alice).acceptDefaultAdminTransfer()
    ).to.be.revertedWith('AccessControl: transfer delay not passed')

    await sleep(1)
    await broker.connect(Alice).acceptDefaultAdminTransfer()
    expect(await broker.owner()).to.equal(Alice.address)
  })

  it('grant operate should be ok', async function () {
    const [owner, Alice, Bob] = await hre.ethers.getSigners()
    expect(await broker.hasRole(BROKER_ROLE, Alice.address)).to.equal(false)
    await broker.grantBrokerRole(Alice)
    expect(await broker.hasRole(BROKER_ROLE, Alice.address)).to.equal(true)
  })

  it('acceptERC20 should be ok', async function () {
    const [owner, Alice, Bob] = await hre.ethers.getSigners()

    await broker.grantBrokerRole(Alice)
    await broker.grantWitnessRole(Bob)

    const factory = await hre.ethers.getContractFactoryFromArtifact(
      await hre.artifacts.readArtifact('ZkLink')
    )
    const aliceAddr = Alice.address
    const params = [aliceAddr, 1, aliceAddr, 1, 1, 1, 1, 1, 1, 2]
    let data = factory.interface.encodeFunctionData('acceptERC20', params)
    const wallet = Wallet.createRandom()
    await broker.grantWitnessRole(wallet.address)
    const digest = keccak256(data)
    const ec = new EC('secp256k1')
    const keypair = ec.keyFromPrivate(arrayify(wallet.privateKey))
    const signature = keypair.sign(arrayify(digest), { canonical: true })
    const sig = new Uint8Array(65)
    sig.set(Buffer.from(signature.r.toArray()), 0)
    sig.set(Buffer.from(signature.s.toArray()), 32)
    sig.set(signature.recoveryParam ? arrayify('0x1c') : arrayify('0x1b'), 64)
    await broker.connect(Alice).acceptERC20(arrayify(data), sig)
  })

  it('acceptETH should be ok', async function () {
    const [owner, Alice, Bob] = await hre.ethers.getSigners()

    await broker.grantBrokerRole(Alice)
    await broker.grantWitnessRole(Bob)

    const factory = await hre.ethers.getContractFactoryFromArtifact(
      await hre.artifacts.readArtifact('ZkLink')
    )
    const aliceAddr = Alice.address
    const params = [aliceAddr, 1, aliceAddr, 1, 1, 1, 1, 1]
    let data = factory.interface.encodeFunctionData('acceptETH', params)
    const wallet = Wallet.createRandom()
    await broker.grantWitnessRole(wallet.address)
    const digest = keccak256(data)
    const ec = new EC('secp256k1')
    const keypair = ec.keyFromPrivate(arrayify(wallet.privateKey))
    const signature = keypair.sign(arrayify(digest), { canonical: true })
    const sig = new Uint8Array(65)
    sig.set(Buffer.from(signature.r.toArray()), 0)
    sig.set(Buffer.from(signature.s.toArray()), 32)
    sig.set(signature.recoveryParam ? arrayify('0x1c') : arrayify('0x1b'), 64)
    await broker.connect(Alice).acceptETH(data, 1, sig)
  })

  it('batchAcceptERC20 should be ok', async function () {
    const [owner, Alice, Bob] = await hre.ethers.getSigners()

    await broker.grantBrokerRole(Alice)
    await broker.grantWitnessRole(Bob)

    const factory = await hre.ethers.getContractFactoryFromArtifact(
      await hre.artifacts.readArtifact('ZkLink')
    )
    const aliceAddr = Alice.address
    const params = [aliceAddr, 1, aliceAddr, 1, 1, 1, 1, 1, 1, 1]
    const dataslice = factory.interface.encodeFunctionData(
      'acceptERC20',
      params
    )
    const data = [dataslice, dataslice, dataslice]

    const wallet = Wallet.createRandom()
    await broker.grantWitnessRole(wallet.address)

    const digest = keccak256(
      encodePacked(data.map((v) => ['bytes', arrayify(v)]))
    )
    const ec = new EC('secp256k1')

    const keypair = ec.keyFromPrivate(arrayify(wallet.privateKey))
    const signature = keypair.sign(arrayify(digest), { canonical: true })
    const sig = new Uint8Array(65)
    sig.set(Buffer.from(signature.r.toArray()), 0)
    sig.set(Buffer.from(signature.s.toArray()), 32)
    sig.set(signature.recoveryParam ? arrayify('0x1c') : arrayify('0x1b'), 64)

    await broker.connect(Alice).batchAcceptERC20(data, sig)
  })

  it('batchAcceptETH should be ok', async function () {
    const [owner, Alice, Bob] = await hre.ethers.getSigners()

    await broker.grantBrokerRole(Alice)
    await broker.grantWitnessRole(Bob)

    const factory = await hre.ethers.getContractFactoryFromArtifact(
      await hre.artifacts.readArtifact('ZkLink')
    )
    const aliceAddr = Alice.address
    const params = [aliceAddr, 1, aliceAddr, 1, 1, 1, 1, 1]
    const dataslice = factory.interface.encodeFunctionData('acceptETH', params)
    const data = [dataslice, dataslice, dataslice]

    const wallet = Wallet.createRandom()
    await broker.grantWitnessRole(wallet.address)

    const digest = keccak256(
      encodePacked(data.map((v) => ['bytes', arrayify(v)]))
    )
    const ec = new EC('secp256k1')

    const keypair = ec.keyFromPrivate(arrayify(wallet.privateKey))
    const signature = keypair.sign(arrayify(digest), { canonical: true })
    const sig = new Uint8Array(65)
    sig.set(Buffer.from(signature.r.toArray()), 0)
    sig.set(Buffer.from(signature.s.toArray()), 32)
    sig.set(signature.recoveryParam ? arrayify('0x1c') : arrayify('0x1b'), 64)

    await broker.connect(Alice).batchAcceptETH(
      data,
      data.map((_) => {
        return 1
      }),
      sig
    )
  })
})

async function sleep(second: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, second * 1000)
  })
}
function encodePacked(params = []) {
  let types = []
  let values = []

  params.forEach((itemArray) => {
    types.push(itemArray[0])
    values.push(itemArray[1])
  })

  return solidityPacked(types, values)
}
