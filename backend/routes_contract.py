import re
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'AI_service'))
from AI_service.generate_contract import generate_contract as ai_generate_contract
from deployment_service import deployment_service

router = APIRouter()

class GenerateRequest(BaseModel):
    prompt: str

class AuditRequest(BaseModel):
    code: str

class DeployRequest(BaseModel):
    code: str
    network: str = "primordial"  # Default to BlockDAG testnet

def extract_contract_name(contract_code: str) -> str:
    # This regex matches 'contract <Name>' optionally followed by inheritance and then a '{'
    match = re.search(r'contract\s+([A-Za-z_]\w*)\s*(?:is\s*[A-Za-z_][\w, ]*)?\s*{', contract_code)
    return match.group(1) if match else "GeneratedContract"

@router.post("/generate")
async def generate_contract(req: GenerateRequest):
    # Expect prompt in the format: "<contract_type>|<features>"
    if '|' not in req.prompt:
        return {"error": "Prompt must be in the format '<contract_type>|<features>'"}
    contract_type, features = map(str.strip, req.prompt.split('|', 1))
    contract = ai_generate_contract(contract_type, features)
    return {"contract": contract}

@router.post("/audit")
async def audit_contract(req: AuditRequest):
    # Placeholder: Return dummy audit result
    return {"audit": f"Audit result for provided code: OK (placeholder)"}

@router.post("/deploy")
async def deploy_contract(req: DeployRequest):
    try:
        # Validate network
        if req.network.lower() not in ["primordial", "blockdag"]:
            raise HTTPException(status_code=400, detail="Only BlockDAG testnet (primordial) is supported")
        
        # Extract contract name from the code
        contract_name = extract_contract_name(req.code)
        print(f"Extracted contract name: {contract_name}")
        
        # Deploy the contract with the correct name
        deployment_result = deployment_service.deploy_contract(req.code, contract_name)
        
        if deployment_result["success"]:
            return {
                "success": True,
                "message": "Contract deployed successfully",
                "contractAddress": deployment_result["contractAddress"],
                "network": deployment_result["network"],
                "contractName": deployment_result["contractName"],
                "explorerUrl": deployment_result["explorerUrl"]
            }
        else:
            raise HTTPException(
                status_code=500, 
                detail=f"Deployment failed: {deployment_result['error']}"
            )
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Deployment error: {str(e)}")
    finally:
        # Clean up the generated contract file
        try:
            deployment_service.cleanup_contract_file(contract_name)
        except:
            pass  # Ignore cleanup errors 