import type { ITreeData } from "@/models";

export const treeData: ITreeData[] = [
  {
    id: 1,
    label: "社团管理",
    disabled: true,
    children: [
      {
        id: 7,
        label: "查询未提交社团表"
      },
      {
        id: 8,
        label: "查询未审批社团表"
      },
      {
        id: 9,
        label: "查询未过审社团表"
      },
      {
        id: 10,
        label: "查询过审社团"
      },
      {
        id: 11,
        label: "查询社团详情"
      },
      {
        id: 12,
        label: "新增社团表"
      },
      {
        id: 13,
        label: "删除社团表"
      },
      {
        id: 14,
        label: "修改社团表"
      },
      {
        id: 15,
        label: "审批社团表"
      },
    ]
  },
  {
    id: 2,
    label: "活动管理",
    disabled: true,
    children: [
      {
        id: 16,
        label: "查询未提交活动表"
      },
      {
        id: 17,
        label: "查询未审批活动表"
      },
      {
        id: 18,
        label: "查询未过审活动表"
      },
      {
        id: 19,
        label: "查询过审活动"
      },
      {
        id: 20,
        label: "查询活动详情"
      },
      {
        id: 21,
        label: "新增活动表"
      },
      {
        id: 22,
        label: "删除活动表"
      },
      {
        id: 23,
        label: "修改活动表"
      },
      {
        id: 24,
        label: "审批活动表"
      },
    ]
  },
  {
    id: 3,
    label: "经费管理",
    disabled: true,
    children: [
      {
        id: 25,
        label: "查询未提交经费表"
      },
      {
        id: 26,
        label: "查询未审批经费表"
      },
      {
        id: 27,
        label: "查询未过审经费表"
      },
      {
        id: 28,
        label: "查询过审经费"
      },
      {
        id: 29,
        label: "查询经费详情"
      },
      {
        id: 30,
        label: "新增经费表"
      },
      {
        id: 31,
        label: "删除经费表"
      },
      {
        id: 32,
        label: "修改经费表"
      },
      {
        id: 33,
        label: "审批经费表"
      },
    ]
  },
  {
    id: 4,
    label: "用户管理",
    disabled: true,
    children: [
      {
        id: 34,
        label: "查询用户列表"
      },
      {
        id: 35,
        label: "更换用户组"
      },
    ]
  },
  {
    id: 5,
    label: "分组管理",
    disabled: true,
    children: [
      {
        id: 36,
        label: "查询用户组列表"
      },
      {
        id: 37,
        label: "查询用户组权限"
      },
      {
        id: 38,
        label: "新增用户组"
      },
      {
        id: 39,
        label: "删除用户组"
      },
      {
        id: 40,
        label: "删除组内所有用户"
      },
      {
        id: 41,
        label: "转移组内所有用户"
      },
      {
        id: 42,
        label: "修改用户组"
      },
      {
        id: 43,
        label: "修改用户组权限"
      },
    ]
  },
  {
    id: 6,
    label: "日志管理",
    disabled: true,
    children: [
      {
        id: 44,
        label: "查询日志列表"
      },
    ]
  },
];

export const treeLeaf = {
  club: [7, 8, 9, 11, 12, 13, 14, 15],
  activity: [16, 17, 18, 20, 21, 22, 23, 24],
  fund: [25, 26, 27, 29, 30, 31, 32, 33],
  user: [35],
  role: [37, 38, 39, 40, 41, 42, 43],
  log: [],
};
