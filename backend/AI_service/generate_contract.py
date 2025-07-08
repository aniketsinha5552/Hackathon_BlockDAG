from langchain.chat_models import ChatOpenAI
from langchain.schema import HumanMessage
from langchain.memory import ConversationBufferMemory
from langchain.prompts import ChatPromptTemplate
from dotenv import load_dotenv
import os
import sys

# Load .env variables
load_dotenv()
openai_api_key = os.getenv("OPENAI_API_KEY")

# Initialize LLM
llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.2, openai_api_key=openai_api_key)

# Memory to track session context
memory = ConversationBufferMemory(memory_key="chat_history", return_messages=True)

# Friendly prompt template for non-technical users
contract_prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a helpful assistant who creates smart contracts in Solidity for non-technical users. Always explain the contract in plain language after generating the code."),
    ("human", "I want a {contract_type} contract with features like: {features}. Make it secure and production-ready.")
])

# Function to get LLM response
def generate_contract(contract_type, features):
    prompt = contract_prompt.format_messages(
        contract_type=contract_type,
        features=features
    )
    response = llm(prompt)
    memory.save_context({"input": prompt}, {"output": response.content})
    return response.content

# Entry point for CLI
if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python generate_contract.py <ContractType> <Features>")
        print("Example: python generate_contract.py 'ERC-20' 'burnable, mintable, supply cap 1 million tokens'")
        sys.exit(1)

    contract_type = sys.argv[1]
    features = sys.argv[2]

    print("\n🔧 Generating your smart contract, please wait...\n")
    contract = generate_contract(contract_type, features)

    print("✅ Contract and Explanation:\n")
    print(contract)