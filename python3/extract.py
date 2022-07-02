import os
import zipfile
import json
import shutil
import sys
import time


_time = 1000000000


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
    print(k)
    if not data["page_info"][str(k)]["is_empty"]:
        os.rename(file_name+"/"+str(k)+".jpg", str(k)+".jpg")
        os.utime(str(k)+".jpg", (_time, _time))
        out_data.write(str(k)+".jpg")
        os.remove(str(k)+".jpg")
        _time+=100
shutil.rmtree(file_name)