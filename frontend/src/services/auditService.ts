import { api } from "../utils/axios";

export interface AuditRequest {
    contract_code: string;
    description?: string;
}

export interface AuditResponse {
    success: boolean;
    original_code: string;
    corrected_code: string;
    original_audit: {
        success: boolean;
        issues: string[];
        warnings: string[];
        errors: string[];
    };
    final_audit: {
        success: boolean;
        issues: string[];
        warnings: string[];
        errors: string[];
    };
    issues_fixed: number;
    remaining_issues: number;
    validation: {
        has_pragma: boolean;
        has_contract: boolean;
        has_constructor: boolean;
        has_imports: boolean;
        solidity_version: string | null;
        contract_name: string | null;
    };
    improvements: {
        security_improvements: string[];
        functionality_improvements: string[];
        best_practice_improvements: string[];
        structural_improvements: string[];
        total_improvements: number;
    };
    error?: string;
}

export interface ValidationResponse {
    success: boolean;
    validation: {
        has_pragma: boolean;
        has_contract: boolean;
        has_constructor: boolean;
        has_imports: boolean;
        solidity_version: string | null;
        contract_name: string | null;
    };
}

export interface SolhintResponse {
    success: boolean;
    audit_result: {
        success: boolean;
        issues: string[];
        warnings: string[];
        errors: string[];
    };
}

function isAxiosErrorWithDetail(error: unknown): error is { response: { data: { detail: string } } } {
    return (
        typeof error === 'object' &&
        error !== null &&
        'response' in error &&
        typeof (error as any).response === 'object' &&
        (error as any).response !== null &&
        'data' in (error as any).response &&
        typeof (error as any).response.data === 'object' &&
        (error as any).response.data !== null &&
        'detail' in (error as any).response.data &&
        typeof (error as any).response.data.detail === 'string'
    );
}

export async function auditContract(contractCode: string, description?: string): Promise<AuditResponse> {
    try {
        const response = await api.post("/audit", {
            contract_code: contractCode,
            description: description || ""
        });
        return response.data;
    } catch (error: unknown) {
        console.error("Audit failed:", error);
        if (isAxiosErrorWithDetail(error)) {
            throw new Error(error.response.data.detail);
        }
        throw new Error("Audit failed");
    }
}

export async function validateContract(contractCode: string, description?: string): Promise<ValidationResponse> {
    try {
        const response = await api.post("/validate", {
            contract_code: contractCode,
            description: description || ""
        });
        return response.data;
    } catch (error: unknown) {
        console.error("Validation failed:", error);
        if (isAxiosErrorWithDetail(error)) {
            throw new Error(error.response.data.detail);
        }
        throw new Error("Validation failed");
    }
}

export async function solhintAudit(contractCode: string, description?: string): Promise<SolhintResponse> {
    try {
        const response = await api.post("/solhint-only", {
            contract_code: contractCode,
            description: description || ""
        });
        return response.data;
    } catch (error: unknown) {
        console.error("Solhint audit failed:", error);
        if (isAxiosErrorWithDetail(error)) {
            throw new Error(error.response.data.detail);
        }
        throw new Error("Solhint audit failed");
    }
} 