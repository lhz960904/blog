<template>
  <div class="custom-layout">
    <div class="main-div">
      <Content slot-key="desc" />
    </div>
    <div class="main-div">
      <Content slot-key="solution" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'LeetCodeContent',
}
</script>