<template>
    <p class="no-content-container">{{message}}</p>
</template>

<script>
export default {
  name: "NoContent",
  props:['message']
}
</script>

<style>
   .no-content-container {
      font-family: 'Roboto', sans-serif!important;
      font-weight: 300;
      font-size: 1.5em;
      color: #676767;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
   }
</style>