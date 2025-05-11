import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  BankInfo,
  EmergencyContact,
  GeneralInfo,
  GovernmentInfo,
  OnboardingResponse,
} from "../../data/employee/onboarding.model";
import { AxiosResponse } from "axios";
import { BaseResponse } from "../../data/base-response.model";
import { PUT } from "../axios";

export const updateOnboardingGeneralInfoAsync = createAsyncThunk(
  "onboarding/updateOnboardingGeneralInfoAsync",
  async (request: GeneralInfo) => {
    const response: AxiosResponse<BaseResponse<OnboardingResponse>> = await PUT(
      `/onboarding/general-information`,
      request
    );

    return response.data.data;
  }
);

export const updateOnboardingGovernmentInfoAsync = createAsyncThunk(
  "onboarding/updateOnboardingGovernmentInfoAsync",
  async (request: GovernmentInfo) => {
    const response: AxiosResponse<BaseResponse<OnboardingResponse>> = await PUT(
      `/onboarding/government-information`,
      request
    );

    return response.data.data;
  }
);

export const updateOnboardingBankInfoAsync = createAsyncThunk(
  "onboarding/updateOnboardingBankInfoAsync",
  async (request: BankInfo) => {
    const response: AxiosResponse<BaseResponse<OnboardingResponse>> = await PUT(
      `/onboarding/bank-account`,
      request
    );

    return response.data.data;
  }
);

export const updateOnboardingEmergencyContactAsync = createAsyncThunk(
  "onboarding/updateOnboardingEmergencyContactAsync",
  async (request: EmergencyContact) => {
    const response: AxiosResponse<BaseResponse<OnboardingResponse>> = await PUT(
      `/onboarding/ec-info`,
      request
    );

    return response.data.data;
  }
);
