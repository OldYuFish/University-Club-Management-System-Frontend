import type { LoginInfo, UserInfo, UserQuery } from "@/models";
import { AxiosPromise } from "axios";
import axios from "@/api/api";

export const user = {
  register: (params: UserInfo): AxiosPromise<any> => {
    return axios.request({
      url: '/api/user/register',
      data: params,
    })
  },
  retrieve: (params: LoginInfo): AxiosPromise<any> => {
    return axios.request({
      url: '/api/user/retrieve',
      data: params,
    })
  },
  updatePassword: (params: { password: string, oldPassword: string, email: string }): AxiosPromise<any> => {
    return axios.request({
      url: '/api/user/update/password',
      data: params,
    })
  },
  updatePhone: (params: { password: string, phone: string, email: string }): AxiosPromise<any> => {
    return axios.request({
      url: '/api/user/update/phone',
      data: params,
    })
  },
  updateEmail: (params: { password: string, email: string, oldEmail: string }): AxiosPromise<any> => {
    return axios.request({
      url: '/api/user/update/email',
      data: params,
    })
  },
  updateRole: (params: { id: number, roleId: number }): AxiosPromise<any> => {
    return axios.request({
      url: '/api/user/update/password',
      data: params,
    })
  },
  login: (params: LoginInfo): AxiosPromise<any> => {
    return axios.request({
      url: '/api/user/login',
      data: params,
    })
  },
  researchDetail: (params: { email: string }): AxiosPromise<any> => {
    return axios.request({
      url: '/api/user/research/detail',
      data: params,
    })
  },
  researchBasic: (params: UserQuery): AxiosPromise<any> => {
    return axios.request({
      url: '/api/user/research/basic',
      data: params,
    })
  }
};
