<script>
export default {
  props:["connection", "customClasses", "model"],
  methods: {
    LoadEditor(tsnode){
      this.model.treeNodeSpec.state.selected = true;
      let msg = {command:"GetNotes"};
      msg.path = tsnode;
      this.connection.send(JSON.stringify(msg));
    },
  }
}
</script>
<template>
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 16 16"
    fill="currentColor"
     @click="LoadEditor(customClasses.fullpath)"
     :style="{fill: model.treeNodeSpec.state.selected ? '#ca0' : ''}">
     <title>edit note</title>
    <path
     id="path9485"
     d="M2.679 10.293l5.849-5.851 3 3-5.83 5.873-4.026 1.072z" />
  <path
     style=""
     class="success"
     id="path9487"
     d="M11.637 1.676c-.2 0-.4.077-.554.23l-1.77 1.768 3.053 3.053 1.77-1.77a.783.783 0 0 0 0-1.109l-1.944-1.941a.782.782 0 0 0-.555-.23z" />
  </svg>
</template>