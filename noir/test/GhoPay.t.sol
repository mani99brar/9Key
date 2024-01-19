pragma solidity ^0.8.17;

import "forge-std/Test.sol";
import "../contract/GhoPay.sol";
import "../circuits/contract/with_foundry/plonk_vk.sol";

contract GhoPayTest is Test {
    GhoPay public ghoPay;
    UltraVerifier public verifier;

    bytes32[] public correctProof;
    bytes32[] public incorrectProof;

    function setUp() public {
        verifier = new UltraVerifier();
        ghoPay = new GhoPay(verifier);

        // Initialize correct and incorrect proof scenarios based on your zk circuit inputs
        // Note: Replace these with actual proofs generated by your zk circuit
        correctProof = new bytes32[](1);
        correctProof[0] = bytes32(uint256(285)); // Replace with actual correct proof

        incorrectProof = new bytes32[](1);
        incorrectProof[0] = bytes32(uint256(295)); // Replace with actual incorrect proof
    }

    function testCorrectVerifyEqual() public {
        // Assuming proof is read from a file or generated
        string memory proof = vm.readLine("./circuits/proofs/with_foundry.proof");
        bytes memory proofBytes = vm.parseBytes(proof);
        bool result = ghoPay.verifyEqual(proofBytes, correctProof);
        assertTrue(result, "Proof should be valid");
    }
    
}
