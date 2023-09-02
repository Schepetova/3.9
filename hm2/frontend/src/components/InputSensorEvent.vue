<template>
  <div v-if="errors">
        {{ errors }}
  </div>

  <form class="stacked-inputs" @submit.prevent="invokeEvent">
    <div class="row">
      <input type="text" placeholder="Event source ID" v-model="form.id">
    </div>
    <div class="row">
      <input type="text" placeholder="Sensor ID" v-model="form.params[0].id">
      <input type="text" placeholder="Param value" v-model="form.params[0].value">
    </div>
    <div class="row">
      <input type="text" placeholder="Sensor ID" v-model="form.params[1].id">
      <input type="text" placeholder="Param value" v-model="form.params[1].value">
    </div>
    <div class="row">
      <input type="text" placeholder="Sensor ID" v-model="form.params[2].id">
      <input type="text" placeholder="Param value" v-model="form.params[2].value">
    </div>
    <div class="row">
      <input type="text" placeholder="Sensor ID" v-model="form.params[3].id">
      <input type="text" placeholder="Param value" v-model="form.params[3].value">
    </div>
    <div class="row">
      <input type="text" placeholder="Sensor ID" v-model="form.params[4].id">
      <input type="text" placeholder="Param value" v-model="form.params[4].value">
    </div>
    <button type="submit" class="">
      Invoke
    </button>
  </form>
</template>

<script setup>
import { reactive } from 'vue';
import useEmulateEvent from '../composables/useEmulateEvent';

const form = reactive({
  'id': null,
  'params': [],
})
for(let i = 0; i < 5; i++) {
    form.params.push({id: null, value: null});
}

const { errors, createEvent } = useEmulateEvent()
const invokeEvent = async () => {
  await createEvent({ ...form });
}
</script>
