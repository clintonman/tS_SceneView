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
import HairIcon from './components/HairIcon.vue'
import HiddenIcon from './components/HiddenIcon.vue'
import IKHandleIcon from './components/IKHandleIcon.vue'
import IKLockIcon from './components/IKLockIcon.vue'
import JointIcon from './components/JointIcon.vue'
import LightIcon from './components/LightIcon.vue'
import LockedIcon from './components/LockedIcon.vue'
import MaterialIcon from './components/MaterialIcon.vue'
import MeshIcon from './components/MeshIcon.vue'
import ModifierIcon from './components/ModifierIcon.vue'
import NoteEditIcon from './components/NoteEditIcon.vue'
import NoteNewIcon from './components/NoteNewIcon.vue'
import ParticlesIcon from './components/ParticlesIcon.vue'
import PatchIcon from './components/PatchIcon.vue'
import PhysicsIcon from './components/PhysicsIcon.vue'
import SkeletonIcon from './components/SkeletonIcon.vue'
import TextIcon from './components/TextIcon.vue'
import UnlockedIcon from './components/UnlockedIcon.vue'
import VisibleIcon from './components/VisibleIcon.vue'
import NAIcon from './components/NAIcon.vue'
import MoreChildrenIcon from './components/MoreChildrenIcon.vue'
import Notes from './components/Notes.vue'
import NameDialog from './components/NameDialog.vue'

import TreeMethods from './components/TreeMethods'
import onmessage from './components/onmessage'

// build assumes that page is served from root
// add vue.config.js file to fix it
// https://medium.com/developer-rants/why-is-strict-mime-type-checking-blocking-the-static-serving-of-vue-frontend-files-4cbea1eedbd1

//setup to serve from /web/sceneview2/
//may need to manually edit the index.html links to the js and css files

  
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
    HairIcon,
    HiddenIcon,
    IKHandleIcon,
    IKLockIcon,
    JointIcon,
    LightIcon,
    LockedIcon, 
    MaterialIcon,
    MeshIcon,
    ModifierIcon,
    NoteEditIcon,
    NoteNewIcon,
    ParticlesIcon,
    PatchIcon,
    PhysicsIcon,
    TextIcon,
    SkeletonIcon,
    UnlockedIcon,
    VisibleIcon,
    NAIcon,
    MoreChildrenIcon,
    Notes,
    NameDialog
  },
  data() {
    return {
      model: [],
      optionsArray1: [
        {
          name: 'Group3D',
          slug: 'group3d',
        },
        {
          name: 'Group',
          slug: 'group',
        },
        {
          name: 'UnGroup',
          slug: 'ungroup',
        },
        {
          name: 'UnGroup3D',
          slug: 'ungroup3d',
        },
        {
          type: 'divider',
        },
        {
          name: 'Parent',
          slug: 'parent',
        },
        {
          name: 'UnParent',
          slug: 'unparent',
        },
        {
          type: 'divider',
        },
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
      dragOptions: [
        {
          name: 'Parent',
          slug: 'parent',
        },
        {
          name: 'Move into Group',
          slug: 'move2d',
        },
        {
          name: 'Move into Group 3D',
          slug: 'move3d',
        }
      ],
      dragOptionsCopy: [
        {
          name: 'Parent a Copy',
          slug: 'parentcopy',
        },
        {
          name: 'Copy into Group',
          slug: 'copy2d',
        },
        {
          name: 'Copy into Group 3D',
          slug: 'copy3d',
        }
      ],
      dropIsActive: false,
 
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
      alphaOrder: 'NONE',
      shownotes: true,
      showBoneNames: false,
      nameWidth: 12,
      dataForTS: {},
      lastContextItem: null,
      lastContextEvent: null,
      showrename: false,
      scrolltop: 0,
      pagescrolltop: 0,
      scenepath: "/Project/Space 3D",
      nurbscpselectauto: true,
      socketport: 8080,
      showoptions: false,
      socketerror: false,
      isDev: process.env.NODE_ENV == "development" // only show port number input if in dev mode
    }
  },

  mounted: function(){
    // https://github.com/johndatserakis/vue-simple-context-menu/issues/8
    var menu = document.getElementById("myFirstMenu");
    document.firstElementChild.appendChild(menu);
    var menu1 = document.getElementById("moveMenu");
    document.firstElementChild.appendChild(menu1);
    var menu2 = document.getElementById("copyMenu");
    document.firstElementChild.appendChild(menu2);

    console.log("mounted")

    this.SetSocketPort();
  },

  methods: {
    ...TreeMethods,
    SetSocketPort() {
      this.socketerror = false;

      if(this.connection) {
        this.connection.close();
        this.connection = null;
      }

      if(process.env.NODE_ENV == "development") {
        var myurl = `ws://${location.hostname}:${this.socketport}/ws`;//development dev port and server port
      } else {
        var myurl = `ws:${location.host}/ws`;//production live and server ports the same and don't need socketport
      }
      this.connection = new WebSocket(myurl);

      this.connection.onerror = (e) => {
        console.log(location)
        console.log(e)
        this.socketerror = true;
      }

      this.connection.onopen = (ev) => {
        console.log(location)
        console.log(process.env.NODE_ENV)
          // connection.send('{ "command" : "GetSceneTree2" }');
          //this.connection.send('{ "command" : "GetSceneTree3", "root": "current_scene" }');
          let mydata = {};
          mydata.command = "GetSceneTree3";
          mydata.root = "current_scene";
          mydata.doParentChild = this.doParentChild;
          mydata.doJointHeirarchy = this.doJointHeirarchy;
          mydata.nurbscpselectauto = this.nurbscpselectauto;
          this.connection.send(JSON.stringify(mydata));
      };
  
      this.connection.onmessage = (event) => {
        let mytree = document.getElementById("my-tree");
        this.model.scrolltop = mytree.scrollTop;
        // this.model.pagescrolltop = document.body.scrollTop;
        this.model.pagescrolltop = document.documentElement.scrollTop;

        let mydata = {};
        mydata = JSON.parse(event.data);

        if(mydata.command == "ErrorResult") { onmessage.ErrorResult.call(this, mydata); }
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
        if(mydata.command == "RenameFailed") { onmessage.RenameFailed.call(this, mydata); }
        if(mydata.command == "TSRefresh") { onmessage.TSRefresh.call(this); }
        if(mydata.command == "DoGroup3D") { onmessage.DoGroup3D.call(this); }
        if(mydata.command == "DoGroup") { onmessage.DoGroup.call(this); }

        // mytree.scrollTop = scrolltop;
        mytree = document.getElementById("my-tree");
        // mytree.scroll(0, scrolltop);
        console.log(this.model.scrolltop);
        // mytree.scrollTop = scrolltop;

        // if(mydata.command == "DisplaySceneTree3" || mydata.command == "AddToTree" || mydata.command == "TSRefresh" || mydata.command == "ErrorResult") {
        if(mydata.command == "DisplaySceneTree3") {
          this.$nextTick(function(){
            setTimeout(() => {
              console.log("next timeout",this.model.scrolltop);
              // this.$refs.scrollList.scrollTop = 99999
              let mytree = document.getElementById("my-tree");
              mytree.scrollTop = this.model.scrolltop;
              document.documentElement.scrollTop = this.model.pagescrolltop;
          }, 100)
          });
        }
        // this.$nextTick((scrolltop) => {
        //   let mytree = document.getElementById("my-tree");
        //   console.log("nexttick",scrolltop)
        //   mytree.scrollTop = scrolltop;
        // });
      }
    }
  }
}
</script>

<template>
  <div class="controls">
    <h1>Scene View<!-- &nbsp;
    <ActorIcon />
    <AnimationIcon />
    <BoneIcon />
    <CameraIcon />
    <ConstraintIcon />
    <CurveIcon />
    <GeometryIcon />
    <GroupIcon />
    <Group3DIcon />
    <HairIcon />
    <IKHandleIcon />
    <IKLockIcon />
    <LightIcon />
    <MeshIcon />
    <MaterialIcon />
    <ModifierIcon />
    <MoreChildrenIcon />
    <ParticlesIcon/>
    <PatchIcon/>
    <PhysicsIcon/>
    <SkeletonIcon />
    <TextIcon /> -->
    </h1>
    <div v-if="socketerror" class="errordisplay">Connection Error - check address and port number</div>
    <div class="notes-head">
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

    <div class="action-buttons">
      <button @click="GetScene" title="load or refresh at the current scene level">Scene</button>
      <button @click="GetRoot" title="load or refresh at the root app level">Root</button>
      <button @click="GetTreeToSelected" title="show the selected node in the tree">Expand to</button>
      <button @click="GetMaxDepthAndSetChildExpanded" title="straighten action icon columns">Straighten</button>
      <label for="showoptions" class="showoptions-label">Options
      <HiddenIcon v-if="!showoptions" style="height: 80%;"/>
      <VisibleIcon v-else style="height: 80%;"/>
      </label>
    </div>

    
      <input type="checkbox" name="showoptions" id="showoptions" class="showoptions" v-model="showoptions" hidden>
      

      <div class="options-groups" v-if="showoptions">
        <div class="order-by">
          <h3 title="arrange alphabetically, by ID number or by object type">Order by:</h3>
          <label for="none">
            <input @change="OrderNodes" type="radio" name="" id="none" v-model="alphaOrder" value="NONE"/>
            None
          </label>
          <label for="alpha" title="order alphabetically">
            <input @change="OrderNodes" type="radio" name="" id="alpha" v-model="alphaOrder" value="ALPHA">
            Alpha
          </label>
          <label for="id" title="order by node id">
            <input @change="OrderNodes" type="radio" name="" id="id" v-model="alphaOrder" value="ID">
            ID
          </label>
          <label for="type" title="order by type of object">
            <input @change="OrderNodes" type="radio" name="" id="type" v-model="alphaOrder" value="TYPE">
            Type
          </label>
        </div>
        <div class="check-options">
          <input type="checkbox" name="" id="shownotes" v-model="shownotes" title="show the notes section">
          <label for="shownotes" title="show the notes section">Show Notes</label>
          <input type="checkbox" name="" id="parentchild" v-model="doParentChild" title="show parent child relationships">
          <label for="parentchild" title="show parent child relationships">Parent-Child</label>
          <input type="checkbox" name="" id="jointheirarchy" v-model="doJointHeirarchy" title="show skeleton joint heirarchy">
          <label for="jointheirarchy" title="show skeleton joint heirarchy">Joint Heirarchy</label>
          <input type="checkbox" id="showbonenames" v-model="showBoneNames" title="show bones names when joint heirarchy is displayed">
          <label for="showbonenames" title="show bones names when joint heirarchy is displayed">Show Bone Names</label>
          <input type="checkbox" id="nurbscpselectauto" v-model="nurbscpselectauto" title="automatically convert nurbs selections for 3d manipulation">
          <label for="nurbscpselectauto" title="automatically convert nurbs selections for 3d manipulation">NURBS Auto CP Mesh Select</label>
        </div>
        <div class="num-options">
          <label for="namewidth">Label Width</label>
          <input @change="SetLabelWidth" type="number" name="" id="namewidth" v-model="nameWidth">
          <label v-if="isDev" for="socketport">Websocket Port</label>
          <input v-if="isDev" @change="SetSocketPort" type="number" name="" id="socketport" v-model="socketport">
        </div>
      </div>
    

    </div>

  <div class="rename-box" :style="{top:edittop-25+'px',left:editleft-15+'px'}" v-if="shownameedit">
    <input type="text" 
      v-model="lastselectionlabel" 
      @keyup.enter="Rename"
      >
    <button style="margin-left: 5px;color:red;" @click="cancelnameedit">X</button>
  </div>

  <tree-view  
    ref="mytree" 
    id="my-tree" 
    :initial-model="model" 
    :model-defaults="modelDefaults" 
    :selection-mode="selectionMode"
    @treeNodeExpandedChange="GetMaxDepthAndSetChildExpanded"
    connection="connection"
    :doParentChild="doParentChild" :doJointHeirarchy="doJointHeirarchy"
    :showBoneNames="showBoneNames"
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
          <HairIcon class="label-icon" v-else-if="customClasses.type == 'hair'" />
          <IKHandleIcon class="label-icon label-icon-bone" v-else-if="customClasses.type == 'ikhandle'" />
          <IKLockIcon class="label-icon label-icon-bone" v-else-if="customClasses.type == 'iklock'" />
          <JointIcon class="label-icon label-icon-joint" v-else-if="customClasses.type == 'joint'" />
          <LightIcon class="label-icon label-icon-light" v-else-if="customClasses.type == 'light'" />
          <MaterialIcon class="label-icon label-icon-material" v-else-if="customClasses.type == 'material'" />
          <MeshIcon class="label-icon" v-else-if="customClasses.type == 'renderable'" />
          <ModifierIcon class="label-icon" v-else-if="customClasses.type == 'modifier'" />
          <ParticlesIcon class="label-icon" v-else-if="customClasses.type == 'particles'" />
          <PatchIcon class="label-icon label-icon-nurbs" v-else-if="customClasses.type == 'patch'" />
          <PhysicsIcon class="label-icon" v-else-if="customClasses.type == 'physics'" />
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
            @drop="Dropped($event, model)"
          >{{ model[model.treeNodeSpec.labelProperty] }}</span>

          <!-- <span :style="{display:'block',width:1.25 + maxdepth*3 - customClasses.treedepth*3.2+'em'}"></span> -->
          <span :style="{display:'block',width:1.25 + maxdepth*3.4 - customClasses.treedepth*2.8+'em'}"></span>

          <VisibleIcon class="action-label action-label--inactive" v-if="customClasses.visible == 'yes'" :connection="connection" :model="model" @onHide="HideNode" @onHideSoft="HideNodeSoft" :showtitle="true"/>
          <HiddenIcon class="action-label action-label--active" v-if="customClasses.visible == 'no'" :connection="connection" :model="model" @onShow="ShowNode" @onShowSoft="ShowNodeSoft" :showtitle="true"/>
          <NAIcon class="action-label action-label--na" v-if="customClasses.visible == 'na'"/>

          <LockedIcon class="action-label action-label--active" v-if="customClasses.locked == 'yes'" :connection="connection" :model="model" title="unlock"/>
          <UnlockedIcon class="action-label action-label--inactive" v-if="customClasses.locked == 'no'" :connection="connection" :model="model" title="lock"/>
          <NAIcon class="action-label action-label--na" v-if="customClasses.locked == 'na'"/>

          <NoteEditIcon class="action-label action-label--note" v-if="customClasses.note == 'yes'" :connection="connection" :customClasses="customClasses" :model="model"/>
          <NoteNewIcon class="action-label action-label--nonote" v-if="customClasses.note == 'no'"  @click="ShowEditor(customClasses.fullpath, model)"/>
          <NAIcon class="action-label action-label--na" v-if="customClasses.note == 'na'"/>

          <MoreChildrenIcon class="action-label action-label--children" 
             :connection="connection" :customClasses="customClasses" :doParentChild="doParentChild" :doJointHeirarchy="doJointHeirarchy"
            v-if="!model.treeNodeSpec.state.expanded && customClasses.numchildren > 0 && model[model.treeNodeSpec.childrenProperty].length == 0" />
          <div v-else></div>
          <div v-if="customClasses.bone && showBoneNames">{{customClasses.bone}}</div>
        </div>
      </template>
      
  </tree-view>

  <NameDialog id="namedialog" v-if="showrename" @onNodeRenamed="onNodeRenamed" @onRenameCancelled="onRenameCancelled" :contextevent="lastContextEvent"></NameDialog>

  <vue-simple-context-menu
    element-id="myFirstMenu"
    :options="optionsArray1"
    ref="vueSimpleContextMenu1"
    @option-clicked="optionClicked1"
  >
  </vue-simple-context-menu>
  <vue-simple-context-menu
    element-id="moveMenu"
    :options="dragOptions"
    ref="vueSimpleContextMoveMenu"
    @option-clicked="moveOptionClicked"
    @menu-closed="refreshTree"
  >
  </vue-simple-context-menu>
  <vue-simple-context-menu
    element-id="copyMenu"
    :options="dragOptionsCopy"
    ref="vueSimpleContextCopyMenu"
    @option-clicked="copyOptionClicked"
    @menu-closed="refreshTree"
  >
  </vue-simple-context-menu>


</template>

<style>
@import './assets/base.css';
  .errordisplay {
    background-color: rgb(134, 0, 0);
    font-size: 1.3em;
    padding-left: 0.4em;
  }
  .action-buttons {
    display: flex;
    /* flex-wrap: wrap; */
    gap: 0.3em;
    /* margin-left: 0.25em; */
    margin-top: 1em;
  }
  .action-buttons button {
    height: 2em;
    width: 7.2em;
    color:white;
    background-color: rgb(48, 15, 43);
    border-radius: 6px;
    border-color: rgb(94,58,89);
    font-size: 0.8em;
  }

  .showoptions {
    margin-left: 0.5em;
    margin-top: 1.5em;
  }

  .showoptions-label {
    display: flex;
    gap: 0.5em;
    height: 2em;
    /* margin-left: 0.5em; */
    /* margin-top: 1.5em; */
    /* padding: 0.05em 0.125em; */
    background-color: rgb(48, 15, 43);
    border: 2px outset rgb(94,58,89);
    border-radius: 6px;
    width: 7.2em;
    align-items: center;
    justify-content: center;
    font-size: 0.8em;
  }
  .showoptions-label:hover,
  .action-buttons button:hover {
    background-color: rgb(75, 12, 65);
  }
  .options-groups {
    border:2px solid rgb(167, 56, 139);
    margin: 1em;
    margin-left: auto;
    margin-right: auto;
    padding: 1.5em;
    width: 26em;
  }
  .order-by {
    display: flex;
    gap: 1em;
    align-items: center;
  }
  .order-by h3 {
    font-size: 1em;
  }
  .check-options {
    display: grid;
    margin-top: 1.5em;
    grid-template-columns: 2em 1fr;
    row-gap: 0.5em;
  }

  .check-options input {
    margin-right: 0.8em;
  }
  .num-options {
    display: grid;
    margin-top: 1.5em;
    grid-template-columns: 7.5em 4em;
    row-gap: 0.5em;
  }

  #my-tree {
    border:2px solid rgb(48, 16, 40);
    margin-top: 1em;
    padding: 0.5em;
    background-color: rgb(107, 107, 107);
    max-height: 65vh;
    overflow-y:scroll;
    font-size: 1.1em;
    font-family: Tahoma, Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  }

  .rename-box {
    background-color:white;
    padding:12px;
    position:absolute;
    z-index:5;
    box-shadow: 0 0 10px 5px black;
  }
  .note-readonly {
     background-color:rgb(233, 233, 233);
    border:2px solid rgb(48, 16, 40);
     margin: 0.125em;
  }
  /* .note-readonly-content {
    padding: 0.125em;
  } */
  .notes-head {
    background-color: initial;
    color: initial;
  }
  .notes-head h2 {
    color:white;
    font-size: 1em;
  }
  h1 {
    font-size: 1.3em;
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
    fill:rgb(134, 161, 250);
  }
  .label-icon-group {
    fill:rgb(135, 175, 88);
  }
  .label-icon-joint {
    fill:rgb(238, 177, 97);
  }
  .label-icon-light {
    fill:rgb(219, 221, 101);
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

  :root {
    --namewidth: 10em;
  }

  .tree-line {
    display: grid;
    grid-template-columns: 1.3em var(--namewidth) min-content repeat(3, 1.3em) 1.6em 10em;
    line-height: 1.8em;
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
    width: 1.1em;
    height: 1.1em;
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
