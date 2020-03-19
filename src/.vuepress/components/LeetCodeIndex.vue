<template>
  <div class="custom-layout">
    <div class="main-div">
      <h3>标签</h3>
      <div class="tags-select">
        <label
          v-for="tag in tags"
          :key="tag"
          class="tag-checkbox"
        >
          <input
            v-show="false"
            v-model="selectedTags"
            type="checkbox"
            :value="tag"
          >
          <IconTag icon="tag" :name="tag"/>
        </label>
      </div>
      <h3>查找</h3>
      <PostsFilterSearch v-model="filterSearch" />
    </div>
    <LeetCodeTable :list="filteredPosts" />
  </div>
</template>

<script>
import IconTag from '@theme/components/IconTag.vue'
import PostsFilterSearch from '@theme/components/PostsFilterSearch.vue'

export default {
  name: 'LeetCodeLayout',
  components: {
    IconTag,
    PostsFilterSearch,
  },
  data() {
    return {
      selectedTags: [],
      filterSearch: '',
    }
  },
  computed: {
    tags() {
      const set = new Set();
      this.$leetcode.forEach(post => post.frontmatter.leetcodeTags.forEach(tag => set.add(tag)));
      return [...set];
    },
    filteredPosts() {
      let filteredPosts = this.$leetcode;
      if (this.tags && this.selectedTags.length !== 0) {
        filteredPosts = filteredPosts.filter(p => {
          const postTags = p.frontmatter.leetcodeTags;
          for (const tag of this.selectedTags) {
            if (postTags.includes(tag)) {
              return true;
            }
          }
          return false;
        })
      }
      if (this.filterSearch !== '') {
        const searchString = this.filterSearch.toLowerCase().trim()
        filteredPosts = filteredPosts.filter(p => p.title.toLowerCase().includes(searchString))
      }
      
      return filteredPosts;
    }
  },
  methods: {
  }
}
</script>

<style lang="stylus" scoped>
.leetcode-post-list
  margin: 0;
</style>