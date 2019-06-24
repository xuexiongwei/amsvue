import { Points } from './data/mockData.js';

let _Points = Points;

const MapMockHandler = {
    init(mock) {

      // 获取地图区域点
      mock.onPost('/ams/api/dxf/query').reply(config => {
        let {prjSN} = JSON.parse(config.data);
        let points = _Points;
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve([200, {
              points: points,
              header: {
                reqpageIndex: 1,
                reqUserId: "xxw",
                rspPageCount: 1,
                rspReturnMsg: "【1130134024585609216】交易成功",
                reqpageSize: 20,
                rspReturnCode: "000000"
              }
            }]);
          }, 1000);
        });
      });

      // 获取地图区域点
      mock.onPost('/ams/api/dxf/convertZB').reply(config => {
        let {prjSN} = JSON.parse(config.data);
        let points = _Points;
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve([200, {
              longlatV: "116.53974519970919,40.04219375358758",
              header: {
                reqpageIndex: 1,
                reqUserId: "xxw",
                rspPageCount: 1,
                rspReturnMsg: "【1130134024585609216】交易成功",
                reqpageSize: 20,
                rspReturnCode: "000000"
              }
            }]);
          }, 1000);
        });
      });
  
    }
};

export default MapMockHandler;