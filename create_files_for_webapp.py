from create_pwr_table import *
import random as rn
import requests
import pandas as pd
from time import sleep


def get_dataframes():
    file="./Data/pwr_stats.pkl"
    df = pd.DataFrame(pd.read_pickle(file))

    file="./Data/database_of_cards.dat"
    deck_df = pd.read_csv(file, sep='\t') 

    return df, deck_df

def create_json(df,deck_df):
    df = pd.merge(df, deck_df[['Image', 'Deck']], how='left', left_on='img_name', right_on='Image')
    df = df.drop(columns=["Image"])
    df['id'] = df.index

    json_str = df.to_json(orient='records')

    f = open("./webapp/src/data.json", 'w')
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


if __name__ == '__main__':
    (df, deck_df) = get_dataframes()
    create_json(df, deck_df)
    #download_images(deck_df)
