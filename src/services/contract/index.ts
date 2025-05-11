import { AxiosResponse } from "axios";
import {  ContractResponse, ContractsResponse } from "../../data/contract";
import { BaseResponse } from "../../data/base-response.model";
import { GET, PUT, POST } from "../axios";
import { ContractFormProps } from "../../data/contract";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { TableFilterState } from "../../redux/store";



export const handleContract =  createAsyncThunk (
    "contracts/saveContract",
    async (createContract: ContractFormProps) => {
      const response: AxiosResponse<BaseResponse<ContractResponse>> = await POST(
        `/contracts/`, // Assuming the `id` is part of `createContract`
        createContract // Passing the request body
      );
      return response.data;
    }
)

export const addContractAsync = createAsyncThunk(
    "contracts/addContractAsync",
    async (contract: ContractFormProps) => {
      const response: AxiosResponse<BaseResponse<ContractResponse>> = await POST(
        `/contracts?isSkip=true`, contract
      );
      return response.data;
    }
  );


export const getContractsAsync = (
    async () => {
        const response: AxiosResponse<BaseResponse<ContractsResponse>> = await GET(
        "/contracts"
        );
        return response.data.data;
    }
);
export const getContractsByIdAsync = createAsyncThunk (
    "contracts/getContractsByIdAsync",
    async ({id,params}:{id:string, params: TableFilterState}) => {
        const response: AxiosResponse<BaseResponse<ContractsResponse>> = await GET(
        `/contracts/employee/${id}`,{
            params
        }
        );
        return response.data.data;
    }
);



export const resignContractAsync = createAsyncThunk (
    "contracts/resignContractAsync",
    async (contract: ContractFormProps) => {
      const response: AxiosResponse<BaseResponse<ContractFormProps>> = await PUT(
        `/contracts/${contract.id}`, contract 
      );
      return response.data.data;
    }
  );

  export const handlePdfContractFile = createAsyncThunk(
    "media/handlePdfContractFile",
    async (file: File) => {
        const formData = new FormData();
        formData.append("file", file);
        const response: AxiosResponse = await POST(`/medias/upload-pdf`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          return response.data.data.url;
    }
)
