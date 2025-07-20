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
    try {
        const payload = {
            code: code,
            network: "primordial"
        };
        const res = await api.post("/deploy", payload);
        return res.data;
    } catch (e: unknown) {
        console.log(e);
        throw e;
    }
}

export async function saveDeployment(deployment: IDeployResponse, user_id: string) {
    try{
        const payload = {
            user_id: user_id,
            deployment: deployment
        };
        await api.post('/save_deployment', payload);
    }catch(e: unknown){
        console.log(e);
    }
}

export async function getDeployments(user_id: string) {
    try{
        const res = await api.get(`/get_deployments/${user_id}`);
        return res.data.deployments;
    }catch(e: unknown){
        console.log(e);
    }
}