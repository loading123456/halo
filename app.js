const express = require('express')
const path = require("path")
const app = express()
const server = require('http').createServer(app);
const WebSocket = require('ws');
const fs = require("fs");
const wss = new WebSocket.Server({ server:server });
const {spawn, exec} = require("child_process")




app.use("/public", express.static(path.join(__dirname, 'public')))


app.get("/test", (req, res)=>{
  res.sendFile(path.join(__dirname, "view/test.html"))
})

app.get("/", (req, res)=>{
  fs.readdir("/storage/emulated/0/halo/raw_stories", (err, stories)=>{
    if(stories!=undefined){
      stories.forEach(story=>{
        if(  fs.existsSync("/storage/emulated/nexus/halo/storage/stories/"+story)){
          fs.unlinkSync("/storage/emulated/nexus/halo/storage/stories/"+story)
        }
        fs.rename("/storage/emulated/0/halo/raw_stories/"+story, "/storage/emulated/nexus/halo/storage/stories/"+story, (err)=>{})
      })
    }
  })
  fs.readdir("/storage/emulated/0/halo/tran_imgs", (err, stories)=>{
    if(stories!=undefined){
      stories.forEach(story=>{
        if(fs.existsSync("/storage/emulated/nexus/halo/storage/tran_imgs/"+story)){
          fs.unlinkSync("/storage/emulated/nexus/halo/storage/tran_imgs/"+story)
        }
        fs.rename("/storage/emulated/0/halo/tran_imgs/"+story, "/storage/emulated/nexus/halo/storage/tran_imgs/"+story, (err)=>{})
        
      })
    }
  })

    res.sendFile(path.join(__dirname, "view/index.html"))

    fs.readdir("public", (err, data)=>{
      if(data!=undefined){
        data.forEach( n => {
          fs.rmSync("public/"+n, { recursive: true, force: true });
        })
      }
    })
})


app.get("/get_story_names", (req, res)=>{
    get_story_names(req, res)
})


app.post("/format/:story_name", (req, res)=>{
  format_story(req, res)
})

app.post("/identity/:story_name", (req, res)=>{
  identity_story(req, res)
})

app.post("/extract/:story_name", (req, res)=>{
  extract_imgs(req, res)
})


app.post("/rename/:story_name", (req, res)=>{
  rename_imgs(req, res)
})

app.post("/view/:story_name", (req, res)=>{
  view_story(req, res)
})

app.get("/get_story_name_view", (req, res)=>{
  res.send(story_name)
})

app.post("/delete/:story_name", (req, res)=>{
  delete_story(req, res)
})

app.get("/close_server", (req, res)=>{
  if(story_info !=undefined){
    save()
  }
  console.log("CLose")
  process.exit()

})

app.get('/download', function(req, res){
  res.download(`${__dirname}/Halo.zip`); // Set disposition and send it.
});


wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {
        let func_name = String(message).split("||")[0]
        let data = String(message).split("||")[1]
        if (func_name in global && typeof global[func_name] === "function") {
          global[func_name](data, ws);
        }
        else{
          console.log("Function not exits!")
        }
    });
});
  
  // stories, untran_imgs, tran_imgs, rename_imgs

let story_names
let story_info
let story_name 
let page_index


function load_data(){
  story_info = require("./storage/jsons/"+story_name+".json")
  page_index = story_info["index"]
}

function get_story_names(req, res){
  
  fs.readdir("storage/stories", (err, data)=>{
    let res_data = {}

    story_names = data != undefined ? data : []

    for (i in story_names){
      story_names[i] = story_names[i].replace(".zip", '')

      // if(fs.existsSync("storage/jsons/"+story_names[i]+".json")){
      //     let json_file = require("./storage/jsons/"+story_names[i]+".json" )
      //     res_data[story_names[i]] = json_file["stage"]
      // }
      // else  
      res_data[story_names[i]] = "Story is not format!"
    }

    res.send(JSON.stringify(res_data))
  })
}


function format_story(req, res){
  story_name = req.params.story_name

  if( fs.existsSync("storage/jsons/"+story_name+".json")){
    res.redirect("/")
  }
  else{
      let action = spawn("python3", ["python3/format.py", story_name])

      action.stderr.on("data", (err)=>{
        console.log(String(err))
      })
      action.on("close", ()=>{
        res.redirect("/")
      })
  }
}


function identity_story(req, res){
  story_name = req.params.story_name

  if( fs.existsSync("storage/jsons/"+story_name+".json") ){
    load_data()

    fs.rmSync("public/"+req.params.story_name, { recursive: true, force: true })
    let action = spawn("python3", ["python3/extract_zip.py","storage/stories/"+story_name+".zip", "public/"])
  
    action.on("close",()=>{
      res.sendFile(path.join(__dirname, "view/identity.html"))
      story_info["stage"] = "Identity"
      save()
    })
  }
  else res.send("<h1>You must format to story before identity!</h1>")
}

function extract_imgs(req, res){
  story_name = req.params.story_name
  if( fs.existsSync("storage/jsons/"+story_name+".json") ){
    load_data()

    let action = spawn("python3", ["python3/extract.py",story_name])

    action.on("close",()=>{
      exec(`cp "/storage/emulated/nexus/halo/${story_name}.zip" "/storage/emulated/0/halo/untran_imgs"`, (err)=>console.log(err))
      exec(`rm -r '${story_name}.zip'`,  (err)=>console.log(err))
      story_info["stage"] = "Extract!"
      res.redirect("/")
      save()

    })
    action.stderr.on("data", (err)=>{
      console.log(String(err))
    })
  }
  else{
    res.send("<h1>You must format to  story before extract!</h1>")
  }
}

function rename_imgs(req, res){
  story_name = req.params.story_name
  if( fs.existsSync("storage/jsons/"+story_name+".json") && fs.existsSync("storage/tran_imgs/"+story_name+".zip")){
    load_data()
    
    let action = spawn("python3", ["python3/rename.py",story_name])

    action.on("close",()=>{
      story_info["stage"] = "Rename!"
      res.redirect("/")
      save()
    })
    action.stderr.on("data", (err)=>{
      console.log(String(err))
    })
  }
  else{
    res.send("<h1>Error rename!</h1>")
  }  
}


function view_story(req,res){
    story_name = req.params.story_name
    if( fs.existsSync("storage/jsons/"+story_name+".json")  ){
      load_data()

        fs.rmSync("public/"+req.params.story_name, { recursive: true, force: true })
        let action = spawn("python3", ["python3/view.py",story_name])
        story_info["stage"] = "View!"
        save()
  
        action.on("close",()=>{
         
          res.sendFile(path.join(__dirname, "view/view.html"))
        })
        action.stderr.on("data", (err)=>{
          console.log(String(err))
        })

    }
    else res.send("<h1>Story was not formated!</h1>")
}


function delete_story(req, res){
  fs.rmSync("public/"+req.params.story_name, { recursive: true, force: true })
  if(fs.existsSync("storage/stories/"+req.params.story_name+".zip")){
    fs.unlinkSync("storage/stories/"+req.params.story_name+".zip")
  }

  if(fs.existsSync("storage/untran_imgs/"+req.params.story_name+".zip")){
    fs.unlinkSync("storage/untran_imgs/"+req.params.story_name+".zip")
  }

  if(fs.existsSync("storage/tran_imgs/"+req.params.story_name+".zip")){
    fs.unlinkSync("storage/tran_imgs/"+req.params.story_name+".zip")
  }

  res.sendFile(path.join(__dirname, "view/index.html"))
}


global.init_page = (data="", ws)=>{
    ws.send(`init_page||${story_name},${story_info["pages_number"]}`)
    ws.send(`load_page_info||${story_info["index"]},${story_info["page_info"][String(page_index)]["is_empty"]}`)
  story_info["page_info"][String(page_index)].is_readed = true
  
}

global.change_index = (data="", ws)=>{
  if( data>=0 && data<story_info["pages_number"]){
    story_info["index"] = data
    page_index = data
    ws.send(`load_page_info||${story_info["index"]},${story_info["page_info"][String(page_index)].is_empty},`)

    story_info["page_info"][String(page_index)].is_readed = true
  }
}

global.tick = (data="")=>{
    story_info["page_info"][String(page_index)].is_empty = !story_info["page_info"][String(page_index)].is_empty
}

global.save = (data="")=>{
    fs.writeFile("./storage/jsons/"+story_name+".json", JSON.stringify(story_info), (err)=>{})
}


server.listen(3030, () => console.log(`Lisening on port :3030\n`))