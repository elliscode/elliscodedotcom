import json

seeds = [
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


with open("stores.json", "r", encoding="utf-8") as f:
    data = json.load(f)

keys = list(data.keys())

with open("seeds.csv", 'w', encoding="utf-8") as f:
    i = 0
    f.write(f"name,lat,lon\n")
    for seed in seeds:
        f.write(f"seed{i},{seed['latitude']},{seed['longitude']}\n")
        i = i + 1

with open("locations.csv", 'w', encoding="utf-8") as f:
    i = 0
    f.write(f"name,lat,lon\n")
    for key in keys:
        f.write(f"{key},{data[key]['coordinates']['latitude']},{data[key]['coordinates']['longitude']}\n")
        i = i + 1