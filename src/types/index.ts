import { AxiosRequestConfig, AxiosResponseHeaders, RawAxiosResponseHeaders } from "axios";

export interface AuthState {
    Isdark: boolean;
    user: any | null;
    data: any | null;
    token: string | null;
    accessToken: string | null;
    setUser: (user: any | null) => void;
    setData: (data: any | null) => void;
    setIsdark: (user: any | null) => void;
    setToken: (token: string | null | undefined) => void;
    setAccessToken: (accessToken: string | null | undefined) => void;
    removeAll: () => void;
}


type Pagination = {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
};
type ErrorDetails = {
    id: string;
    name: string;
    status: string;
    errors: number;
    success: number;
    merchantCode: string;
    createdAt: string;
};
export type AxiosResponse<T = any, D = any> = {
    data: T;
    message?: string;
    status: number;
    pagination?: Pagination;
    link_expired?: boolean;
    details?: ErrorDetails;
    accessToken?: string | null;
    statusText: string;
    headers: RawAxiosResponseHeaders | AxiosResponseHeaders;
    config: AxiosRequestConfig<D>;
    request?: any;
};

export type ApiResponseType = {
    status: boolean;
    data: Datum[];
}



    ;
export type LoginBodyType = {
    status: boolean;
    data: Datum[];
};

export type Datum = {
    _id: string;
    content: string;
    contentArray: ContentArray[];
    type: string;
    __v: number;
    createdAt: Date;
    updatedAt: Date;
};

export type ContentArray = {
    title: string;
    description: string;
    _id: string;
    createdAt: Date;
    updatedAt: Date;
};


