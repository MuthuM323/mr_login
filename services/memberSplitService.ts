import { apiClient } from './apiClient';

const HEADER_NONCE = "X-NONCE";
const X_BCBSMS_Authorization_Token = "X-BCBSMS-Authorization-Token";

export interface VerifyUserRequest {
    firstName: string;
    lastName: string;
    subscriberId: string;
    zipCode: string;
    birthDate: string;
    uniqueCode: string;
    ssn: string;
}

export interface AccountSetupRequest {
    currentUsername?: string;
    username: string;
    email: string;
    mobilePhone: string;
    homePhone: string;
    password: string;
    securityQuestions: Array<{
        question: string;
        answer: string;
    }>;
}

export interface AuthTokens {
    sessionToken: string;
    nonce: string;
}

export interface UsernameAvailabilityRequest {
    userId: string;
    sessionToken: string;
    nonce: string;
}

export interface AccountSharingRequest {
    shareAccount: boolean;
}

export interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
}

export const memberSplitService = {
    async verifyUser(requestData: VerifyUserRequest) {
        if (process.env.NODE_ENV !== "development") {
            const response = await apiClient.post("/user/account/verify", requestData);
            return response.data;
        } else {
            // Mock response for development
            return {
                status: "200",
                data: {
                    firstName: requestData.firstName,
                    lastName: requestData.lastName,
                    showAccountSharing: Math.random() > 0.5,
                    policyHolderFirstName: "John",
                    policyHolderLastName: "Doe",
                    requestToken: "mock-token-123",
                    nonce: "mock-nonce-456",
                    username: "mockuser",
                    email: "mock@example.com",
                    userExists: false
                }
            };
        }
    },

    async checkUsernameAvailability(requestData: UsernameAvailabilityRequest) {
        if (process.env.NODE_ENV !== "development") {
            const response = await apiClient.get(
                `/user/account/availability/${requestData.userId}`,
                {
                    headers: {
                        [X_BCBSMS_Authorization_Token]: requestData.sessionToken,
                        [HEADER_NONCE]: requestData.nonce
                    }
                }
            );
            return response.data;
        } else {
            // Mock response for development
            return {
                status: "200",
                data: "OK"
            };
        }
    },

    async getSecurityQuestions(requestData: AuthTokens) {
        if (process.env.NODE_ENV !== "development") {
            const response = await apiClient.get("/user/account/securityquestionnaire", {
                headers: {
                    [X_BCBSMS_Authorization_Token]: requestData.sessionToken,
                    [HEADER_NONCE]: requestData.nonce
                }
            });
            return response.data;
        } else {
            // Mock response for development
            return {
                status: "200",
                data: {
                    securityQuestions: [
                        {
                            questions: [
                                { questionText: "What was the name of your first pet?" },
                                { questionText: "What is your mother's maiden name?" },
                                { questionText: "What was the make of your first car?" }
                            ]
                        },
                        {
                            questions: [
                                { questionText: "What city were you born in?" },
                                { questionText: "What is your favorite color?" },
                                { questionText: "What was your childhood nickname?" }
                            ]
                        },
                        {
                            questions: [
                                { questionText: "What is the name of your favorite teacher?" },
                                { questionText: "What street did you grow up on?" },
                                { questionText: "What is your favorite movie?" }
                            ]
                        }
                    ]
                }
            };
        }
    },

    async accountSetup(requestData: AccountSetupRequest, authData: AuthTokens) {
        if (process.env.NODE_ENV !== "development") {
            const response = await apiClient.put("/user/account/setup", requestData, {
                headers: {
                    [X_BCBSMS_Authorization_Token]: authData.sessionToken,
                    [HEADER_NONCE]: authData.nonce
                }
            });
            return response.data;
        } else {
            // Mock response for development
            return {
                status: "200",
                data: {
                    sessionToken: "new-token-789",
                    nonce: "new-nonce-012"
                }
            };
        }
    },

    async accountSharing(requestData: AccountSharingRequest, authData: AuthTokens) {
        if (process.env.NODE_ENV !== "development") {
            const response = await apiClient.put("/user/account/share", requestData, {
                headers: {
                    [X_BCBSMS_Authorization_Token]: authData.sessionToken,
                    [HEADER_NONCE]: authData.nonce
                }
            });
            return response.data;
        } else {
            // Mock response for development
            return {
                status: "200",
                data: "Account sharing preference updated successfully"
            };
        }
    },

    async changePassword(token: string, requestData: ChangePasswordRequest) {
        const response = await apiClient.post("/user/account/password/update", requestData, {
            headers: {
                [X_BCBSMS_Authorization_Token]: token
            }
        });
        return response.data;
    }
};