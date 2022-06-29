const express = require("express")
const router = express.Router()
const path = require("path")

const actions = require("../controllers/actions")


router.get("/", (req, res)=>{
  actions.come_to_index(req, res)
})


router.get("/get_story_names", (req, res)=>{
    actions.get_story_names(req, res)
})




router.post("/identity/:story_name", (req, res)=>{
  actions.identity_story(req, res)
})

router.post("/extract/:story_name", (req, res)=>{
  actions.extract_imgs(req, res)
})


router.post("/rename/:story_name", (req, res)=>{
  actions.rename_imgs(req, res)
})

router.post("/view/:story_name", (req, res)=>{
  actions.view_story(req, res)
})

router.get("/get_story_name_view", (req, res)=>{
  res.send(story_name)
})

router.post("/delete/:story_name", (req, res)=>{
  actions.delete_story(req, res)
})

router.get("/close_server", (req, res)=>{
  
  actions.close_server(req, res)

})




module.exports = router