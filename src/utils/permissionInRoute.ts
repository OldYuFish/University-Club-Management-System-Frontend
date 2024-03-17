import type { PermissionRouterInfo } from "@/models";

export const permissionInRoute: PermissionRouterInfo[] = [
  // TODO club下detail页中会涉及到一些其他权限，比如对活动、经费、成员的管理
  {
    name: 'club',
    router: '/club',
    permissionUrl: '/api/club',
    children: [
      {
        name: 'club-list',
        router: '/club/list',
        permission: [
          {
            id: 1,
            permissionName: '查询未提交社团表',
            url: '/research/not-submit',
          },
          {
            id: 2,
            permissionName: '查询未审批社团表',
            url: '/research/not-approval',
          },
          {
            id: 3,
            permissionName: '查询未过审社团表',
            url: '/research/been-rejected',
          },
          {
            id: 4,
            permissionName: '查询过审社团',
            url: '/research/been-accepted',
          },
          {
            id: 5,
            permissionName: '查询社团详情',
            url: '/research/detail',
          },
          {
            id: 6,
            permissionName: '新增社团表',
            url: '/create',
          },
          {
            id: 7,
            permissionName: '删除社团表',
            url: '/delete',
          },
          {
            id: 8,
            permissionName: '修改社团表',
            url: '/update',
          },
          {
            id: 9,
            permissionName: '审批社团表',
            url: '/approval',
          },
        ],
      }
    ],
  },
  {
    name: 'activity',
    router: '/activity',
    permissionUrl: '/api/activity',
    children: [
      {
        name: 'activity-list',
        router: '/activity/list',
        permission: [
          {
            id: 10,
            permissionName: '查询未提交活动表',
            url: '/research/not-submit',
          },
          {
            id: 11,
            permissionName: '查询未审批活动表',
            url: '/research/not-approval',
          },
          {
            id: 12,
            permissionName: '查询未过审活动表',
            url: '/research/been-rejected',
          },
          {
            id: 13,
            permissionName: '查询过审活动',
            url: '/research/been-accepted',
          },
          {
            id: 14,
            permissionName: '查询活动详情',
            url: '/research/detail',
          },
          {
            id: 15,
            permissionName: '新增活动表',
            url: '/create',
          },
          {
            id: 16,
            permissionName: '删除活动表',
            url: '/delete',
          },
          {
            id: 17,
            permissionName: '修改活动表',
            url: '/update',
          },
          {
            id: 18,
            permissionName: '审批活动表',
            url: '/approval',
          },
        ],
      }
    ],
  },
  {
    name: 'fund',
    router: '/fund',
    permissionUrl: '/api/fund',
    children: [
      {
        name: 'fund-list',
        router: '/fund/list',
        permission: [
          {
            id: 19,
            permissionName: '查询未提交经费表',
            url: '/research/not-submit',
          },
          {
            id: 20,
            permissionName: '查询未审批经费表',
            url: '/research/not-approval',
          },
          {
            id: 21,
            permissionName: '查询未过审经费表',
            url: '/research/been-rejected',
          },
          {
            id: 22,
            permissionName: '查询过审经费',
            url: '/research/been-accepted',
          },
          {
            id: 23,
            permissionName: '查询经费详情',
            url: '/research/detail',
          },
          {
            id: 24,
            permissionName: '新增经费表',
            url: '/create',
          },
          {
            id: 25,
            permissionName: '删除经费表',
            url: '/delete',
          },
          {
            id: 26,
            permissionName: '修改经费表',
            url: '/update',
          },
          {
            id: 27,
            permissionName: '审批经费表',
            url: '/approval',
          },
        ],
      }
    ],
  },
  {
    name: 'role',
    router: '/role',
    permissionUrl: '/api/role',
    children: [
      {
        name: 'role-list',
        router: '/role/list',
        permission: [
          {
            id: 28,
            permissionName: '查询用户组列表',
            url: '/research/role',
          },
          {
            id: 29,
            permissionName: '查询用户组权限',
            url: '/research/permission',
          },
          {
            id: 30,
            permissionName: '新增用户组',
            url: '/create',
          },
          {
            id: 31,
            permissionName: '删除用户组',
            url: '/delete/role',
          },
          {
            id: 32,
            permissionName: '删除组内所有用户',
            url: '/delete/user',
          },
          {
            id: 33,
            permissionName: '转移组内所有用户',
            url: '/update/user',
          },
          {
            id: 34,
            permissionName: '修改用户组',
            url: '/update/role',
          },
          {
            id: 35,
            permissionName: '修改用户组权限',
            url: '/update/permission',
          },
        ],
      },
    ],
  },
  {
    name: 'user',
    router: '/user',
    permissionUrl: '/api/user',
    children: [
      {
        name: 'user-list',
        router: '/user/list',
        permission: [
          {
            id: 36,
            permissionName: '查询用户列表',
            url: '/research/basic',
          },
          {
            id: 37,
            permissionName: '更换用户组',
            url: '/update/role',
          },
        ],
      }
    ],
  },
  {
    name: 'log',
    router: '/log',
    permissionUrl: '/api/log',
    children: [
      {
        name: 'log-list',
        router: '/log/list',
        permission: [
          {
            id: 38,
            permissionName: '查询日志列表',
            url: '/research'
          },
        ],
      }
    ],
  },
];
