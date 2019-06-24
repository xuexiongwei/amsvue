import { Roles, HasRoles } from './data/mockData.js';

let _Roles = Roles;
let _HasRoles = HasRoles;

const RolesMockHandler = {
    init(mock) {

    //获取角色列表（分页）
    mock.onPost('/ams/getRoleByRolename').reply(config => {
      let {header, roleName} = JSON.parse(config.data);
        let {reqpageSize, reqpageIndex} = header;
      let mockRoles = _Roles.filter(role => {
        if (roleName && role.roleName.indexOf(roleName) == -1) return false;
        return true;
      });
      let total = mockRoles.length;
      mockRoles = mockRoles.filter((u, index) => index < reqpageSize * reqpageIndex && index >= reqpageSize * (reqpageIndex - 1));
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            header: {
              reqpageIndex: 1,
              reqUserId: "xxw",
              rspPageCount: total,
              rspReturnMsg: "【1130134024585609216】交易成功",
              reqpageSize: 20,
              rspReturnCode: "000000"
            },
            roleList: mockRoles
          }]);
        }, 1000);
      });
    });
  
    //删除角色
    mock.onPost('/ams/deleteRole').reply(config => {
      let { id } = JSON.parse(config.data);
      _Roles = _Roles.filter(r => r.id !== id);
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            header: {
              reqpageIndex: 1,
              reqUserId: "xxw",
              rspPageCount: 86,
              rspReturnMsg: "【1130130350522105856】角色删除成功",
              reqpageSize: 20,
              rspReturnCode: "000000"
            }
          }]);
        }, 500);
      });
    });

    //编辑角色
    mock.onPost('/ams/updateRole').reply(config => {
      let { id, roleSign, roleName, remark } = JSON.parse(config.data);
      _Roles.some(r => {
        if (r.id === id) {
          r.roleSign = roleSign;
          r.roleName = roleName;
          r.remark = remark;
          return true;
        }
      });
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            header: {
              reqpageIndex: 1,
              reqUserId: "xxw",
              rspPageCount: 86,
              rspReturnMsg: "【1130130350522105856】角色修改成功",
              reqpageSize: 20,
              rspReturnCode: "000000"
            }
          }]);
        }, 500);
      });
    });

    // 新增角色
    mock.onPost('/ams/addRole').reply(config => {
      let { roleSign, roleName, remark } = JSON.parse(config.data);
      _Roles.push({
        roleSign: roleSign,
        roleName: roleName,
        remark: remark
      });
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            header: {
              reqpageIndex: 1,
              reqUserId: "xxw",
              rspPageCount: 86,
              rspReturnMsg: "【1130130350522105856】角色添加成功",
              reqpageSize: 20,
              rspReturnCode: "000000"
            }
          }]);
        }, 500);
      });
    });

    //获取角色列表（无分页）
    mock.onPost('/ams/getRoleAndPage').reply(() => {
      let mockRoles = _Roles;
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            header: {
              reqpageIndex: 1,
              reqUserId: "xxw",
              rspPageCount: mockRoles.length,
              rspReturnMsg: "【1130134024585609216】交易成功",
              reqpageSize: 20,
              rspReturnCode: "000000"
            },
            roleList: mockRoles
          }]);
        }, 1000);
      });
    });

    // 通过userId查询已经配置的角色id
    mock.onPost('/ams/getRoleByUserId').reply((config) => {
      let { id } = JSON.parse(config.data);
      let mockRoles = _HasRoles;
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            header: {
              reqpageIndex: 1,
              reqUserId: "xxw",
              rspPageCount: mockRoles.length,
              rspReturnMsg: "【1130134024585609216】交易成功",
              reqpageSize: 20,
              rspReturnCode: "000000"
            },
            roleList: mockRoles
          }]);
        }, 1000);
      });
    });

    // 给用户分配角色信息
    mock.onPost('/ams/addUserAddRole').reply((config) => {
      let { userRoleList } = JSON.parse(config.data);
      _HasRoles = [];
      userRoleList.filter(d => {
        _HasRoles.push({
          id: d.roleId
        });
      });
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            code: 200,
            msg: '设置角色成功'
          }]);
        }, 1000);
      });
    });

  }
};

export default RolesMockHandler;