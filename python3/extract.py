import os
import zipfile
import json
import shutil
import sys

file_name = sys.argv[1]

data = {}



if os.path.exists(file_name):
    shutil.rmtree(file_name)

with open("storage/jsons/"+file_name+".json") as f:
    data = json.load(f)

out_data = zipfile.ZipFile(file_name+".zip", 'w')

with zipfile.ZipFile("storage/stories/"+file_name+".zip", 'r') as zipObj:
    zipObj.extractall(file_name)

keys  = sorted([int(item) for item in data["page_info"].keys()])

for k in keys:
    if not data["page_info"][str(k)]["is_empty"]:
        os.rename(file_name+"/"+str(k)+".jpg", str(k)+".jpg")
        out_data.write(str(k)+".jpg")
        os.remove(str(k)+".jpg")
shutil.rmtree(file_name)
os.rename(file_name+".zip", "storage/untran_imgs/"+file_name+".zip")