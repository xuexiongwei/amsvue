import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'
import User from './views/user/User.vue';
import Role from './views/role/Role.vue';
import Menu from './views/menu/Menu.vue';
import Project from './views/project/Project.vue';
import ProjectDetail from './views/project/detail/ProjectDetail.vue';
import ProjectAttribute from './views/project/attribute/ProjectAttribute.vue';
import Log from './views/log/log.vue';
import View001 from './views/view/View001.vue';
import View002 from './views/view/View002.vue';
import View003 from './views/view/View003.vue';
import AmsUpload from './views/AmsUpload.vue';

let routes = [
    {
        path: '/login',
        component: Login,
        name: '',
        hidden: true
    },
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
    },
    {
        path: '/',
        component: Home,
        name: '系统功能',
        iconCls: 'el-icon-message', // 图标样式class
        children: [
            { path: '/user', component: User },
            { path: '/role', component: Role },
            { path: '/menu', component: Menu },
            { path: '/project', component: Project },
            { path: '/project/:param', component: Project },
            { path: '/projectAttribute/:param', component: ProjectAttribute },
            { path: '/projectDetail/:param', component: ProjectDetail },
            { path: '/log', component: Log },
            { path: '/view001', component: View001 },
            { path: '/view002/:prjSNType', component: View002 },
            { path: '/view002', component: View002 },
            { path: '/view003', component: View003 },
            { path: '/view003/:prjSN', component: View003 },
            { path: '/amsUpload', component: AmsUpload },
        ]
    },
    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    }
];

export default routes;