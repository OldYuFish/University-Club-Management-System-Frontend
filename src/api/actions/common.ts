import { AxiosPromise } from "axios";
import axios from "@/api/api";

export const common = {
  captcha: (params: { connectionId: string }): AxiosPromise<any> => {
    return axios.request({
      url: '/api/user/captcha',
      method: 'get',
      responseType: 'blob',
      params,
    })
  },
  verify: (params: { email: string, connectionId: string }): AxiosPromise<any> => {
    return axios.request({
      url: '/api/user/verify',
      data: params,
    })
  },
  cid: (params: { connectionId: string }): AxiosPromise<any> => {
    return axios.request({
      url: '/api/user/cid',
      data: params,
    })
  },
  qrcode: (params: { phone: string }): AxiosPromise<any> => {
    return axios.request({
      url: '/api/user/qrcode',
      method: 'get',
      responseType: 'blob',
      params,
    })
  },
  isLogin: (): AxiosPromise<any> => {
    return axios.request({
      url: '/api/user/is-login',
    })
  },
  delete: (params: { email: string }): AxiosPromise<any> => {
    return axios.request({
      url: '/api/user/delete',
      data: params,
    })
  },
  logout: (params: { email: string }): AxiosPromise<any> => {
    return axios.request({
      url: '/api/user/logout',
      data: params,
    })
  },
};
