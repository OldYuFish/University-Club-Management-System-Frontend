import type { LogQuery } from "@/models";
import { AxiosPromise } from "axios";
import axios from "@/api/api";

export const log = {
  research: (params: LogQuery): AxiosPromise<any> => {
    return axios.request({
      url: '/api/log/research',
      data: params,
    })
  }
};
