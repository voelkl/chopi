<template>
    <div>
        <b-form-input v-model="text" placeholder="Enter your item" v-on:keyup.enter="newItem"></b-form-input>
        <b-list-group>
            <b-list-group-item 
                    v-on:click='editItem(i.id)' 
                    contenteditable="false" 
                    v-for="i in this.items" 
                    :key="'dyn-item-' + i.id" 
                    :id="'item'+i.id" 
                    :title="i.name"
                >
                    {{i.name}}
            </b-list-group-item>
        </b-list-group>
    </div>
</template>
<script>
import axios from 'axios'
export default {
    name: 'Itemview',
    data: function(){
        return{
            delay: 700,
            clicks: 0,
            timer: null,
            text: '',
        }
    },
    props:{
        listId: Number,
        items: Array,
        getItems: Function,
    },

    methods: {
        mounted(){
        },
        newItem() {
            axios.post("http://localhost:4000/item", {
                list_id: this.listId,
                name: this.text
        }).then(()=>{
            this.text = ''
            this.$emit('getItems', this.listId)
        }).catch((err)=>console.log(err))
        },
        deleteTab(id){
            axios.delete(`http://localhost:4000/item/${id}`).then(()=>this.$emit('getItems', id))
        },
        addEventListenerForInput(id){
            let self = this
            let myEditableElement = document.getElementById(`item${id}`);
            myEditableElement.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    myEditableElement.contentEditable = false
                    axios.put(`http://localhost:4000/item/${id}`,{name:myEditableElement.innerHTML} ).then(()=>
                    self.$emit('getItems', self.listId))
                }
            });
            myEditableElement.addEventListener('focusout', function(){
                myEditableElement.contentEditable = false
                axios.put(`http://localhost:4000/item/${id}`,{name:myEditableElement.innerHTML} ).then(()=>
                self.$emit('getItems', self.listId)
            )
        })
        },
        toggleStrike(id){
            let item = document.getElementById(`item${id}`)
            if(item.classList.contains('strike')){
                item.classList.remove('strike')
            }else{
                item.classList.add('strike')
            }
            
        },     
        editItem(id){
        this.clicks++ 
            if(this.clicks === 1) {
                this.toggleStrike(id)
                var self = this
                this.timer = setTimeout(function() {
                self.clicks = 0
                }, this.delay);
            } else{
                clearTimeout(this.timer);  
                this.clicks = 0;
                let selectTab = document.getElementById(`item${id}`)
                selectTab.contentEditable = true
                this.addEventListenerForInput(id)
            }        	
        }
    }
}
</script>
<style scoped>
    .strike{
        text-decoration: line-through;
    }
</style>