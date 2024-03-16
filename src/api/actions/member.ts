import type { MemberInfo } from "@/models";
import { AxiosPromise } from "axios";
import axios from "@/api/api";

export const member = {
  create: (params: MemberInfo): AxiosPromise<any> => {
    return axios.request({
      url: '/api/member/create',
      data: params,
    })
  },
  delete: (params: { id: number }): AxiosPromise<any> => {
    return axios.request({
      url: '/api/member/delete',
      data: params,
    })
  },
  update: (params: MemberInfo): AxiosPromise<any> => {
    return axios.request({
      url: '/api/member/update',
      data: params,
    })
  },
  research: (params: { clubId: number }): AxiosPromise<any> => {
    return axios.request({
      url: '/api/member/research',
      data: params,
    })
  }
};
