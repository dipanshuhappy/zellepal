import createClient from 'openapi-fetch'
import { API_URL } from './constants';
export interface paths {
    "/v1/{projectId}/info": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Returns the current info of the project */
        get: {
            parameters: {
                query?: never;
                header: {
                    "x-api-key": string;
                };
                path: {
                    /** @description The project id */
                    projectId: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Returns the current info of the project */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            id: string;
                            name: string;
                            /** Format: uri */
                            url: string;
                            /** @default true */
                            fiatActive: boolean;
                            fiatOptions: number[];
                            /** @default 5 */
                            feePercentage: number;
                            feeAmount?: number;
                            /**
                             * @default payout
                             * @enum {string}
                             */
                            settlementType: "payout" | "smart-contract";
                        };
                    };
                };
                /** @description Internal Server Error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/{projectId}/transactions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Returns the list of transactions of related to the  project id */
        get: {
            parameters: {
                query?: never;
                header: {
                    "x-api-key": string;
                };
                path: {
                    /** @description The project id */
                    projectId: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Returns the list of transactions of related to the  project id */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["TransactionWithPaymentUser"][];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/{projectId}/transactions/{transactionId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Returns the transaction to the  project id and transaction id */
        get: {
            parameters: {
                query?: never;
                header: {
                    "x-api-key": string;
                };
                path: {
                    /** @description The project id */
                    projectId: string;
                    /** @description The transaction id */
                    transactionId: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Returns transaction of project id and transaction id */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["TransactionWithPaymentUser"];
                    };
                };
                /** @description Internal Server Error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/{projectId}/{paymentId}/transactions/{transactionId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Returns the transaction to the  project id , transaction id and payment Id */
        get: {
            parameters: {
                query?: never;
              
                path: {
                    /** @description The project id */
                    projectId: string;
                    /** @description The transaction id */
                    transactionId: string;
                    /** @description The payment id e.g 0 for stripe */
                    paymentId: number;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Returns transaction of project id , transaction id and payment Id */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["TransactionWithPaymentUser"];
                    };
                };
                /** @description Internal Server Error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/{projectId}/{paymentId}/transactions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Returns all the transaction related to project id and payment id */
        get: {
            parameters: {
                query?: never;
                header: {
                    "x-api-key": string;
                };
                path: {
                    /** @description The project id */
                    projectId: string;
                    /** @description The payment id e.g 0 for stripe */
                    paymentId: number;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Returns all the transaction related to project id and payment id */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["TransactionWithPaymentUser"][];
                    };
                };
                /** @description Internal Server Error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/{projectId}/0/payment-links": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** @description Returns all the transaction related to project id and payment id */
        post: {
            parameters: {
                query?: never;
                header: {
                    "x-api-key": string;
                };
                path: {
                    /** @description The project id */
                    projectId: string;
                };
                cookie?: never;
            };
            /** @description The request body of the payment link */
            requestBody: {
                content: {
                    "application/json": {
                        name: string;
                    };
                };
            };
            responses: {
                /** @description Returns URL of the payment link */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            url: string;
                        };
                    };
                };
                /** @description Internal Server Error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/{projectId}/0/checkout": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** @description Create a checkout session for stripe in the noahchonlee  project */
        post: {
            parameters: {
                query?: never;
                header: {
                    "x-api-key": string;
                };
                path: {
                    /** @description The project id */
                    projectId: string;
                };
                cookie?: never;
            };
            /** @description The request body of voice deck stripe checkout */
            requestBody: {
                content: {
                    "application/json": {
                        description?: string;
                        name: string;
                        images?: string[];
                        amount: number;
                        /** Format: uri */
                        success_url?: string;
                        chainId?: number;
                        /** @default evm */
                        blockChainName?: string;
                        customerEmail?: string;
                        metadata: {
                            payoutAddress: string;
                        };
                        extraMetadata?: unknown;
                        /** @default true */
                        forwardFeesToUsersInCheckout?: boolean;
                        customId?: string;
                        productId?: string;
                        referrerId?: string;
                    };
                };
            };
            responses: {
                /** @description Returns the checkout session */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            projectId: string;
                            paymentId: string;
                            url: string;
                            transactionId: string;
                        };
                    };
                };
                /** @description Internal Server Error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/payment/5/capture": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Captures a Phoenix payment transaction */
        post: {
            parameters: {
                query?: never;
                header: {
                    "x-api-key": string;
                };
                path?: never;
                cookie?: never;
            };
            /** @description The request body for capturing a Phoenix payment */
            requestBody: {
                content: {
                    "application/json": {
                        transactionId: string;
                    };
                };
            };
            responses: {
                /** @description Payment captured successfully */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            message: string;
                        };
                    };
                };
                /** @description Bad Request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: string;
                        };
                    };
                };
                /** @description Not Found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: string;
                        };
                    };
                };
                /** @description Internal Server Error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        get?: never;
        put?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/payment/5/details/{transactionId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Gets the details of a Phoenix payment transaction */
        get: {
            parameters: {
                query?: never;
                header: {
                    "x-api-key": string;
                };
                path: {
                    /** @description The transaction ID */
                    transactionId: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Returns the payment details */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            success: boolean;
                            data: {
                                id: string;
                                transactionId: string;
                                confirmationStatus: "not-started-by-sender"|"wait-for-payment-details"|"payment-confirmed-by-sender"|"payment-confirmed-by-admin"|"confirmed-but-settle-later"|"failed";
                                payoutDetails?: string;
                                amount?: number;
                                createdAt: string;
                                uniquenessAmount?: number;
                                updatedAt: string;
                            };
                        };
                    };
                };
                /** @description Not Found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            success: boolean;
                            error: string;
                        };
                    };
                };
                /** @description Internal Server Error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            success: boolean;
                            error: string;
                        };
                    };
                };
            };
        };
        post?: never;
        put?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/payment/5/details": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Creates or updates payment details for a Phoenix transaction */
        post: {
            parameters: {
                query?: never;
                header: {
                    "x-api-key": string;
                };
                path?: never;
                cookie?: never;
            };
            /** @description The request body for creating/updating payment details */
            requestBody: {
                content: {
                    "application/json": {
                        transactionId: string;
                        sellerAddress?: string;
                    };
                };
            };
            responses: {
                /** @description Payment details created/updated successfully */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            success: boolean;
                            data: {
                                orderId: string;
                                status: string;
                                amount: string;
                                recipientAddress: string;
                                createdAt: string;
                                verificationMethod: string;
                                orderFulfillment?: {
                                    transaction: {
                                        hash: string;
                                    };
                                };
                                orderVerification?: {
                                    verified: boolean;
                                };
                            };
                        };
                    };
                };
                /** @description Bad Request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: string;
                        };
                    };
                };
                /** @description Not Found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            success: boolean;
                            error: string;
                        };
                    };
                };
                /** @description Internal Server Error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            success: boolean;
                            error: string;
                        };
                    };
                };
            };
        };
        get?: never;
        put?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/{projectId}/referrers": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Returns all referrers for a project */
        get: {
            parameters: {
                query?: never;
                header: {
                    "x-api-key": string;
                };
                path: {
                    /** @description The project id */
                    projectId: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Returns list of referrers */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Referrer"][];
                    };
                };
                /** @description Unauthorized */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: string;
                        };
                    };
                };
            };
        };
        /** @description Creates a new referrer */
        post: {
            parameters: {
                query?: never;
                header: {
                    "x-api-key": string;
                };
                path: {
                    /** @description The project id */
                    projectId: string;
                };
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": {
                        id?: string;
                        email?: string;
                        phone?: string;
                        percentageCut: number;
                    };
                };
            };
            responses: {
                /** @description Referrer created successfully */
                201: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Referrer"];
                    };
                };
                /** @description Bad Request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: string;
                        };
                    };
                };
                /** @description Unauthorized */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: string;
                        };
                    };
                };
            };
        };
    };
    "/v1/{projectId}/referrers/{referralId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Returns a specific referrer */
        get: {
            parameters: {
                query?: never;
                header: {
                    "x-api-key": string;
                };
                path: {
                    /** @description The project id */
                    projectId: string;
                    /** @description The referral id */
                    referralId: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Returns the referrer */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Referrer"];
                    };
                };
                /** @description Not Found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: string;
                        };
                    };
                };
                /** @description Unauthorized */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: string;
                        };
                    };
                };
            };
        };
        /** @description Updates a referrer */
        put: {
            parameters: {
                query?: never;
                header: {
                    "x-api-key": string;
                };
                path: {
                    /** @description The project id */
                    projectId: string;
                    /** @description The referral id */
                    referralId: string;
                };
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": {
                        email?: string;
                        phone?: string;
                    };
                };
            };
            responses: {
                /** @description Referrer updated successfully */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Referrer"];
                    };
                };
                /** @description Not Found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: string;
                        };
                    };
                };
                /** @description Unauthorized */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: string;
                        };
                    };
                };
            };
        };
    };
    "/v1/payment/6/zelle-mail/lp/{zelleId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: {
                    zelleId: string;
                };
                cookie?: never;
            };
            responses: {
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            success: boolean;
                            data: {
                                id: string;
                                walletAddress: string;
                                email: string | null;
                                zelleId: string | null;
                                zelleName: string | null;
                                paymentProcessorId: string | null;
                                earnedFees: number;
                                liquidityInFiat: number;
                                createdAt: string;
                                updatedAt: string;
                                isBusinessZelle: boolean;
                            };
                        };
                    };
                };
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            success: boolean;
                            error: string;
                        };
                    };
                };
            };
        };
    },
    "/v1/payment/6/zelle-mail/lp": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Creates a new liquidity provider */
        post: {
            parameters: {
                query?: never;
                header: {
                    "x-api-key": string;
                };
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": {
                        email?: string;
                        zelleId?: string;
                        zelleName?: string;
                        paymentProcessorId?: string;
                    };
                };
            };
            responses: {
                /** @description LP created successfully */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            success: boolean;
                            data: {
                                id: string;
                                walletAddress: string;
                                email: string | null;
                                zelleId: string | null;
                                zelleName: string | null;
                                paymentProcessorId: string | null;
                                createdAt: string;
                            };
                        };
                    };
                };
                /** @description Internal Server Error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            success: boolean;
                            error: string;
                        };
                    };
                };
            };
        };
        /** @description Lists all liquidity providers */
        get: {
            parameters: {
                query?: never;
                header: {
                    "x-api-key": string;
                };
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            success: boolean;
                            data: Array<{
                                id: string;
                                walletAddress: string;
                                email: string | null;
                                zelleId: string | null;
                                zelleName: string | null;
                                paymentProcessorId: string | null;
                                earnedFees: number;
                                liquidityInFiat: number;
                                createdAt: string;
                                updatedAt: string;
                                isBusinessZelle: boolean;
                            }>;
                        };
                    };
                };
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            success: boolean;
                            error: string;
                        };
                    };
                };
            };
        };
    };
    "/v1/payment/6/zelle-mail/transfer-funds": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Transfers funds from LP wallet to reserve */
        post: {
            parameters: {
                query?: never;
                header: {
                    "x-api-key": string;
                };
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": {
                        zelleId: string;
                    };
                };
            };
            responses: {
                /** @description Transfer successful */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            hash: string;
                        };
                    };
                };
                /** @description LP not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            success: boolean;
                            error: string;
                        };
                    };
                };
                /** @description LP wallet balance too low */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            success: boolean;
                            error: string;
                        };
                    };
                };
            };
        };
    };
    "/v1/payment/6/zelle-mail/zelle-payment-received": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Webhook for Zelle payment received */
        post: {
            parameters: {
                query?: never;
                header: {
                    "parsio-signature": string;
                };
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": {
                        mailbox_id: string;
                        doc_id: string;
                        event: "doc.parsed";
                        payload: {
                            filename: string;
                            template_id: string;
                            parsed: {
                                name: string;
                                sent_date: string;
                                transaction_number: string;
                                zelleEmail: string;
                                amount: string;
                                created_at: string;
                            };
                        };
                    };
                };
            };
            responses: {
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            success: boolean;
                        };
                    };
                };
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: string;
                        };
                    };
                };
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: string;
                        };
                    };
                };
            };
        };
    };
    "/v1/payment/6/zelle-mail/zelle-details": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Updates Zelle payment details */
        post: {
            parameters: {
                query?: never;
                header: {
                    "x-api-key": string;
                };
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": {
                        transactionId: string;
                    };
                };
            };
            responses: {
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            success: boolean;
                            data: {
                                orderId: string;
                                status: string;
                            };
                        };
                    };
                };
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            success: boolean;
                            error: string;
                        };
                    };
                };
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            success: boolean;
                            error: string;
                        };
                    };
                };
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            success: boolean;
                            error: string;
                        };
                    };
                };
            };
        };
    };
    "/v1/payment/6/zelle-mail/confirm": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Confirms a Zelle transaction */
        post: {
            parameters: {
                query?: never;
                header: {
                    "x-api-key": string;
                };
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": {
                        transactionId: string;
                    };
                };
            };
            responses: {
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            success: boolean;
                        };
                    };
                };
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: string;
                        };
                    };
                };
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: string;
                        };
                    };
                };
            };
        };
    };
    "/v1/payment/6/zelle-mail/settle": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Confirms a Zelle transaction */
        post: {
            parameters: {
                query?: never;
                header: {
                    "x-api-key": string;
                };
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": {
                        transactionId: string;
                    };
                };
            };
            responses: {
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            success: boolean;
                        };
                    };
                };
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: string;
                        };
                    };
                };
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: string;
                        };
                    };
                };
            };
        };
    };
    
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
        TransactionWithPaymentUser: {
            id: string;
            projectId: string | null;
            paymentId: string | null;
            externalPaymentProviderId: string | null;
            chainId: number | null;
            blockChainName: string | null;
            blockchainTransactionId: string | null;
            paymentUserId: string | null;
            amountInFiat: number | null;
            currencyInFiat: string | null;
            finalAmountInFiat: number | null;
            paymentProcessFeesInFiat: number | null;
            platformFeesInFiat: number | null;
            token: string;
            amountInToken: number;
            decimals: number;
            /** @enum {string|null} */
            tokenType: "TOKEN" | "NFT" | null;
            paymentIntent: string | null;
            metadataJson: string | number | boolean | unknown | (string | number | boolean | unknown | (string | number | boolean | unknown | unknown)[] | {
                [key: string]: string | number | boolean | unknown | unknown;
            } | unknown)[] | {
                [key: string]: string | number | boolean | unknown | (string | number | boolean | unknown | (string | number | boolean | unknown | unknown)[] | {
                    [key: string]: string | number | boolean | unknown | unknown;
                } | unknown)[] | unknown;
            } | unknown;
            extraMetadataJson: string | number | boolean | unknown | (string | number | boolean | unknown | (string | number | boolean | unknown | unknown)[] | {
                [key: string]: string | number | boolean | unknown | unknown;
            } | unknown)[] | {
                [key: string]: string | number | boolean | unknown | (string | number | boolean | unknown | (string | number | boolean | unknown | unknown)[] | {
                    [key: string]: string | number | boolean | unknown | unknown;
                } | unknown)[] | unknown;
            } | unknown;
            /** @enum {string|null} */
            status: "pending" | "confirmed-onchain" | "failed" | "cancelled" | "refunded" | "fiat-confirmed" | "confirmed" | null;
            createdAt: string | null;
            updatedAt: string | null;
            paymentUser: {
                id: string;
                email: string | null;
                name: string | null;
                paypalId: string | null;
                externalId: string | null;
                projectId: string | null;
                phoneNumber: string | null;
                createdAt: string | null;
                updatedAt: string | null;
            } | null;
        };
        Referrer: {
            referralId: string;
            email: string | null;
            phone: string | null;
            referredBy: string | null;
            projectId: string | null;
            percentageCut: number;
            totalVolume: number;
            amountEarned: number;
            amountClaimed: number;
            createdAt: string;
            updatedAt: string;
        };
    };
    responses: never;
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export type operations = Record<string, never>;


 
export const normieTechClient = createClient<paths>({
  baseUrl: API_URL,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  },
})
