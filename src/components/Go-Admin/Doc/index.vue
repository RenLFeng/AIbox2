<template>
  <div>
    <svg-icon icon-class="question" @click="goto" />
  </div>
</template>

<script>
export default {
  name: 'GoAdminDoc',
  data() {
    return {
      url: 'http://www.lifedefender.net/'
    }
  },
  methods: {
    goto() {
      window.open(this.url)
    }
  }
}
</script>
