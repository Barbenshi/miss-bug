'use strict'
import { bugService } from '../services/bug-service.js'
import bugList from '../cmps/bug-list.cmp.js'
import bugFilter from '../cmps/bug-filter.cmp.js'

export default {
  template: `
    <section class="bug-app">
        <div class="subheader">
          <bug-filter @setFilterBy="setFilterBy"></bug-filter> ||
          <router-link to="/bug/edit">Add New Bug</router-link> 
        </div>
        <h2>Total Pages:{{pageCount}}</h2>
        <bug-list v-if="bugs" :bugs="bugs" @removeBug="removeBug"></bug-list>
        <button @click="downloadBugs">Download bugs</button>
        <button :disabled="filterBy.page===0" @click=changePage(-1)>Prev</button>
        <button :disabled="filterBy.page>=pageCount-1" @click=changePage(1)>Next</button>
    </section>
    `,
  data() {
    return {
      bugs: null,
      filterBy: {
        title: '',
        page: 0,
        creatorId:''
      },
      pageCount: 0,
    }
  },
  created() {
    this.loadBugs()
  },
  methods: {
    loadBugs() {
      bugService.query(this.filterBy).then(({ filteredBugs, totalPageCount }) => {
        this.bugs = filteredBugs
        this.pageCount = totalPageCount
      })
    },
    setFilterBy(filterBy) {
      this.filterBy = { ...filterBy, page: 0 ,creatorId:this.filterBy.creatorId}
      this.loadBugs()
    },
    removeBug(bugId) {
      bugService.remove(bugId)
        .then(() => this.loadBugs())
        .catch(err=>console.log('Not your bug...'))
    },
    downloadBugs() {
      bugService.downloadBugs()
        .then(() => console.log('downloaded bugs'))
    },
    changePage(diff) {
      this.filterBy.page += diff
      this.loadBugs()
    }
  },
  computed: {

  },
  components: {
    bugList,
    bugFilter,
  },
}
