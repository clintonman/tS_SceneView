<script>
import TreeView from "@grapoza/vue-tree"
import VueSimpleContextMenu from 'vue-simple-context-menu';
import 'vue-simple-context-menu/dist/vue-simple-context-menu.css';
// import { QuillEditor, Delta } from '@vueup/vue-quill'
import { Delta } from '@vueup/vue-quill'
// import '@vueup/vue-quill/dist/vue-quill.snow.css';

import ActorIcon from './components/ActorIcon.vue'
import AnimationIcon from './components/AnimationIcon.vue'
import BoneIcon from './components/BoneIcon.vue'
import CameraIcon from './components/CameraIcon.vue'
import ConstraintIcon from './components/ConstraintIcon.vue'
import CurveIcon from './components/CurveIcon.vue'
import GeometryIcon from './components/GeometryIcon.vue'
import GroupIcon from './components/GroupIcon.vue'
import Group3DIcon from './components/Group3DIcon.vue'
import HiddenIcon from './components/HiddenIcon.vue'
import JointIcon from './components/JointIcon.vue'
import LightIcon from './components/LightIcon.vue'
import LockedIcon from './components/LockedIcon.vue'
import MaterialIcon from './components/MaterialIcon.vue'
import MeshIcon from './components/MeshIcon.vue'
import ModifierIcon from './components/ModifierIcon.vue'
import NoteEditIcon from './components/NoteEditIcon.vue'
import NoteNewIcon from './components/NoteNewIcon.vue'
import PatchIcon from './components/PatchIcon.vue'
import SkeletonIcon from './components/SkeletonIcon.vue'
import TextIcon from './components/TextIcon.vue'
import UnlockedIcon from './components/UnlockedIcon.vue'
import VisibleIcon from './components/VisibleIcon.vue'
import NAIcon from './components/NAIcon.vue'
import MoreChildrenIcon from './components/MoreChildrenIcon.vue'
import Notes from './components/Notes.vue'

import TreeMethods from './components/TreeMethods'
import onmessage from './components/onmessage'

// build assumes that page is served from root
// add vue.config.js file to fix it
// https://medium.com/developer-rants/why-is-strict-mime-type-checking-blocking-the-static-serving-of-vue-frontend-files-4cbea1eedbd1

//setup to serve from /web/sceneview2/
//may need to manually edit the index.html links to js and css

  
export default {
  components: {
    TreeView,
    VueSimpleContextMenu,
    Delta,
    ActorIcon,
    AnimationIcon,
    BoneIcon,
    CameraIcon,
    ConstraintIcon,
    CurveIcon,
    GeometryIcon,
    GroupIcon,
    Group3DIcon,
    HiddenIcon,
    JointIcon,
    LightIcon,
    LockedIcon, 
    MaterialIcon,
    MeshIcon,
    ModifierIcon,
    NoteEditIcon,
    NoteNewIcon,
    PatchIcon,
    TextIcon,
    SkeletonIcon,
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
      optionsArray1: [
        {
          name: 'Show Node in LE',
          slug: 'leopento',
        },
        {
          name: 'Open Node in LE',
          slug: 'openinle',
        },
        {
          type: 'divider',
        },
        {
          // name: '<em>Delete</em>',
          name: 'Delete',
          slug: 'delete',
        },
      ],
 
      mycontent: new Delta([]),
      htmlnote: "",
      showNoteEditor: false,
      tsnode: "",
      connection: null,
      modelDefaults: {
        selectable: false,
      },
      selectionMode: null,
      maxdepth: 1,
      newselection: false,
      lastselection: null,
      lastselectionlabel:"",
      shownameedit: false,
      edittop: 0,
      editleft: 0,
      doParentChild: true,
      doJointHeirarchy: false,
      alphaOrder: false,
      shownotes: true
    }
  },

  mounted: function(){
    // https://github.com/johndatserakis/vue-simple-context-menu/issues/8
    var menu = document.getElementById("myFirstMenu");
    document.firstElementChild.appendChild(menu);

    this.time = 'bobobo';
    // let connection = new WebSocket('ws://localhost:3000/');
    console.log("mounted")
    let myurl = 'ws://127.0.0.1:8080/ws';
    this.connection = new WebSocket(myurl);

    this.connection.onopen = (ev) => {
        // connection.send('{ "command" : "GetSceneTree2" }');
        //this.connection.send('{ "command" : "GetSceneTree3", "root": "current_scene" }');
        let mydata = {};
        mydata.command = "GetSceneTree3";
        mydata.root = "current_scene";
        mydata.doParentChild = this.doParentChild;
        mydata.doJointHeirarchy = this.doJointHeirarchy;
        this.connection.send(JSON.stringify(mydata));
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
      if(mydata.command == "DisplaySceneTree3") { onmessage.DisplaySceneTree3.call(this, mydata); }
      if(mydata.command == "AddToTree") { onmessage.AddToTree.call(this, mydata); }
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
      if(mydata.command == "NewSelection") { onmessage.NewSelection.call(this, mydata); }
    }
  },

  methods: {
    ...TreeMethods,
  }
}
</script>

<template>
  <div class="controls">
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
        <div class="note-readonly ql-editor"  v-else-if="shownotes">
          <div class="note-readonly-content" v-html="htmlnote"></div>
        </div>
    </div>

    <ActorIcon />
    <AnimationIcon />
    <BoneIcon />
    <CameraIcon />
    <ConstraintIcon />
    <CurveIcon />
    <GeometryIcon />
    <GroupIcon />
    <Group3DIcon />
    <LightIcon />
    <MeshIcon />
    <MaterialIcon />
    <ModifierIcon />
    <PatchIcon/>
    <SkeletonIcon />
    <TextIcon />
    <button @click="ShowTest">get id=280799308</button>
    <button type="button" @click="refreshSelectedList">What's selected?</button>
    <button @click="GetScene">scene root</button>
    <button @click="GetRoot">pure root</button>
    <button @click="GetMaxDepthAndSetChildExpanded">force depth</button>
    <button @click="ListModel">list</button>
    <input type="checkbox" name="" id="shownotes" v-model="shownotes"><label for="shownotes">Show Notes</label>
    <input type="checkbox" name="" id="parentchild" v-model="doParentChild"><label for="parentchild">Parent-Child</label>
    <input type="checkbox" name="" id="jointheirarchy" v-model="doJointHeirarchy"><label for="jointheirarchy">Joint Heirarchy</label>
    <input @change="OrderNodes" type="checkbox" name="" id="alphaorder" v-model="alphaOrder"><label for="alphaorder">Alphabetize</label>
  </div>

  <div class="rename-box" :style="{top:edittop-25+'px',left:editleft-15+'px'}" v-if="shownameedit">
    <input type="text" 
      v-model="lastselectionlabel" 
      @keyup.enter="testinput"
      >
    <button style="margin-left: 5px;color:red;" @click="cancelnameedit">X</button>
  </div>

  <tree-view  
    ref="mytree" 
    id="my-tree" 
    :initial-model="model" 
    :model-defaults="modelDefaults" 
    :selection-mode="selectionMode"
    :doReport="doReport" :doReport2="doReport2"
    @treeNodeExpandedChange="GetMaxDepthAndSetChildExpanded"
    connection="connection"
    :doParentChild="doParentChild" :doJointHeirarchy="doJointHeirarchy"
    >
      <template v-slot:text="{ model, customClasses }">
        <div 
          class="tree-line"
          :style="{backgroundColor: model.treeNodeSpec.state.selected ? '#334' : ''}"
        >
          <ActorIcon class="label-icon" v-if="customClasses.type == 'actor'" />
          <AnimationIcon class="label-icon" v-else-if="customClasses.type == 'animation'" />
          <BoneIcon class="label-icon label-icon-bone" v-else-if="customClasses.type == 'bone'" />
          <CameraIcon class="label-icon label-icon-camera" v-else-if="customClasses.type == 'camera'" />
          <ConstraintIcon class="label-icon" v-else-if="customClasses.type == 'constraint'" />
          <CurveIcon class="label-icon label-icon-nurbs" v-else-if="customClasses.type == 'curve'" />
          <GeometryIcon class="label-icon" v-else-if="customClasses.type == 'geom'" />
          <GroupIcon class="label-icon label-icon-group" v-else-if="customClasses.type == 'group'" />
          <Group3DIcon class="label-icon" v-else-if="customClasses.type == 'group3d'" />
          <JointIcon class="label-icon label-icon-joint" v-else-if="customClasses.type == 'joint'" />
          <LightIcon class="label-icon label-icon-light" v-else-if="customClasses.type == 'light'" />
          <MaterialIcon class="label-icon label-icon-material" v-else-if="customClasses.type == 'material'" />
          <MeshIcon class="label-icon" v-else-if="customClasses.type == 'renderable'" />
          <ModifierIcon class="label-icon" v-else-if="customClasses.type == 'modifier'" />
          <PatchIcon class="label-icon label-icon-nurbs" v-else-if="customClasses.type == 'patch'" />
          <JointIcon class="label-icon label-icon-root-joint" v-else-if="customClasses.type == 'rootjoint'" />
          <SkeletonIcon class="label-icon" v-else-if="customClasses.type == 'skeleton'" />
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
             :connection="connection" :customClasses="customClasses" :doParentChild="doParentChild" :doJointHeirarchy="doJointHeirarchy"
            v-if="!model.treeNodeSpec.state.expanded && customClasses.numchildren > 0 && model[model.treeNodeSpec.childrenProperty].length == 0" />
        </div>
      </template>
  </tree-view>

  <vue-simple-context-menu
    element-id="myFirstMenu"
    :options="optionsArray1"
    ref="vueSimpleContextMenu1"
    @option-clicked="optionClicked1"
  >
  </vue-simple-context-menu>

</template>

<style>
@import './assets/base.css';

  #my-tree {
    border:2px solid rgb(48, 16, 40);
    margin-top: 1em;
    padding: 0.5em;
    background-color: rgb(107, 107, 107);
    max-height: 65vh;
    overflow-y:scroll;
  }
  .controls {
    /* max-height: 25vh; */
  }
  .rename-box {
    background-color:white;
    padding:12px;
    position:absolute;
    z-index:5;
    box-shadow: 0 0 10px 5px black;
  }
  .note-readonly {
     background-color:white;
     opacity:0.7;
     margin: 0.5em;
  }
  .note-readonly-content {
    padding: 0.25em;
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
  .label-icon-bone {
    fill:rgb(231, 216, 196);
  }
  .label-icon-camera {
    fill:rgb(156, 177, 247);
  }
  .label-icon-group {
    fill:rgb(135, 175, 88);
  }
  .label-icon-joint {
    fill:rgb(238, 177, 97);
  }
  .label-icon-light {
    fill:rgb(203, 221, 101);
  }
  .label-icon-material {
    fill:rgb(221, 101, 117);
  }
  .label-icon-nurbs {
    fill:rgb(101, 203, 221);
  }
  .label-icon-root-joint {
    fill:rgb(101, 203, 221);
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
    fill:rgb(135, 177, 135);
  }
  .action-label--active {
    fill:rgb(197, 108, 108);
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
  padding: 1rem 2rem;

  font-weight: normal;
  position: relative;
  background-color: rgb(59, 55, 59);
  color: white;
}

header {
  line-height: 1.5;
}

#quill-container{
   background-color:white;
   max-width:50em;
   padding: 2em;
}
/* css of quill is not available easily outside of quill and not available outside the page*/

  .vue-simple-context-menu {
    position: absolute !important;
  }

</style>
