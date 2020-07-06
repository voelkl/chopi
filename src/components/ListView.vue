<template>
  <div class="inputContainer" >
    <b-card no-body>
      <b-tabs pills card vertical>
        <b-tab v-on:click='editTab(i.id)' contenteditable="false" v-for="i in lists" :key="'dyn-tab-' + i.id" :id="'tab'+i.id" :title="i.name">
          <b-button size="sm" variant="danger" class="float-right" @click="deleteTab(i.id)">
            X
          </b-button>
          <h3>{{ i.name }}</h3>
          

        <Itemview v-on="$listeners" v-bind:listId='listId' v-bind:items='items' />

        </b-tab>

        <template v-slot:tabs-end>
          <b-nav-item role="presentation" @click.prevent="newTab" href="#"><b>+</b></b-nav-item>
        </template>

        <!-- Render this if no tabs -->
        <template v-slot:empty>
          <div class="text-center text-muted">
            There are no open tabs<br>
            Open a new tab using the <b>+</b> button above.
          </div>
        </template>
      </b-tabs>
    </b-card>
  </div>
</template>

<script>
import Itemview from './ItemView.vue'
import axios from 'axios'
export default {
  data: function (){
    return{
      delay: 700,
      clicks: 0,
      timer: null,
    }
  },
    components: {
      Itemview,
  },
  props:{
    userId: Number,
    lists: Array,
    listId: Number,
    items: Array,
    getItems: Function,
    updateListId: Function,
    getLists: Function,
    },
  created: function() {
  },
  methods: {
    newTab() {
      axios.post("http://localhost:4000/list", {
        user_id: this.userId,
        name: 'gorTab'
      }).then(()=>{
        this.$emit('getLists', this.userId)
      }).catch((err)=>console.log(err))
    },
    deleteTab(id){
      axios.delete(`http://localhost:4000/list/${id}`).then(()=>this.$emit('getLists', this.userId))
    },
    addEventListenerForInput(id){
      let self = this
      let myEditableElement = document.getElementById(`tab${id}___BV_tab_button__`);
      myEditableElement.addEventListener('input', function() {
      console.log('An edit input has been detected');
      console.log(myEditableElement.innerHTML);
      });
      myEditableElement.addEventListener('focusout', function(){
        let myEditableElement = document.getElementById(`tab${id}___BV_tab_button__`);
        myEditableElement.contentEditable = false
        axios.put(`http://localhost:4000/list/${id}`,{name:myEditableElement.innerHTML} ).then(()=>
        self.$emit('getLists', this.userId)
      )
        
      })
    },
    editTab(id){
      this.clicks++ 
          if(this.clicks === 1) {
            var self = this
            this.$emit('updateListId', id)
            this.timer = setTimeout(function() {
              self.clicks = 0
            }, this.delay);
          } else{
             clearTimeout(this.timer);  
             this.clicks = 0;
             let selectTab = document.getElementById(`tab${id}___BV_tab_button__`)
             selectTab.contentEditable = true
             this.addEventListenerForInput(id)
          }        	
    }
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 0 0 20px 0;
}
</style>
