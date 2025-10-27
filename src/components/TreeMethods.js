import { Delta } from '@vueup/vue-quill'

export default {
   DeleteNode(item, connection, mytree) {

      let data = {};
      data.command = "DeleteNode";

      let sel = this.GetPathSelection();
      //remove context item if it is in the selected items list
      data.nodelist = sel.filter(chk=>{
        return chk != item.treeNodeSpec.customizations.classes.fullpath;
      });
      // add item to selection
      data.nodelist.push(item.treeNodeSpec.customizations.classes.fullpath);

      // if not in scene or is the scene get confirmation

      let scenepathArr = this.scenepath.split("/")
      let outsideFound = false;

      data.nodelist.forEach(node => {
        let nodeArr = node.split("/");
        if(nodeArr.length < 3 || node == this.scenepath) {
          outsideFound = true;
        } else {
          if(nodeArr[1] != scenepathArr[1] || nodeArr[2] != scenepathArr[2]) {
            outsideFound = true;
          }
        }
      });

      if(outsideFound) {
        if(!window.confirm("Are you sure?")) {
          return;
        }
      }

      data.root = this.model[0].treeNodeSpec.customizations.classes.fullpath;
      data.doParentChild = this.doParentChild;
      data.doJointHeirarchy = this.doJointHeirarchy;

      //send expanded nodes list so can keep open on load fresh
      let matchArr = this.$refs.mytree.getMatching((themodel)=>{
        return themodel.treeNodeSpec.state.expanded;
      });

      data.expandedNodes = matchArr.map(el => el.treeNodeSpec.customizations.classes.fullpath);
      if(data.expandedNodes && data.expandedNodes[0] === undefined) {
        data.expandedNodes.shift();
      }

      connection.send(JSON.stringify(data));

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

      data.nurbscpselectauto = this.nurbscpselectauto;

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

      data.nurbscpselectauto = this.nurbscpselectauto;

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
      if(data.children[0] == data.parent) {
        return;
      }

      data.command = "Parent";
      data.root = this.model[0].treeNodeSpec.customizations.classes.fullpath;
      data.doParentChild = this.doParentChild;
      data.doJointHeirarchy = this.doJointHeirarchy;
      data.nurbscpselectauto = this.nurbscpselectauto;
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

      data.root = this.model[0].treeNodeSpec.customizations.classes.fullpath;
      data.doParentChild = this.doParentChild;
      data.doJointHeirarchy = this.doJointHeirarchy;
      connection.send(JSON.stringify(data));
    },
   rangeselection(model) {
      //must be same level
      if(this.lastselection && 
        model.treeNodeSpec.customizations.classes.treedepth == this.lastselection.treeNodeSpec.customizations.classes.treedepth) {
      } else {
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

      let child1Index = matchArr[0].children.findIndex(elem => {
        return elem.id == child1ID;
      });
      let child2Index = matchArr[0].children.findIndex(elem => {
        return elem.id == child2ID;
      });

      //order the indices
      if(child1Index > child2Index) {
        let tempIndex = child2Index;
        child2Index = child1Index;
        child1Index = tempIndex;
      }

      let data = {};
      data.command = "SelectItems";
      data.nurbscpselectauto = this.nurbscpselectauto;
      data.selection = [];

      for(let i=child1Index;i<=child2Index;i++) {
        // data.selection.push({fullpath: matchArr[0].children[i].treeNodeSpec.customizations.classes.fullpath});
        data.selection.push(matchArr[0].children[i].treeNodeSpec.customizations.classes.fullpath);
        matchArr[0].children[i].treeNodeSpec.state.selected = true;
      }

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
        
        let data = {};
        data.command = "SelectItems";
        data.nurbscpselectauto = this.nurbscpselectauto;
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
      data.nurbscpselectauto = this.nurbscpselectauto;
      data.selection = [];
      if(matchArr.length > 0) {
        for(let i=0;i<matchArr.length;i++) {
          data.selection.push(matchArr[i].treeNodeSpec.customizations.classes.fullpath);
        }
      }
        
      this.connection.send(JSON.stringify(data));
    },
    GetMaxDepthAndSetChildExpanded() {
      // note when de-expand the children will remain expanded so visual depth not one to one with expanded state
      if(this.newselection) return;
      var maxval = -1;
      //getMatching does not include the root node of the tree
      let matchArr = this.$refs.mytree.getMatching((themodel)=>{
        if(!themodel.treeNodeSpec.customizations.classes) {
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
      this.lastContextEvent = event;
      this.$refs.vueSimpleContextMenu1.showMenu(event, item);
    },
    optionClicked1(event) {
      this.lastContextItem = event.item;

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
      // clear timeout from menu close, if no menu choice timeout would run refreshing the tree view
      clearTimeout(this.timerID);

      this.lastContextItem = event.item;

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
    // always firing, cannot find way to enable-disable the @menu-closed
    // based on https://github.com/andymark-by/click-outside-vue3#readme
    // do refresh tree after 500ms of closing the context menu
    // cancel timeout if a context selection is made
    menuClosed() {
      if(this.dropIsActive) {
        this.timerID = setTimeout(()=>{
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

        }, 500);
      }
      this.dropIsActive = false;
    },
    editname(e) {
      this.shownameedit = true;
      this.edittop = e.pageY;
      this.editleft = e.pageX;
    },
    GetTreeToSelected() {
      let mydata = {};
      mydata.command = "GetSceneTree3";
      mydata.toselection = true;
      mydata.root = this.model[0].treeNodeSpec.customizations.classes.fullpath;
      if(!mydata.root) {
        mydata.root = "/";
      }
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
    GetScene() {
      let mydata = {};
      mydata.command = "GetSceneTree3";
      mydata.root = "current_scene";
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
    GetRoot() {
      let mydata = {};
      mydata.command = "GetSceneTree3";
      mydata.root = "/";
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
      //special case switch from scene root to actual root
      if(mydata.expandedNodes.length !== 0) {
        for(let anode of mydata.expandedNodes) {
          if(anode.match("/Project")) {
            mydata.expandedNodes.push("/Project");
            break;
  
          }
        }
      }
      
      this.connection.send(JSON.stringify(mydata));
    },
    RefreshTree() {
      if(this.model[0].treeNodeSpec.customizations.classes.fullpath) {
        this.GetScene();
      } else {
        this.GetRoot();
      }
    },

    OrderNodes() {
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
    this.showNoteEditor=false;
    if(html) {
      this.htmlnote = html;
    }
   },

    Dropped(event, model) {
      this.dropIsActive = true;
      
      let dropData = event.dataTransfer.getData("text/plain");
      let dropDataArr = JSON.parse(dropData)

      this.dataForTS = {};
      this.dataForTS.command = "DoDropped";
      this.dataForTS.sourcepath = dropDataArr.treeNodeSpec.customizations.classes.fullpath;
      
      // this.dataForTS.destinationid = event.path[3].id.split("-")[2];
      this.dataForTS.destinationid = event.target.parentNode.parentNode.parentNode.id.split("-")[2];

      this.dataForTS.treeroot = this.model[0].treeNodeSpec.customizations.classes.fullpath;
      this.dataForTS.ctrlKey = event.ctrlKey;

      this.$refs.vueSimpleContextMoveMenu.showMenu(event, model);
    },
    DroppedParent() {
      this.dropIsActive = false;
      this.dataForTS.droptype = "parent";//parent, 2d, 3d

      this.dataForTS.root = this.model[0].treeNodeSpec.customizations.classes.fullpath;
      this.dataForTS.doParentChild = this.doParentChild;
      this.dataForTS.doJointHeirarchy = this.doJointHeirarchy;

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
    onNodeRenamed(newName) {
      this.showrename = false;
      if(!newName) {
        return;
      }
      this.SendGroup(newName);
    },

   SendGroup(data) {
      //add name here
      this.dataForTS.groupName = data;
      this.connection.send(JSON.stringify(this.dataForTS));
   },
   HideNode(model) {
    model.treeNodeSpec.customizations.classes.visible = "no";
    let data = {};
      data.command = "HideNode";   
      data.path = model.treeNodeSpec.customizations.classes.fullpath;

      //if ora created need to update tree
      data.root = this.model[0].treeNodeSpec.customizations.classes.fullpath;
      data.doParentChild = this.doParentChild;
      data.doJointHeirarchy = this.doJointHeirarchy;

      //send expanded nodes list so can keep open on load fresh
      let matchArr = this.$refs.mytree.getMatching((themodel)=>{
        return themodel.treeNodeSpec.state.expanded;
      });

      data.expandedNodes = matchArr.map(el => el.treeNodeSpec.customizations.classes.fullpath);
      if(data.expandedNodes && data.expandedNodes[0] === undefined) {
        data.expandedNodes.shift();
      }

      this.connection.send(JSON.stringify(data));
   },
   ShowNode(model) {
    model.treeNodeSpec.customizations.classes.visible = "yes";
      let data = {};
      data.command = "ShowNode";   
      data.path = model.treeNodeSpec.customizations.classes.fullpath;

      //if ora created need to update tree
      data.root = this.model[0].treeNodeSpec.customizations.classes.fullpath;
      data.doParentChild = this.doParentChild;
      data.doJointHeirarchy = this.doJointHeirarchy;

      //send expanded nodes list so can keep open on load fresh
      let matchArr = this.$refs.mytree.getMatching((themodel)=>{
        return themodel.treeNodeSpec.state.expanded;
      });

      data.expandedNodes = matchArr.map(el => el.treeNodeSpec.customizations.classes.fullpath);
      if(data.expandedNodes && data.expandedNodes[0] === undefined) {
        data.expandedNodes.shift();
      }

      this.connection.send(JSON.stringify(data));
   },
   HideNodeSoft(model) {
    model.treeNodeSpec.customizations.classes.visible = "no";
    let data = {};
      data.command = "HideNodeSoft";   
      data.path = model.treeNodeSpec.customizations.classes.fullpath;

      //if ora created need to update tree
      data.root = this.model[0].treeNodeSpec.customizations.classes.fullpath;
      data.doParentChild = this.doParentChild;
      data.doJointHeirarchy = this.doJointHeirarchy;

      //send expanded nodes list so can keep open on load fresh
      let matchArr = this.$refs.mytree.getMatching((themodel)=>{
        return themodel.treeNodeSpec.state.expanded;
      });

      data.expandedNodes = matchArr.map(el => el.treeNodeSpec.customizations.classes.fullpath);
      if(data.expandedNodes && data.expandedNodes[0] === undefined) {
        data.expandedNodes.shift();
      }

      this.connection.send(JSON.stringify(data));
   },
   ShowNodeSoft(model) {
    model.treeNodeSpec.customizations.classes.visible = "yes";
      let data = {};
      data.command = "ShowNodeSoft";   
      data.path = model.treeNodeSpec.customizations.classes.fullpath;

      //if ora created need to update tree
      data.root = this.model[0].treeNodeSpec.customizations.classes.fullpath;
      data.doParentChild = this.doParentChild;
      data.doJointHeirarchy = this.doJointHeirarchy;

      //send expanded nodes list so can keep open on load fresh
      let matchArr = this.$refs.mytree.getMatching((themodel)=>{
        return themodel.treeNodeSpec.state.expanded;
      });

      data.expandedNodes = matchArr.map(el => el.treeNodeSpec.customizations.classes.fullpath);
      if(data.expandedNodes && data.expandedNodes[0] === undefined) {
        data.expandedNodes.shift();
      }

      this.connection.send(JSON.stringify(data));
   }
}