<template>
  <div @click="toggleClick">
    <!-- <svg
      data-v-49e15297=""
      viewBox="0 0 1024 1024"
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      class="hamburger"
      :class="{ 'is-active': isActive }"
    >
      <path
        fill="#000000"
        data-v-49e15297=""
        d="M408 442h480c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H408c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8zm-8 204c0 4.4 3.6 8 8 8h480c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H408c-4.4 0-8 3.6-8 8v56zm504-486H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0 632H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM142.4 642.1L298.7 519a8.84 8.84 0 0 0 0-13.9L142.4 381.9c-5.8-4.6-14.4-.5-14.4 6.9v246.3a8.9 8.9 0 0 0 14.4 7z"
      ></path>
    </svg> -->
    <svg-icon
      icon-class="folding"
      :class="{ 'is-active': isActive }"
      class="hamburger"
      style="width: 40px;height: 40px;padding-top: 10px;"
    />
    <!-- <svg
      xmlns="http://www.w3.org/2000/svg"
      class="hamburger"
      width="64px"
      height="64.00px"
      viewBox="0 0 1024 1024"
      version="1.1"
      :class="{ 'is-active': isActive }"
    >
      <path
        fill="#ededed"
        d="M676.992 449.621a85.547 85.547 0 0 1 0 124.758L391.509 841.856a42.39 42.39 0 0 1-60.074-2.07 42.773 42.773 0 0 1 2.069-60.309L618.987 512 333.504 244.523a42.773 42.773 0 0 1-2.07-60.31 42.39 42.39 0 0 1 60.075-2.069l285.483 267.477z"
      />
    </svg> -->
  </div>
</template>

<script>
export default {
  name: 'Hamburger',
  props: {
    isActive: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    toggleClick() {
      this.$emit('toggleClick')
    }
  }
}
</script>

<style scoped>
  .navbar[data-v-3bb06c32]{
    background-color: #fff;
  }
.navbar .hamburger-container[data-v-d16d6306] {
  background-color: #fff;
}
.navbar .hamburger-container[data-v-d16d6306]:hover {
  background-color: #fff;
}
.hamburger {
  /* position: fixed;
  top: 102px; */
  display: inline-block;
  vertical-align: middle;
  margin-left: 5px;
  width: 64px;
  height: 64px;
  background-color: #fff;
  color: #000;
  /* border-radius: 50%; */
  /* background: linear-gradient(to bottom, #fdb136, #f39702); */
}

.hamburger.is-active {
  transform: rotate(180deg);
  margin-top: 10px;
}
</style>
