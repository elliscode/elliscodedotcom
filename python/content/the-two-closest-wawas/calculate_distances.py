import json
import math


def distance(point1: dict, point2: dict) -> float:
    R = 6371000  # Earth radius in meters

    lat1 = math.radians(point1["latitude"])
    lon1 = math.radians(point1["longitude"])
    lat2 = math.radians(point2["latitude"])
    lon2 = math.radians(point2["longitude"])

    d_lat = lat2 - lat1
    d_lon = lon2 - lon1

    a = (
        math.sin(d_lat / 2) ** 2
        + math.cos(lat1) * math.cos(lat2) * math.sin(d_lon / 2) ** 2
    )

    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

    return R * c

with open("stores.json", "r", encoding="utf-8") as f:
    data = json.load(f)

keys = list(data.keys())

print(len(keys))

min_dist = math.inf
store1 = None
store2 = None

distance_map = {}

for i in range(len(keys)):
    for j in range(i + 1, len(keys)):
        value = distance(
            data[keys[i]]["coordinates"],
            data[keys[j]]["coordinates"],
        )
        store1 = keys[i]
        store2 = keys[j]
        if store1 == '564628' or store2 == '564628':
            continue
        if value not in distance_map:
            distance_map[value] = []
        distance_map[value].append((store1, store2))

distances = list(distance_map.keys())
distances.sort()
print(f"| Distance (meters) | Store A | Store B | State | Google Maps Link |")
print(f"|-------------------|---------|---------|-------|------------------|")
for i in range(15):
    distance = distances[i]
    for pair in distance_map[distance]:
        print(f"| {distance:.0f} | [{data[pair[0]]['name']}](https://www.wawa.com/locations/{pair[0]}) | [{data[pair[1]]['name']}](https://www.wawa.com/locations/{pair[1]}) | {data[pair[0]]['address']['state']} | [Directions](https://www.google.com/maps/dir/?api=1&travelmode=walking&origin={data[pair[0]]['coordinates']['latitude']},{data[pair[0]]['coordinates']['longitude']}&destination={data[pair[1]]['coordinates']['latitude']},{data[pair[1]]['coordinates']['longitude']}) |")

