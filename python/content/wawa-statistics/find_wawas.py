import http.client
import json
import time

conn = http.client.HTTPSConnection("www.wawa.com")


coords = [
    {"latitude": 33.21292557430234, "longitude": -86.78343388277315}, # Alabama
    {"latitude": 38.94216542578203, "longitude": -75.47716093772388}, # Delaware
    {"latitude": 27.92340478259995, "longitude": -81.67186192597387}, # Florida
    {"latitude": 32.14267180674801, "longitude": -83.20743736228074}, # Georgia
    {"latitude": 40.53805291022152, "longitude": -86.12503069126379}, # Indiana
    {"latitude": 37.673295756057385, "longitude": -84.29243899470653}, # Kentucky
    {"latitude": 39.39028570445561, "longitude": -77.02521636026935}, # Maryland
    {"latitude": 40.01345482905636, "longitude": -74.56623793409696}, # New Jersey
    {"latitude": 35.842720560893035, "longitude": -79.67004895457568}, # North Carolina
    {"latitude": 40.293925454476316, "longitude": -82.52660510684396}, # Ohio
    {"latitude": 40.88937778409294, "longitude": -77.65365637650396}, # Pennsylvania
    {"latitude": 37.81515423731911, "longitude": -78.77387447543269}, # Virginia
    {"latitude": 38.89421944264099, "longitude": -77.04281534600585}, # Washington, D.C.
    {"latitude": 38.44953805131787, "longitude": -80.95990485444845}, # and West Virginia
]
stores = {}

while len(coords) > 0:
    coord = coords.pop()
    try:
        payload = '{ "query": "query FindNearLocations($latitude: Latitude!, $longitude: Longitude!) { findNearLocations(latitude: $latitude, longitude: $longitude) { results { distance name coordinates { latitude longitude } address { address city state zip } } }}", "variables": { "latitude": ' + str(coord['latitude']) + ', "longitude": ' + str(coord["longitude"]) + ' }}'

        headers = {
            'content-type': "application/json",
            'user-agent': "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36 Edg/134.0.0.0"
        }

        conn.request("POST", "/api/bff", payload, headers)

        res = conn.getresponse()
        data = res.read()

        result = json.loads(data.decode("utf-8"))
        storesToCheck = {  }

        for store in result["data"]["findNearLocations"]["results"]:
            if stores.get(store["name"]):
                continue
            stores[store["name"]] = store
            eastOrWest = "east" if coord['latitude'] > store['coordinates']['latitude'] else "west"
            northOrSouth = "north" if coord['longitude'] < store['coordinates']['longitude'] else "south"
            directionKey = northOrSouth + eastOrWest
            if directionKey not in storesToCheck or storesToCheck[directionKey]['distance'] < store['distance']:
                storesToCheck[directionKey] = store
        for store in storesToCheck.values():
            coords.append(store['coordinates'])

        print(len(stores))

        with open('stores.json', 'w') as stores_file:
            json.dump(stores, stores_file, indent=4)
    except:
        coords.append(coord)
    time.sleep(45)