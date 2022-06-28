const stories = require("../models/stories")


let story_names
let story_info
let story_name 
let page_index



module.exports.get_story_names = (req, res)=>{
  
    let res_data = {}

    story_names = data 



    for (i in stories.stories){

      res_data[i] = stories.stories[i]["stage"]
    }
    res.send(JSON.stringify(res_data))
  
}




module.exports.identity_story = (req, res)=>{
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

module.exports.extract_imgs = (req, res)=>{
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

module.exports.rename_imgs = (req, res)=>{
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


module.exports.view_story = (req,res)=>{
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


module.exports.delete_story = (req, res)=>{
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




