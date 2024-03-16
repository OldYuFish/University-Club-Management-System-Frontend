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
  cid: (params: { connectionId: number }): AxiosPromise<any> => {
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
  }
};
