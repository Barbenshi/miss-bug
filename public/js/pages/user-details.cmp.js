import { userService } from "../services/user-service.js"
import { bugService } from "../services/bug-service.js"

import bugList from "../cmps/bug-list.cmp.js"

export default {
    template: `
    <div v-if="user" className="user-details">
        <h1>Hello {{user.fullname}}, those are your bugs</h1>
        <bug-list v-if="bugs" :bugs="bugs"/>
    </div>
    `,
    data() {
        return {
            user: userService.getLoggedInUser(),
            bugs: null
        }
    },
    created() {
        console.log(this.user);
        bugService.query({ creatorId: this.user._id }).then(({ filteredBugs, totalPageCount }) => this.bugs = filteredBugs)
    },
    components: {
        bugList
    }
}