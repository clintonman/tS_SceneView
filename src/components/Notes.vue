

<script>
import { QuillEditor, Delta } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';
export default {
   components: {
      QuillEditor,
      Delta
   },
   props: ["connection", "CloseNoteEditor", "htmlnote","initialDelta", "tsnode"],
    data() {
      return {
         mycontent: new Delta([]),
         edittop: 0,
         editleft: 0,
         // showNoteEditor: true
      };
    },
   //  mounted: function() {
    beforeMount: function() {
      console.log("notes before mounted")
      this.mycontent = this.initialDelta;
   },

    methods: {
       SaveNote() {
         console.log("savenote")
         //send to tS here
         let msg = {command:"AddNotes"};
         msg.path = this.tsnode;
         msg.html = this.$refs.editor.getHTML();
         msg.delta = JSON.stringify(this.mycontent);
         this.$emit('onNoteClose', msg.html);
         this.connection.send(JSON.stringify(msg));
      },
       CancelNote() {
         this.$emit('onNoteClose');
      },
      DeleteNote() {
         let msg = {command:"DeleteNotes"};
         msg.path = this.tsnode;
         this.connection.send(JSON.stringify(msg));
         this.$emit('onNoteClose','<p></p>');
      }
    }

}
</script>

<template>

   
  <div id="quill-container">
    <QuillEditor theme="snow" toolbar="full" 
      v-model:content="mycontent" 
      ref="editor"
    />
    <div class="button-group">
       <button @click="SaveNote">Save</button>
       <button @click="CancelNote">Cancel</button>
       <button @click="DeleteNote">Delete</button>
    </div>
    
  </div>


</template>

<style>
   #quill-container {
      padding: 0.3em !important;
      margin: 0 !important;
      max-width:none !important;
   }

   .ql-toolbar.ql-snow {
      padding: 0;
   }
   .ql-editing {
      z-index: 1;
   }
   .ql-editor {
      max-height: 40vh;
   }
   .button-group {
      display: grid;
      grid-template-columns: 5em 5em 5em;
      gap: 0.5em;
      justify-content: end;
      margin-top: 2em;
   }
</style>