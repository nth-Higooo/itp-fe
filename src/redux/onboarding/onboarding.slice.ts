import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import {
  Gender,
  MaritalStatus,
  GeneralInfo,
  GovernmentInfo,
  BankInfo,
  EmergencyContact,
  OnboardingEmployee,
  SalaryInfo,
  DetailInfo,
  OthersInfo,
} from '../../data/employee/onboarding.model';
import {
  updateOnboardingBankInfoAsync,
  updateOnboardingEmergencyContactAsync,
  updateOnboardingGeneralInfoAsync,
  updateOnboardingGovernmentInfoAsync,
} from '../../services/employee/onboarding.service';
import { pick } from '../../utils';
import { UserStatus } from 'src/data/auth/user.model';

export type OnboardingState = {
  generalInformation: GeneralInfo;
  governmentInformation: GovernmentInfo;
  bankInformation: BankInfo;
  emergencyContact: EmergencyContact;
};

export const initGeneralInfo: GeneralInfo = {
  fullName: '',
  photo: '',
  departmentIds: [],
  levelId: '',
  positionId: '',
  recommendedRoleIds: [],
  status: UserStatus.PENDING,
  email: '',
};

export const initDetailInfo: DetailInfo = {
  dateOfBirth: '',
  gender: Gender.MALE,
  maritalStatus: MaritalStatus.Single,
  personalEmail: '',
  contactAddress: '',
  permanentAddress: '',
  phoneNumber: '',
};

export const initGovernmentInfo: GovernmentInfo = {
  pitNo: '',
  vneIDDate: '',
  vneIDNo: '',
  vneIDPlace: '',
  siNo: '',
  vneIDCardBack: '',
  vneIDCardFront: '',
};

export const initBankInfo: BankInfo = {
  bankAccountName: '',
  bankBranch: '',
  bankName: '',
  bankAccountNumber: '',
};

export const initEmergencyContact: EmergencyContact = {
  ecName: '',
  ecPhoneNumber: '',
  ecRelationship: '',
};

export const initOthersInfo: OthersInfo = {
  fingerprintId: '',
  payslipPassword: '',
  joinDate: '',
  leaveDate: '',
  resignDate: '',
  resignReason: '',
};

export const initSalary: SalaryInfo = {
  basicSalary: 0,
  lunchAllowance: 0,
  netAmount: 0,
  otherBonus: 0,
  otherIncome: 0,
  othersDeduction: 0,
  overtimeIncome: 0,
  performanceBonus: 0,
  personalIncomeTax: 0,
  petrolAllowance: 0,
  phoneAllowance: 0,
  responsibilityAllowance: 0,
  seniorityBonus: 0,
  socialInsurance: 0,
};

const initOnboardingState: OnboardingState = {
  generalInformation: initGeneralInfo,
  governmentInformation: initGovernmentInfo,
  bankInformation: initBankInfo,
  emergencyContact: initEmergencyContact,
};

export const onboardingSlice = createSlice({
  name: 'onboarding',
  initialState: initOnboardingState,
  reducers: {
    setOnboardingEmployee: (state, action: PayloadAction<OnboardingEmployee>) => {
      state.generalInformation = pick(
        action.payload,
        Object.keys(state.generalInformation) as (keyof GeneralInfo)[]
      );

      state.governmentInformation = pick(
        action.payload,
        Object.keys(state.governmentInformation) as (keyof GovernmentInfo)[]
      );

      state.bankInformation = pick(
        action.payload,
        Object.keys(state.bankInformation) as (keyof BankInfo)[]
      );

      state.emergencyContact = pick(
        action.payload,
        Object.keys(state.emergencyContact) as (keyof EmergencyContact)[]
      );

      return state;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(updateOnboardingGeneralInfoAsync.fulfilled, (state, action) => {
      state.generalInformation = pick(
        action.payload.employee,
        Object.keys(state.generalInformation) as (keyof GeneralInfo)[]
      );
    });
    builder.addCase(updateOnboardingGovernmentInfoAsync.fulfilled, (state, action) => {
      state.governmentInformation = pick(
        action.payload.employee,
        Object.keys(state.governmentInformation) as (keyof GovernmentInfo)[]
      );
    });
    builder.addCase(updateOnboardingBankInfoAsync.fulfilled, (state, action) => {
      state.bankInformation = pick(
        action.payload.employee,
        Object.keys(state.bankInformation) as (keyof BankInfo)[]
      );
    });
    builder.addCase(updateOnboardingEmergencyContactAsync.fulfilled, (state, action) => {
      state.emergencyContact = pick(
        action.payload.employee,
        Object.keys(state.emergencyContact) as (keyof EmergencyContact)[]
      );
    });
  },
});

export const { setOnboardingEmployee } = onboardingSlice.actions;

export const selectOnboarding = (state: RootState) => state.onboarding;

export default onboardingSlice.reducer;
