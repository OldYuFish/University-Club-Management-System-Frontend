/**
 * 响应数据的基本结构
 */
interface IResponse {
  code: number;
  message: string;
  data?: any;
}

/**
 * 响应列表数据的基本结构
 */
interface IResponseTable {
  data: any[];
  pageConfig: IPagination;
}

/**
 * 响应分页数据的基本结构
 */
interface IPagination {
  pageIndex?: number;
  pageSize?: number;
  total: number;
}

/**
 * 响应下拉数据的基本结构
 */
interface IOption {
  label: string;
  value: string;
  isleaf?: boolean;
  groupId?: string;
  groupName?: string;
  disabled?: boolean;
  customProp?: string;
}
