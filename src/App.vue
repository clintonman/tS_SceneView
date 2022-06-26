<script>
import TreeView from "@grapoza/vue-tree"
import VueSimpleContextMenu from 'vue-simple-context-menu';
import 'vue-simple-context-menu/dist/vue-simple-context-menu.css';

import HelloWorld from './components/HelloWorld.vue'
import TheWelcome from './components/TheWelcome.vue'
import { VueElement } from 'vue'
import HiddenIcon from './components/HiddenIcon.vue'
import LockedIcon from './components/LockedIcon.vue'
import NoteIcon from './components/NoteIcon.vue'
import UnlockedIcon from './components/UnlockedIcon.vue'
import VisibleIcon from './components/VisibleIcon.vue'
import NAIcon from './components/NAIcon.vue'
import MoreChildrenIcon from './components/MoreChildrenIcon.vue'
  
export default {
  components: {
    TreeView,
    VueSimpleContextMenu,
    HelloWorld,
    TheWelcome,
    HiddenIcon,
    LockedIcon, 
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
    }


  },
  mounted: function(){
    // https://github.com/johndatserakis/vue-simple-context-menu/issues/8
    var menu = document.getElementById("myFirstMenu");
    document.firstElementChild.appendChild(menu);
    var menu = document.getElementById("mySecondMenu");
    document.firstElementChild.appendChild(menu);

    this.time = 'bobobo';
    // let connection = new WebSocket('ws://localhost:3000/');
    console.log("mounted")
    let myurl = 'ws://127.0.0.1:8080/ws';
    let connection = new WebSocket(myurl);

    connection.onopen = function(ev) {
        // connection.send('{ "command" : "GetSceneTree2" }');
        connection.send('{ "command" : "GetSceneTree3" }');
    };

    connection.onmessage = (event) => {
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
        this.model.push(...mydata.data.model)
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
    }
  }
}
</script>

<template>
  <!-- <header>
    <img alt="Vue logo" class="logo" src="./assets/logo.svg" width="125" height="125" />

    <div class="wrapper">
      <HelloWorld msg="You did it!" />
    </div>
  </header>

  <main>
    <TheWelcome />
  </main> -->
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
  <h2 @click="doReport">Time: {{time}}</h2>


    <div class="container pt-2 pb-4">
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
      </div>
  
      

  <tree-view  id="my-tree" :initial-model="model" :doReport="doReport" :doReport2="doReport2">
    <template v-slot:text="{ model, customClasses }">
        <!-- <span @click="doReport">say hi</span> -->
        <!-- <span 
          @click="doReport2(model[model.treeNodeSpec.labelProperty], customClasses.type)" 
          style="color: blue;"
        >
          {{ model[model.treeNodeSpec.labelProperty] }}. Custom Classes: {{ JSON.stringify(customClasses) }}
        </span> -->
        <div 
          @click="doReport2(model[model.treeNodeSpec.labelProperty], customClasses.type)" 
          style="color: blue;display: flex;gap: 10px;"
          @contextmenu.prevent.stop='handleClick1($event, model)'
        >
          <span>{{ model[model.treeNodeSpec.labelProperty] }}</span>
          <!-- <span>Custom Classes: {{ JSON.stringify(customClasses) }}</span> -->
          <VisibleIcon style="fill:green;stroke:green;" v-if="customClasses.visible == 'yes'"/>
          <HiddenIcon style="fill:red;" v-if="customClasses.visible == 'no'"/>
          <NAIcon v-if="customClasses.visible == 'na'"/>
          <LockedIcon style="fill:red;" v-if="customClasses.locked == 'yes'"/>
          <UnlockedIcon style="fill:green;" v-if="customClasses.locked == 'no'"/>
          <NAIcon v-if="customClasses.locked == 'na'"/>
          <NoteIcon style="fill:green;" v-if="customClasses.note == 'yes'"/>
          <NoteIcon style="fill:lightgray;" v-if="customClasses.note == 'no'"/>
          <NAIcon v-if="customClasses.note == 'na'"/>
          <MoreChildrenIcon v-if="!model.treeNodeSpec.state.expanded && customClasses.numchildren > 0 && model[model.treeNodeSpec.childrenProperty].length == 0" />
        </div>
      </template>
  </tree-view>
</template>

<style>
@import './assets/base.css';

#app {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;

  font-weight: normal;
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

@media (hover: hover) {
  a:hover {
    background-color: hsla(160, 100%, 37%, 0.2);
  }
}

@media (min-width: 1024px) {
  body {
    display: flex;
    place-items: center;
  }

  #app {
    display: grid;
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
