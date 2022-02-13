_base_url1 = "http://playagricola.com/Agricola/Images/"
_base_url2 = "http://playagricola.com/Agricola/Cards/Cards/"

def base_url(deck):
    if deck in ['E', 'I', 'K', 'G']:
        return _base_url1
    return _base_url2