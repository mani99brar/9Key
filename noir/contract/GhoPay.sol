// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../circuits/contract/with_foundry/plonk_vk.sol";

interface IERC20Permit {
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    function permit(address owner, address spender, uint256 value, uint256 deadline, uint8 v, bytes32 r, bytes32 s) external;
}

contract GhoPay {
    address public ghoTokenAddress = 0xc4bF5CbDaBE595361438F8c6a187bDc330539c60; // Address of the GHO token contract
    mapping(address => uint32) public registeredUsers; // Track registered users
    UltraVerifier public verifier;
    constructor(UltraVerifier _verifier) {
        verifier = _verifier;
    }

    // Combined user registration and approval
    function registerAndApprove(uint32 sum, uint256 value, uint256 deadline, uint8 v, bytes32 r, bytes32 s) external {
        // Register the user
        require(registeredUsers[msg.sender] == 0, "User already registered");
        registeredUsers[msg.sender] = sum;

        // Approve with permit
        IERC20Permit(ghoTokenAddress).permit(msg.sender, address(this), value, deadline, v, r, s);
    }

    // Transfer GHO tokens
    function transferGhoTokens(bytes calldata proof,address recipient, uint256 amount, uint32 sum) external {
        bytes32[] memory y;
        y[0] = bytes32(uint256(sum));
        bool proofResult = verifier.verify(proof, y);
        require(proofResult, "Proof is not valid");
        require(registeredUsers[msg.sender] == sum, "User not registered");
        require(sum != 0, "User not registered");
        IERC20Permit(ghoTokenAddress).transferFrom(msg.sender, recipient, amount);
    }
    function verifyEqual(bytes calldata proof, bytes32[] calldata y) public view returns (bool) {
        bool proofResult = verifier.verify(proof, y);
        require(proofResult, "Proof is not valid");
        return proofResult;
    }
}
