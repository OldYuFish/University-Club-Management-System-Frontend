import type { ClubInfo, ClubQuery } from "@/models";
import { AxiosPromise } from "axios";
import axios from "@/api/api";

export const club = {
  create: (params: ClubInfo): AxiosPromise<any> => {
    return axios.request({
      url: '/api/club/create',
      data: params,
    })
  },
  delete: (params: { id: number }): AxiosPromise<any> => {
    return axios.request({
      url: '/api/club/delete',
      data: params,
    })
  },
  update: (params: ClubInfo): AxiosPromise<any> => {
    return axios.request({
      url: '/api/club/update',
      data: params,
    })
  },
  approval: (params: { id: number, statusCode: number, approvalComment: string }): AxiosPromise<any> => {
    return axios.request({
      url: '/api/club/approval',
      data: params,
    })
  },
  researchDetail: (params: { id: number }): AxiosPromise<any> => {
    return axios.request({
      url: '/api/club/research/detail',
      data: params,
    })
  },
  researchNotSubmit: (params: ClubQuery): AxiosPromise<any> => {
    return axios.request({
      url: '/api/club/research/not-submit',
      data: params,
    })
  },
  researchNotApproval: (params: ClubQuery): AxiosPromise<any> => {
    return axios.request({
      url: '/api/club/research/not-approval',
      data: params,
    })
  },
  researchBeenRejected: (params: ClubQuery): AxiosPromise<any> => {
    return axios.request({
      url: '/api/club/research/been-rejected',
      data: params,
    })
  },
  researchBeenAccepted: (params: ClubQuery): AxiosPromise<any> => {
    return axios.request({
      url: '/api/club/research/been-accepted',
      data: params,
    })
  },
  count: (): AxiosPromise<any> => {
    return axios.request({
      url: '/api/club/count',
    })
  }
};
