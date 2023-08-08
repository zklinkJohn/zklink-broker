// SPDX-License-Identifier: MIT OR Apache-2.0

pragma solidity ^0.8.0;

import '@openzeppelin/contracts/access/AccessControlDefaultAdminRules.sol';
import '@openzeppelin/contracts/utils/Multicall.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import 'zklink-contracts-interface/contracts/IZkLink.sol';
import '@openzeppelin/contracts/security/ReentrancyGuard.sol';
import '@openzeppelin/contracts/utils/cryptography/ECDSA.sol';

contract BrokerAccepter is
  AccessControlDefaultAdminRules,
  Multicall,
  ReentrancyGuard
{
  bytes32 public constant WITNESS_ROLE = keccak256('WITNESS_ROLE');
  bytes32 public constant BROKER_ROLE = keccak256('BROKER_ROLE');
  bytes32 public constant FUND_ROLE = keccak256('FUND_ROLE');

  bytes4 public constant ACCEPT_ERC20 =
    bytes4(
      keccak256(
        bytes(
          'acceptERC20(address,uint32,address,uint16,uint128,uint16,uint32,uint8,uint32,uint128)'
        )
      )
    );
  bytes4 public constant ACCEPT_ETH =
    bytes4(
      keccak256(
        bytes(
          'acceptETH(address,uint32,address,uint128,uint16,uint32,uint8,uint32)'
        )
      )
    );

  IZkLink public zkLinkInstance;

  constructor(
    IZkLink _zkLinkInstance,
    uint48 initialDelay
  ) AccessControlDefaultAdminRules(initialDelay, _msgSender()) {
    zkLinkInstance = _zkLinkInstance;
  }

  receive() external payable {}

  modifier mustFundRole() {
    require(
      hasRole(DEFAULT_ADMIN_ROLE, _msgSender()) ||
        hasRole(FUND_ROLE, _msgSender()),
      'must fund role'
    );
    _;
  }

  function grantWitnessRole(address account) external {
    grantRole(WITNESS_ROLE, account);
  }

  function grantBrokerRole(address account) external {
    grantRole(BROKER_ROLE, account);
  }

  function grantFundRole(address account) external {
    grantRole(FUND_ROLE, account);
  }

  function changeZkLinkInstance(
    IZkLink newAddress
  ) external onlyRole(DEFAULT_ADMIN_ROLE) {
    zkLinkInstance = newAddress;
  }

  function acceptERC20(
    bytes calldata data,
    bytes calldata signature
  ) external onlyRole(BROKER_ROLE) {
    require(bytes4(data) == ACCEPT_ERC20, 'func error erc20');
    address witnessAddress = ECDSA.recover(keccak256(data), signature);
    _checkRole(WITNESS_ROLE, witnessAddress); // if not witness, will revert
    address(zkLinkInstance).call(data);
  }

  function batchAcceptERC20(
    bytes[] calldata data,
    bytes calldata signature
  ) external onlyRole(BROKER_ROLE) {
    bytes memory digest = data[0];
    address(zkLinkInstance).call(data[0]);
    require(bytes4(data[0]) == ACCEPT_ERC20, 'func error erc20');
    for (uint8 i = 1; i < data.length; i++) {
      digest = abi.encodePacked(digest, data[i]);
      address(zkLinkInstance).call(data[i]);
      require(bytes4(data[i]) == ACCEPT_ERC20, 'func error erc20');
    }
    address witnessAddress = ECDSA.recover(keccak256(digest), signature);
    _checkRole(WITNESS_ROLE, witnessAddress); // if not witness, will revert
  }

  function acceptETH(
    bytes calldata data,
    uint128 amount,
    bytes calldata signature
  ) external onlyRole(BROKER_ROLE) {
    require(bytes4(data) == ACCEPT_ETH, 'func error eth');
    address witnessAddress = ECDSA.recover(keccak256(data), signature);
    _checkRole(WITNESS_ROLE, witnessAddress); // if not witness, will revert
    //amount * (MAX_ACCEPT_FEE_RATE - withdrawFeeRate) / MAX_ACCEPT_FEE_RATE;
    address(zkLinkInstance).call{value: amount}(data);
  }

  function batchAcceptETH(
    bytes[] calldata data,
    uint128[] calldata amounts,
    bytes calldata signature
  ) external onlyRole(BROKER_ROLE) {
    bytes memory digest = data[0];
    address(zkLinkInstance).call{value: amounts[0]}(data[0]);
    require(bytes4(data[0]) == ACCEPT_ETH, 'func error eth');
    for (uint i = 1; i < data.length; i++) {
      digest = abi.encodePacked(digest, data[i]);
      address(zkLinkInstance).call{value: amounts[i]}(data[i]);
      require(bytes4(data[i]) == ACCEPT_ETH, 'func error eth');
    }
    address witnessAddress = ECDSA.recover(keccak256(digest), signature);
    _checkRole(WITNESS_ROLE, witnessAddress);
  }

  function batchAccept(
    bytes[] calldata data,
    uint128[] calldata amounts,
    bytes calldata signature
  ) external onlyRole(BROKER_ROLE) {
    bytes memory digest = data[0];
    address(zkLinkInstance).call{value: amounts[0]}(data[0]);
    bytes4 funcSig = bytes4(data[0]);
    require(funcSig == ACCEPT_ETH || funcSig == ACCEPT_ERC20, 'func error eth');
    for (uint i = 1; i < data.length; i++) {
      digest = abi.encodePacked(digest, data[i]);
      address(zkLinkInstance).call{value: amounts[i]}(data[i]);
      funcSig = bytes4(data[i]);
      require(
        funcSig == ACCEPT_ETH || funcSig == ACCEPT_ERC20,
        'func error eth'
      );
    }
    address witnessAddress = ECDSA.recover(keccak256(digest), signature);
    _checkRole(WITNESS_ROLE, witnessAddress);
  }

  // Dynamic call function
  function dynamicCall(
    address payable contractAddress,
    bytes calldata data
  ) external payable nonReentrant onlyRole(DEFAULT_ADMIN_ROLE) {
    contractAddress.call{value: msg.value}(data);
  }

  function withdraw(
    IERC20 token, // Token address
    address to, // Address to withdraw to
    uint256 amount // Amount to withdraw
  ) external nonReentrant mustFundRole returns (bool) {
    return token.transfer(to, amount);
  }

  function approve(
    address contractAddress,
    address spender,
    uint256 amount
  ) internal returns (bool) {
    return IERC20(contractAddress).approve(spender, amount);
  }

  function approveZkLink(
    address contractAddress,
    uint256 amount
  ) external nonReentrant mustFundRole returns (bool) {
    return approve(contractAddress, address(zkLinkInstance), amount);
  }

  function withdrawETH(
    address to,
    uint256 amount
  ) external nonReentrant mustFundRole returns (bool res) {
    (res, ) = to.call{value: amount}(new bytes(0));
  }
}
