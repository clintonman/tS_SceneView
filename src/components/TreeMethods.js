export default {
   DeleteNode(item, connection, mytree) {
      console.log("deletenode")
      console.log(item.id)

      let data = {};
      data.command = "DeleteNode";
      data.path = item.treeNodeSpec.customizations.classes.fullpath;
      connection.send(JSON.stringify(data));

      //find parent
      let matchArr = mytree.getMatching((themodel)=>{
        if(themodel.children && themodel.children.length > 0) {
          let childlength = themodel.children.length;

          for(let i=0;i<childlength;i++) {
            let child = themodel.children[i];
            if(child.id == item.id) {
              return true;
            }
          }
        }
        return false;
      });
      console.log(matchArr)
      //find index and splice remove
      let childIndex = matchArr[0].children.findIndex(child => {
        return child.id == item.id;
      });
      console.log(childIndex);
      matchArr[0].children.splice(childIndex, 1);

    },
   LEOpenLocation(item, connection) {
      let data = {};
      data.command = "LEOpenLocation";
      data.path = item.treeNodeSpec.customizations.classes.fullpath;
      connection.send(JSON.stringify(data));
    },
    LEOpenLocation2(item, connection) {
      let data = {};
      data.command = "LEOpenLocation2";
      data.path = item.treeNodeSpec.customizations.classes.fullpath;
      connection.send(JSON.stringify(data));
    },
   rangeselection(model) {
      //must be same level
      if(this.lastselection && 
        model.treeNodeSpec.customizations.classes.treedepth == this.lastselection.treeNodeSpec.customizations.classes.treedepth) {
          console.log("same level")
      } else {
        console.log("nope")
        return;
      }
      //must be same parent node
      let child1ID = this.lastselection.id;
      let child2ID = model.id;
      let matchArr = this.$refs.mytree.getMatching((themodel)=>{
        if(themodel.children && themodel.children.length > 0) {
          let childlength = themodel.children.length;
          let child1found = false;
          let child2found = false;
          for(let i=0;i<childlength;i++) {
            let child = themodel.children[i];
            if(child.id == child1ID) {
              child1found = true;
            }
            if(child.id == child2ID) {
              child2found = true;
            }
            if(child1found && child2found) {
              return true;
            }
          }
        }
        return false;
      });
      if(matchArr.length != 1) {
        return;
      }

      //use parent to get inbetween based on index of id's
      console.log(matchArr[0])
      let child1Index = matchArr[0].children.findIndex(elem => {
        return elem.id == child1ID;
      });
      let child2Index = matchArr[0].children.findIndex(elem => {
        return elem.id == child2ID;
      });

      console.log(child1Index, child2Index)
      //order the indices
      if(child1Index > child2Index) {
        let tempIndex = child2Index;
        child2Index = child1Index;
        child1Index = tempIndex;
      }

      let data = {};
      data.command = "SelectItems";
      data.selection = [];

      for(let i=child1Index;i<=child2Index;i++) {
        data.selection.push({fullpath: matchArr[0].children[i].treeNodeSpec.customizations.classes.fullpath});
        matchArr[0].children[i].treeNodeSpec.state.selected = true;
      }
      console.log(data)
      this.connection.send(JSON.stringify(data));

      return;
    },
   selectonenode(model) {
      let matchArr = this.$refs.mytree.getMatching((themodel)=>{
        let idmatch = themodel.id == model.id;
        themodel.treeNodeSpec.state.selected = false;
        return idmatch;
      });
      if(matchArr.length == 1) {
        matchArr[0].treeNodeSpec.state.selected = true;
        this.lastselection = matchArr[0];
        this.lastselectionlabel = matchArr[0].label;

        // if($scope.jointboneselection == "bone" && sel.bone != null && sel.bone != "")
        //     selobj.selecttext = sel.bonepath;
        // else
        
        let data = {};
        data.command = "SelectItem";
        data.selecttext = matchArr[0].treeNodeSpec.customizations.classes.fullpath;
        this.connection.send(JSON.stringify(data));
      }
    },
    toggleselection(model) {
      let matchArr = this.$refs.mytree.getMatching((themodel)=>{
        return themodel.id == model.id;
      });
      if(matchArr.length == 1) {
        matchArr[0].treeNodeSpec.state.selected = !matchArr[0].treeNodeSpec.state.selected;
        this.lastselection = matchArr[0];
        this.lastselectionlabel = matchArr[0].label;
      }

      matchArr = this.$refs.mytree.getMatching((themodel)=>{
        return themodel.treeNodeSpec.state.selected;
      });

      let data = {};
      data.command = "SelectItems";
      data.selection = [];
      if(matchArr.length > 0) {
        for(let i=0;i<matchArr.length;i++) {
          data.selection.push({fullpath: matchArr[i].treeNodeSpec.customizations.classes.fullpath});
        }
      }
        
      this.connection.send(JSON.stringify(data));
      console.log(data)
    },
    GetMaxDepthAndSetChildExpanded() {
      // note when de-expand the children will remain expanded so visual depth not one to one with expanded state
      if(this.newselection) return;
      console.log("GetMaxDepthAndSetChildExpanded")
      var maxval = -1;
      //getMatching does not include the root node of the tree
      let matchArr = this.$refs.mytree.getMatching((themodel)=>{
        if(!themodel.treeNodeSpec.customizations.classes) {
          console.log("no classes")
          return false;
        }
        if(themodel.treeNodeSpec.customizations.classes.treedepth) {
          if(!themodel.treeNodeSpec.state.expanded && themodel.children) {
            let childlength = themodel.children.length;
            if(childlength > 0) {
              for(let i=0;i<childlength;i++) {
                let child = themodel.children[i];
                child.treeNodeSpec.state.expanded = false;
              }
            }
          }
          let td = themodel.treeNodeSpec.customizations.classes.treedepth;
          // console.log(themodel.label, td, themodel.treeNodeSpec.state.expanded)
          if(td > maxval && themodel.treeNodeSpec.state.expanded) maxval = td;
        }
        return false;
      });
      if(maxval == -1) {
        this.maxdepth = 1;
      } else {
        this.maxdepth = maxval + 1;
      }
    },
    testinput() {
      // console.log("testinput")
      // console.log(this.lastselectionlabel)
      // console.log(this.lastselection.label)
      this.lastselection.label = this.lastselectionlabel;

      this.shownameedit = false;
      let data = {};
      data.command = "RenameItem";   
      data.oldpath = this.lastselection.treeNodeSpec.customizations.classes.fullpath;
      data.newname = this.lastselection.label;
      this.connection.send(JSON.stringify(data));
    },
    cancelnameedit(){
      this.shownameedit = false;
    },

    handleClick1(event, item) {
      // console.log("handleclick1", event)
      // console.log("handleclick1", item)
      // console.log(this.$refs.vueSimpleContextMenu1)
      this.$refs.vueSimpleContextMenu1.showMenu(event, item);
    },
    optionClicked1(event) {
      // console.log(event)
      console.log(event.item.label)
      console.log(event.item.treeNodeSpec.customizations.classes.fullpath)
      console.log(event.option.slug)
      // window.alert(JSON.stringify(event));
      if(event.option.slug == "delete") {
        this.DeleteNode(event.item, this.connection, this.$refs.mytree);
      }
      if(event.option.slug == "leopento") {
        this.LEOpenLocation2(event.item, this.connection);
      }
      if(event.option.slug == "openinle") {
        this.LEOpenLocation(event.item, this.connection);
      }
    },
    doReport() {
      console.log("hi")
    },
    doReport2(label, nodetype) {
      console.log(label, nodetype)
    },
    editname(model,e) {
      console.log("editname")
      console.log(e)
      console.log(this.lastselection)
      this.shownameedit = true;
      this.edittop = e.pageY;
      this.editleft = e.pageX;
    },
    refreshSelectedList() {
      let sel = this.$refs.mytree.getSelected();
      console.log(sel);
    },
   
    GetScene() {
      // this.model.length = 0
      this.connection.send('{ "command" : "GetSceneTree3", "root": "current_scene" }');
    },
    GetRoot() {
      // this.model.length = 0
      this.connection.send('{ "command" : "GetSceneTree3", "root": "/" }');
    },
   ShowEditor(tsnode, model) {
      this.showNoteEditor=true;
      this.tsnode = tsnode;
      this.mycontent = new Delta([]);
      model.treeNodeSpec.state.selected = true;
    },
   CloseNoteEditor(html) {
    console.log("closenoteeditor")
    this.showNoteEditor=false;
    if(html) {
      this.htmlnote = html;
    }
   },
   
    ShowTest() {
      let id=280799308;
      // console.log(this.$refs.mytree.getSelected());
      // let rbNodes = this.$refs.mytree.getSelected();
      let matchArr = this.$refs.mytree.getMatching((themodel)=>{
        // console.log(themodel)
        return themodel.id == id;
      });
      console.log(matchArr);
    },
    ListModel(){
      console.log(this.model)
    }
}