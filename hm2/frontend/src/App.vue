<template>
  <div class="container">
    <InputSensorEvent />
    <Suspense>
      <ControlsList />
    </Suspense>
  </div>
</template>

<script setup>
import ControlsList from './components/ControlsList.vue';
import InputSensorEvent from './components/InputSensorEvent.vue';
import useWS from './service/ws.js'

const { initWS } = useWS();
initWS();
</script>

<style lang="css">
.container {
  margin: 0 auto;
}
</style>

