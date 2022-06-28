const express = require('express')
const path = require("path")
const router = express()
const server = require('http').createServer(router);
const WebSocket = require('ws');
const fs = require("fs");
const wss = new WebSocket.Server({ server:server });
const {spawn, exec} = require("child_process")


const index_route = require("./routes/index")


router.use("/public", express.static(path.join(__dirname, 'public')))
router.use("/", index_route)


function upload_stories(){
  console.log("upload stories")
  let raw_stories = fs.readdirSync("/storage/emulated/0/halo/storage/stories")

  if(raw_stories.length > 0 ){
    for(let i=0; i<raw_stories.length; i++){
      fs.copyFileSync(`/storage/emulated/0/halo/stories/${raw_stories[i]}`, `storage/stories/${raw_stories[i].replaceAll(' ','_').replaceAll('-','_')}`)
      fs.unlinkSync(`/storage/emulated/0/halo/stories/${raw_stories[i]}`)
    }
    format_stories(0, raw_stories)
  }

}

function format_stories(t, _stories){
  if(_stories.length > 0){
    let action = spawn("python3", ["python3/format.py", _stories[t].replace(".zip",'')])

    action.on("close", ()=>{
      if(t+1 == _stories.length){
        console.log("Full")
        upload_tran_imgs()
      }
      else{
        console.log(t)
        format_stories(t+1, _stories)
      }
    })
  }
  else{
    upload_tran_imgs()
  }
}

function upload_tran_imgs(){
  console.log("upload tran_imgs")

  let img_trans = fs.readdirSync("/storage/emulated/0/halo/storage/tran_imgs")

  for(let i=0; i<img_trans.length; i++){
    fs.renameSync(`/storage/emulated/0/halo/storage/tran_imgs/${img_trans[i]}`, `storage/tran_imgs/${img_trans[i]}`)
  }
  server.listen(3030, () => console.log(`Lisening on port :3030\n`))
}


upload_stories()


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

    story_names = data 

    for (i in story_names){
      story_names[i] = story_names[i].replace(".zip", '')

      let json_file = require("./storage/jsons/"+story_names[i]+".json" )
      res_data[story_names[i]] = json_file["stage"]
    }
    res.send(JSON.stringify(res_data))
  })
}




function identity_story(req, res){
  story_name = req.params.story_name

    load_data()

    fs.rmSync("public/"+req.params.story_name, { recursive: true, force: true })
    let action = spawn("python3", ["python3/extract_zip.py","storage/stories/"+story_name+".zip", "public/"])
  
    action.on("close",()=>{
      res.sendFile(path.join(__dirname, "view/identity.html"))
      story_info["stage"] = "Identiting"
      save()
    })

}

function extract_imgs(req, res){
  story_name = req.params.story_name
    load_data()

    let action = spawn("python3", ["python3/extract.py",story_name])

    action.on("close",()=>{
      exec(`cp /storage/emulated/nexus/halo/'${story_name}.zip' /storage/emulated/0/halo/storage/untran_imgs`, (err)=>{
        if(err){
          console.log("error in line 205")
        }
        else{
          exec(`rm -r '${story_name}.zip'`,  (err)=>{
            if(err){
              console.log("error in line 210")
            }
            else{
              story_info["stage"] = "Extracting"
              res.redirect("/")
              save()
            }
          })
        }
      })

    })
    action.stderr.on("data", (err)=>{
      console.log(String(err))
    })

}

function rename_imgs(req, res){
  story_name = req.params.story_name
  if(  fs.existsSync("storage/tran_imgs/"+story_name+".zip")){
    load_data()
    
    let action = spawn("python3", ["python3/rename.py",story_name])

    action.on("close",()=>{
      story_info["stage"] = "Renaming"
      res.redirect("/")
      save()
    })
    action.stderr.on("data", (err)=>{
      console.log(String(err))
    })
  }
  else{
    res.send("<h1>Not found img_trans!</h1>")
  }  
}


function view_story(req,res){
    story_name = req.params.story_name
      load_data()

        fs.rmSync("public/"+req.params.story_name, { recursive: true, force: true })
        let action = spawn("python3", ["python3/view.py",story_name])
        story_info["stage"] = "Viewing!"
        save()
  
        action.on("close",()=>{
         
          res.sendFile(path.join(__dirname, "view/view.html"))
        })
        action.stderr.on("data", (err)=>{
          console.log(String(err))
        })

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




