'use strict'

import { userService } from "../services/user-service.js"

export default {
  props: ['bug'],
  template: `<article v-if="bug" className="bug-preview">
                <span>🐛</span>
                <h4>{{bug.title}}</h4>
                <span :class='"severity" + bug.severity'>Severity: {{bug.severity}}</span>
                <div class="actions">
                  <router-link :to="'/bug/' + bug._id">Details</router-link>
                  <router-link v-if="isLoggedInUser" :to="'/bug/edit/' + bug._id"> Edit</router-link>
                </div>
                <button @click="onRemove(bug._id)">X</button>
              </article>`,
  methods: {
    onRemove(bugId) {
      this.$emit('removeBug', bugId)
    },

  },
  computed: {
    isLoggedInUser() {
      if(!userService.getLoggedInUser()) return false
      console.log(userService.getLoggedInUser())
      console.log(this.bug);
      return (userService.getLoggedInUser()._id === this.bug.creator._id
      || userService.getLoggedInUser().isAdmin)
    }
  }
}
