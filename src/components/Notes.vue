

<script>
import { QuillEditor, Delta } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';
export default {
   components: {
      QuillEditor,
      Delta
   },
   props: ["CloseNoteEditor", "htmlnote","initialDelta", "tsnode"],
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
         // console.log(this.mycontent.getContents())
         console.log(this.mycontent.ops)
         // console.log(this.editor.root.innerHTML)
         console.log(this.$refs.editor.getHTML()) //.$el.querySelector('.ql-editor').innerHTML)
         // this.showNoteEditor=false
         //send to tS here
         let msg = {command:"AddNotes"};
         msg.path = this.tsnode;
         msg.html = this.$refs.editor.getHTML();
         msg.delta = JSON.stringify(this.mycontent);
         console.log(msg)
         // this.connection.send(JSON.stringify(msg));
         // this.tsnode = "";
         this.$emit('onNoteClose', msg.html);//TODO add arg for html update
      },
      LogNote(){
         console.log(this.mycontent)
      },
       CancelNote() {
         // this.showNoteEditor=false;
         // this.tsnode = "";
         this.$emit('onNoteClose');
      },
      DeleteNote() {
         // this.showNoteEditor=false;
         let msg = {command:"DeleteNotes"};
         msg.path = this.tsnode;
         this.connection.send(JSON.stringify(msg));
         // this.tsnode = "";
         this.$emit('onNoteClose');
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
    <button @click="SaveNote">save</button>
    <button @click="CancelNote">cancel</button>
    <button @click="DeleteNote">delete</button>
    <button @click="LogNote">log it</button>
    
  </div>


</template>

<style>

</style>