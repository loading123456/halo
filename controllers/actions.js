const stories = require("../models/stories")
const story = require("../models/story")
const fs = require("fs")
const {spawn, exec} = require("child_process")
const path = require("path")





module.exports.come_to_index = (req, res)=>{
  let files_in_public = fs.readdirSync("public")

  for(let i=0; i<files_in_public; i++){
    fs.rmSync("public/"+files_in_public[i], { recursive: true, force: true })
  }

  res.sendFile(path.join(__dirname.replace("controllers", ''), "views/index.html"))


}

module.exports.get_story_names = (req, res)=>{
  
    let res_data = {}

    for (i in stories.stories){

      res_data[i] = stories.stories[i]["stage"]
    }
    res.send(JSON.stringify(res_data))
  
}




module.exports.identity_story = (req, res)=>{
  let story_name = req.params.story_name
    story.load_story(story_name)

    fs.rmSync("public/"+story_name, { recursive: true, force: true })
    let action = spawn("python3", ["python3/extract_zip.py","storage/stories/"+story_name+".zip", "public/"])

    action.on("close",()=>{
      res.sendFile(path.join(__dirname.replace("controllers", ''), "views/identity.html"))
      stories.stories[story_name].stage = "Identiting"
      stories.save(story_name)
    })
}

module.exports.extract_imgs = (req, res)=>{
  let story_name = req.params.story_name
  story.load_story(story_name)

  let action = spawn("python3", ["python3/extract.py",story_name])

    action.on("close",()=>{
      fs.copyFileSync(`/storage/emulated/nexus/halo/${story_name}.zip`, `/storage/emulated/0/halo/storage/untran_imgs/${story_name}.zip`)
      fs.unlinkSync(`/storage/emulated/nexus/halo/${story_name}.zip`)
 
      stories.stories[story_name].stage =  "Extracting"
      stories.save(story_name)
      res.redirect("/")
    })
    action.stderr.on("data", (err)=>{
      console.log(String(err))
    })

}

module.exports.rename_imgs = (req, res)=>{
  let story_name = req.params.story_name
  story.load_story(story_name)

  if(  fs.existsSync("storage/tran_imgs/"+story_name+".zip")){
    
    let action = spawn("python3", ["python3/rename.py",story_name])

    action.on("close",()=>{
      stories.stories[story_name].stage = "Renaming"
      res.redirect("/")
      stories.save(story_name)
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
    let story_name = req.params.story_name
    story.load_story(story_name)
        fs.rmSync("public/"+story_name, { recursive: true, force: true })
        let action = spawn("python3", ["python3/view.py",story_name])
        stories.stories[story_name].stage = "Viewing!"
        stories.save(story_name)
  
        action.on("close",()=>{
          res.sendFile(path.join(__dirname.replace("controllers", ''), "views/view.html"))
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

module.exports.get_story_name_view = (req, res)=>{
  res.send(story.story_name)
}

module.exports.close_server = (req, res)=>{
  console.log("CLose")
  process.exit()
}



