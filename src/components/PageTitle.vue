<template>
  <h1 class="page-title"><font-awesome-icon :icon="pageIcon"></font-awesome-icon> {{title}}<br><small v-if="subtitle" class="small subtitle">{{subtitle}}</small></h1>
</template>

<script>
export default {
  name: "PageTitle",
  props:['title', 'pageIcon', 'subtitle']
}
</script>

<style>
   .subtitle {
      font-family: 'Roboto', sans-serif;
      font-weight: 300;
      position: relative;
      top:5px;
      font-size: 0.75em;
      color: #676767;
   }
</style>