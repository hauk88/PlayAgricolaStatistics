import os
import shutil
from create_pwr_table import *
import random as rn
import requests
import pandas as pd
import re
from PIL import Image
from time import sleep

def get_globus_name(files):
    files = [f for f in files if f.endswith('.png')]
    # remove the .png ending
    files = [f[:-4] for f in files]
    # strip all whitespace
    files = [f.replace(" ", "") for f in files]
    # remove special characters
    files = [f.replace("'", "") for f in files]
    # remove numerical characters
    files = [re.sub(r'[0-9]+', '', f) for f in files]
    # lowercase all
    files = [f.lower() for f in files]
    return files

def parse_globus_deck(copy=False):
    path = '/mnt/g/Min disk/Agricola/Decks/Globus/Original'
    oc_path = path + '/ocs'
    minor_path = path + '/minors'

    oc_files = os.listdir(oc_path)
    minor_files = os.listdir(minor_path)

    files = []
    source_paths = []
    card_types = []
    for f in oc_files:
        if not f.endswith('.png'):
            continue
        files.append(f)
        source_paths.append(oc_path + '/' + f)
        card_types.append("Occupation")
    for f in minor_files:
        if not f.endswith('.png'):
            continue
        files.append(f)
        source_paths.append(minor_path + '/' + f)
        card_types.append("MinorImprovement")
    
    names = get_globus_name(files)
    path = "./Data/globus_to_database.dat"
    # read file to dictionary line by line
    globus_to_database = {}
    with open(path) as f:
        lines = f.readlines()
        for line in lines:
            line = line.strip()
            line = line.split(' ')
            globus_to_database[line[0]] = line[1]
    
    names = [globus_to_database[f].lower() if f in globus_to_database else f for f in names]
    
    img_names = []
    download_path = "./webapp/public/img/"
    for i in range(len(names)):
        name = names[i]
        source_path = source_paths[i]
        img_name = 'globus_' + name + ".png"
        img_names.append(img_name)
        if copy:
            target_path = download_path + img_name
            prep_globus_image(source_path, target_path)
    
    df = pd.DataFrame(data={'name': names, 'image': img_names, "Type": card_types})
    return df


def get_dataframes():
    file="./Data/pwr_stats.pkl"
    df = pd.DataFrame(pd.read_pickle(file))

    file="./Data/database_of_cards.dat"
    deck_df = pd.read_csv(file, sep='\t') 

    file="./Data/bann_list.dat"
    banned_cards = pd.read_csv(file, sep='\t')

    return df, deck_df, banned_cards

def create_json(df,deck_df, bann_df, globus_df):
    df = pd.merge(df, deck_df[['Image', 'Deck', 'Type']], how='left', left_on='img_name', right_on='Image')
    df = df.drop(columns=["Image"])
    df = pd.merge(df, globus_df[['name', 'image', 'Type']], how='outer', left_on='name', right_on='name')
    df["Type"] = df["Type_x"].fillna(df["Type_y"])
    df = df.drop(columns=["Type_x", "Type_y"])
    # rename columns
    df = df.rename(columns={'image': 'alt_image'})
    # add image extension
    df['image'] = df['img_name'] + ".jpg"
    # set image to alt_image if image is null
    df['image'] = df['image'].fillna(df['alt_image'])

    df['banned'] = df['name'].isin(bann_df['Name'])
    df['id'] = df.index

    json_str = df.to_json(orient='records')

    f = open("./webapp/public/data/stats.json", 'w')
    f.write(json_str)
    f.close()


base_url1 = "http://playagricola.com/Agricola/Images/"
base_url2 = "http://playagricola.com/Agricola/Cards/Cards/"
def prefered_url(deck):
    if deck in ['E', 'I', 'K', 'G']:
        return [base_url1, base_url2]
    return [base_url2, base_url1]

def download_card(deck, card_name, download_path):
    base_urls = prefered_url(deck)
    jpg_card_name = card_name + ".jpg"
    img = None
    for base_url in base_urls:
        url = base_url + jpg_card_name
        try:
            response = requests.get(url, timeout=1)
            response.raise_for_status()
            img = response.content
            break
        except requests.exceptions.Timeout:
            print(f"Url timed out: {url}")
        except requests.exceptions.HTTPError:
            print(f"Could not get card from url: {url}")
    if not img:
        print(f"Could not download card {card_name}")
    file = open(download_path + jpg_card_name, "wb")
    file.write(img)
    file.close()


def download_images(deck_df):
    download_path = "./webapp/public/img/"

    for i in range(deck_df.shape[0]):
        row = deck_df.iloc[i]
        download_card(row.Deck, row.Image, download_path)
        sleep(0.1)


def prep_globus_image(source_path, target_path):
    im = Image.open(source_path)
    w, h = im.size
    n = 80
    im = im.crop((n, n, w-n,h-n))
    im = im.resize((229,357))
    im.save(target_path)

if __name__ == '__main__':
    (df, deck_df, bann_df) = get_dataframes()
    df["name"] = df["name"].str.lower()

    globus_df = parse_globus_deck(copy=True)
    create_json(df, deck_df, bann_df, globus_df)
    #download_images(deck_df)
