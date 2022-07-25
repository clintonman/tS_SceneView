<script>
export default {
    props: ["contextevent"],
    data() {
        return {
            NodeName: ""
        }
    },
    beforeMount() {
        this.NodeName = "Group_" + this.S4();
    },
    mounted() {
        this.$refs.nameinput.focus();
        this.$refs.nameinput.select();
        // this.$nextTick(() => this.$refs.nameinput.select());
    },
    methods: {
        SetName() {
            // console.log("emit")
            // console.log(this.contextevent);
            this.$emit('onNodeRenamed', this.NodeName);
        },
        CancelName() {
            // console.log("emit")
            // console.log(this.contextevent);
            this.$emit('onNodeRenamed', "");
        },
        S4() {
            return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
        }
    }
}
</script>

<template>
    <div class="dialog-container" :style="{top:contextevent.clientY - 40 + 'px'}">
        <label for="">Group Name</label>
        <input type="text" name="" id="" v-model="NodeName" ref="nameinput">
        <button @click="SetName">OK</button><button @click="CancelName">Cancel</button>
    </div>
</template>

<style>
.dialog-container {
    background-color: gray;
    padding: 1.5em;
    position:absolute;
    width: 45em;
    display:grid;
    grid-template-columns: 7em 20em 5em 5em;
    grid-gap: 0.5em;
}
</style>