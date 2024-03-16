import type { RoleInfo, RolePermission, RoleQuery } from "@/models";
import {AxiosPromise} from "axios";
import axios from "@/api/api";

export const role = {
  create: (params: RoleInfo): AxiosPromise<any> => {
    return axios.request({
      url: '/api/role/create',
      data: params,
    })
  },
  deleteRole: (params: { id: number }): AxiosPromise<any> => {
    return axios.request({
      url: '/api/role/delete/role',
      data: params,
    })
  },
  deleteUser: (params: { id: number }): AxiosPromise<any> => {
    return axios.request({
      url: '/api/role/delete/user',
      data: params,
    })
  },
  updateRole: (params: RoleInfo): AxiosPromise<any> => {
    return axios.request({
      url: '/api/role/update/role',
      data: params,
    })
  },
  updateUser: (params: { id: number, roleName: string }): AxiosPromise<any> => {
    return axios.request({
      url: '/api/role/update/user',
      data: params,
    })
  },
  updatePermission: (params: RolePermission): AxiosPromise<any> => {
    return axios.request({
      url: '/api/role/update/permission',
      data: params,
    })
  },
  researchPermission: (params: { id: number }): AxiosPromise<any> => {
    return axios.request({
      url: '/api/role/research/permission',
      data: params,
    })
  },
  researchRole: (params: RoleQuery): AxiosPromise<any> => {
    return axios.request({
      url: '/api/role/research/role',
      data: params,
    })
  }
};
