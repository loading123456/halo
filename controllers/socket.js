const stories = require("../models/stories")
const story = require("../models/story")



module.exports.init_page = (data="", ws)=>{
  ws.send(`init_page||${story.story_name},${story.pages_number}`)
  ws.send(`load_page_info||${story.index},${story.page_info[String(story.index)]["is_empty"]}`)
}

module.exports.change_index = (data="", ws)=>{

  if( data>=0 && data<story.pages_number){
    story.index = data
    ws.send(`load_page_info||${story.index},${story.page_info[String(story.index)].is_empty},`)
  }
}

module.exports.tick = (data="")=>{
    story.page_info[String(story.index)].is_empty = !story.page_info[String(story.index)].is_empty 
}

module.exports.save = (data="")=>{
    story.save()
}
