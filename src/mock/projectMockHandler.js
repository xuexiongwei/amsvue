import { XmjbxxList, XmsxList, XmmxList, PrjClasfiName1, 
  PrjClasfiName2, PrjClasfiName3, PrjClasfiName4, PrjClasfiName5, DicByProejctDetailId } from './data/mockData.js';

let _XmjbxxList = XmjbxxList, _XmsxList = XmsxList, _XmmxList = XmmxList,
_PrjClasfiName1 = PrjClasfiName1, _PrjClasfiName2 = PrjClasfiName2, 
_PrjClasfiName3 = PrjClasfiName3, _PrjClasfiName4 =  PrjClasfiName4, 
_PrjClasfiName5 = PrjClasfiName5, _DicByProejctDetailId = DicByProejctDetailId;

const ProjectMockHandler = {
    init(mock) {
      
    // 查询项目基本信息列表
    mock.onPost('/ams/api/xmjbxx/query').reply(config => {
      let {header, prjName, prjSN} = JSON.parse(config.data);
      let {reqpageSize, reqpageIndex} = header;
      let mockJbxx = _XmjbxxList.filter(user => {
        if (prjName && user.prjName.indexOf(prjName) == -1) return false;
        if (prjSN && user.prjSN.indexOf(prjSN) == -1) return false;
        return true;
      });
      let total = mockJbxx.length;
      mockJbxx = mockJbxx.filter((u, index) => index < reqpageSize * reqpageIndex && index >= reqpageSize * (reqpageIndex - 1));
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            xmjbxxList: mockJbxx,
            header: {
              reqpageIndex: 1,
              reqUserId: 'xxw',
              rspPageCount: total,
              rspReturnMsg: '【1130134024585609216】交易成功',
              reqpageSize: 20,
              rspReturnCode: '000000'
            }
          }]);
        }, 1000);
      });
    });

    // 删除项目基本信息
    mock.onPost('/ams/api/xmjbxx/del').reply(config => {
      let { id } = JSON.parse(config.data);
      _XmjbxxList = _XmjbxxList.filter(r => r.id !== id);
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            header: {
              reqpageIndex: 1,
              reqUserId: 'xxw',
              rspPageCount: 86,
              rspReturnMsg: '【1130130350522105856】项目删除成功',
              reqpageSize: 20,
              rspReturnCode: '000000'
            }
          }]);
        }, 500);
      });
    });


    // 新增或修改项目基本信息
    mock.onPost('/ams/api/xmjbxx/createOrUpdate').reply(config => {
      let { prjSN, prjUnit, prjAdr, prjName, prjType, contacts, contactInf, prjTemSN, specialNotifi, 
        noticeTime, effectiveTime, remark, prjSNType, prjStatus, delaySN, delayCountDay, correctionSN, correctionDate } = JSON.parse(config.data);
      if (typeof prjSN !== 'undefined') {
        _XmjbxxList.some(u => {
          if (u.prjSN === prjSN) {
            u.prjUnit = prjUnit;
            u.prjAdr = prjAdr;
            u.prjName = prjName;
            u.prjType = prjType;
            u.contacts = contacts;
            u.contactInf = contactInf;
            u.prjTemSN = prjTemSN;
            u.specialNotifi = specialNotifi;
            u.noticeTime = noticeTime;
            u.effectiveTime = effectiveTime;
            u.prjSNType = prjSNType;
            u.prjStatus = prjStatus;
            u.delaySN = delaySN;
            u.delayCountDay = delayCountDay;
            u.correctionSN = correctionSN;
            u.correctionDate = correctionDate;
            return true;
          }
        });
      } else {
        prjSN = Math.random();
        _XmjbxxList.push({prjSN, prjUnit, prjAdr, prjName, prjType, contacts, contactInf, prjTemSN, specialNotifi, noticeTime, effectiveTime, remark});
      }
     
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            header: {
              reqpageIndex: 1,
              reqUserId: 'xxw',
              rspPageCount: 86,
              rspReturnMsg: '【1130130350522105856】保存成功',
              reqpageSize: 20,
              rspReturnCode: '000000'
            }
          }]);
        }, 500);
      });
    });

    // 查询项目属性信息列表
    mock.onPost('/ams/api/xmsx/query').reply(config => {
      let {header, prjSN} = JSON.parse(config.data);
      let {reqpageSize, reqpageIndex} = header;
      let mockXmsx = _XmsxList.filter(user => {
        if (prjSN && user.prjSN.indexOf(prjSN) == -1) return false;
        return true;
      });
      let total = mockXmsx.length;
      mockXmsx = mockXmsx.filter((u, index) => index < reqpageSize * reqpageIndex && index >= reqpageSize * (reqpageIndex - 1));
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            xmsxList: mockXmsx,
            header: {
              reqpageIndex: 1,
              reqUserId: 'xxw',
              rspPageCount: total,
              rspReturnMsg: '【1130134024585609216】交易成功',
              reqpageSize: 20,
              rspReturnCode: '000000'
            }
          }]);
        }, 1000);
      });
    });

    // 删除项目属性信息
    mock.onPost('/ams/api/xmsx/del').reply(config => {
      let { id } = JSON.parse(config.data);
      _XmsxList = _XmsxList.filter(r => r.id !== id);
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            header: {
              reqpageIndex: 1,
              reqUserId: 'xxw',
              rspPageCount: 86,
              rspReturnMsg: '【1130130350522105856】项目属性删除成功',
              reqpageSize: 20,
              rspReturnCode: '000000'
            }
          }]);
        }, 500);
      });
    });

    // 新增或者修改项目属性
    mock.onPost('/ams/api/xmsx/createOrUpdate').reply(config => {
      let { id, prjSN, serialNumber, prjNature, prjAttr, peacetimeUses, 
        aboveGroundLev, underGroundLev, aboveGroundHet, underGroundHet, 
        buildings, housingStockNum, strucType, checkDocSN, checkDocDate, 
        checkSN, checkDate, cancelSN, cancelDate, imgJudgeRes, exproprInfo, buldStatus, remark } = JSON.parse(config.data);
      
      if (typeof id !== 'undefined') {
        _XmsxList.some(u => {
          if (u.id === id) {
            u.prjSN = prjSN;
            u.serialNumber = serialNumber;
            u.prjNature = prjNature;
            u.prjAttr = prjAttr;
            u.peacetimeUses = peacetimeUses;
            u.aboveGroundLev = aboveGroundLev;
            u.underGroundLev = underGroundLev;
            u.aboveGroundHet = aboveGroundHet;
            u.underGroundHet = underGroundHet;
            u.buildings = buildings;
            u.housingStockNum = housingStockNum;
            u.strucType = strucType;
            u.checkDocSN = checkDocSN;
            u.checkDocDate = checkDocDate;
            u.checkSN = checkSN;
            u.checkDate = checkDate;
            u.cancelSN = cancelSN;
            u.cancelDate = cancelDate;
            u.imgJudgeRes = imgJudgeRes;
            u.exproprInfo = exproprInfo;
            u.buldStatus = buldStatus;
            u.remark = remark;
            return true;
          }
        });
      } else {
        id = Math.random();
        _XmsxList.push({ id, prjSN, serialNumber, prjNature, prjAttr, peacetimeUses, 
          aboveGroundLev, underGroundLev, aboveGroundHet, underGroundHet, 
          buildings, housingStockNum, strucType, checkDocSN, checkDocDate, 
          checkSN, checkDate, cancelSN, cancelDate, imgJudgeRes, exproprInfo, buldStatus, remark });
      }
     
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            header: {
              reqpageIndex: 1,
              reqUserId: 'xxw',
              rspPageCount: 86,
              rspReturnMsg: '【1130130350522105856】保存成功',
              reqpageSize: 20,
              rspReturnCode: '000000'
            }
          }]);
        }, 500);
      });
    });


    // 查询项目明细信息列表
    mock.onPost('/ams/api/xmmx/query').reply(config => {
      let {header, prjSN} = JSON.parse(config.data);
      let {reqpageSize, reqpageIndex} = header;
      let mockXmmx = _XmmxList.filter(user => {
        if (prjSN && user.prjSN.indexOf(prjSN) == -1) return false;
        return true;
      });
      let total = mockXmmx.length;
      mockXmmx = mockXmmx.filter((u, index) => index < reqpageSize * reqpageIndex && index >= reqpageSize * (reqpageIndex - 1));
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            xmmxList: mockXmmx,
            header: {
              reqpageIndex: 1,
              reqUserId: 'xxw',
              rspPageCount: total,
              rspReturnMsg: '【1130134024585609216】交易成功',
              reqpageSize: 20,
              rspReturnCode: '000000'
            }
          }]);
        }, 1000);
      });
    });

    // 删除项目属性信息
    mock.onPost('/ams/api/xmmx/del').reply(config => {
      let { id } = JSON.parse(config.data);
      _XmmxList = _XmmxList.filter(r => r.id !== id);
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            header: {
              reqpageIndex: 1,
              reqUserId: 'xxw',
              rspPageCount: 86,
              rspReturnMsg: '【1130130350522105856】项目明细删除成功',
              reqpageSize: 20,
              rspReturnCode: '000000'
            }
          }]);
        }, 500);
      });
    });

    // 新增或者修改项目明细
    mock.onPost('/ams/api/xmmx/createOrUpdate').reply(config => {
      let { id, prjSN, serialNumber, serialFunct, aboveGroundArea, underGroundArea, 
        blendArea, aboveGroundLen, prjClasfiCode } = JSON.parse(config.data);
      if (typeof id !== 'undefined') {
        _XmmxList.some(u => {
          if (u.id === id) {
            u.prjSN = prjSN;
            u.serialNumber = serialNumber;
            u.serialFunct = serialFunct;
            u.aboveGroundArea = aboveGroundArea;
            u.underGroundArea = underGroundArea;
            u.blendArea = blendArea;
            u.aboveGroundLen = aboveGroundLen;
            u.prjClasfiName1 = '1';
            u.prjClasfiName2 = '2';
            u.prjClasfiName3 = '3';
            u.prjClasfiName4 = '4';
            u.prjClasfiName5 = '5';
            return true;
          }
        });
      } else {
        id = Math.random();
        _XmmxList.push({ 
          prjSN, 
          serialNumber, 
          serialFunct, 
          aboveGroundArea, 
          underGroundArea, 
          blendArea, 
          aboveGroundLen, 
          prjClasfiCode,
          prjClasfiName1: '1',
          prjClasfiName2: '2',
          prjClasfiName3: '3',
          prjClasfiName4: '4',
          prjClasfiName5: '5'
         });
      }
     
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            header: {
              reqpageIndex: 1,
              reqUserId: 'xxw',
              rspPageCount: 86,
              rspReturnMsg: '【1130130350522105856】保存成功',
              reqpageSize: 20,
              rspReturnCode: '000000'
            }
          }]);
        }, 500);
      });
    });

    // 级联查询五级分类
    mock.onPost('/ams/api/dic/queryJL').reply(config => {
      let {header, type, parentID} = JSON.parse(config.data);
      let classifiDicList;
      if (parentID === '001') {
        classifiDicList = _PrjClasfiName2;
      } else if (parentID === '002') {
        classifiDicList = _PrjClasfiName3;
      } else if (parentID === '003') {
        classifiDicList = _PrjClasfiName4;
      } else if (parentID === '004') {
        classifiDicList = _PrjClasfiName5;
      } else {
        classifiDicList = _PrjClasfiName1;
      }

      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            classifiDicList: classifiDicList,
            header: {
              reqpageIndex: 1,
              reqUserId: 'xxw',
              rspPageCount: 1,
              rspReturnMsg: '【1130134024585609216】交易成功',
              reqpageSize: 20,
              rspReturnCode: '000000'
            }
          }]);
        }, 1000);
      });
    });

    // 查询五级分类某一级的全部值
    mock.onPost('/ams/api/dic/queryDL').reply(config => {
      let {header, type, name, other} = JSON.parse(config.data);
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            classifiDicList: ['商品房', '限价商品房', '自住型商品房'],
            header: {
              reqpageIndex: 1,
              reqUserId: 'xxw',
              rspPageCount: 1,
              rspReturnMsg: '【1130134024585609216】交易成功',
              reqpageSize: 20,
              rspReturnCode: '000000'
            }
          }]);
        }, 1000);
      });
    });

    // 根据项目明细信息 查询五级分类值域以及选中五级分类信息
    mock.onPost('/ams/api/xmmx/queryDicByID').reply(config => {
      let {header, id} = JSON.parse(config.data);
      const l = _DicByProejctDetailId;

      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            viewObj: l,
            header: {
              reqpageIndex: 1,
              reqUserId: 'xxw',
              rspPageCount: 1,
              rspReturnMsg: '【1130134024585609216】交易成功',
              reqpageSize: 20,
              rspReturnCode: '000000'
            }
          }]);
        }, 1000);
      });
    });

    // 查询五级分类值域
    mock.onPost('/ams/api/dic/queryJL').reply(config => {
      let {header, type, parentID} = JSON.parse(config.data);
      let classifiDicList;
      if (parentID === '001') {
        classifiDicList = _PrjClasfiName2;
      } else if (parentID === '002') {
        classifiDicList = _PrjClasfiName3;
      } else if (parentID === '003') {
        classifiDicList = _PrjClasfiName4;
      } else if (parentID === '004') {
        classifiDicList = _PrjClasfiName5;
      } else {
        classifiDicList = _PrjClasfiName1;
      }

      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            classifiDicList: [
              '商品房',
              '限价商品房',
              '自住型商品房'
            ],
            header: {
              reqpageIndex: 1,
              reqUserId: 'xxw',
              rspPageCount: 1,
              rspReturnMsg: '【1130134024585609216】交易成功',
              reqpageSize: 20,
              rspReturnCode: '000000'
            }
          }]);
        }, 1000);
      });
    });

  }
};

export default ProjectMockHandler;