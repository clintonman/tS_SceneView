<script>
export default {
   props: ['connection', 'model'],
   methods: {
      Lock(model){
      model.treeNodeSpec.customizations.classes.locked = "yes";
      let data = {};
      data.command = "LockNode";   
      data.path = model.treeNodeSpec.customizations.classes.fullpath;
      this.connection.send(JSON.stringify(data));
    }
   }
}
</script>

<template>
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" 
      fill="currentColor"
      style="fill:green;" @click="Lock(model)">
    <g
     transform="translate(-195,-961.3622)"
     id="object-unlocked">
    <path
       id="rect31373"
       d="m 195,449 h 16 v 16 h -16 z"
       style="opacity:0;fill:none"
       transform="translate(0,512.3622)" />
    <path
       style="opacity:1"
       d="m 198,969.3622 v 7 h 10 v -7 a 1,1 45 0 0 -1,-1 h -8 a 1,1 135 0 0 -1,1 z"
       id="rect31375" />
    <path
       id="rect31389"
       d="m 204,966.3622 v 2 h 2 v -2 c 0,-1.108 0.49516,-2 1.5,-2 1.00484,0 1.5,0.892 1.5,2 v 2 h 2 v -2 c 0,-2.3808 -1.34322,-4 -3.5,-4 -2.15678,0 -3.5,1.68965 -3.5,4 z"
       style="opacity:1" />
  </g>
  </svg>
</template>