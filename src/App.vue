<script>
import TreeView from "@grapoza/vue-tree"
import VueSimpleContextMenu from 'vue-simple-context-menu';
// import 'vue-simple-context-menu/dist/vue-simple-context-menu.css';
// import { QuillEditor, Delta } from '@vueup/vue-quill'
import { Delta } from '@vueup/vue-quill'
// import '@vueup/vue-quill/dist/vue-quill.snow.css';

import CameraIcon from './components/CameraIcon.vue'
import GeometryIcon from './components/GeometryIcon.vue'
import GroupIcon from './components/GroupIcon.vue'
import HiddenIcon from './components/HiddenIcon.vue'
import LightIcon from './components/LightIcon.vue'
import LockedIcon from './components/LockedIcon.vue'
import MaterialIcon from './components/MaterialIcon.vue'
import MeshIcon from './components/MeshIcon.vue'
import NoteEditIcon from './components/NoteEditIcon.vue'
import NoteNewIcon from './components/NoteNewIcon.vue'
import TextIcon from './components/TextIcon.vue'
import UnlockedIcon from './components/UnlockedIcon.vue'
import VisibleIcon from './components/VisibleIcon.vue'
import NAIcon from './components/NAIcon.vue'
import MoreChildrenIcon from './components/MoreChildrenIcon.vue'
import Notes from './components/Notes.vue'
  
export default {
  components: {
    TreeView,
    VueSimpleContextMenu,
    Delta,
    CameraIcon,
    GeometryIcon,
    GroupIcon,
    HiddenIcon,
    LightIcon,
    LockedIcon, 
    MaterialIcon,
    MeshIcon,
    NoteEditIcon,
    NoteNewIcon,
    TextIcon,
    UnlockedIcon,
    VisibleIcon,
    NAIcon,
    MoreChildrenIcon,
    Notes
  },
  data() {
    return {
      model: [],
    time: null,
    itemArray1: [
        {
          name: 'Jim',
          job: 'Salesman',
        },
        {
          name: 'Dwight',
          job: 'Assistant to the Regional Manager',
        },
        {
          name: 'Pam',
          job: 'Receptionist',
        },
      ],
      itemArray2: [
        {
          name: 'Leslie',
          job: 'Deputy Director',
        },
        {
          name: 'Ron',
          job: 'Parks Director',
        },
        {
          name: 'Andy',
          job: 'Shoeshiner',
        },
      ],
      optionsArray1: [
        {
          name: 'Duplicate',
          slug: 'duplicate',
        },
        {
          type: 'divider',
        },
        {
          name: 'Edit',
          slug: 'edit',
        },
        {
          name: '<em>Delete</em>',
          slug: 'delete',
        },
      ],
      optionsArray2: [
        {
          name: 'Add Star',
          slug: 'add-star',
          class: 'my-custom-class',
        },
        {
          name: 'Remove Star',
          slug: 'remove-star',
        },
      ],

      mycontent: new Delta([]),
      htmlnote: "<h1>html will go here</h1>",
      showNoteEditor: false,
      tsnode: "",
      connection: null,
      modelDefaults: {
        selectable: false,
      },
      // selectionMode: 'single',
      // selectionMode: 'multiple',
      selectionMode: null,
      maxdepth: 1,
      newselection: false,
      lastselection: null,
      lastselectionlabel:"",
      shownameedit: false,
      edittop: 0,
      editleft: 0
    }
  },
  updated: function(){
    // this.GetMaxDepthAndSetChildExpanded();
  },

  mounted: function(){
    // https://github.com/johndatserakis/vue-simple-context-menu/issues/8
    var menu = document.getElementById("myFirstMenu");
    document.firstElementChild.appendChild(menu);
    var menu2 = document.getElementById("mySecondMenu");
    document.firstElementChild.appendChild(menu2);

    this.time = 'bobobo';
    // let connection = new WebSocket('ws://localhost:3000/');
    console.log("mounted")
    let myurl = 'ws://127.0.0.1:8080/ws';
    this.connection = new WebSocket(myurl);

    this.connection.onopen = (ev) => {
        // connection.send('{ "command" : "GetSceneTree2" }');
        this.connection.send('{ "command" : "GetSceneTree3", "root": "current_scene" }');
    };

    this.connection.onmessage = (event) => {
      // Vue data binding means you don't need any extra work to
      // update your UI. Just set the `time` and Vue will automatically
      // update the `<h2>`.
      let mydata = {};
      mydata = JSON.parse(event.data);
      console.log(event.data)
      this.time = mydata.command;
      // this.time = mydata.data.model;
      //this.model = mydata.data.model;
      //console.log(this.model);
      if(mydata.command == "DisplaySceneTree3") {
        console.log(mydata.data.model)
        this.model.length = 0
        this.model.push(...mydata.data.model);

        if(mydata.data.htmlnote != "") {
          this.htmlnote = mydata.data.htmlnote;
        }
        //only good for first load, so also called in update but still issue switching root
        // this.GetMaxDepthAndSetChildExpanded();
      }
      if(mydata.command == "AddToTree") {
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
      }
      if(mydata.command == "SetNoteStatus") {
        console.log(mydata)
        let matchArr = this.$refs.mytree.getMatching((themodel)=>{
          return themodel.id == mydata.id;
        });
        if(matchArr.length > 0) {
          console.log()
          matchArr[0].treeNodeSpec.customizations.classes.note = mydata.status;
        }
      }
      if(mydata.command == "OpenEditor") {
        console.log(mydata)
        this.showNoteEditor=true;
        this.tsnode = mydata.path;
        this.mycontent = JSON.parse(mydata.delta);
      }
      if(mydata.command == "UpdateHTMLNote") {
        console.log(mydata)
        this.showNoteEditor=false;
        this.htmlnote = mydata.html;
      }
      if(mydata.command == "NewSelection") {
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
  },

  methods: {
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
      this.$refs.vueSimpleContextMenu1.showMenu(event, item);
    },
    handleClick2(event, item) {
      this.$refs.vueSimpleContextMenu2.showMenu(event, item);
    },
    optionClicked1(event) {
      window.alert(JSON.stringify(event));
    },
    optionClicked2(event) {
      window.alert(JSON.stringify(event));
    },
    doReport() {
      console.log("hi")
    },
    doReport2(label, nodetype) {
      console.log(label, nodetype)
    },
    // doReport3(model, nodetype) {
    //   console.log("hey",model.id, nodetype, model.treeNodeSpec.state.selected)
    //   // model.treeNodeSpec.state.selected = true
    //   // console.log("hey",model.treeNodeSpec.state, nodetype)

    //   // if(mydata.command == "SetNoteStatus") {
    //   //   console.log(mydata)
    //   let matchArr = this.$refs.mytree.getMatching((themodel)=>{
    //     return themodel.id == model.id;
    //   });
    //   if(matchArr.length > 0) {
    //     // matchArr[0].treeNodeSpec.state.expanded = false;//this works
    //     // matchArr[0].treeNodeSpec.state.selected = true;//this does not work with selection processing turned off
    //     //did tests and cannot use selected without enabling click selection in the tree
    //     //must do own selection processing
    //     //test shows can use the builtin selected - how style it?
    //     matchArr[0].treeNodeSpec.state.selected = !matchArr[0].treeNodeSpec.state.selected;
    //   }
    //   // }
    // },
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

        //TODO change to select item and get note html
        
        let data = {};
        data.command = "SelectItem";
        data.selecttext = matchArr[0].treeNodeSpec.customizations.classes.fullpath;
        this.connection.send(JSON.stringify(data));
      }
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
    }
  }
}
</script>

<template>
  <h1>Scene View</h1>
  <div class="notes-head">
    <h2 @click="doReport">Time: {{time}} - {{tsnode}}</h2>
    <Notes 
      style="margin:1em;"
      v-if="showNoteEditor" 
      :connection="connection"
      @onNoteClose="CloseNoteEditor" 
      :htmlnote="htmlnote" 
      :initialDelta="mycontent" 
      :tsnode="tsnode"/>
      <!-- must place inside parent with class to get quill styles -->
      <div class="note-readonly ql-editor" v-else>
        <div class="note-readonly-content" v-html="htmlnote"></div>
      </div>
  </div>

    <!-- <div class="container pt-2 pb-4">
        <div class="row">
          <div class="col-lg-6 mb-4 mb-lg-0">
            <p>Right click on an item below.</p>
  
            <div class="list-group">
              <div
                v-for="(item, index) in itemArray1"
                :key="index"
                @contextmenu.prevent.stop="handleClick1($event, item)"
                class="list-group-item list-group-item-action"
              >
                {{ item.name }}
              </div>
            </div>
          </div>
  
          <div class="col-lg-6">
            <p>Left click on an item below.</p>
  
            <div class="list-group">
              <div
                v-for="(item, index) in itemArray2"
                :key="index"
                @click.prevent.stop="handleClick2($event, item)"
                class="list-group-item list-group-item-action"
              >
                {{ item.name }}
              </div>
            </div>
          </div>
        </div>
      </div> -->
  
  <CameraIcon />
  <GeometryIcon />
  <GroupIcon />
  <LightIcon />
  <MeshIcon />
  <MaterialIcon />
  <TextIcon />
  <button @click="ShowTest">get id=280799308</button>
  <button type="button" @click="refreshSelectedList">What's selected?</button>
  <button @click="GetScene">scene root</button>
  <button @click="GetRoot">pure root</button>
  <button @click="GetMaxDepthAndSetChildExpanded">force depth</button>
  <button @click="ListModel">list</button>

  <tree-view  
    ref="mytree" 
    id="my-tree" 
    :initial-model="model" 
    :model-defaults="modelDefaults" 
    :selection-mode="selectionMode"
    :doReport="doReport" :doReport2="doReport2"
    @treeNodeExpandedChange="GetMaxDepthAndSetChildExpanded"
    connection="connection"
    >
      <template v-slot:text="{ model, customClasses }">
        <div 
          class="tree-line"
          :style="{backgroundColor: model.treeNodeSpec.state.selected ? '#334' : ''}"
        >
          <MeshIcon class="label-icon" v-if="customClasses.type == 'renderable'" />
          <CameraIcon class="label-icon" v-else-if="customClasses.type == 'camera'" />
          <GeometryIcon class="label-icon" v-else-if="customClasses.type == 'geom'" />
          <GroupIcon class="label-icon" v-else-if="customClasses.type == 'group'" />
          <LightIcon class="label-icon" v-else-if="customClasses.type == 'light'" />
          <MaterialIcon class="label-icon" v-else-if="customClasses.type == 'material'" />
          <TextIcon class="label-icon" v-else-if="customClasses.type == 'text'" />
          <NAIcon class="label-icon--na" v-else />

          <span 
            class="tree-line-label"
            @contextmenu.prevent.stop='handleClick1($event, model)'
            @click.exact="selectonenode(model)"
            @click.ctrl.exact="toggleselection(model)"
            @click.shift.exact="rangeselection(model)"
            @dblclick.exact="editname(model, $event)"
          >{{ model[model.treeNodeSpec.labelProperty] }}</span>

          <span :style="{display:'block',width:1.25 + maxdepth*3 - customClasses.treedepth*3.2+'em'}"></span>

          <VisibleIcon class="action-label action-label--inactive" v-if="customClasses.visible == 'yes'" :connection="connection" :model="model"/>
          <HiddenIcon class="action-label action-label--active" v-if="customClasses.visible == 'no'" :connection="connection" :model="model"/>
          <NAIcon class="action-label action-label--na" v-if="customClasses.visible == 'na'"/>

          <LockedIcon class="action-label action-label--active" v-if="customClasses.locked == 'yes'" :connection="connection" :model="model"/>
          <UnlockedIcon class="action-label action-label--inactive" v-if="customClasses.locked == 'no'" :connection="connection" :model="model"/>
          <NAIcon class="action-label action-label--na" v-if="customClasses.locked == 'na'"/>

          <NoteEditIcon class="action-label action-label--note" v-if="customClasses.note == 'yes'" :connection="connection" :customClasses="customClasses" :model="model"/>
          <NoteNewIcon class="action-label action-label--nonote" v-if="customClasses.note == 'no'"  @click="ShowEditor(customClasses.fullpath, model)"/>
          <NAIcon class="action-label action-label--na" v-if="customClasses.note == 'na'"/>

          <MoreChildrenIcon class="action-label action-label--children" 
             :connection="connection" :customClasses="customClasses"
            v-if="!model.treeNodeSpec.state.expanded && customClasses.numchildren > 0 && model[model.treeNodeSpec.childrenProperty].length == 0" />
        </div>
      </template>
  </tree-view>
    <!-- <div :style="{backgroundColor:'white', position:'absolute',top:edittop,left:editleft}" v-if="shownameedit"> -->
    <!-- <div :style="{backgroundColor:'white', padding:'3em', position:'absolute',top:edittop+'px',left:editleft+'px'}" v-if="shownameedit">
      <p>{{lastselectionlabel}}</p>
      <input type="text" v-model="lastselectionlabel" @keyup.enter="testinput">
    </div> -->
    <!-- <input type="text" 
      v-model="lastselectionlabel" 
      @keyup.enter="testinput"
      :style="{backgroundColor:'white', padding:'8px', position:'absolute',top:edittop-15+'px',left:editleft-25+'px'}" 
      v-if="shownameedit"> -->
      <!-- <div :style="{backgroundColor:'white', padding:'12px', position:'absolute',top:edittop-18+'px',left:editleft-25+'px', boxShadow: '0 0 10px 5px red'}" 
          v-if="shownameedit"
          >
        <input type="text" 
          v-model="lastselectionlabel" 
          @keyup.enter="testinput"
          >
        <button style="margin-left: 5px;color:red;" @click="cancelnameedit">X</button>
      </div>

   -->

  <div class="rename-box" :style="{top:edittop-18+'px',left:editleft-25+'px'}"
          v-if="shownameedit"
          >
        <input type="text" 
          v-model="lastselectionlabel" 
          @keyup.enter="testinput"
          >
        <button style="margin-left: 5px;color:red;" @click="cancelnameedit">X</button>
      </div>

  <vue-simple-context-menu
    element-id="myFirstMenu"
    :options="optionsArray1"
    ref="vueSimpleContextMenu1"
    @option-clicked="optionClicked1"
  >
  </vue-simple-context-menu>

  <vue-simple-context-menu
    element-id="mySecondMenu"
    :options="optionsArray2"
    ref="vueSimpleContextMenu2"
    @option-clicked="optionClicked2"
  >
  </vue-simple-context-menu>
</template>

<style>
@import './assets/base.css';

  /* .grtvn-self {
    background-color: red;
    border: 2px solid red;
  } */
  /* .tree-line {
    background-color: #ddd;
  } */
  #my-tree {
    border:2px solid rgb(48, 16, 40);
    margin-top: 1em;
    padding: 0.5em;
    /* background-color: rgb(59, 59, 59); */
    background-color: rgb(107, 107, 107);
  }
  .rename-box {
    background-color:white;
    padding:12px;
    position:absolute;
    box-shadow: 0 0 10px 5px red;
  }
  .note-readonly {
     background-color:white;
     /* color:black; */
     opacity:0.7;
     margin: 1em;
  }
  .note-readonly-content {
    padding: 0.5em;
  }
  .notes-head {
    background-color: initial;
    color: initial;
  }
  .notes-head h2 {
    color:white;
    font-size: 1em;
  }
  h1 {
    font-size: 1.6em;
  }

  .label-icon {
    fill:rgb(212, 127, 194);
    width: 1.1em;
    height: 1.1em;
  }
  .label-icon--na {
    fill:#333344;
    width: 1.1em;
    height: 1.1em;
  }
  .tree-line {
    color: rgb(236, 236, 236);
    display: grid;
    grid-template-columns: 1.3em 10em min-content repeat(3, 1.5em) 2em;
    line-height: 1.6em;
    align-items: center;
    font-size: 0.75em;
  }
  .tree-line-label {
    display:block;
    overflow-wrap: break-word;
  }
   .tree-line-label:hover {
    color:yellow;
    background-color: rgb(33, 33, 100);
   }
  .action-label {
    width: 1.4em;
    height: 1.4em;
  }
  .action-label--inactive {
    fill:rgb(91, 141, 91);
  }
  .action-label--active {
    fill:rgb(168, 79, 79);
  }
  .action-label:not(.action-label--na):hover
  {
    fill: yellow;
  }
  .action-label--note {
    fill:rgb(61, 175, 61);
  }
  .action-label--nonote {
    fill: rgb(97, 97, 97);
  }
  .action-label--na {
    fill: rgb(71, 70, 89);
  }
  .action-label--children {
    fill: rgb(255, 255, 255);
    justify-self: flex-end;
  }
  .grtvn:nth-child(even) {
    background-color: rgb(66, 65, 65);
  }
  .grtvn:nth-child(odd) {
    background-color: rgb(73, 71, 71);
  }

  .grtv-wrapper.grtv-default-skin .grtvn-self-expander i.grtvn-self-expanded-indicator {
    color:white;
  }

#app {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;

  font-weight: normal;
  position: relative;
  background-color: rgb(59, 55, 59);
  color: white;
}

header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

a,
.green {
  text-decoration: none;
  color: hsla(160, 100%, 37%, 1);
  transition: 0.4s;
}

#quill-container{
   /* position: absolute;
   top:3em; */
   background-color:white;
   max-width:50em;
   padding: 2em;
}
/* css of quill is not available easily outside of quill and not available outside the page*/

/* .grtv-wrapper.grtv-default-skin .grtvn-self{
  display: grid;
  width: 90%;
} */

@media (hover: hover) {
  a:hover {
    background-color: hsla(160, 100%, 37%, 0.2);
  }
}

@media (min-width: 1024px) {
  /* body {
    display: flex;
    place-items: center;
  } */

  #app {
    /* display: grid; */
    /* grid-template-columns: 1fr 1fr; */
    padding: 0 2rem;
  }

  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  /* .vue-simple-context-menu {
    position: fixed !important;
  } */

}
</style>
