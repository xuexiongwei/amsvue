import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { LoginUsers, PrjSNList, view001List, view002List, view003List } from './data/mockData.js';
import UserMockHandler from './userMockHandler.js';
import RolesMockHandler from './roleMockHandler.js';
import MenusMockHandler from './menuMockHandler.js';
import MapMockHandler from './MapMockHandler.js';
import ProjectMockHandler from './projectMockHandler.js';

export default {
  /**
   * mock bootstrap
   */
  bootstrap() {
    let mock = new MockAdapter(axios);

    //登录
    mock.onPost('/ams/amsLogin').reply(config => {
      let {username, password} = JSON.parse(config.data);
      return new Promise((resolve, reject) => {
        let respData = {};
        setTimeout(() => {
          let hasUser = LoginUsers.some(u => {
            if (u.userName === username && u.password === password) {
              respData = JSON.parse(JSON.stringify(u));
              return true;
            }
          });
          if (hasUser) {
            respData.header = {
              reqpageIndex: 1,
              reqUserId: 'xxw',
              rspPageCount: 86,
              rspReturnMsg: '【1130130350522105856】用户登录成功',
              reqpageSize: 20,
              rspReturnCode: '000000'
            };
            resolve([200, respData]);
          } else {
            respData.header = {
              reqpageIndex: 1,
              reqUserId: 'xxw',
              rspPageCount: 86,
              rspReturnMsg: '【1130130350522105856】用户登录失败',
              reqpageSize: 20,
              rspReturnCode: '000001'
            };
            resolve([200, respData]);
          }
        }, 1000);
      });
    });

    // 用户登出系统
    mock.onPost('/ams/amsLogout').reply(config => {
      return new Promise((resolve, reject) => {
        let respData = {};
        setTimeout(() => {
          respData.header = {
            reqpageIndex: 1,
            reqUserId: 'xxw',
            rspPageCount: 86,
            rspReturnMsg: '【1131538952285716480】用户退出成功',
            reqpageSize: 20,
            rspReturnCode: '000000'
          };
          resolve([200, respData]);
        }, 1000);
      });
    });

    // 查询操作日志
    mock.onPost('/ams/api/userOperation/queryUserOperByDate').reply(config => {
      let {header, startDate, endDate, operAction, operDesc} = JSON.parse(config.data);
      let {reqpageSize, reqpageIndex} = header;
      return new Promise((resolve, reject) => {
        let respData = {
          header : {
            reqpageIndex: 1,
            reqUserId: 'xxw',
            rspPageCount: 1,
            rspReturnMsg: '【1131538952285716480】查询操作日志成功',
            reqpageSize: 20,
            rspReturnCode: '000000'
          },
          userOperationList: [
            { id: 3, operAction: '新增', operDesc: '项目属性信息', prjSN: '许可证号222', userID: '99999', userName: '1' }
          ]
        };
        setTimeout(() => {
          resolve([200, respData]);
        }, 1000);
      });
    });

    // 模糊过滤
    mock.onPost('/ams/api/mh/queryJbxxLike').reply(config => {
      let {header, tab, key, val} = JSON.parse(config.data);
      let {reqpageSize, reqpageIndex} = header;
      const respData = {
        header : {
          reqpageIndex: 1,
          reqUserId: 'xxw',
          rspPageCount: 1,
          rspReturnMsg: '【1132250761523232768】交易成功',
          reqpageSize: 20,
          rspReturnCode: '000000'
        }
      }

      if (key === 'prjSN') {
        const _PrjSNList = PrjSNList;
        respData.PrjSNList = _PrjSNList.filter(d => {
          return (d.indexOf(val) > -1);
        });
      }

      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, respData]);
        }, 1000);
      });
    });

    // 查询view001
    mock.onPost('/ams/api/view/bb001').reply(config => {
      const respData = {
        header : {
          reqpageIndex: 1,
          reqUserId: 'xxw',
          rspPageCount: view001List.length,
          rspReturnMsg: '【1132250761523232768】交易成功',
          reqpageSize: 20,
          rspReturnCode: '000000'
        },
        viewList: view001List
      }

      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, respData]);
        }, 1000);
      });
    });

    // 查询view002
    mock.onPost('/ams/api/view/bb002').reply(config => {
      const respData = {
        header : {
          reqpageIndex: 1,
          reqUserId: 'xxw',
          rspPageCount: view002List.length,
          rspReturnMsg: '【1132250761523232768】交易成功',
          reqpageSize: 20,
          rspReturnCode: '000000'
        },
        viewList: view002List
      }

      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, respData]);
        }, 1000);
      });
    });

    // 查询view003
    mock.onPost('/ams/api/view/bb003').reply(config => {
      const respData = {
        header : {
          reqpageIndex: 1,
          reqUserId: 'xxw',
          rspPageCount: 1,
          rspReturnMsg: '【1132250761523232768】交易成功',
          reqpageSize: 20,
          rspReturnCode: '000000'
        },
        viewList: view003List
      }

      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, respData]);
        }, 1000);
      });
    });

    // 上传文件
    mock.onPost('/ams/api/upload').reply(config => {
      let prjSN = config.data.get('prjSN');
      let files = config.data.get('files');
      let upLoadType = config.data.get('upLoadType');
      let header = config.data.get('header');
      debugger;
      const respData = {
        header : {
          reqpageIndex: 1,
          reqUserId: 'xxw',
          rspPageCount: 1,
          rspReturnMsg: '【1132250761523232768】上传成功',
          reqpageSize: 20,
          rspReturnCode: '000000'
        }
      }

      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, respData]);
        }, 1000);
      });
    });

    // 用户mock方法处理
    UserMockHandler.init(mock);

    // 角色mock方法处理
    RolesMockHandler.init(mock);

    // 菜单mock方法处理
    MenusMockHandler.init(mock);

    // 地图mock方法处理
    MapMockHandler.init(mock);

    // 项目信息mock方法处理
    ProjectMockHandler.init(mock);
  }
};