export default {
   DisplaySceneTree3(mydata) {
      console.log(mydata.data.model)

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
   }
 }