import { bugService } from "../services/bug-service.js"
import { userService } from "../services/user-service.js"
import userPreview from "./user-preview.cmp.js"

export default {
    template: `
    <section v-if="users">    
        <section v-if="users.length" className="bug-list">                    
            <user-preview v-for="user in users" :user="user" :key="user._id" @deleted="removeUser" />
        </section>
        <section v-else class="bug-list">Yay! No Users!</section>
    </section>
    `,
    data() {
        return {
            users: null
        }
    },
    created() {
        userService.query()
            .then(users => this.users = users)
    },
    methods: {
        removeUser(user) {
            bugService.query({ creatorId: user._id })
                .then(({ filteredBugs, totalPageCount }) => {
                    console.log(filteredBugs);
                    if (filteredBugs.length || user.isAdmin) return console.log('cant delete user')
                    userService.remove(user._id)
                        .then(() => {
                            console.log('user deleted')
                            const userIdx = this.users.findIndex(currUser=>currUser._id === user._id)
                            this.users.splice(userIdx,1)
                    })
                })
        }
    },
    components: {
        userPreview
    }
}   