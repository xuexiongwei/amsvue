import axios from 'axios';

// let base = '';
let base = 'http://154.8.232.103:8899';

// 登录接口
export const login = params => { 
    const p = pckParam(params, {});
    return axios.post(`${base}/ams/amsLogin`, p).then(res => res.data); 
};

// 登出接口
export const logout = params => { 
    const p = pckParam(params, {});
    return axios.post(`${base}/ams/amsLogout`, p).then(res => res.data); 
};

// 获取用户列表（分页）
export const getUserListPage = (params, pageSize, pageNum) => {
    const p = pckParam(params, {reqpageSize: pageSize, reqpageIndex: pageNum});
    return axios.post(`${base}/ams/getUserByname`, p).then(res => res.data); 
};

// 删除用户
export const removeUser = params => { 
    const p = pckParam(params, {});
     return axios.post(`${base}/ams/deleteUser`, p).then(res => res.data); 
};

// 编辑用户
export const editUser = params => {
    const p = pckParam(params, {});
    return axios.post(`${base}/ams/updateUser`, p).then(res => res.data); 
};

// 新增用户
export const addUser = params => { 
    const p = pckParam(params, {});
    return axios.post(`${base}/ams/addUser`, p).then(res => res.data); 
};

// 获取角色列表（无分页）
export const getRoleList = params => { 
    const p = pckParam(params, {});
    return axios.post(`${base}/ams/getRoleAndPage`, p).then(res => res.data); 
};

// 通过userId查询已经配置的角色id
export const getHasRoleIdsByUserId = params => { 
    const p = pckParam(params, {});
    return axios.post(`${base}/ams/getRoleByUserId`, p).then(res => res.data); 
};

// 这只某个用户的角色id
export const setRoleIdsByUserId = params => { 
    const p = pckParam(params, {});
    return axios.post(`${base}/ams/addUserAddRole`, p).then(res => res.data); 
};

// 获取角色列表（分页）
export const getRoleListPage = (params, pageSize, pageNum) => { 
    const p = pckParam(params, {reqpageSize: pageSize, reqpageIndex: pageNum});
    return axios.post(`${base}/ams/getRoleByRolename`, p).then(res => res.data); 
};

// 删除角色
export const removeRole = params => { 
    const p = pckParam(params, {});
    return axios.post(`${base}/ams/deleteRole`, p).then(res => res.data); 
};

// 编辑角色
export const editRole = params => { 
    const p = pckParam(params, {});
    return axios.post(`${base}/ams/updateRole`, p).then(res => res.data); 
};

// 新增角色
export const addRole = params => { 
    const p = pckParam(params, {});
    return axios.post(`${base}/ams/addRole`, p).then(res => res.data); 
};

// 获取菜单列表（分页）
export const getMenuListPage = params => { return axios.post(`${base}/menu/listPage`, params).then(res => res.data); };

// 获取菜单树
export const getMenuTree = params => { return axios.post(`${base}/menu/tree`, params).then(res => res.data); };

// 获取该角色已经选中的菜单id
export const getMenuIdsByRoleId = params => { return axios.post(`${base}/menu/getMenuIdsByRoleId`, params).then(res => res.data); };

// 设置已经选中的菜单id
export const setMenuIdsByRoleId = params => { return axios.post(`${base}/menu/setMenuIdsByRoleId`, params).then(res => res.data); };

// 删除菜单
export const removeMenu = params => { 
    const p = pckParam(params, {});
    return axios.post(`${base}/ams/deleteMenu`, p).then(res => res.data);
};

// 修改菜单
export const editMenu = params => { return axios.post(`${base}/menu/edit`, params).then(res => res.data); };

// 新增菜单
export const addMenu = params => { return axios.post(`${base}/menu/add`, params).then(res => res.data); };

// 获取项目基本信息列表
export const getProjectListPage = (params, pageSize, pageNum) => { 
    const p = pckParam(params, {reqpageSize: pageSize, reqpageIndex: pageNum});
    return axios.post(`${base}/ams/api/xmjbxx/query`, p).then(res => res.data); 
};

// 删除项目基本信息
export const removeProject = params => { 
    const p = pckParam(params, {});
    return axios.post(`${base}/ams/api/xmjbxx/del`, p).then(res => res.data); 
};

// 新增/修改 项目基本信息
export const createOrUpdateProject = params => { 
    const p = pckParam(params, {});
    return axios.post(`${base}/ams/api/xmjbxx/createOrUpdate`, p).then(res => res.data); 
};

// 模糊过滤字段接口
export const queryDataByLike = (params, pageSize, pageNum) => { 
    const p = pckParam(params, {reqpageSize: pageSize, reqpageIndex: pageNum});
    return axios.post(`${base}/ams/api/mh/queryJbxxLike`, p).then(res => res.data); 
};


// 获取项目明细列表
export const getProjectDtailListPage = (params, pageSize, pageNum) => { 
    const p = pckParam(params, {reqpageSize: pageSize, reqpageIndex: pageNum});
    return axios.post(`${base}/ams/api/xmmx/query`, p).then(res => res.data); 
};

// 删除项目明细
export const removeProjectDetail = params => { 
    const p = pckParam(params, {});
    return axios.post(`${base}/ams/api/xmmx/del`, p).then(res => res.data); 
};

// 新增/修改 项目明细
export const createOrUpdateProjectDetail = params => { 
    const p = pckParam(params, {});
    return axios.post(`${base}/ams/api/xmmx/createOrUpdate`, p).then(res => res.data); 
};

// 获取项目属性列表
export const getProjectAttributeListPage = (params, pageSize, pageNum) => { 
    const p = pckParam(params, {reqpageSize: pageSize, reqpageIndex: pageNum});
    return axios.post(`${base}/ams/api/xmsx/query`, p).then(res => res.data); 
};

// 删除项目属性
export const removeProjectAttribute = params => { 
    const p = pckParam(params, {});
    return axios.post(`${base}/ams/api/xmsx/del`, p).then(res => res.data); 
};

// 新增/修改 项目属性
export const createOrUpdateProjectAttribute = params => { 
    const p = pckParam(params, {});
    return axios.post(`${base}/ams/api/xmsx/createOrUpdate`, p).then(res => res.data); 
};

// 级联查询五级分类
export const getPrjClasfiNameByParentId = params => {
    const p = pckParam(params, {});
    return axios.post(`${base}/ams/api/dic/queryJL`, p).then(res => res.data); 
};

// 级联查询五级分类
export const getPrjClasfiNames = params => {
    const p = pckParam(params, {});
    return axios.post(`${base}/ams/api/dic/queryDL`, p).then(res => res.data); 
};

// 根据项目明细信息 查询五级分类值域以及选中五级分类信息
export const queryDicByProejctDetailId = params => {
    const p = pckParam(params, {});
    return axios.post(`${base}/ams/api/xmmx/queryDicByID`, p).then(res => res.data); 
};

// 查询操作日志列表
export const getLogListPage = (params, pageSize, pageNum) => {
    const p = pckParam(params, {reqpageSize: pageSize, reqpageIndex: pageNum});
    return axios.post(`${base}/ams/api/userOperation/queryUserOperByDate`, p).then(res => res.data); 
};

export const queryDicByType = (params) => {
    const p = pckParam(params, {});
    return axios.post(`${base}/ams/api/dic/queryByType`, p).then(res => res.data); 
}

// view001
export const getView001 = (params, pageSize, pageNum) => {
    const p = pckParam(params, {reqpageSize: pageSize, reqpageIndex: pageNum});
    return axios.post(`${base}/ams/api/view/bb001`, p).then(res => res.data); 
};

// view002
export const getView002 = (params, pageSize, pageNum) => {
    const p = pckParam(params, {reqpageSize: pageSize, reqpageIndex: pageNum});
    return axios.post(`${base}/ams/api/view/bb002`, p).then(res => res.data); 
};

// view003
export const getView003 = params => {
    const p = pckParam(params, {});
    return axios.post(`${base}/ams/api/view/bb003`, p).then(res => res.data); 
};


// 获取地图区域点
export const getPointsByprjSN = params => { 
    const p = pckParam(params, {});
    return axios.post(`${base}/ams/api/dxf/query`, p).then(res => res.data); 
};

// 根据大地坐标转换经纬度
export const convertZB = params => { 
    const p = pckParam(params, {});
    return axios.post(`${base}/ams/api/dxf/convertZB`, p).then(res => res.data); 
};

// 组装上传地址
export const getUploadUrl = () => { 
    return `${base}/ams/api/upload`; 
};


// 组装下载地址
export const getDownloadUrl = (fileName, prjSN) => { 
    return `${base}/ams/api/download?fname=${fileName}&prjSN=${prjSN}`; 
};


const pckParam = (params, headerParam) => {
    const userInfo = JSON.parse(sessionStorage.getItem('user'));
    const p = Object.assign({}, params);
    let header = {
        reqUserId: userInfo ? userInfo['id'] : '1',
		rspReturnCode: "",
		rspReturnMsg:"",
		reqpageSize: "",
		reqpageIndex: "",
		rspPageCount: ""
    };
    header = Object.assign(header, headerParam);
    p['header'] = header;
    return p;
}