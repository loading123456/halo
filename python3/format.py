
import time
import os
import zipfile
import json
import shutil
import sys

_time = 1000000000

file_name =  sys.argv[1]


# Tao file zip de luu file anh chu va anh khong chu
output_data = zipfile.ZipFile(file_name+".zip", "w")

# Giai nen file zip
with zipfile.ZipFile("storage/stories/"+file_name+".zip", 'r') as zipObj:
    zipObj.extractall(file_name)


i = 0
pages_number = len(os.listdir(file_name))

dirFiles = []

for x in os.listdir(file_name):
    if ord(x[0]) > 57:
        dirFiles.append(str(ord(x[0]))+x[1:].zfill(9))

    else:
        dirFiles.append(x.zfill(8))
    os.rename(file_name+"/"+x, file_name+"/"+dirFiles[-1])

dirFiles = sorted(dirFiles)

for img_name in dirFiles:
    os.rename(file_name+"/"+img_name, str(i)+".jpg")
    os.utime(str(i)+".jpg", (_time, _time))
    output_data.write(str(i)+".jpg")
    os.remove(str(i)+".jpg")
    i += 1

data = {"stage":"formated", "page_info":{}, "index":0,"pages_number":pages_number}
for i in range(pages_number):
    data["page_info"][str(i)] = {"is_empty":True, "is_readed":False}


with open("storage/jsons/"+file_name+".json", 'w') as f:
    json.dump(data, f, indent=2)

print("\n")
shutil.rmtree(file_name)
os.rename(file_name+".zip", "storage/stories/"+file_name+".zip")
