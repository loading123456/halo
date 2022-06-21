import zipfile
import os
import sys
import shutil

if sys.argv[2] != "" and sys.argv[2][-1]!="/":
    sys.argv[2] += "/"

if os.path.exists(sys.argv[2]+sys.argv[1].split("/")[-1][:-4]):
    shutil.rmtree(sys.argv[2]+sys.argv[1].split("/")[-1][:-4])    

with zipfile.ZipFile(sys.argv[1], 'r') as zipObj:
    zipObj.extractall(sys.argv[2]+sys.argv[1].split("/")[-1][:-4])

print("Extracted!")