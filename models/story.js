const { json } = require("express")
const fs = require("fs")

const stories = require("./stories")

module.exports.story_name 
module.exports.page_info
module.exports.index
module.exports.pages_number

module.exports.load_story = (story_name)=>{
    this.story_name = story_name
    this.page_info = stories.stories[story_name].page_info
    this.index = stories.stories[story_name].index
    this.pages_number = stories.stories[story_name].pages_number
}

module.exports.save = ()=>{
    stories.stories[this.story_name].page_info = this.page_info
    stories.stories[this.story_name].index = this.index
    
    stories.save(this.story_name)
}