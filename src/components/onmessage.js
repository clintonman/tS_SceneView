export default {
   ErrorResult(mydata) {
      console.log("errors", mydata.error)
   },
   DisplaySceneTree3(mydata) {
      if(mydata.error) { console.log("errors", mydata.error); }
      this.scenepath = mydata.data.scenepath;

      this.ReOrder(mydata.data.model[0]);

      //clear data now then timout hack to get update
      this.model.splice(0, 1);
      setTimeout(() => { 
         this.model.splice(0, 1, mydata.data.model[0]); 
      }, 1);


      if(mydata.data.htmlnote != "") {
         this.htmlnote = mydata.data.htmlnote;
      }
   },
   AddToTree(mydata){
      let id = mydata.data.model[0].id;

      let matchArr = this.$refs.mytree.getMatching((themodel)=>{
         return themodel.id == id;
      });

      if(matchArr.length > 0) {
         matchArr[0].children = mydata.data.model[0].children;
         matchArr[0].treeNodeSpec.state.expanded = true;
      }

      this.ReOrder(mydata.data.model[0]);

      if(mydata.data.htmlnote != "") {
         this.htmlnote = mydata.data.htmlnote;
      }

      this.GetMaxDepthAndSetChildExpanded();
   },
   NewSelection(mydata) {
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
      }
      this.newselection = false;
   },
   RenameFailed(mydata) {
      let matchArr = this.$refs.mytree.getMatching((themodel)=>{
         return themodel.id == mydata.id;
      });
      if(matchArr[0]) {
         matchArr[0].label = mydata.oldname;
      }
   },
   TSRefresh() {
      let mydata = {};
        mydata.command = "GetSceneTree3";
        mydata.root = this.model[0].treeNodeSpec.customizations.classes.fullpath;
        mydata.doParentChild = this.doParentChild;
        mydata.doJointHeirarchy = this.doJointHeirarchy;
        mydata.nurbscpselectauto = this.nurbscpselectauto;

        //send expanded nodes list so can keep open on load fresh
      let matchArr = this.$refs.mytree.getMatching((themodel)=>{
         return themodel.treeNodeSpec.state.expanded;
       });
       mydata.expandedNodes = matchArr.map(el => el.treeNodeSpec.customizations.classes.fullpath);
       if(mydata.expandedNodes && mydata.expandedNodes[0] === undefined) {
         mydata.expandedNodes.shift();
       }

        this.connection.send(JSON.stringify(mydata));
   },
   DoGroup3D() {
      this.dataForTS = {};
      this.dataForTS.command = "Group3D";
      this.dataForTS.root = this.model[0].treeNodeSpec.customizations.classes.fullpath;
      this.dataForTS.doParentChild = this.doParentChild;
      this.dataForTS.doJointHeirarchy = this.doJointHeirarchy;

      this.showrename = true;
   },
   DoGroup() {
      this.dataForTS = {};
      this.dataForTS.command = "Group";
      this.dataForTS.root = this.model[0].treeNodeSpec.customizations.classes.fullpath;
      this.dataForTS.doParentChild = this.doParentChild;
      this.dataForTS.doJointHeirarchy = this.doJointHeirarchy;

      this.showrename = true;
   }
 }