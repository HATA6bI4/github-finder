<template>
    <div class="wrapper-content wrapper-content--fixed">
      
      <section>
        <div class="container">

          <div class="error" v-if="error" style="margin-bottom: 20px">
            <p> {{ error }} </p>
          </div>

          <search :value="search" placeholder="Type username..." @search="search = $event"/>
          <button v-if="!repos" class="btn" @click="getRepos">Search</button>
          <button v-else class="btn" @click="getRepos">Search Again</button>

          <div v-if="user" class="user-info">
            <div class="user-info-text">
              <span> {{ name }} </span>
              <span> Public Repos: {{ repos_count }} </span>
            </div>
            <img class="picture" :src="picture" alt="user_pic">
          </div>

          <div v-if="repos" class="sort">
            <p @click="sort('name')">Name &#8595;</p>
            <p @click="sort('stargazers_count')">Repos Count &#8595;</p>
          </div>

          <div class="repos__wrapper" v-if="repos">
            <div class="repos-item" v-for="repo in reposSort" :key="repo.id">
              <div class="repos-info">
                <a class="link" target="_blank" :href="repo.html_url">{{ repo.name }}</a>
                <span> 
                  {{ repo.stargazers_count }} 
                  ⭐
                </span>
              </div>
            </div>
          </div>
          <button @click="reposToShow(repos)" v-if="repos" class="btn" 
          :disabled="maxLength === 0" :class="{btnDisabled: maxLength === 0}">Load More</button>

        </div>
      </section>

    </div>
</template>

<script>

import search from '@/components/Search.vue'
import Search from '../components/Search.vue'
import axios from 'axios'

export default {
  components: { search },
    data () {
      return {
        user: null,
        name: null,
        stargazers_count: null,
        picture: null,
        repos_count: null,
        search: '',
        error: null,
        repos: null,
        repos_show: [],
        currentSort: 'name',
        currentSortDir: 'asc'
      }
    },
    computed: {
        reposSort() {
            return this.repos_show.sort((a, b) => {
                let mod = 1
                if (this.currentSortDir === 'desc') mod = -1
                if (a[this.currentSort] < b[this.currentSort]) return -1 * mod
                if (a[this.currentSort] > b[this.currentSort]) return 1 * mod
                return 0
            })
        },
        maxLength () {
          return this.repos.length
        }
    },
    methods: {
      getRepos () {
        this.repos_show = []
        axios
          .get(`https://api.github.com/users/${this.search}/repos`)
            .then(res => {
              this.repos = res.data
              this.error = null
              for (let i = 0; i < 3; i++) {
                this.repos_show.push(this.repos[i])
                this.repos.splice(i, 1)
              }
            })
            .catch(err => {
              console.log(err);
              this.repos = null
              this.error = `Can't find this user` 
            })

        axios
         .get(`https://api.github.com/users/${this.search}`)
            .then(res => {
              this.user = true
              this.name = res.data.name
              this.picture = res.data.avatar_url
              this.error = null
              this.repos_count = res.data.public_repos
            })
            .catch(err => {
              console.log(err);
              this.user = null
              this.error = `Can't find this user` 
            })
      },
      reposToShow (res) {
        if (res.length > 3) {
          for (let i = 0; i < 3; i++) {
            this.repos_show.push(res[i])
            this.repos.splice(i, 1)
          }
          return this.repos_show
          } else {
            for (let i = 0; i < res.length; i++) {
              this.repos_show.push(res[i])
              this.repos.splice(i, 1)
            }
            return this.repos_show
        }
      },
      sort (e) {
        if (e === this.currentSort) {
          this.currentSortDir = this.currentSortDir === 'asc' ? 'desc' : 'asc'
        }
        this.currentSort = e
      },
    }
}
</script>
<style lang="scss" scoped>
.btn {
  background:#5247e7;
  color: #fff;
}
.container {
  display: flex;
  align-items: center;
  flex-direction: column;
}
button {
  margin-top: 40px;
  margin-bottom: 20px;
  &.btnDisabled {
    cursor: default;
    opacity: .6;
  }
}
.picture {
  margin-top: 20px;
  border-radius: 50%;
  width: 50%;
  height: auto;
}
.repos__wrapper {
  width: 400px;
  margin: 30px 0;
}
.repos-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  padding: 10px 0;
  border-bottom: 1px solid #dbdbdb;
}
.user-info {
  display: flex;
  align-items: center;
  flex-direction: column;
  margin-top: 15px;
  font-size: 20px;
  background: #fff;
  padding: 30px 0;
  border-radius: 20px;
  box-shadow: 0 12px 12px 0 rgba(0,0,0,.1);
}
.user-info-text {
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 400px;
}
.sort {
  display: flex;
  justify-content: space-around;
  width: 400px;
  margin-top: 40px;
  p {
    cursor: pointer;
  }
}
</style>