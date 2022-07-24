<script>
export default {
    data() {
        return {
            NodeName: ""
        }
    },
    methods: {
        SetName() {
            console.log("emit")
            this.$emit('onNodeRenamed', this.NodeName);
        },
        CancelName() {
            console.log("emit")
            this.$emit('onRenameCancelled');
        }
    }
}
</script>

<template>
<div class="dialog-container">
    <label for="">Group Name</label>
    <input type="text" name="" id="" v-model="NodeName">
    <button @click="SetName">OK</button><button @click="CancelName">Cancel</button>
</div>
</template>

<style>
.dialog-container {
    background-color: gray;
    padding: 1.5em;
    position:absolute;
    top: 50%;
    width: 45em;
    display:grid;
    grid-template-columns: 7em 20em 5em 5em;
    grid-gap: 0.5em;
}
</style>