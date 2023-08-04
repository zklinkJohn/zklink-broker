// SPDX-License-Identifier: MIT OR Apache-2.0

pragma solidity ^0.8.0;
import "zklink-contracts-interface/contracts/IZkLink.sol";

contract ZkLink is IZkLink {
    /// @return Return the accept allowance of broker
    function brokerAllowance(
        uint16 tokenId,
        address acceptor,
        address broker
    ) external view returns (uint128) {
        return 0;
    }

    /// @notice Give allowance to broker to call accept
    /// @param tokenId token that transfer to the receiver of accept request from accepter or broker
    /// @param broker who are allowed to do accept by accepter(the msg.sender)
    /// @param amount the accept allowance of broker
    function brokerApprove(
        uint16 tokenId,
        address broker,
        uint128 amount
    ) external returns (bool) {}

    /// @notice A map of token address to id, 0 is invalid token id
    function tokenIds(
        address tokenAddress
    ) external view returns (uint16 tokenId) {}

    /// @notice Get synchronized progress of zkLink contract known on deployed chain
    function getSynchronizedProgress(
        StoredBlockInfo memory block
    ) external view returns (uint256 progress) {}

    /// @notice Combine the `progress` of the other chains of a `syncHash` with self
    function receiveSynchronizationProgress(
        bytes32 syncHash,
        uint256 progress
    ) external {}

    /// @notice Deposit ETH to Layer 2 - transfer ether from user into contract, validate it, register deposit
    /// @param _zkLinkAddress The receiver Layer 2 address
    /// @param _subAccountId The receiver sub account
    function depositETH(
        bytes32 _zkLinkAddress,
        uint8 _subAccountId
    ) external payable {}

    /// @notice Deposit ERC20 token to Layer 2 - transfer ERC20 tokens from user into contract, validate it, register deposit
    /// @dev it MUST be ok to call other external functions within from this function
    /// when the token(eg. erc777) is not a pure erc20 token
    /// @param _token Token address
    /// @param _amount Token amount
    /// @param _zkLinkAddress The receiver Layer 2 address
    /// @param _subAccountId The receiver sub account
    /// @param _mapping If true and token has a mapping token, user will receive mapping token at l2
    function depositERC20(
        IERC20 _token,
        uint104 _amount,
        bytes32 _zkLinkAddress,
        uint8 _subAccountId,
        bool _mapping
    ) external {}

    /// @notice Acceptor accept a eth fast withdraw, acceptor will get a fee for profit
    /// @param acceptor Acceptor who accept a fast withdraw
    /// @param accountId Account that request fast withdraw
    /// @param receiver User receive token from acceptor (the owner of withdraw operation)
    /// @param amount The amount of withdraw operation
    /// @param withdrawFeeRate Fast withdraw fee rate taken by acceptor
    /// @param accountIdOfNonce Account that supply nonce, may be different from accountId
    /// @param subAccountIdOfNonce SubAccount that supply nonce
    /// @param nonce Account nonce, used to produce unique accept info
    function acceptETH(
        address acceptor,
        uint32 accountId,
        address payable receiver,
        uint128 amount,
        uint16 withdrawFeeRate,
        uint32 accountIdOfNonce,
        uint8 subAccountIdOfNonce,
        uint32 nonce
    ) external payable {}

    /// @notice Acceptor accept a erc20 token fast withdraw, acceptor will get a fee for profit
    /// @param acceptor Acceptor who accept a fast withdraw
    /// @param accountId Account that request fast withdraw
    /// @param receiver User receive token from acceptor (the owner of withdraw operation)
    /// @param tokenId Token id
    /// @param amount The amount of withdraw operation
    /// @param withdrawFeeRate Fast withdraw fee rate taken by acceptor
    /// @param accountIdOfNonce Account that supply nonce, may be different from accountId
    /// @param subAccountIdOfNonce SubAccount that supply nonce
    /// @param nonce Account nonce, used to produce unique accept info
    /// @param amountTransfer Amount that transfer from acceptor to receiver
    /// may be a litter larger than the amount receiver received
    function acceptERC20(
        address acceptor,
        uint32 accountId,
        address receiver,
        uint16 tokenId,
        uint128 amount,
        uint16 withdrawFeeRate,
        uint32 accountIdOfNonce,
        uint8 subAccountIdOfNonce,
        uint32 nonce,
        uint128 amountTransfer
    ) external {}

    /// @notice  Withdraws tokens from zkLink contract to the owner
    /// @param _owner Address of the tokens owner
    /// @param _tokenId Token id
    /// @param _amount Amount to withdraw to request.
    /// @return The actual withdrawn amount
    /// @dev NOTE: We will call ERC20.transfer(.., _amount), but if according to internal logic of ERC20 token zkLink contract
    /// balance will be decreased by value more then _amount we will try to subtract this value from user pending balance
    function withdrawPendingBalance(
        address payable _owner,
        uint16 _tokenId,
        uint128 _amount
    ) external returns (uint128) {
        return 0;
    }
}
