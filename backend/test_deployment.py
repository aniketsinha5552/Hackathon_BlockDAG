#!/usr/bin/env python3
"""
Test script for the deployment service
"""

import sys
import os
from deployment_service import deployment_service

def test_deployment():
    # Sample ERC-20 contract for testing
    sample_contract = """
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TestToken is ERC20, Ownable {
    constructor() ERC20("TestToken", "TEST") Ownable(msg.sender) {
        _mint(msg.sender, 1000000 * 10 ** decimals());
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}
"""
    
    print("Testing contract deployment...")
    print("=" * 50)
    
    try:
        # Save the contract file first
        print("1. Saving contract file...")
        contract_file = deployment_service.save_contract_to_file(sample_contract, "TestToken")
        print(f"✅ Contract saved to: {contract_file}")
        
        # Test compilation
        print("\n2. Testing compilation...")
        compile_result = deployment_service.compile_contract("TestToken")
        
        if compile_result["success"]:
            print("✅ Compilation successful")
            print(f"   Bytecode length: {len(compile_result['bytecode'])}")
            print(f"   ABI functions: {len(compile_result['abi'])}")
        else:
            print(f"❌ Compilation failed: {compile_result['error']}")
            return
        
        # Test deployment
        print("\n3. Testing deployment...")
        deployment_result = deployment_service.deploy_contract(sample_contract, "TestToken")
        
        if deployment_result["success"]:
            print("✅ Deployment successful!")
            print(f"   Contract Address: {deployment_result['contractAddress']}")
            print(f"   Network: {deployment_result['network']}")
            print(f"   Explorer URL: {deployment_result['explorerUrl']}")
        else:
            print(f"❌ Deployment failed: {deployment_result['error']}")
    
    except Exception as e:
        print(f"❌ Test failed with error: {str(e)}")
    
    finally:
        # Clean up
        try:
            deployment_service.cleanup_contract_file("TestToken")
            print("\n🧹 Cleaned up test files")
        except:
            pass

if __name__ == "__main__":
    test_deployment() 