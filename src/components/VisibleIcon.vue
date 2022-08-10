<script>
export default {
   props: ['connection', 'model', 'showtitle'],
   methods: {
      HideNodeSoft(model){
      // model.treeNodeSpec.customizations.classes.visible = "no";
      this.$emit('onHideSoft', model);
      // console.log("soft hide")
      },
    HideNode(model){
      // model.treeNodeSpec.customizations.classes.visible = "no";
      this.$emit('onHide', model);

      console.log("hide")
      // let data = {};
      // data.command = "HideNode";   
      // data.path = model.treeNodeSpec.customizations.classes.fullpath;

      // //if ora created need to update tree
      // data.root = this.initialmodel[0].treeNodeSpec.customizations.classes.fullpath;
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
      @click.exact="HideNodeSoft(model)" @click.ctrl="HideNode(model)">
      <title v-if="showtitle">hide object, +ctrl intensive hide object</title>
    <g
     style="display:inline"
     id="object-visible"
     transform="matrix(1,0,0,0.969277,-165,-931.33457)">
    <path
       style="opacity:0;fill:none"
       d="m 165,961.36218 h 16 v 16 h -16 z"
       id="rect11899" />
    <path
       id="path11920"
       d="m 173,968.07679 c -1.1046,0 -2,0.92378 -2,2.0634 0,1.13954 0.8954,2.06339 2,2.06339 1.10453,0 2,-0.92385 2,-2.06339 0,-1.13962 -0.89547,-2.0634 -2,-2.0634 z"
       style="opacity:1;stroke-width:0.999996" />
    <path
       d="m 177.98438,970.14062 c 0,0.57745 -1.70278,3.14258 -4.98438,3.14258 -3.28159,0 -4.98438,-2.56516 -4.98438,-3.14258 0,-0.57739 1.70278,-3.14257 4.98438,-3.14257 3.28159,0 4.98438,2.5652 4.98438,3.14257 z m -11.96876,10e-6 c 2e-5,2.07257 3.05185,5.14257 6.98438,5.14257 3.93254,0 6.98438,-3.06999 6.98438,-5.14259 -2e-5,-2.07256 -3.05185,-5.14256 -6.98438,-5.14256 -3.93254,0 -6.98438,3.07 -6.98438,5.14258 z"
       style="fill-rule:nonzero;stroke:none;stroke-width:2.03145"
       id="path844" />
    <path
       id="path859"
       d="m 171.98428,962.91831 v 2.47839 a 1.0157248,1.0157248 0 1 0 2.03144,0 v -2.47839 a 1.0157248,1.0157248 0 1 0 -2.03144,0 z"
       style="display:inline;fill-rule:nonzero;stroke:none;stroke-width:2.03145;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" />
    <path
       transform="translate(0,1.0920465)"
       id="path853"
       d="m 177.90686,963.83411 -1.21406,1.47289 c -0.8614,1.04504 0.70616,2.33714 1.56756,1.2921 l 1.21406,-1.47289 c 0.8614,-1.04504 -0.70616,-2.33714 -1.56756,-1.2921 z m -9.81372,0 1.21406,1.47289 c 0.8614,1.04504 -0.70616,2.33714 -1.56756,1.2921 l -1.21406,-1.47289 c -0.8614,-1.04504 0.70616,-2.33714 1.56756,-1.2921 z"
       style="display:inline;fill-rule:nonzero;stroke:none;stroke-width:2.03145;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" />
  </g>
  </svg>
</template>