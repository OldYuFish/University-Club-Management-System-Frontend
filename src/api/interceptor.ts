import type { AxiosRequestConfig, AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from "axios";
import axios from "axios";
import { ElMessage } from "element-plus";

export default class HttpClient {
  baseUrl: string

  constructor(public apiUrl: string = '') {
    this.baseUrl = apiUrl;
  }

  request(httpOptions: AxiosRequestConfig) {
    const instance: AxiosInstance = axios.create();
    httpOptions = this.mergeConfig(httpOptions);
    this.interceptors(instance, httpOptions.url);
    return instance(httpOptions);
  }

  private mergeConfig(httpOptions: AxiosRequestConfig): AxiosRequestConfig {
    return Object.assign(
        {
          baseURL: this.baseUrl,
          timeout: 20000,
          headers: {
            Authorization: localStorage.getItem("token"),
          },
          method: 'post',
        },
        httpOptions,
    );
  }

  private interceptors(instance: AxiosInstance, url?: string) {
    instance.interceptors.request.use(
        (config: InternalAxiosRequestConfig) => {
          return config;
        },
        (error) => {
          return Promise.reject(error);
        },
    );

    instance.interceptors.response.use(
        (response: AxiosResponse) => {
          const data: IResponse = response.data as any;

          const codeRes = {
            '-10000': '权限异常！',
            '-20000': '参数缺失！',
            '-20001': '非空参数为空！',
            '-20002': '参数格式异常！',
            '-20003': 'SQL操作异常！',
            '-20004': '系统时钟异常！',
            '-20005': 'CID不存在！',
            '-20006': '参数逻辑异常！',
            '-20200': '文件删除失败！',
            '-20201': '用户信息已被注册！',
            '-20202': '社团已存在！',
            '-20203': '用户不存在！',
            '-20204': '密码错误！',
            '-20205': '手机号未注册！',
            '-20206': '邮箱未注册！',
            '-20207': '分组名已被使用！',
            '-20208': '该用户已担任其他社团会长！',
            '-20209': '用户组不存在！',
            '-20210': '社团不存在！',
            '-20211': '活动标题已被使用！',
            '-20500': '文件丢失！',
            '-20501': '源文件文件名为空！',
            '-20502': '文件格式异常！',
            '-20700': '验证码已过期！',
            '-20701': '验证码错误！',
            '-20702': '验证码请求过于频繁！',
          };
          if (data.code && codeRes[data.code.toString()]) {
            ElMessage.error(codeRes[data.code.toString()]);
          }

          return response;
        },

        (error) => {
          console.log(error.response);
          return Promise.reject(error);
        },
    );
  }
}
