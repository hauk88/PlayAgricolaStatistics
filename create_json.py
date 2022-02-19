from create_pwr_table import *

file="./Data/pwr_stats.pkl"
df = pd.DataFrame(pd.read_pickle(file))

file="./Data/database_of_cards.dat"
deck_df = pd.read_csv(file, sep='\t')[['Image', 'Deck']]
df = pd.merge(df, deck_df, how='left', left_on='img_name', right_on='Image')
df = df.drop(columns=["Image"])

json_str = df.to_json()

f = open("./Data/data.json", 'w')
f.write(json_str)
f.close()