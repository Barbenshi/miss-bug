import bugApp from '../pages/bug-app.cmp.js'
import bugEdit from '../pages/bug-edit.cmp.js'
import bugDetails from '../pages/bug-details.cmp.js'
import userLogin from '../pages/user-login.cmp.js'
import userDetails from '../pages/user-details.cmp.js'
import usersList from '../cmps/users-list.cmp.js'

const routes = [
  { path: '/', redirect: '/bug' },
  { path: '/bug', component: bugApp },
  { path: '/bug/edit/:bugId?', component: bugEdit },
  { path: '/bug/users', component: usersList },
  { path: '/bug/login', component: userLogin },
  { path: '/bug/users/:userId', component: userDetails },
  { path: '/bug/:bugId', component: bugDetails },
]

export const router = VueRouter.createRouter({ history: VueRouter.createWebHashHistory(), routes })
