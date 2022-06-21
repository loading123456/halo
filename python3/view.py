import os
import zipfile
import shutil
import sys

story_name = sys.argv[1]


with zipfile.ZipFile("storage/stories/"+story_name+".zip", 'r') as zipObj:
    zipObj.extractall("public/"+story_name)
