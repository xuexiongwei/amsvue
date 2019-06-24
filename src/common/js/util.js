import XLSX from 'xlsx';
import FileSaver from 'file-saver';

var SIGN_REGEXP = /([yMdhsm])(\1*)/g;
var DEFAULT_PATTERN = 'yyyy-MM-dd';
function padding(s, len) {
    var len = len - (s + '').length;
    for (var i = 0; i < len; i++) { s = '0' + s; }
    return s;
};

export default {
    getQueryStringByName: function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        var context = "";
        if (r != null)
            context = r[2];
        reg = null;
        r = null;
        return context == null || context == "" || context == "undefined" ? "" : context;
    },

    formatDate: {
        format: function (date, pattern) {
            pattern = pattern || DEFAULT_PATTERN;
            return pattern.replace(SIGN_REGEXP, function ($0) {
                switch ($0.charAt(0)) {
                    case 'y': return padding(date.getFullYear(), $0.length);
                    case 'M': return padding(date.getMonth() + 1, $0.length);
                    case 'd': return padding(date.getDate(), $0.length);
                    case 'w': return date.getDay() + 1;
                    case 'h': return padding(date.getHours(), $0.length);
                    case 'm': return padding(date.getMinutes(), $0.length);
                    case 's': return padding(date.getSeconds(), $0.length);
                }
            });
        },
        parse: function (dateString, pattern) {
            var matchs1 = pattern.match(SIGN_REGEXP);
            var matchs2 = dateString.match(/(\d)+/g);
            if (matchs1.length == matchs2.length) {
                var _date = new Date(1970, 0, 1);
                for (var i = 0; i < matchs1.length; i++) {
                    var _int = parseInt(matchs2[i]);
                    var sign = matchs1[i];
                    switch (sign.charAt(0)) {
                        case 'y': _date.setFullYear(_int); break;
                        case 'M': _date.setMonth(_int - 1); break;
                        case 'd': _date.setDate(_int); break;
                        case 'h': _date.setHours(_int); break;
                        case 'm': _date.setMinutes(_int); break;
                        case 's': _date.setSeconds(_int); break;
                    }
                }
                return _date;
            }
            return null;
        }

    },

    validatorUtils: {
        checkSpecialChar(rule, value, callback) {
            rule.message = '不能包含特殊字符:\\<>"\'';
            if (value && value.indexOf('\\') > -1) {
                return callback(new Error());
            }

            const reg = new RegExp('[\\<>"\']');
            if (reg.test(value)) {
                return callback(new Error());
            } else {
                return callback();
            }
        },
        checkEmail(rule, value, callback) {

            if (!value) {
                return callback(new Error('email不能为空'));
            }
    
            const reg = new RegExp('^\\w+([-+.]\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*$');
            if (reg.test(value)) {
                return callback();
            } else {
                return callback(new Error('email格式不正确'));
            }
        },
        checkMobile(rule, value, callback) {
            if (!value) {
                return callback();
            }

            var reg = /(^(0[0-9]{2,3}\-)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$)|(^((\(\d{3}\))|(\d{3}\-))?(1[3578]\d{9})$)|(^(400)-(\d{3})-(\d{4})(.)(\d{1,4})$)|(^(400)-(\d{3})-(\d{4}$))/;
            if ( reg.test(value) ){
                return callback();
            }else{
                return callback(new Error('联系方式格式不正确'));
            }
        },
        checkContaintStr(strTem, errorMsg) {
            return (rule, value, callback) => {

                if (!value) {
                    return callback();
                }

                if (value.indexOf(strTem) > -1) {
                    return callback();
                } else {
                    return callback(new Error(errorMsg));
                }
            }
        }
    },

    exportExcel(table, fileName) {
        const wb = XLSX.utils.table_to_book(table);
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
        });
        FileSaver.saveAs(data, `${fileName}.xlsx`);
    },

    paginationSize: [10, 20, 50, 100],

    prjSNTypeOptions: [
        {id: '1', label: '请选择许可证类型', value: ''},
        {id: '2', label: '城镇建设项目', value: '城镇建设项目'},
        {id: '3', label: '乡村建设项目', value: '乡村建设项目'},
        {id: '4', label: '临时建设项目', value: '临时建设项目'},
        {id: '5', label: '补正项目', value: '补正项目'}
    ],
    
    prjTypeOptions: [
        { id: '1', label: '请选择建设类型', value: ''},
        { id: '2', label: '新建', value: '新建'},
        { id: '3', label: '改扩建', value: '改扩建'}
    ],

    prjStatusOptions: [
        { id: '1', label: '请选择项目状态', value: ''},
        { id: '2', label: '未申报', value: '未申报'},
        { id: '3', label: '已撤（注）销', value: '已撤（注）销'},
        { id: '4', label: '已验收', value: '已验收'},
        { id: '5', label: '已完结', value: '已完结'},
        { id: '6', label: '部分撤（注）销', value: '部分撤（注）销'},
        { id: '7', label: '部分验收', value: '部分验收'},
        { id: '8', label: '未撤（注）销部分部分验收', value: '未撤（注）销部分部分验收'}
    ],

    prjMarkOptions: [
        { id: '1', label: '请选择项目标识', value: ''},
        { id: '2', label: '正常', value: '正常'},
        { id: '3', label: '超期', value: '超期'},
        { id: '4', label: '延期', value: '延期'},
        { id: '5', label: '补正', value: '补正'}

    ],

    menuTree: [
        {
            id: '1',
            menuName: '业务功能',
            iconCls: 'fa fa-free-code-camp',
            children: [
                {id: '1_1', menuName: '项目基本信息管理', menuLink: '/project'},
                {id: '1_2', menuName: '项目属性信息管理', menuLink: '/ProjectAttribute'},
                {id: '1_3', menuName: '项目明细信息管理', menuLink: '/projectDetail'}
            ]
        },
        {
            id: '2',
            menuName: '项目信息',
            iconCls: 'fa fa-eercast',
            children: [
                {id: '2_1', menuName: '项目总览', menuLink: '/view002'},
                {id: '2_2', menuName: '项目详情', menuLink: '/view003'}
            ]
        },
        {
            id: '3',
            menuName: '许可证类型',
            iconCls: 'fa fa-quora',
            children: [      
                {id: '3_1', menuName: '城镇建设项目', menuLink: '/view002/1'},
                {id: '3_2', menuName: '乡村建设项目', menuLink: '/view002/2'},
                {id: '3_3', menuName: '临时建设项目', menuLink: '/view002/3'},
                {id: '3_4', menuName: '补正项目', menuLink: '/view002/4'},
            ]
        },
        {
            id: '4',
            menuName: '统计分析',
            iconCls: 'fa fa-area-chart',
            children: [      
                {id: '4_1', menuName: '复合统计', menuLink: '/view001'}
            ]
        },
        {
            id: '5',
            menuName: '基础功能',
            iconCls: 'fa fa-snowflake-o',
            children: [
                {id: '5_1', menuName: '数据上传', menuLink: '/amsUpload'},
                {id: '5_2', menuName: '日志查询', menuLink: '/log'}
            ]
        }
    ]
};
