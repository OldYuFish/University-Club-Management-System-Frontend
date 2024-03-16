import type { FundInfo, FundQuery } from "@/models";
import { AxiosPromise } from "axios";
import axios from "@/api/api";

export const fund = {
  create: (params: FundInfo): AxiosPromise<any> => {
    return axios.request({
      url: '/api/fund/create',
      data: params,
    })
  },
  delete: (params: { id: number }): AxiosPromise<any> => {
    return axios.request({
      url: '/api/fund/delete',
      data: params,
    })
  },
  update: (params: FundInfo): AxiosPromise<any> => {
    return axios.request({
      url: '/api/fund/update',
      data: params,
    })
  },
  approval: (params: { id: number, statusCode: number, approvalComment: string }): AxiosPromise<any> => {
    return axios.request({
      url: '/api/fund/approval',
      data: params,
    })
  },
  researchDetail: (params: { id: number }): AxiosPromise<any> => {
    return axios.request({
      url: '/api/fund/research/detail',
      data: params,
    })
  },
  researchNotSubmit: (params: FundQuery): AxiosPromise<any> => {
    return axios.request({
      url: '/api/fund/research/not-submit',
      data: params,
    })
  },
  researchNotApproval: (params: FundQuery): AxiosPromise<any> => {
    return axios.request({
      url: '/api/fund/research/not-approval',
      data: params,
    })
  },
  researchBeenRejected: (params: FundQuery): AxiosPromise<any> => {
    return axios.request({
      url: '/api/fund/research/been-rejected',
      data: params,
    })
  },
  researchBeenAccepted: (params: FundQuery): AxiosPromise<any> => {
    return axios.request({
      url: '/api/fund/research/been-accepted',
      data: params,
    })
  }
};
