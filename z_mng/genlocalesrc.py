# -*- coding: utf-8 -*-
import sys
import os
import requests
import pandas as pd
from io import StringIO

#===============================================
#
# App locale generate tool
# 
# use manual:
# 1, you create csv for translation in Google spreadsheet etc
# 2, save the csv to local or set to below paramater
# 3, execute this script (set "mode" paramater.)
#
#===============================================


#===============================================
# configration
#===============================================
# load type: w - web, l - local
mode = "w"

# web url
url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSXC5rrt131DE6eu10ucTkS4aRNnhYBDLActJoaFTEkiVe490R5--FeQ6B2C-pihVSgJ4glCy21hRze/pub?gid=1867365001&single=true&output=tsv"


# local file path
path = 'E:\\IshiiEiju\\documents\\downloads\\Translation-vrmviewer.tsv'


# output file directory
outdir = [
    #"D:\\cygwin64\\home\\IshiiEiju\\prog\\js\\quasar\\umd\\VRMViewMeister",
    "D:\\cygwin64\\home\\IshiiEiju\\prog\\js\\quasar\\umd\\VRMViewMeister\\src\\locales",
    "D:\\cygwin64\\home\IshiiEiju\\prog\\js\\quasar\\umd\\VRMViewMeister\\public\\static\\locales"
]

#===============================================
# main 
#===============================================
myui_dataframe: pd.DataFrame = None
myui_isload = False

def loadFromWeb():
    r = requests.get(url)
    r.encoding = r.apparent_encoding
    if r.ok:
        u8 = r.text
        return pd.read_csv(StringIO(u8),delimiter="\t")
    else:
        return None
    
def loadFromLocal():
    df = pd.read_csv(path,delimiter="\t",encoding="utf-8")
    return df
    
def loadBarancer():
    global myui_dataframe, myui_isload
    if (mode == "w"):
        print('mode: from CSV on the Web')
        myui_dataframe = loadFromWeb()
        myui_isload = True
    elif (mode == "l"):
        print('mode: from CSV on the local')
        myui_dataframe = loadFromLocal()
        myui_isload = True

def analyze_csv():
    global myui_dataframe
    column_names = myui_dataframe.columns
    print(column_names)
    for v in column_names:
        if (v.find("translation") > -1):
            print(v)
            json = myui_dataframe.loc[:, ["resource id", v]]
            save_file(json, v.replace("translation:",""))

def save_file(json: pd.DataFrame, localestr):
    global outdir
    #print(json)
    print(f'{localestr}===>')
    cnt  = json["resource id"].count()
    print(f'translation item count={cnt}')
    arr = []
    for i,v in enumerate(range(0,cnt)):
        arr.append(f'"{json.iloc[i,0]}":"{json.iloc[i,1]}"')

    for o in outdir:
        fullpath = os.path.join(o, localestr+".js")
        print("output file:")
        print(fullpath)
        
        f = open(fullpath, mode="w",encoding="utf-8")
        f.write("export default {")
        f.write(",".join(arr))
        f.write("}")
        f.close()
        
    print("...ok")
    print(" ")


print("start creation of translation string.")
loadBarancer()
print(myui_isload)
if myui_isload == True:
    analyze_csv()
    print("all locale successed.")
else:
    print("file or URL not found.")