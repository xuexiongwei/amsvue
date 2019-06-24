import { Users } from './data/mockData.js';

let _Users = Users;

const UserMockHandler = {
    init(mock) {
        //获取用户列表（分页）
    mock.onPost('/ams/getUserByname').reply(config => {
        let {header, name} = JSON.parse(config.data);
        let {reqpageSize, reqpageIndex} = header;
        let mockUsers = _Users.filter(user => {
          if (name && user.name.indexOf(name) == -1) return false;
          return true;
        });
        let total = mockUsers.length;
        mockUsers = mockUsers.filter((u, index) => index < reqpageSize * reqpageIndex && index >= reqpageSize * (reqpageIndex - 1));
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve([200, {
              userList: mockUsers,
              header: {
                reqpageIndex: 1,
                reqUserId: "xxw",
                rspPageCount: total,
                rspReturnMsg: "【1130134024585609216】交易成功",
                reqpageSize: 20,
                rspReturnCode: "000000"
              }
            }]);
          }, 1000);
        });
      });
  
      //删除用户
      mock.onPost('/ams/deleteUser').reply(config => {
        let { id } = JSON.parse(config.data);
        _Users = _Users.filter(u => u.id !== id);
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve([200, {
              header: {
                reqpageIndex: 1,
                reqUserId: "xxw",
                rspPageCount: 86,
                rspReturnMsg: "【1130130350522105856】用户删除成功",
                reqpageSize: 20,
                rspReturnCode: "000000"
              }
            }]);
          }, 500);
        });
      });
  
      //编辑用户
      mock.onPost('/ams/updateUser').reply(config => {
        let { id, name, username, password, email, mobile, sex } = JSON.parse(config.data);
        _Users.some(u => {
          if (u.id === id) {
            u.name = name;
            u.username = username;
            u.password = password;
            u.email = email;
            u.mobile = mobile;
            u.sex = sex;
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
                rspReturnMsg: "【1130130350522105856】用户修改成功",
                reqpageSize: 20,
                rspReturnCode: "000000"
              }
            }]);
          }, 500);
        });
      });
  
      //新增用户
      mock.onPost('/ams/addUser').reply(config => {
        let { name, username, email, mobile, sex } = JSON.parse(config.data);
        _Users.push({
          name: name,
          username: username,
          email: email,
          mobile: mobile,
          sex: sex
        });
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve([200, {
              header: {
                reqpageIndex: 1,
                reqUserId: "xxw",
                rspPageCount: 86,
                rspReturnMsg: "【1130130350522105856】用户添加成功",
                reqpageSize: 20,
                rspReturnCode: "000000"
              }
            }]);
          }, 500);
        });
      });
    }
};

export default UserMockHandler;