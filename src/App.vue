<template>
  <div id="app">
    <h1>Chopi</h1>
    <div v-show='!loginState'>
      <Login v-on:submitLogin='handleLoginStatus'/>
    </div>
    <div v-show='loginState'>
      <ListView v-bind:userId='userId' v-bind:listId='listId' v-bind:lists='lists' v-on:getLists='getLists' v-on:updateListId='updateListId'/>
    </div>
  </div>
</template>

<script>
import ListView from './components/ListView.vue'
import Login from './components/Login.vue'
import axios from 'axios'

export default {
  name: 'App',
  data: function(){
    return{
      loginState: false,
      userId: 0,
      lists: [],
      listId: 0
    }
  },
  components: {
    ListView,
    Login
  },
  methods:{
    handleLoginStatus(event){
      this.loginState = true
      this.userId= event.data.user.id
      this.getLists(this.userId)
    },
    getLists(userId){
      axios.get(`http://localhost:4000/lists/${userId}`).then((lists)=>{
        this.lists=lists.data
        console.log(lists.data[0].id)
        this.updateListId(lists.data[0].id)
      }).catch((err)=>console.log(err))
    },
    updateListId(id){
      this.listId= id
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
#logo {
  width: 250px
}
</style>
