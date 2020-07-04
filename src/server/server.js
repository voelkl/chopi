const express = require('express')
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const PORT = 4000;
const bcrypt = require('bcrypt');
const saltRounds = 10;
const DB = new sqlite3.Database("./db/chopiApp.db");


const app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req,res,next)=>{
  res.header('Access-Control-Allow-Origin', '*')
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  if(req.method === 'OPTIONS'){
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET')
    return res.status(200).json({})
  }
  next()
})

app.get('/', function(req,res){
  let sql = `SELECT * from lists`;
  DB.all(sql, function(err, rows){
    if(err){
      throw err
    }
    return res.json(rows)
  })
});

app.listen(4000, function(){
    console.log(`App running on localhost:${PORT}`);
});


app.post('/register', function(req, res){
    // check to make sure none of the fields are empty
    if( !req.body.name || !req.body.password ){
        return res.json({
            'status' : false,
            'message' : 'All fields are required'
        });
    }
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        let sql = `INSERT INTO users(name,password) VALUES('${
          req.body.name
        }','${hash}')`;
        DB.run(sql, function(err) {
          if (err) {
              console.log(err)
            throw err;
          } else {
            return res.json({
              status: true,
              message: "User Created"
            });
          }
        });
      });
    });

app.post("/login", function(req, res) {
  let sql = `SELECT * from users where name='${req.body.name}'`;
  DB.all(sql, [], (err, rows) => {
    if (err) {
      throw err;
    }
    if (rows.length == 0) {
      return res.json({
        status: false,
        message: "Sorry, wrong name or password"
      });
    }
    let user = rows[0];
    let authenticated = bcrypt.compareSync(req.body.password, user.password);
    delete user.password;
    if (authenticated) {
      return res.json({
        status: true,
        user: user
      });
    }
    return res.json({
      status: false,
      message: "Wrong Password, please retry"
    });
  });
});

app.post("/list", function(req, res){
  let user_id= req.body.user_id
  let name= req.body.name
  let sql = `INSERT INTO lists(name,user_id) VALUES('${name}', '${user_id}')`
  if (!req.body.name) { 
    return res.json({
      status: false,
      message: "List needs a name"
    });
  }
  DB.serialize( function(){
    DB.run(sql, function(err){
      if (err) {
        throw err;
      }
      return res.json({
        status: true,
        message: "List created"
      });
    })
  })
})
    
app.get("/lists/:id", function(req,res){
  let sql = `SELECT * FROM lists WHERE user_id=${req.params.id}`
  DB.all(sql, function(err, row){
    if(err){
      throw err
    }
    return res.json(row)
  })
})

app.put("/list/:id", function(req,res){
  let sql = `UPDATE lists SET name='${req.body.name}' WHERE id=${req.params.id}`
  DB.run(sql, function(err){
    if(err){
      throw err
    }
    return res.json("List updated")
  })
})

app.delete("/list/:id", function(req,res){
  let sql = `DELETE FROM lists WHERE id=${req.params.id}`
  DB.run(sql, function(err){
    if(err){
      throw err
    }
    return res.json("Deleted list")
  })
})

app.post("/item", function(req, res){
  let list_id= req.body.list_id
  let name= req.body.name
  let sql = `INSERT INTO items(name,list_id) VALUES('${name}', '${list_id}')`
  if (!req.body.name) { 
    return res.json({
      status: false,
      message: "Item needs a name"
    });
  }
  DB.serialize( function(){
    DB.run(sql, function(err){
      if (err) {
        throw err;
      }
      return res.json({
        status: true,
        message: "Item created"
      });
    })
  })
})
    
app.get("/items", function(req,res){
  let sql = `SELECT * FROM items WHERE list_id=${req.body.list_id}`
  DB.all(sql, function(err, row){
    if(err){
      throw err
    }
    return res.json(row)
  })
})

app.put("/item/:id", function(req,res){
  let sql = `UPDATE items SET name='${req.body.name}' WHERE id=${req.params.id}`
  DB.run(sql, function(err){
    if(err){
      throw err
    }
    return res.json("item updated")
  })
})

app.delete("/item/:id", function(req,res){
  let sql = `DELETE FROM items WHERE id=${req.params.id}`
  DB.run(sql, function(err){
    if(err){
      throw err
    }
    return res.json("Deleted item")
  })
})