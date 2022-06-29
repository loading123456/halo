const { json } = require("express")
const fs = require("fs")

module.exports.stories = {}

module.exports.load_stories = ()=>{
    let json_files = fs.readdirSync("./storage/jsons")

    for(let i=0; i<json_files.length; i++){
        this.stories[json_files[i].replace(".json", '')] = JSON.parse(fs.readFileSync(`./storage/jsons/${json_files[i]}`))
    }
}

module.exports.save = (story_name)=>{
    fs.writeFileSync(`./storage/jsons/${story_name}.json`, JSON.stringify(this.stories[story_name]))
}