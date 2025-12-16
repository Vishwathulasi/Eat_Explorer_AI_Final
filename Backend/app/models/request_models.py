from pydantic import BaseModel
from typing import Optional

class RecommendRequest(BaseModel):
    query: str
    lat: Optional[float] = None
    lng: Optional[float] = None
    radius: Optional[int] = None 
    veg_only: Optional[bool] = None
    budget: Optional[float] = None
    max_distance_km: Optional[float] = None 
    location_text: Optional[str] = None      
    use_my_location: Optional[bool] = None
    limit: Optional[int] = 10
