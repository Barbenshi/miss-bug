import { eventBus } from "../services/eventBus-service.js"
import { userService } from "../services/user-service.js"

export default {
    emits: ['login-state-changed'],
    template: `
    <div className="login-cmp">
    <button @click="isSignUp= !isSignUp">{{isSignUp? 'Login' : 'Sign Up'}}</button>
    <div v-if="isSignUp" className="signup-container">
        <h1>Sign Up</h1>
        <form @submit.prevent="signup">
            <div className="fullname-container">
                <label htmlFor="fullname">Full Name</label>
                <input
                v-model="signUp.fullname"
                type="text"
                id="fullname" 
                placeholder="Puki Katan for example..."/>
            </div>
            <div className="username-container">
                <label htmlFor="username">UserName</label>
                <input
                v-model="signUp.username"
                type="text"
                id="username" 
                placeholder="Puki123 for example..."/>
            </div>
            <div className="password-container">
                <label htmlFor="pwd">Password</label>
                <input
                v-model="signUp.password" 
                type="password" 
                id="pwd" 
                placeholder="Your password goes here"/>
            </div>
            <button>Sign Up</button>
        </form>
    </div>

        <div v-else className="login-container">
            <h1>Login</h1>
            <form @submit.prevent="login">
                <div className="username-container">
                    <label htmlFor="username">UserName</label>
                    <input
                    v-model="credentials.username"
                    type="text"
                    id="username" 
                    placeholder="Puki123 for example..."/>
                </div>
                <div className="password-container">
                    <label htmlFor="pwd">Password</label>
                <input
                v-model="credentials.password" 
                type="password" 
                id="pwd" 
                placeholder="Your password goes here"/>
            </div>
            <button>Login</button>
        </form>
    </div>

</div>
    `,
    data() {
        return {
            credentials: {
                username: '',
                password: ''
            },
            signUp: {
                fullname: '',
                username: '',
                password: ''
            },
            isSignUp: false
        }
    },
    methods: {
        login() {
            userService.login({ ...this.credentials })
                .then(() => {
                    eventBus.emit('login')
                    this.$router.push('/')
                })
                .catch(err => eventBus.emit('show-msg', { txt: 'Invalid username/password', type: 'error' }))
        },
        signup() {
            userService.signup({ ...this.signUp })
                .then(user => {
                    eventBus.emit('login')
                    this.$router.push('/')
                })
                .catch(err => console.log('Couldn\'t create user', err))
        }
    }
}