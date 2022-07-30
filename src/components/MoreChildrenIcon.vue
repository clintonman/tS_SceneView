<script>
export default {
   props: ['connection', 'customClasses', 'doParentChild', 'doJointHeirarchy'],
   methods: {
       GetTreeBranch(tsnode, depth){
      // console.log("load branch", tsnode);
      let data = {};
      data.command = "GetTreeBranch";
      data.root = tsnode;
      data.startdepth = depth;
      
      data.doParentChild = this.doParentChild;
      data.doJointHeirarchy = this.doJointHeirarchy;
      data.nurbscpselectauto = this.nurbscpselectauto;
      console.log("GetTreeBranch", this.doParentChild, this.doJointHeirarchy);
      this.connection.send(JSON.stringify(data));
    },
   }
}
</script>
<template>
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 18 18"
   fill="currentColor"
   @click="GetTreeBranch(customClasses.fullpath, customClasses.treedepth)">
    <g
     id="xml-attribute-delete"
     transform="matrix(0.666667,0,0,0.666667,-797.33333,-371.57479)">
    <path
       style="opacity:0;fill:none"
       d="m 1196,557.36218 h 24 v 24 h -24 z"
       id="rect21940" />
    <path
       style="opacity:1"
       d="m 1196,557.36218 h 1 v 24 h -1 z"
       id="rect21942" />
    <path
       style="opacity:1"
       d="m 1196,557.36218 h 24 v 1 h -24 z"
       id="rect21944" />
    <path
       style="opacity:1"
       d="m 1196,580.36218 h 24 v 1 h -24 z"
       id="rect21946" />
    <path
       style="opacity:1"
       d="m 1219,557.36218 h 1 v 24 h -1 z"
       id="rect21948" />
    <path
       id="rect21982"
       d="m 1199,562.3622 v 3 h 3 v -3 z m 1,1 h 1 v 1 h -1 z"
       style="opacity:1" />
    <path
       style="opacity:1"
       d="m 1200,565.36218 h 1 v 8.00001 h -1 z"
       id="rect21986" />
    <path
       style="opacity:1"
       d="m 1201,568.36218 h 6 v 1 h -6 z"
       id="rect21988" />
    <path
       style="opacity:1"
       d="m 1200,573.36218 h 7 v 1 h -7 z"
       id="rect21990" />
    <path
       id="rect21992"
       d="m 1207,566.3622 v 4 h 10 v -4 z m 1,1 h 8 v 2 h -8 z"
       style="opacity:1" />
    <path
       id="rect21994"
       d="m 1207,571.3622 v 4 h 10 v -4 z m 1,1 h 8 v 2 h -8 z"
       style="opacity:1" />
  </g>
  </svg>
</template>