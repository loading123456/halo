const express = require("express")
const router = express.Router()
const path = require("path")

const actions = require("../controller/actions")


router.get("/", (req, res)=>{
    res.sendFile(path.join(__dirname.replace("routes", ''), "views/index.html"))


})


router.get("/get_story_names", (req, res)=>{
    actions.get_story_names(req, res)
})




router.post("/identity/:story_name", (req, res)=>{
  identity_story(req, res)
})

router.post("/extract/:story_name", (req, res)=>{
  extract_imgs(req, res)
})


router.post("/rename/:story_name", (req, res)=>{
  rename_imgs(req, res)
})

router.post("/view/:story_name", (req, res)=>{
  view_story(req, res)
})

router.get("/get_story_name_view", (req, res)=>{
  res.send(story_name)
})

router.post("/delete/:story_name", (req, res)=>{
  delete_story(req, res)
})

router.get("/close_server", (req, res)=>{
  if(story_info !=undefined){
    save()
  }
  console.log("CLose")
  process.exit()

})




module.exports = router