import { Delta } from '@vueup/vue-quill'

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
    GetPathSelection(){
      let matchArr = this.$refs.mytree.getMatching((themodel)=>{
        return themodel.treeNodeSpec.state.selected;
      });
      let sel = [];
      if(matchArr.length > 0) {
        for(let i=0;i<matchArr.length;i++) {
          sel.push(matchArr[i].treeNodeSpec.customizations.classes.fullpath);
        }
      }
      return sel;
    },
    Group3DSelect(item, connection) {
      let data = {};
      data.command = "Group3DSelect";
      let sel = this.GetPathSelection();
      //remove context item(the parent) if it is in the selected items list
      data.subobj = sel.filter(chk=>{
        return chk != item.treeNodeSpec.customizations.classes.fullpath;
      });
      // add item to selection
      data.subobj.push(item.treeNodeSpec.customizations.classes.fullpath);

      connection.send(JSON.stringify(data));
    },
    GroupSelect(item, connection) {
      let data = {};
      data.command = "GroupSelect";
      let sel = this.GetPathSelection();
      //remove context item(the parent) if it is in the selected items list
      data.subobj = sel.filter(chk=>{
        return chk != item.treeNodeSpec.customizations.classes.fullpath;
      });
      // add item to selection
      data.subobj.push(item.treeNodeSpec.customizations.classes.fullpath);

      connection.send(JSON.stringify(data));
    },
    UnGroup(item, connection) {
      let data = {};
      data.command = "UnGroup";
      let sel = this.GetPathSelection();
      //remove context item if it is in the selected items list
      data.subobj = sel.filter(chk=>{
        return chk != item.treeNodeSpec.customizations.classes.fullpath;
      });
      // add item to selection
      data.subobj.push(item.treeNodeSpec.customizations.classes.fullpath);

      data.root = this.model[0].treeNodeSpec.customizations.classes.fullpath;
      data.doParentChild = this.doParentChild;
      data.doJointHeirarchy = this.doJointHeirarchy;
      connection.send(JSON.stringify(data));
    },
    UnGroup3D(item, connection) {
      let data = {};
      data.command = "UnGroup3D";
      let sel = this.GetPathSelection();
      //remove context item if it is in the selected items list
      data.subobj = sel.filter(chk=>{
        return chk != item.treeNodeSpec.customizations.classes.fullpath;
      });
      // add item to selection
      data.subobj.push(item.treeNodeSpec.customizations.classes.fullpath);

      data.root = this.model[0].treeNodeSpec.customizations.classes.fullpath;
      data.doParentChild = this.doParentChild;
      data.doJointHeirarchy = this.doJointHeirarchy;
      connection.send(JSON.stringify(data));
    },
    Parent(item, connection) {
      // let matchArr = this.$refs.mytree.getMatching((themodel)=>{
      let matchArr = this.$refs.mytree.getMatching((themodel)=>{
        return themodel.treeNodeSpec.state.selected;
      });
      let data = {};
      let children = [];
      if(matchArr.length >= 1) {
        for(let i=0;i<matchArr.length;i++) {
          children.push(matchArr[i].treeNodeSpec.customizations.classes.fullpath);
        }
      }
      //remove context item(the parent) if it is in the selected items list
      data.children = children.filter(chk=>{
        return chk != item.treeNodeSpec.customizations.classes.fullpath;
      });

      if(data.children.length == 0) return;

      data.parent = item.treeNodeSpec.customizations.classes.fullpath;

      //parent to self - no
      if(children[0] == data.parent) return;

      data.command = "Parent";
      data.root = this.model[0].treeNodeSpec.customizations.classes.fullpath;
      data.doParentChild = this.doParentChild;
      data.doJointHeirarchy = this.doJointHeirarchy;
      connection.send(JSON.stringify(data));
    },
    UnParent(item, connection) {
      let matchArr = this.$refs.mytree.getMatching((themodel)=>{
        return themodel.treeNodeSpec.state.selected;
      });
      let data = {};
      data.children = [];
      if(matchArr.length > 0) {
        for(let i=0;i<matchArr.length;i++) {
          data.children.push(matchArr[i].treeNodeSpec.customizations.classes.fullpath);
        }
      }
      data.children.push(item.treeNodeSpec.customizations.classes.fullpath);
      //remove duplicate entries
      data.children = [...new Set(data.children)];

      data.command = "UnParent";
      console.log(this.model)
      data.root = this.model[0].treeNodeSpec.customizations.classes.fullpath;
      data.doParentChild = this.doParentChild;
      data.doJointHeirarchy = this.doJointHeirarchy;
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
        // data.selection.push({fullpath: matchArr[0].children[i].treeNodeSpec.customizations.classes.fullpath});
        data.selection.push(matchArr[0].children[i].treeNodeSpec.customizations.classes.fullpath);
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
        data.command = "SelectItems";
        data.selection = [];
        data.selection.push(matchArr[0].treeNodeSpec.customizations.classes.fullpath);
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
          // data.selection.push({fullpath: matchArr[i].treeNodeSpec.customizations.classes.fullpath});
          data.selection.push(matchArr[i].treeNodeSpec.customizations.classes.fullpath);
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
    Rename() {
      this.lastselection.label = this.lastselectionlabel;

      this.shownameedit = false;
      let data = {};
      data.command = "RenameItem";
      data.id = this.lastselection.id;
      data.oldpath = this.lastselection.treeNodeSpec.customizations.classes.fullpath;
      data.newname = this.lastselection.label;
      this.connection.send(JSON.stringify(data));
    },
    cancelnameedit(){
      this.shownameedit = false;
    },

    handleClick1(event, item) {
      console.log("handleclick1", event)
      console.log("handleclick1", item)
      // console.log(this.$refs.vueSimpleContextMenu1)
      
      this.$refs.vueSimpleContextMenu1.showMenu(event, item);
    },
    optionClicked1(event) {
      // console.log(event)
      //console.log(event.item.label)
      //console.log(event.item.treeNodeSpec.customizations.classes.fullpath)
      //console.log(event.option.slug)

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
      if(event.option.slug == "parent") {
        this.Parent(event.item, this.connection, this.$refs.mytree);
      }
      if(event.option.slug == "unparent") {
        this.UnParent(event.item, this.connection, this.$refs.mytree);
      }
      if(event.option.slug == "group3d") {
        this.Group3DSelect(event.item, this.connection, this.$refs.mytree);
      }
      if(event.option.slug == "group") {
        this.GroupSelect(event.item, this.connection, this.$refs.mytree);
      }
      if(event.option.slug == "ungroup") {
        this.UnGroup(event.item, this.connection, this.$refs.mytree);
      }
      if(event.option.slug == "ungroup3d") {
        this.UnGroup3D(event.item, this.connection, this.$refs.mytree);
      }
    },
    moveOptionClicked(event) {
      console.log("move", event);
      this.lastContextItem = event.item;
      console.log("item", this.lastContextItem)

      if(event.option.slug == 'parent') {
        this.DroppedParent();
      }
      if(event.option.slug == 'move2d') {
        this.Dropped2D();
      }
      if(event.option.slug == 'move3d') {
        this.Dropped3D();
      }
    },
    copyOptionClicked(event) {
      console.log("copy", event);
      this.lastContextItem = event.item;
      console.log("item", this.lastContextItem)

      if(event.option.slug == 'parentcopy') {
        this.DroppedParent();
      }
      if(event.option.slug == 'copy2d') {
        this.Dropped2D();
      }
      if(event.option.slug == 'copy3d') {
        this.Dropped3D();
      }
    },
    // always firing, cannot find way to enable-disable the @menu-closed
    // based on https://github.com/andymark-by/click-outside-vue3#readme
    // still can't figure it
    refreshTree() {
      console.log("refreshtree dropisactive", this.dropIsActive)
      if(this.dropIsActive) {
        let mydata = {};
        mydata.command = "GetSceneTree3";
        mydata.root = this.model[0].treeNodeSpec.customizations.classes.fullpath;
        mydata.doParentChild = this.doParentChild;
        mydata.doJointHeirarchy = this.doJointHeirarchy;

        //send expanded nodes list so can keep open on load fresh
        let matchArr = this.$refs.mytree.getMatching((themodel)=>{
          return themodel.treeNodeSpec.state.expanded;
        });

        mydata.expandedNodes = matchArr.map(el => el.treeNodeSpec.customizations.classes.fullpath);
        if(mydata.expandedNodes && mydata.expandedNodes[0] === undefined) {
          mydata.expandedNodes.shift();
        }

        this.connection.send(JSON.stringify(mydata));
      }
      this.dropIsActive = false;
    },
    editname(model,e) {
      console.log("editname")
      console.log(e)
      console.log(this.lastselection)
      this.shownameedit = true;
      this.edittop = e.pageY;
      this.editleft = e.pageX;
    },
    //TEST for scene level only first
    GetTreeToSelected() {
      let mydata = {};
      mydata.command = "GetSceneTreeToSelection";
      mydata.root = "current_scene";
      mydata.doParentChild = this.doParentChild;
      mydata.doJointHeirarchy = this.doJointHeirarchy;
      this.connection.send(JSON.stringify(mydata));
    },
    GetScene() {
      // this.connection.send('{ "command" : "GetSceneTree3", "root": "current_scene" }');
      let mydata = {};
      mydata.command = "GetSceneTree3";
      mydata.root = "current_scene";
      mydata.doParentChild = this.doParentChild;
      mydata.doJointHeirarchy = this.doJointHeirarchy;
      //send expanded nodes list so can keep open on load fresh
      let matchArr = this.$refs.mytree.getMatching((themodel)=>{
        return themodel.treeNodeSpec.state.expanded;
      });
      // console.log("expanded", matchArr)

      mydata.expandedNodes = matchArr.map(el => el.treeNodeSpec.customizations.classes.fullpath);
      if(mydata.expandedNodes && mydata.expandedNodes[0] === undefined) {
        mydata.expandedNodes.shift();
      }

      // console.log("expanded", mydata.expandedNodes)
      this.connection.send(JSON.stringify(mydata));
    },
    GetRoot() {
      // this.connection.send('{ "command" : "GetSceneTree3", "root": "/" }');
      let mydata = {};
      mydata.command = "GetSceneTree3";
      mydata.root = "/";
      mydata.doParentChild = this.doParentChild;
      mydata.doJointHeirarchy = this.doJointHeirarchy;
      //send expanded nodes list so can keep open on load fresh
      let matchArr = this.$refs.mytree.getMatching((themodel)=>{
        return themodel.treeNodeSpec.state.expanded;
      });
      mydata.expandedNodes = matchArr.map(el => el.treeNodeSpec.customizations.classes.fullpath);
      if(mydata.expandedNodes && mydata.expandedNodes[0] === undefined) {
        mydata.expandedNodes.shift();
      }
      // console.log(mydata.expandedNodes)
      //special case switch from scene root to actual root
      if(mydata.expandedNodes.length !== 0) {
        for(let anode of mydata.expandedNodes) {
          if(anode.match("/Project")) {
            mydata.expandedNodes.push("/Project");
            break;
  
          }
        }
      }
      
      console.log(mydata.expandedNodes)
      this.connection.send(JSON.stringify(mydata));
    },

    OrderNodes() {
      console.log("order nodes");
      console.log(this.alphaOrder);
      this.ReOrder(this.model[0]);
    },
    ReOrder(parentnode) {
      if(parentnode.children && parentnode.children.length > 0) {
        this.ReOrderChildren(parentnode.children);
      } else {
        return;
      }
      for(let i=0;i<parentnode.children.length;i++) {
        this.ReOrder(parentnode.children[i]);
      }
    },
    ReOrderChildren(children) {
      if(this.alphaOrder == "ALPHA") {
        children.sort((a,b) =>{
           if (a.label < b.label) {
              return -1;
            }
            if (a.label >  b.label) {
              return 1;
            }
            // a must be equal to b
            return 0;
        });
      } else if(this.alphaOrder == "ID") {
        children.sort((a,b) =>{
          if (a.id < b.id) {
            return -1;
          }
          if (a.id >  b.id) {
            return 1;
          }
          // a must be equal to b
          return 0;
        });
      } else if(this.alphaOrder == "TYPE") {
        children.sort((a,b) =>{
          if (a.treeNodeSpec.customizations.classes.type < b.treeNodeSpec.customizations.classes.type) {
            return -1;
          }
          if (a.treeNodeSpec.customizations.classes.type >  b.treeNodeSpec.customizations.classes.type) {
            return 1;
          }
          // a must be equal to b
          return 0;
        });
      }
    },
    SetLabelWidth(){
      document.documentElement.style.setProperty("--namewidth", `${this.nameWidth}em`);
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

    Dropped(event, model) {
      this.dropIsActive = true;
      console.log(event)
      console.log(model)

      console.log("ctrl",event.ctrlKey)
      console.log("path", event.path)
      // console.log(event.dataTransfer.getData("text/plain"))
      let dropData = event.dataTransfer.getData("text/plain");
      let dropDataArr = JSON.parse(dropData)
      console.log("source",dropDataArr.id)
      console.log("source",dropDataArr.treeNodeSpec.customizations.classes.fullpath)
      console.log("destination", event.path[3].id.split("-")[2])

      //TODO popup to choose parent, 2D, 3D or parent, 2D, 3D with copy when ctrl pressed
      //TODO send message to tS to perform actual action
      //TODO send update info back from tS so no need relaod everything
      // let mydata = {};
      // mydata.command = "DoDropped";
      // mydata.sourcepath = dropDataArr.treeNodeSpec.customizations.classes.fullpath;
      // mydata.destinationid = event.path[3].id.split("-")[2];
      // mydata.treeroot = this.model[0].treeNodeSpec.customizations.classes.fullpath;

      this.dataForTS = {};
      this.dataForTS.command = "DoDropped";
      this.dataForTS.sourcepath = dropDataArr.treeNodeSpec.customizations.classes.fullpath;
      this.dataForTS.destinationid = event.path[3].id.split("-")[2];
      this.dataForTS.treeroot = this.model[0].treeNodeSpec.customizations.classes.fullpath;
      this.dataForTS.ctrlKey = event.ctrlKey;

      if(event.ctrlKey) {
        this.$refs.vueSimpleContextCopyMenu.showMenu(event, model);
      } else {
        this.$refs.vueSimpleContextMoveMenu.showMenu(event, model);
      }

      // mydata.droptype = "parent";//parent, 2d, 3d
      // mydata.copy = event.ctrlKey;
      //this.connection.send(JSON.stringify(mydata));
    },
    DroppedParent() {
      this.dropIsActive = false;
      this.dataForTS.droptype = "parent";//parent, 2d, 3d
      // copy parent
      //temp always pass because of parent with child issue
      //if(this.dataForTS.ctrlKey) {
        this.dataForTS.root = this.model[0].treeNodeSpec.customizations.classes.fullpath;
        this.dataForTS.doParentChild = this.doParentChild;
        this.dataForTS.doJointHeirarchy = this.doJointHeirarchy;
      //}
      this.connection.send(JSON.stringify(this.dataForTS));
    },
    Dropped2D() {
      this.dropIsActive = false;
      this.dataForTS.droptype = "2d";//parent, 2d, 3d

      this.dataForTS.root = this.model[0].treeNodeSpec.customizations.classes.fullpath;
      this.dataForTS.doParentChild = this.doParentChild;
      this.dataForTS.doJointHeirarchy = this.doJointHeirarchy;

      let matchArr = this.$refs.mytree.getMatching((themodel)=>{
        return themodel.treeNodeSpec.state.expanded;
      });
      this.dataForTS.expandedNodes = matchArr.map(el => el.treeNodeSpec.customizations.classes.fullpath);
      if(this.dataForTS.expandedNodes && this.dataForTS.expandedNodes[0] === undefined) {
        this.dataForTS.expandedNodes.shift();
      }
      //add target to expanded nodes list - note may be in the list already
      this.dataForTS.expandedNodes.push(this.lastContextItem.treeNodeSpec.customizations.classes.fullpath);

      this.connection.send(JSON.stringify(this.dataForTS));
    },
    Dropped3D() {
      this.dropIsActive = false;
      this.dataForTS.droptype = "3d";//parent, 2d, 3d

      this.dataForTS.root = this.model[0].treeNodeSpec.customizations.classes.fullpath;
      this.dataForTS.doParentChild = this.doParentChild;
      this.dataForTS.doJointHeirarchy = this.doJointHeirarchy;

      let matchArr = this.$refs.mytree.getMatching((themodel)=>{
        return themodel.treeNodeSpec.state.expanded;
      });
      this.dataForTS.expandedNodes = matchArr.map(el => el.treeNodeSpec.customizations.classes.fullpath);
      if(this.dataForTS.expandedNodes && this.dataForTS.expandedNodes[0] === undefined) {
        this.dataForTS.expandedNodes.shift();
      }
      //add target to expanded nodes list - note may be in the list already
      this.dataForTS.expandedNodes.push(this.lastContextItem.treeNodeSpec.customizations.classes.fullpath);

      this.connection.send(JSON.stringify(this.dataForTS));
    },

   SendGroup(data) {
      console.log("sendgroup")
      //add name here
      //this.dataForTS...
      //this.connection.send(JSON.stringify(data));
   }
}