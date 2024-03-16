import type { ActivityInfo, ActivityQuery } from "@/models";
import { AxiosPromise } from "axios";
import axios from "@/api/api";

export const activity = {
  create: (params: ActivityInfo): AxiosPromise<any> => {
    return axios.request({
      url: '/api/activity/create',
      data: params,
    })
  },
  delete: (params: { id: number }): AxiosPromise<any> => {
    return axios.request({
      url: '/api/activity/delete',
      data: params,
    })
  },
  update: (params: ActivityInfo): AxiosPromise<any> => {
    return axios.request({
      url: '/api/activity/update',
      data: params,
    })
  },
  approval: (params: { id: number, statusCode: number, approvalComment: string }): AxiosPromise<any> => {
    return axios.request({
      url: '/api/activity/approval',
      data: params,
    })
  },
  researchDetail: (params: { id: number }): AxiosPromise<any> => {
    return axios.request({
      url: '/api/activity/research/detail',
      data: params,
    })
  },
  researchNotSubmit: (params: ActivityQuery): AxiosPromise<any> => {
    return axios.request({
      url: '/api/activity/research/not-submit',
      data: params,
    })
  },
  researchNotApproval: (params: ActivityQuery): AxiosPromise<any> => {
    return axios.request({
      url: '/api/activity/research/not-approval',
      data: params,
    })
  },
  researchBeenRejected: (params: ActivityQuery): AxiosPromise<any> => {
    return axios.request({
      url: '/api/activity/research/been-rejected',
      data: params,
    })
  },
  researchBeenAccepted: (params: ActivityQuery): AxiosPromise<any> => {
    return axios.request({
      url: '/api/activity/research/been-accepted',
      data: params,
    })
  }
};
