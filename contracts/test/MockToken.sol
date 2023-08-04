// SPDX-License-Identifier: MIT OR Apache-2.0

pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockToken is ERC20 {
    constructor() ERC20("name", "symbol") {
        _mint(msg.sender, 10000000000 * 10 ** 18);
    }
}
