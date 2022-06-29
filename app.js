const express = require('express')
const path = require("path")
const router = express()
const server = require('http').createServer(router);
const WebSocket = require('ws');
const fs = require("fs");
const wss = new WebSocket.Server({ server:server });



const index_route = require("./routes/index")
const socket_controller = require("./controllers/socket")
const stories = require("./models/stories")

router.use("/public", express.static(path.join(__dirname, 'public')))
router.use("/", index_route)


function upload_stories(){
  console.log("upload stories")
  let raw_stories = fs.readdirSync("/storage/emulated/0/halo/storage/stories")

  if(raw_stories.length > 0 ){
    for(let i=0; i<raw_stories.length; i++){
      fs.renameSync(`/storage/emulated/0/halo/storage/stories/${raw_stories[i]}`, `storage/stories/${raw_stories[i]}`)
      // fs.copyFileSync(`/storage/emulated/0/halo/storage/stories/${raw_stories[i]}`, `storage/stories/${raw_stories[i]}`)
      // fs.unlinkSync(`/storage/emulated/0/halo/storage/stories/${raw_stories[i]}`)
    }
  }
  format_stories(0, raw_stories)

}

function format_stories(t, _stories){
  console.log("format stories")
  if(_stories.length > 0){
    let action = spawn("python3", ["python3/format.py", _stories[t].replace(".zip",'')])

    action.stderr.on("data", (err)=>{
      console.log(String(err))
    })

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
  stories.load_stories()
  server.listen(3030, () => console.log(`Lisening on port :3030\n`))
}


upload_stories()


wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {
        let func_name = String(message).split("||")[0]
        let data = String(message).split("||")[1]
        if (func_name in socket_controller && typeof socket_controller[func_name] === "function") {
          socket_controller[func_name](data, ws);
        }
        else{
          console.log("Function socket not exits!")
        }
    });
});
  
