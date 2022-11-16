import { eventBus } from "../services/eventBus-service.js"
import { userService } from "../services/user-service.js"



export default {
    template: `
        <header class="main-header">
            <router-link v-if="user && user.isAdmin" to="/bug/users">Show all users</router-link>
            <h1><router-link to="/">Miss Bug</router-link></h1>
            <div v-if="user" className="user">
                <router-link :to="'/bug/users/' + user._id">Welcome {{user.fullname}}</router-link> 
                <button @click="logout">Log out</button>
            </div> 
                <router-link
                v-else 
                to="/bug/login">Login</router-link> 
        </header>
    `,
    data() {
        return {
            user: userService.getLoggedInUser()
        }
    },
    created() {
        eventBus.on('login', () => this.user = userService.getLoggedInUser())
    },
    methods: {
        logout() {
            userService.logout()
            this.user = null
        }
    },
}
