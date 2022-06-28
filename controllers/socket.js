
module.exports.init_page = (data="", ws)=>{
    ws.send(`init_page||${story_name},${story_info["pages_number"]}`)
    ws.send(`load_page_info||${story_info["index"]},${story_info["page_info"][String(page_index)]["is_empty"]}`)
  story_info["page_info"][String(page_index)].is_readed = true
  
}

module.exports.change_index = (data="", ws)=>{
  if( data>=0 && data<story_info["pages_number"]){
    story_info["index"] = data
    page_index = data
    ws.send(`load_page_info||${story_info["index"]},${story_info["page_info"][String(page_index)].is_empty},`)

    story_info["page_info"][String(page_index)].is_readed = true
  }
}

module.exports.tick = (data="")=>{
    story_info["page_info"][String(page_index)].is_empty = !story_info["page_info"][String(page_index)].is_empty
}

module.exports.save = (data="")=>{
    fs.writeFile("./storage/jsons/"+story_name+".json", JSON.stringify(story_info), (err)=>{})
}
