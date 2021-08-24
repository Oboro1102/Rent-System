<template>
  <div class="table">
    <table>
      <thead>
        <tr>
          <th v-for="(item, index) in tableHead" :key="index">{{ item }}</th>
        </tr>
      </thead>
      <tbody v-if="tableData.length == 0">
        <tr class="noResult">
          <td :colspan="tableHead.length">查無資料</td>
        </tr>
      </tbody>
      <tbody>
        <tr v-for="(item, index) in tableData" :key="index">
          <slot name="tableData" :item="item" />
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  props: {
    tableHead: {
      type: Array,
      required: true,
    },
    tableData: {
      type: Array,
      required: true,
    },
  },
};
</script>