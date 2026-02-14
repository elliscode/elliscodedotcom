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

min_dist = math.inf
store1 = None
store2 = None

for i in range(len(keys)):
    for j in range(i + 1, len(keys)):
        value = distance(
            data[keys[i]]["coordinates"],
            data[keys[j]]["coordinates"],
        )

        if value < min_dist:
            min_dist = value
            store1 = keys[i]
            store2 = keys[j]

print(store1, store2, min_dist)
