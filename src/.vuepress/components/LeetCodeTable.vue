<template>
  <div class="main-div">
    <TransitionFadeSlide>
      <table class="leetcode-post-table" v-if="list.length">
        <thead>
          <tr>
            <th width="188">#</th>
            <th>题名</th>
            <th width="54">难度</th>
          </tr>
        </thead>
        <tbody >
          <tr v-for="item in list" :key="item.key">
            <td>{{ item.index }}</td>
            <td>
              <RouterLink :to="item.path">{{ item.name }}</RouterLink>
            </td>
            <td>
              <span :class="`difficulty-text-${item.difficulty}`">{{ item.difficulty | difficultyText }}</span>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-else>没有找到相关题目</div>
    </TransitionFadeSlide>
  </div>
</template>

<script>
import TransitionFadeSlide from '@theme/components/TransitionFadeSlide.vue'

export default {
  name: 'LeetCodeTable',
  props: {
    list: {
      type: Array,
      required: true,
    },
    loading: {
      type: Boolean,
      required: false,
    }
  },
  components: {
    TransitionFadeSlide
  },
  filters: {
    difficultyText(text) {
      const map = {
        0: '简单',
        1: '中等',
        2: '困难'
      }
      return map[text];
    }
  }
}
</script>

<style lang="stylus" scoped>
.leetcode-post-table
  position: relative;
  width: 100%;
  border-radius: 2px 2px 0 0;
  border-collapse: separate;
  border-spacing: 0;
  th
    border-bottom: 1px solid #ddd;
  tbody
    tr:nth-child(even)
      background: #fafafa;
    tr:hover
      background: #ecf0f1;
  th, td
    text-align: left;
    height: 36px;
    padding: 8px;
  .difficulty-text-0
    color: #009975;
  .difficulty-text-1
    color: #ed7336;
  .difficulty-text-2
    color: #ec4c47;  
</style>