def normalize_foursquare_item(item):
    if "fsq_id" not in item:
        cuisine = item.get("cuisine")
        category = item.get("category") or cuisine

        return {
            "place_id": item.get("place_id") or item.get("name"),
            "name": item.get("name"),
            "category": category,
            "cuisine": cuisine,
            "popularity": item.get("popularity", 0.0),
            "distance_m": item.get("distance_m"),
            "lat": item.get("lat") or item.get("Latitude"),
            "lng": item.get("lng") or item.get("Longitude"),
            "address": item.get("address"),
            "price_level": item.get("budget") or item.get("price_level"),
            "tags": " ".join(
                (cuisine or "").lower().split(",")
            ) + " " + " ".join(item.get("food_style", [])),
            "menu_link": item.get("menu_link"),
            "city": item.get("city"),
            "reviews_list": item.get("reviews_list") or item.get("reviews"),
        }

    canonical = {}
    canonical["place_id"] = item.get("fsq_id") or item.get("id")
    canonical["name"] = item.get("name")

    cats = item.get("categories") or []
    canonical["category"] = cats[0]["name"] if cats else None
    canonical["cuisine"] = item.get("cuisine") 
    canonical["popularity"] = item.get("popularity") or item.get("rating") or 0

    geo = item.get("geocodes", {}).get("main", {})
    canonical["lat"] = geo.get("latitude")
    canonical["lng"] = geo.get("longitude")
    canonical["distance_m"] = item.get("distance") or None

    location = item.get("location", {})
    canonical["address"] = ", ".join(
        filter(
            None,
            [
                location.get("address"),
                location.get("locality"),
                location.get("region"),
            ],
        )
    )

    canonical["price_level"] = item.get("price") or None

    canonical["tags"] = " ".join([c.get("name", "") for c in cats])
    canonical["menu_link"] = None

    canonical["reviews_list"] = item.get("reviews_list") or item.get("reviews")

    return canonical