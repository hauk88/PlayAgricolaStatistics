import os
import shutil
from create_pwr_table import *
import random as rn
import requests
import pandas as pd
import re
from PIL import Image
from time import sleep


def is_image_file(file):
    return file.endswith(".png") or file.endswith(".jpg") or file.endswith(".jpeg")


def get_globus_name(files):
    # remove the image ending
    files = [f.split(".")[0] for f in files]
    # strip all whitespace
    files = [f.replace(" ", "") for f in files]
    # remove special characters
    files = [f.replace("'", "") for f in files]
    # lowercase all
    files = [f.lower() for f in files]
    return files


def parse_globus_deck(copy=False):
    paths = [
        "/mnt/g/Min disk/Agricola/Decks/Globus/Original",
        "/mnt/g/Min disk/Agricola/Decks/Globus/Minideck 1",
        "/mnt/g/Min disk/Agricola/Decks/Globus/Minideck 2",
    ]
    prefix = ["", "m1_", "m2_"]
    files = []
    source_paths = []
    card_types = []
    deck = []

    for i, path in enumerate(paths):
        oc_path = path + "/ocs"
        minor_path = path + "/minors"

        oc_files = os.listdir(oc_path)
        minor_files = os.listdir(minor_path)

        for f in oc_files:
            deck.append(prefix[i])

            if not is_image_file(f):
                continue
            files.append(f)
            source_paths.append(oc_path + "/" + f)
            card_types.append("Occupation")

        for f in minor_files:
            deck.append(prefix[i])

            if not is_image_file(f):
                continue
            files.append(f)
            source_paths.append(minor_path + "/" + f)
            card_types.append("MinorImprovement")

    names = get_globus_name(files)
    path = "./Data/globus_to_database.dat"
    # read file to dictionary line by line
    globus_to_database = {}
    with open(path) as f:
        lines = f.readlines()
        for line in lines:
            line = line.strip()
            line = line.split(" ")
            globus_to_database[line[0]] = line[1]

    names = [
        globus_to_database[f].lower() if f in globus_to_database else f for f in names
    ]

    img_names = []
    download_path = "./webapp/public/img/"
    for i in range(len(names)):
        name = names[i]
        source_path = source_paths[i]
        img_name = "globus_" + deck[i] + name + ".png"
        img_names.append(img_name)
        if copy:
            target_path = download_path + img_name
            prep_globus_image(source_path, target_path)

    df = pd.DataFrame(data={"name": names, "image": img_names, "Type": card_types})
    return df


def get_dataframes():
    file = "./Data/pwr_stats.pkl"
    df = pd.DataFrame(pd.read_pickle(file))

    file = "./Data/database_of_cards.dat"
    deck_df = pd.read_csv(file, sep="\t")

    file = "./Data/bann_list.dat"
    banned_cards = pd.read_csv(file, sep="\t")

    return df, deck_df, banned_cards


def merge_dataframes(df, deck_df, bann_df, globus_df):
    df = pd.merge(
        df,
        deck_df[["Name", "Image", "Deck", "Type"]],
        how="outer",
        left_on="img_name",
        right_on="Image",
    )
    df["name"] = df["name"].fillna(df["Name"])
    df["img_name"] = df["img_name"].fillna(df["Image"])
    df = df.drop(columns=["Name", "Image"])
    df = pd.merge(
        df,
        globus_df[["name", "image", "Type"]],
        how="outer",
        left_on="name",
        right_on="name",
    )
    df["Type"] = df["Type_x"].fillna(df["Type_y"])
    df = df.drop(columns=["Type_x", "Type_y"])
    # rename columns
    df = df.rename(columns={"image": "alt_image"})
    # add image extension
    df["image"] = df["img_name"] + ".jpg"
    # set image to alt_image if image is null
    df["image"] = df["image"].fillna(df["alt_image"])

    df["banned"] = df["name"].isin(bann_df["Name"])
    df["id"] = df.index
    return df


def create_json(df):
    json_str = df.to_json(orient="records")

    f = open("./webapp/public/data/stats.json", "w")
    f.write(json_str)
    f.close()


base_url1 = "http://playagricola.com/Agricola/Images/"
base_url2 = "http://playagricola.com/Agricola/Cards/Cards/"


def prefered_url(deck):
    if deck in ["E", "I", "K", "G"]:
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

    crop_factor = 80 / 890

    n = int(w * crop_factor)
    should_crop = n > 5 and w * h > 229 * 357
    if should_crop:
        im = im.crop((n, n, w - n, h - n))
    im = im.resize((229, 357))
    im.save(target_path)


def copy_no_deck_images(df, target_path):
    download_path = "./webapp/public/img/"
    for i in range(df.shape[0]):
        row = df.iloc[i]
        print(f"Copying {row['name']}")
        is_no_deck = False
        deck = "" if row["Deck"] is np.nan else row["Deck"].lower()
        if deck == "e" or deck == "i" or deck == "k" or deck == "wm" or deck == "fr":
            is_no_deck = True
        if row["alt_image"] is not np.nan:
            is_no_deck = True
        if row["banned"]:
            is_no_deck = False
        if is_no_deck:
            img = row["alt_image"] if row["alt_image"] is not np.nan else row["image"]
            shutil.copy(download_path + img, target_path + img)


def alt_merge_df(
    stat_df: pd.DataFrame,
    deck_df: pd.DataFrame,
    globus_df: pd.DataFrame,
    bann_df: pd.DataFrame,
):
    stat_df = stat_df.rename(columns={"name": "stat_name", "img_name": "stat_image"})

    deck_df = deck_df.rename(
        columns={
            "Name": "deck_name",
            "Type": "deck_type",
            "Deck": "deck_deck",
            "Image": "deck_image",
        }
    )
    globus_df = globus_df.rename(
        columns={"name": "globus_name", "image": "globus_image", "Type": "globus_type"}
    )
    bann_df = bann_df.rename(columns={"Name": "bann_name"})

    # Remove duplicated gardners wife card
    df = deck_df[~deck_df.duplicated(subset=["deck_name"])]

    df = pd.merge(df, stat_df, how="left", left_on="deck_image", right_on="stat_image")

    df["name"] = df["deck_name"].fillna(df["stat_name"])
    df["image"] = df["deck_image"].fillna("stat_image")

    df["name"] = df["name"].str.lower()

    df = pd.merge(df, globus_df, how="outer", left_on="name", right_on="globus_name")
    df["name"] = df["name"].fillna(df["globus_name"])
    df["type"] = df["deck_type"].fillna(df["globus_type"])
    df["alt_image"] = df["globus_image"]

    df["image"] = df["deck_image"] + ".jpg"
    df["image"] = df["image"].fillna(df["alt_image"])
    df["deck"] = df["deck_deck"]

    df["banned"] = df["name"].isin(bann_df["bann_name"])
    deck = df["deck"].str.lower()
    df["is_no"] = ~df["banned"] & (
        (deck == "e")
        | (deck == "i")
        | (deck == "k")
        | (deck == "wm")
        | (deck == "fr")
        | df["alt_image"].notna()
    )
    df["id"] = df.index
    return df[
        [
            "id",
            "name",
            "type",
            "deck",
            "image",
            "alt_image",
            "banned",
            "is_no",
            "dealt",
            "drafted",
            "played",
            "won",
            "ADP",
            "play_ratio",
            "win_ratio",
            "PWR",
            "PWR_no_log",
            "PWR_normalized",
        ]
    ]


if __name__ == "__main__":
    (stat_df, deck_df, bann_df) = get_dataframes()

    globus_df = parse_globus_deck(copy=False)
    df = alt_merge_df(stat_df, deck_df, globus_df, bann_df)

    # copy_no_deck_images(df, "/mnt/c/Users/hauk8/Pictures/img/")
    create_json(df)
    # download_images(deck_df)
