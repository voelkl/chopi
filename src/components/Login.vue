<template>
    <div>
        <div class='inputContainer'>
            <img id="logo" alt="Vue logo" src="../assets/logo.jpg">
        </div>
        <h3>Hola Gordos</h3>  
        <h4>Que habido pues</h4>
        <div>
            <ul>
                <li>
                <input 
                class="bg-white
                    focus:outline-none 
                    focus:shadow-outline 
                    border border-gray-300 
                    rounded-lg 
                    py-2 
                    px-4 
                    appearance-none 
                    leading-normal" 
                v-on:keyup.13='signin' 
                v-model="name" 
                placeholder="Name">
                </li>
                <li>
                <input 
                class="bg-white
                    focus:outline-none 
                    focus:shadow-outline 
                    border border-gray-300 
                    rounded-lg 
                    py-2 
                    px-4 
                    appearance-none 
                    leading-normal" 
                v-on:keyup.13='signin' 
                type='password' 
                v-model="password" 
                placeholder="Password">
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
import axios from 'axios'
export default {   
 data: function(){
     return{
        name: "",
        password: "",
        status: false,
     }
 },
 methods:{
    signin(e){
        if (e.keyCode === 13) {
        axios.post('http://localhost:4000/login', { 
            name: this.name,
            password: this.password
        }).then((response)=>{
            if(response.data.status === true){
                this.$emit('submitLogin', response)
            }else {
                window.alert(response.data.message)
            }
            
        })
        }
     },
 }
}
</script>