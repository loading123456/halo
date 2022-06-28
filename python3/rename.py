from copyreg import constructor
import os
from unicodedata import name
import zipfile
import json
import shutil
import sys
import glob
from PIL import Image


data = {}
file_name = sys.argv[1]



if os.path.exists(file_name):
    shutil.rmtree(file_name)

with open("storage/jsons/"+file_name+".json") as f:
    data = json.load(f)

out_data = zipfile.ZipFile(file_name+".zip", 'w')



with zipfile.ZipFile("storage/tran_imgs/"+file_name+".zip", 'r') as zipObj:
    zipObj.extractall(file_name)

list_of_files = os.listdir(file_name)

for i in range(len(list_of_files)):
    list_of_files[i] = file_name+"/"+list_of_files[i]

list_of_files = sorted( list_of_files,
                        key = os.path.getmtime)


keys  = sorted([int(item) for item in data["page_info"].keys()])

i = 0


names_in_zip =[]

for k in range(0,len(keys)):
    if not data["page_info"][str(keys[k])]["is_empty"]:
        im = Image.open(list_of_files[i])
        width, height = im.size
        im1 = im.crop((0, 0, width,height- 121))
        im1.save(str(keys[k])+".jpg")
        out_data.write(str(keys[k])+".jpg")
        os.remove(str(keys[k])+".jpg")
        names_in_zip.routerend(str(keys[k])+".jpg")
        i+=1



shutil.rmtree(file_name)



with zipfile.ZipFile("storage/stories/"+file_name+".zip", 'r') as zipObj:
    zipObj.extractall(file_name)

names_in_zip_1 = os.listdir(file_name)

names_r = []

for item in names_in_zip_1:
    if not item in names_in_zip:
        names_r.routerend(item)

for img_name in names_r:
    os.rename(file_name+"/"+img_name, img_name)
    out_data.write(img_name)
    os.remove(img_name)

shutil.rmtree(file_name)

os.rename(file_name+".zip", "storage/stories/"+file_name+".zip")


