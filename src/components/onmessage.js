export default {
   DisplaySceneTree3(mydata) {
      console.log(mydata.data.model)

      this.ReOrder(mydata.data.model[0]);

      //clear data now then timout hack to get update
      this.model.splice(0, 1);
      setTimeout(() => { 
         this.model.splice(0, 1, mydata.data.model[0]); 
      }, 1);


      if(mydata.data.htmlnote != "") {
         this.htmlnote = mydata.data.htmlnote;
      }
      //only good for first load, so also called in update but still issue switching root
      // this.GetMaxDepthAndSetChildExpanded();
   },
   AddToTree(mydata){
      // console.log(mydata.data.model)

      let id = mydata.data.model[0].id;
      // console.log(id);

      this.ReOrder(mydata.data.model[0]);

      let matchArr = this.$refs.mytree.getMatching((themodel)=>{
         return themodel.id == id;
      });

      if(matchArr.length > 0) {
         console.log(mydata.data.model[0].children)
         matchArr[0].children = mydata.data.model[0].children;
         matchArr[0].treeNodeSpec.state.expanded = true;
         // console.log(matchArr[0]);
      }

      if(mydata.data.htmlnote != "") {
         this.htmlnote = mydata.data.htmlnote;
      }

      this.GetMaxDepthAndSetChildExpanded();
   },
   NewSelection(mydata) {
      console.log(mydata.selection);
      this.newselection = true;
      //clear selection
      let matchArr = this.$refs.mytree.getMatching((themodel)=>{
        themodel.treeNodeSpec.state.selected = false;
        return false;
      });

      if(mydata.selection.length == 0) return;
      //do selection
      for(let i=0;i<mydata.selection.length;i++) {
        var id = mydata.selection[i].id;
        let matchArr = this.$refs.mytree.getMatching((themodel)=>{
          if(themodel.id == id) {
            themodel.treeNodeSpec.state.selected = true;
          }
          return themodel.id == id;
        });
        console.log(matchArr)
      }
      this.newselection = false;
   },
   RenameFailed(mydata) {
      // var id = mydata.id;
      let matchArr = this.$refs.mytree.getMatching((themodel)=>{
         return themodel.id == mydata.id;
      });
      if(matchArr[0]) {
         matchArr[0].label = mydata.oldname;
      }
   },
   TSRefresh() {
      console.log("TSRefresh")
      let mydata = {};
        mydata.command = "GetSceneTree3";
        mydata.root = this.model[0].treeNodeSpec.customizations.classes.fullpath;
        mydata.doParentChild = this.doParentChild;
        mydata.doJointHeirarchy = this.doJointHeirarchy;
        this.connection.send(JSON.stringify(mydata));
   },
   DoGroup3D() {
      console.log("DoGroup3D")
      let data = {};
      data.command = "Group3D";
      data.root = this.model[0].treeNodeSpec.customizations.classes.fullpath;
      data.doParentChild = this.doParentChild;
      data.doJointHeirarchy = this.doJointHeirarchy;
      this.connection.send(JSON.stringify(data));
   },
   DoGroup() {
      console.log("DoGroup")
      let data = {};
      data.command = "Group";
      data.root = this.model[0].treeNodeSpec.customizations.classes.fullpath;
      data.doParentChild = this.doParentChild;
      data.doJointHeirarchy = this.doJointHeirarchy;
      this.connection.send(JSON.stringify(data));
   }
 }