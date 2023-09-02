<template>
  <div v-for="control in controls" :key="control.description" class="main">
    <div class="">Name: {{ control.description }}</div>
    <div>Type: {{ control.type }}</div>
    <table class="">
      <thead>
        <tr>
          <th class="">
          <span
            class="">Param name</span>
          </th>
          <th class="">
          <span
            class="">Check low</span>
          </th>
          <th class="">
          <span
            class="">Low value</span>
          </th>
          <th class="">
          <span
            class="">Check high</span>
          </th>
          <th class="">
          <span
            class="">High value</span>
          </th>
        </tr>
      </thead>

      <tbody class="">
        <template v-for="rule in control.rules"
                  :key="rule.id"
        >
          <tr class="">
            <td class="">
              {{ rule.param_id }}
            </td>
            <td class="">
              {{ rule.check_low_param }}
            </td>
            <td class="">
              {{ rule.low_alarm_value }}
            </td>
            <td class="">
              {{ rule.check_high_param  }}
            </td>
            <td class="">
              {{ rule.high_alarm_value }}
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import useControls from '../composables/useControls.js'

const { controls, getControls } = useControls()
onMounted(
  getControls
);
  //let raw = await getControls();
  //console.log('raw: ', raw);
</script>

<style lang="css">
.main {
  border-spacing: 1em 1em;
  padding: 1em 1em 1em 1em;
  border: 1px solid black;
}

table {
  border-collapse: collapse;
}

table,
table td {
  border: 1px solid black;
}

td {
  text-align: center;
  vertical-align: middle;
}
</style>
