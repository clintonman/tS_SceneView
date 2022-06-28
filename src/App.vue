<script>
import TreeView from "@grapoza/vue-tree"
import VueSimpleContextMenu from 'vue-simple-context-menu';
import 'vue-simple-context-menu/dist/vue-simple-context-menu.css';
import { QuillEditor, Delta } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';

import CameraIcon from './components/CameraIcon.vue'
import GroupIcon from './components/GroupIcon.vue'
import HiddenIcon from './components/HiddenIcon.vue'
import LightIcon from './components/LightIcon.vue'
import LockedIcon from './components/LockedIcon.vue'
import MeshIcon from './components/MeshIcon.vue'
import NoteIcon from './components/NoteIcon.vue'
import UnlockedIcon from './components/UnlockedIcon.vue'
import VisibleIcon from './components/VisibleIcon.vue'
import NAIcon from './components/NAIcon.vue'
import MoreChildrenIcon from './components/MoreChildrenIcon.vue'
  
export default {
  components: {
    TreeView,
    VueSimpleContextMenu,
    QuillEditor,
    Delta,
    CameraIcon,
    GroupIcon,
    HiddenIcon,
    LightIcon,
    LockedIcon, 
    MeshIcon,
    NoteIcon,
    UnlockedIcon,
    VisibleIcon,
    NAIcon,
    MoreChildrenIcon
  },
  data() {
    return {
      model: [
            {
              id: 'inputs-radio-1',
              label: 'My First Node',
              treeNodeSpec: {
                input: {
                  type: 'radio',
                  name: 'radio1',
                  value: 'aValueToSubmit',
                  isInitialRadioGroupValue: true
                },
              deletable: true
              },
            },
            {
              id: 'inputs-radio-2',
              label: 'My Second Node',
              children: [
                {
                  id: 'inputs-radio-2-sub-1',
                  label: 'This is a subnode',
                  treeNodeSpec: {
                    input: {
                      type: 'radio',
                      name: 'radio2'
                    }
                  }
                },
                {
                  id: 'inputs-radio-2-sub-2',
                  label: 'This is another subnode',
                  treeNodeSpec: {
                    input: {
                      type: 'radio',
                      name: 'radio2'
                    }
                  }
                }
              ],
              treeNodeSpec: {
                input: {
                  type: 'radio',
                  name: 'radio1'
                },
                state: {
                  expanded: true
                }
              }
            },
            {
              id: 'inputs-checkbox-1',
              label: 'Checkbox node',
              treeNodeSpec: {
                input: {
                  type: 'checkbox'
                },
                state: {
                  input: {
                      value: true
                  }
                },
                addChildTitle: 'Add a new child node',
                deleteTitle: 'Delete this node',
                customizations: {
                  classes: {
                    "type":"renderable","visible":true,"locked":false
                  }
                }
              }
            }
          ],
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
      maxdepth: 3,
      newselection: false,
      lastselection: null
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

        // if($scope.jointboneselection == "bone" && sel.bone != null && sel.bone != "")
        //     selobj.selecttext = sel.bonepath;
        // else

        let data = {};
        data.command = "SelectItem";
        data.selecttext = matchArr[0].treeNodeSpec.customizations.classes.fullpath;
        this.connection.send(JSON.stringify(data));
      }

      
    },
    refreshSelectedList() {
      let sel = this.$refs.mytree.getSelected();
      console.log(sel);
    },
    CancelNote() {
      this.showNoteEditor=false;
      this.tsnode = "";
    },
    DeleteNote() {
      this.showNoteEditor=false;
      let msg = {command:"DeleteNotes"};
      msg.path = this.tsnode;
      this.connection.send(JSON.stringify(msg));
      this.tsnode = "";
    },
    GetScene() {
      // this.model.length = 0
      this.connection.send('{ "command" : "GetSceneTree3", "root": "current_scene" }');
    },
    GetRoot() {
      // this.model.length = 0
      this.connection.send('{ "command" : "GetSceneTree3", "root": "/" }');
    },
    GetTreeBranch(tsnode, depth){
      console.log("load branch", tsnode);
      let data = {};
      data.command = "GetTreeBranch";
      data.root = tsnode;
      data.startdepth = depth;
      this.connection.send(JSON.stringify(data));
    },
    SaveNote() {
      // console.log("hello")
      // console.log(this.mycontent.getContents())
      console.log(this.mycontent.ops)
      // console.log(this.editor.root.innerHTML)
      console.log(this.$refs.editor.getHTML()) //.$el.querySelector('.ql-editor').innerHTML)
      this.showNoteEditor=false
      //send to tS here
      let msg = {command:"AddNotes"};
      msg.path = this.tsnode;
      msg.html = this.$refs.editor.getHTML();
      msg.delta = JSON.stringify(this.mycontent);
      this.connection.send(JSON.stringify(msg));
      this.tsnode = "";
    },
    ShowEditor(tsnode) {
      this.showNoteEditor=true;
      this.tsnode = tsnode;
      this.mycontent = new Delta([]);
    },
    LoadEditor(tsnode){
      let msg = {command:"GetNotes"};
      msg.path = tsnode;
      this.connection.send(JSON.stringify(msg));
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

  <h2 @click="doReport">Time: {{time}} - {{tsnode}}</h2>

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
  
  <div id="notehtml" v-html="htmlnote"></div>
  <LightIcon style="fill:green;"/>
  <CameraIcon style="fill:green;"/>
  <GroupIcon style="fill:green;"/>
  <MeshIcon style="fill:green;"/>
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
    >
    <template v-slot:text="{ model, customClasses }">
        <!-- <span @click="doReport">say hi</span> -->
        <!-- <span 
          @click="doReport2(model[model.treeNodeSpec.labelProperty], customClasses.type)" 
          style="color: blue;"
        >
          {{ model[model.treeNodeSpec.labelProperty] }}. Custom Classes: {{ JSON.stringify(customClasses) }}
        </span> -->
        <div 
           
          style="color: blue;display: grid;grid-template-columns: 20px 13em min-content 20px 20px 20px 20px;"
          :style="{backgroundColor: model.treeNodeSpec.state.selected ? '#eee' : '#fff'}"
        >
          <MeshIcon style="fill:green;" v-if="customClasses.type == 'renderable'" />
          <CameraIcon style="fill:green;" v-else-if="customClasses.type == 'camera'" />
          <GroupIcon style="fill:green;" v-else-if="customClasses.type == 'group'" />
          <LightIcon style="fill:green;" v-else-if="customClasses.type == 'light'" />
          <NAIcon style="fill:green;" v-else />
          <span 
            style="display:block;overflow-wrap: break-word;"
            @contextmenu.prevent.stop='handleClick1($event, model)'
            @click.exact="selectonenode(model)"
            @click.ctrl.exact="toggleselection(model)"
            @click.shift.exact="rangeselection(model)"
          >{{ model[model.treeNodeSpec.labelProperty] }}</span>
          <!-- <span style="display:block;width:calc(5rem - (1rem + var(--itemSpacing)));">{{customClasses.treedepth}}</span> -->
          <!-- <span :style="{display:'block',width:(10-customClasses.treedepth*2.4)+'em'}">{{customClasses.treedepth}}</span> -->
          <!-- <span :style="{display:'block',width:(8-customClasses.treedepth*2.4)+'em'}"></span> -->
          <!-- <span :style="{display:'block',width:(14.5-customClasses.treedepth*2.3)+'em'}">{{customClasses.treedepth}}</span> -->
          <span :style="{display:'block',width:1.25 + maxdepth*3.2 - customClasses.treedepth*2.2+'em'}">{{customClasses.treedepth}} - {{maxdepth}}</span>
          <!-- <span :style="{display:'block',width:'50px'}">{{customClasses.treedepth}}</span> -->
          <!-- <span>Custom Classes: {{ JSON.stringify(customClasses) }}</span> -->
          <VisibleIcon style="fill:green;stroke:green;" v-if="customClasses.visible == 'yes'"/>
          <HiddenIcon style="fill:red;" v-if="customClasses.visible == 'no'"/>
          <NAIcon v-if="customClasses.visible == 'na'"/>
          <LockedIcon style="fill:red;" v-if="customClasses.locked == 'yes'" @click="doReport2(model[model.treeNodeSpec.labelProperty], customClasses.type)"/>
          <UnlockedIcon style="fill:green;" v-if="customClasses.locked == 'no'" @click="doReport2(model[model.treeNodeSpec.labelProperty], customClasses.type)"/>
          <NAIcon v-if="customClasses.locked == 'na'"/>
          <NoteIcon style="fill:green;" v-if="customClasses.note == 'yes'" @click="LoadEditor(customClasses.fullpath)"/>
          <NoteIcon style="fill:lightgray;" v-if="customClasses.note == 'no'" @click="ShowEditor(customClasses.fullpath)"/>
          <NAIcon v-if="customClasses.note == 'na'"/>
          <MoreChildrenIcon 
            @click="GetTreeBranch(customClasses.fullpath, customClasses.treedepth )"
            v-if="!model.treeNodeSpec.state.expanded && customClasses.numchildren > 0 && model[model.treeNodeSpec.childrenProperty].length == 0" />
        </div>
      </template>
  </tree-view>

  <div id="quill-container" v-if="showNoteEditor">
    <QuillEditor theme="snow" toolbar="full" 
      v-model:content="mycontent" 
      ref="editor"
    />
    <button @click="SaveNote">save</button>
    <button @click="CancelNote">cancel</button>
    <button @click="DeleteNote">delete</button>
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

#app {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;

  font-weight: normal;
  position: relative;
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
   position: absolute;
   top:3em;
   background-color:white;
   max-width:50em;
   padding: 2em;
}

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
