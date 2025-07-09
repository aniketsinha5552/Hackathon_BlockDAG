import os
import sys
import subprocess
import tempfile
from dotenv import load_dotenv

from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
from pydantic import SecretStr

# Load API Key from backend directory
load_dotenv(dotenv_path=os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env"))
openai_api_key = os.getenv("OPENAI_API_KEY")

print("DEBUG: OPENAI_API_KEY =", os.getenv("OPENAI_API_KEY"))
if not openai_api_key:
    print("OPENAI_API_KEY not found in .env")
    sys.exit(1)

# Init LLM
llm = ChatOpenAI(
    model="gpt-4o-mini",
    temperature=0.2,
    api_key=SecretStr(openai_api_key)
)

# Prompt Template
contract_prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a helpful assistant who creates smart contracts in Solidity for non-technical users. Always explain the contract in plain language after generating the code."),
    ("human", "I want a {contract_type} contract with features like: {features}. Make it secure and production-ready.")
])

# Contract Generator
def generate_contract(contract_type, features):
    try:
        messages = contract_prompt.format_messages(
            contract_type=contract_type,
            features=features
        )
        response = llm(messages)
        return response.content
    except Exception as e:
        return f"Error generating contract: {str(e)}"

# Smart Contract Auditor (using solhint)
def audit_contract(solidity_code):
    try:
        # Save code to temp file
        with tempfile.NamedTemporaryFile(delete=False, suffix=".sol", mode="w", encoding="utf-8") as temp:
            temp.write(solidity_code)
            temp_path = temp.name

        # Run solhint
        result = subprocess.run(["solhint", temp_path], capture_output=True, text=True)

        # Clean up file
        os.remove(temp_path)

        if result.returncode == 0:
            return "Solhint found no major issues in the contract."
        else:
            return f"Solhint Audit Report:\n\n{result.stdout}"
    except Exception as e:
        return f"Audit failed: {str(e)}"

# Main CLI Entrypoint
def main():
    if len(sys.argv) != 3:
        print("Usage: python generate_contract.py <ContractType> <Features>")
        print("Example: python generate_contract.py 'ERC-20' 'burnable, mintable, capped at 1M tokens'")
        sys.exit(1)

    contract_type = sys.argv[1]
    features = sys.argv[2]

    print("\n Generating your smart contract, please wait...\n")
    contract = generate_contract(contract_type, features)
    print(" Contract and Explanation:\n")
    print(contract)

    print("\n Running basic audit using solhint...\n")
    audit_result = audit_contract(contract)
    print(audit_result)

if __name__ == "__main__":
    main()

