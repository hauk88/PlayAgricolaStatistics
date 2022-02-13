import streamlit as st
import pandas as pd

import os
import sys
# Import create_pwr_table 
current = os.path.dirname(os.path.realpath(__file__))
parent = os.path.dirname(current)
sys.path.append(parent)
from create_pwr_table import CardStats


from helpers import base_url

@st.cache
def read_data():
    # Read df
    file="./../Data/pwr_stats.pkl"
    df = pd.DataFrame(pd.read_pickle(file))

    file="./../Data/database_of_cards.dat"
    deck_df = pd.read_csv(file, sep='\t')[['Image', 'Deck']]
    df = pd.merge(df, deck_df, how='left', left_on='img_name', right_on='Image')
    return df


df = read_data()
df = df.sort_values(by=['PWR'], ascending=False)

display_df = df[['name', 'PWR']]
display_df = display_df.reset_index(drop=True)

st.dataframe(display_df)

n = st.number_input('Select card', min_value=0, max_value=df.size-1, value=0, step=1)
name,deck = df[['img_name','Deck']].values[n]
url = f'{base_url(deck)}{name}.jpg'

st.image(url)