<script>
export default {
   props: ['connection', 'model'],
   methods: {
    ShowNode(model){
      this.$emit('onShow', model);
      // console.log("show")
      // model.treeNodeSpec.customizations.classes.visible = "yes";
      // let data = {};
      // data.command = "ShowNode";   
      // data.path = model.treeNodeSpec.customizations.classes.fullpath;

      // //if ora created need to update tree
      // data.root = this.model[0].treeNodeSpec.customizations.classes.fullpath;
      // data.doParentChild = this.doParentChild;
      // data.doJointHeirarchy = this.doJointHeirarchy;

      // //send expanded nodes list so can keep open on load fresh
      // let matchArr = this.$refs.mytree.getMatching((themodel)=>{
      //   return themodel.treeNodeSpec.state.expanded;
      // });

      // data.expandedNodes = matchArr.map(el => el.treeNodeSpec.customizations.classes.fullpath);
      // if(data.expandedNodes && data.expandedNodes[0] === undefined) {
      //   data.expandedNodes.shift();
      // }

      // this.connection.send(JSON.stringify(data));
    }
   }
}
</script>

<template>
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 16 16"
      fill="currentColor"
      @click="ShowNode(model)">
    <g
     transform="translate(-165,-981.36218)"
     id="object-hidden">
    <path
       id="rect31330"
       d="m 165,981.36218 h 16 v 16 h -16 z"
       style="opacity:0;fill:none" />
    <path
       id="path844"
       style="fill-rule:nonzero;stroke:none;stroke-width:2.035"
       d="m 166.03467,987.61237 c 0.58372,2.17848 3.04831,4.74562 6.96754,4.75413 3.91481,-0.009 6.3794,-2.57565 6.96312,-4.75413 a 1.0175,1.0175 0 1 0 -1.96566,-0.5267 c -0.32882,1.22721 -1.91757,3.23913 -4.99746,3.24583 -3.08431,-0.007 -4.67306,-2.01862 -5.00188,-3.24583 a 1.0175,1.0175 0 1 0 -1.96566,0.5267 z" />
    <path
       style="fill-rule:nonzero;stroke:none;stroke-width:2;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
       d="m 174.01572,994.36218 v -3 a 1.0157248,1.0157248 0 1 0 -2.03144,0 v 3 a 1.0157248,1.0157248 0 1 0 2.03144,0 z"
       id="path859" />
    <path
       style="fill-rule:nonzero;stroke:none;stroke-width:2.03145;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
       d="m 178.36482,964.30517 -2,2.24003 c -0.90198,1.01023 0.61336,2.36319 1.51534,1.35296 l 2,-2.24003 c 0.90198,-1.01023 -0.61336,-2.36319 -1.51534,-1.35296 z m -10.48466,0 2,2.24003 c 0.90198,1.01023 -0.61336,2.36319 -1.51534,1.35296 l -2,-2.24003 c -0.90198,-1.01023 0.61336,-2.36319 1.51534,-1.35296 z"
       id="path853"
       transform="matrix(-1,0,0,-0.969277,346.12249,1927.6967)" />
  </g>
  </svg>
</template>