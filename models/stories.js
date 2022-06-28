const { json } = require("express")
const fs = require("fs")

module.exports.stories = {}

module.exports.load_stories = ()=>{
    // let json_files = fs.readdirSync("../storage/jsons")

    // for(let i=0; i<json_files.length; i++){
    //     this.stories[json_files[i].replace(".json", '')] = fs.readFileSync(`../storage/jsons/${json_files[i]}`)
    // }
    console.log("Load stories")
}