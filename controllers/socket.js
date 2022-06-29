const stories = require("../models/stories")


let story
let _story_name 

module.exports.init_page = (story_name="", ws)=>{
  story = stories.get_story(story_name)
  _story_name = story_name
  console.log(btoa(encodeURIComponent(story_name)),'\n',story)

  // ws.send(`init_page||${story.pages_number}`)
  // ws.send(`load_page_info||${story.index},${story.page_info[String(story.index)]["is_empty"]}`)
}

module.exports.change_index = (data="", ws)=>{

  if( data>=0 && data<story.pages_number){
    story.index = data
    stories.stories[_story_name].index = data
    ws.send(`load_page_info||${story.index},${story.page_info[String(story.index)].is_empty},`)
  }
}

module.exports.tick = (data="")=>{
    story.page_info[String(story.index)].is_empty = !story.page_info[String(story.index)].is_empty 
    stories.stories[_story_name].page_info[String(story.index)] = story.page_info[String(story.index)].is_empty
}

module.exports.save = (data="")=>{
    stories.save(_story_name)
}
