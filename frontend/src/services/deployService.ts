import { api } from "@/utils/axios";

export interface IDeployResponse {
    success: boolean;
    message: string;
    contractAddress: string;
    network: string;
    contractName: string;
    explorerUrl: string;
}

export async function deploySmartContract(code: string) {
    let payload = {
        code: code,
        network: "primordial"
    }

    try {
        let res = await api.post("/deploy", payload)
        return res.data

    } catch (e: any) {
        console.log(e)
        throw(e)
    }
}