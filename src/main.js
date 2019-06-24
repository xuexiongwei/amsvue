import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import './assets/theme/theme-green/index.css'
import VueRouter from 'vue-router'
import routes from './routes'
import 'font-awesome/css/font-awesome.min.css'

Vue.use(ElementUI)
Vue.use(VueRouter)

Vue.prototype.remarkAddClickTag= function (value) {
  if (!value) {
    return [{val: '', isHref: false}];
  }

  const valueArray = [];

  const val1 = value.split('《');

  for (let i = 0; i < val1.length; i++) {
    if (val1[i].indexOf('》') > -1) {
      const val2 = val1[i].split('》');
      valueArray.push({val: val2[0], isHref: true});
      valueArray.push({val: val2[1], isHref: false});
    } else {
      valueArray.push({val: val1[i], isHref: false});
    }
  }
  return valueArray;
};

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    sessionStorage.removeItem('user');
  }
  let user = JSON.parse(sessionStorage.getItem('user'));
  if (!user && to.path != '/login') {
    next({ path: '/login' })
  } else {
    next()
  }
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

