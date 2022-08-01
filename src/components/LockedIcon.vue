<script>
export default {
   props: ['connection', 'model'],
   methods: {
    Unlock(model) {
      model.treeNodeSpec.customizations.classes.locked = "no";
      let data = {};
      data.command = "UnlockNode";   
      data.path = model.treeNodeSpec.customizations.classes.fullpath;
      this.connection.send(JSON.stringify(data));
    },
   }
}
</script>

<template>
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 16 16"
   fill="currentColor"
   @click="Unlock(model)">
   <title>unlock object</title>
    <g
     id="object-locked"
     transform="translate(-195,-981.36218)">
    <path
       style="opacity:0;fill:none"
       d="m 195,981.36218 h 16 v 16 h -16 z"
       id="rect31383" />
    <path
       style="opacity:1"
       d="m 198,989.36218 v 7.00002 h 10 v -7.00002 a 0.99998,0.99998 45 0 0 -0.99998,-0.99998 h -8.00004 A 0.99998,0.99998 135 0 0 198,989.36218 Z"
       id="path31387" />
    <path
       id="rect31389"
       d="m 199,986.3622 v 2 h 2 v -2 c 0,-1.108 0.892,-2 2,-2 1.108,0 2,0.892 2,2 v 2 h 2 v -2 c 0,-2.3808 -1.6025,-4 -4,-4 -2.3975,0 -4,1.68965 -4,4 z"
       style="opacity:1" />
  </g>
  </svg>
</template>