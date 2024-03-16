import type { FileInfo } from "@/models";
import { AxiosPromise } from "axios";
import axios from "@/api/api";
import {param} from "ts-interface-checker";

export const files = {
  create: (params: any): AxiosPromise<any> => {
    return axios.request({
      url: '/api/files/create',
      data: params,
    })
  },
  delete: (params: { fileName: string }): AxiosPromise<any> => {
    return axios.request({
      url: '/api/files/delete',
      data: params,
    })
  },
  researchLogin: (params: { email: string }): AxiosPromise<any> => {
    return axios.request({
      url: '/api/files/research/login',
      method: 'get',
      responseType: 'blob',
      params,
    })
  },
  researchClub: (params: { id: number }): AxiosPromise<any> => {
    return axios.request({
      url: '/api/files/research/club',
      data: params,
    })
  },
  researchMember: (params: { studentNumber: string }): AxiosPromise<any> => {
    return axios.request({
      url: '/api/files/research/member',
      method: 'get',
      responseType: 'blob',
      params,
    })
  },
  researchActivity: (params: { activityId: number }): AxiosPromise<any> => {
    return axios.request({
      url: '/api/files/research/activity',
      method: 'get',
      responseType: 'blob',
      params,
    })
  },
  researchFund: (params: { id: number }): AxiosPromise<any> => {
    return axios.request({
      url: '/api/files/research/fund',
      data: params,
    })
  },
  download: (params: { fileName: string }): AxiosPromise<any> => {
    return axios.request({
      url: '/api/files/download',
      method: 'get',
      responseType: 'blob',
      params,
    })
  },
  zipFund: (params: { fundId: number, theme: string }): AxiosPromise<any> => {
    return axios.request({
      url: '/api/files/zip/fund',
      method: 'get',
      responseType: 'blob',
      params,
    })
  }
};
