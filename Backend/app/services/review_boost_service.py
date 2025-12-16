from typing import List, Dict, Any
import re

def _flatten_reviews(place: Dict[str, Any]) -> str:
    reviews = (
        place.get("reviews_list")
        or place.get("reviews")
        or place.get("reviews_text")
    )

    if isinstance(reviews, list):
        return " ".join(str(r) for r in reviews if r)
    if isinstance(reviews, str):
        return reviews
    return ""


_STOPWORDS = {
    "i", "me", "my", "we", "you", "he", "she", "they",
    "want", "need", "some", "something", "food", "place", "restaurant",
    "near", "nearby", "around", "very", "really", "just",
    "give", "get", "for", "to", "a", "an", "the", "in", "at", "of",
    "on", "with", "and", "or", "but", "too", "also", "like"
}


def _tokenize(text: str) -> List[str]:
    text = text.lower()
    tokens = re.split(r"[^a-z0-9]+", text)
    return [t for t in tokens if t and t not in _STOPWORDS]


def _build_query_terms(user_query: str, attrs: Dict[str, Any]) -> List[str]:
    terms = set(_tokenize(user_query))

    for key in ["cuisine", "inferred_cuisine_from_dish", "mood", "category_hint"]:
        val = attrs.get(key)
        if isinstance(val, str):
            terms.update(_tokenize(val))

    dish = attrs.get("dish")
    if isinstance(dish, str):
        terms.update(_tokenize(dish))
    elif isinstance(dish, list):
        for d in dish:
            terms.update(_tokenize(str(d)))

    fs = attrs.get("food_style") or []
    if isinstance(fs, str):
        fs = [fs]
    for s in fs:
        terms.update(_tokenize(str(s)))

    return list(terms)


def _review_match_score(user_query: str, attrs: Dict[str, Any], reviews_text: str) -> float:
    if not reviews_text:
        return 0.5  

    query_terms = set(_build_query_terms(user_query, attrs))
    if not query_terms:
        return 0.5

    review_tokens = set(_tokenize(reviews_text))
    if not review_tokens:
        return 0.5

    common = query_terms.intersection(review_tokens)
    overlap = len(common) / max(len(query_terms), 1)
    return 0.3 + 0.7 * max(0.0, min(overlap, 1.0))


def _short_review_summary(reviews_text: str, max_len: int = 140) -> str:
    text = reviews_text.strip()
    if not text:
        return ""

    sentences = re.split(r'[.!?]\s+', text)

    negative_markers = [
        "bad", "worst", "poor", "not good", "wasn't good", "wasnt good",
        "not great", "wasn't great", "wasnt great",
        "disappointed", "disappointing", "terrible", "average",
        "slow service", "cold food", "overpriced", "not tasty",
        "didn't like", "did not like"
    ]

    positive_sentences = []
    for s in sentences:
        s_clean = s.lower()
        if not any(neg in s_clean for neg in negative_markers):
            if len(s_clean) > 0:
                positive_sentences.append(s.strip())

    if not positive_sentences:
        return ""

    summary = positive_sentences[0]

    if len(summary) > max_len:
        summary = summary[:max_len].rstrip() + "..."

    return summary



def re_rank_with_reviews(
    user_query: str,
    attrs: Dict[str, Any],
    ranked_places: List[Dict[str, Any]],
    top_k_for_reviews: int = 15,
    blend_weight: float = 0.25,
) -> List[Dict[str, Any]]:

    if not ranked_places:
        return ranked_places

    has_any_reviews = any(
        _flatten_reviews(p).strip() for p in ranked_places
    )
    if not has_any_reviews:
        return ranked_places

    candidates = ranked_places[:top_k_for_reviews]

    review_scores: Dict[str, Dict[str, Any]] = {}
    for p in candidates:
        pid = str(p.get("place_id"))
        reviews_text = _flatten_reviews(p)
        if not reviews_text.strip():
            continue

        r_score = _review_match_score(user_query, attrs, reviews_text)
        summary = _short_review_summary(reviews_text)
        review_scores[pid] = {
            "review_match_score": float(r_score),
            "review_summary": summary,
        }

    if not review_scores:
        return ranked_places

    re_scored: List[Dict[str, Any]] = []

    for p in ranked_places:
        pid = str(p.get("place_id"))
        base_score = float(p.get("score") or 0.0)

        if pid in review_scores:
            r = review_scores[pid]["review_match_score"]
            new_score = (1.0 - blend_weight) * base_score + blend_weight * r

            review_summary = review_scores[pid]["review_summary"]
            if review_summary:
                existing_reason = p.get("reason") or ""
                if existing_reason:
                    p["reason"] = f"{existing_reason}. Reviews highlight: {review_summary}"
                else:
                    p["reason"] = f"Reviews highlight: {review_summary}"

            p["score_with_reviews"] = new_score
        else:
            p["score_with_reviews"] = base_score

        re_scored.append(p)

    re_scored.sort(
        key=lambda x: x.get("score_with_reviews", x.get("score", 0.0)),
        reverse=True,
    )
    return re_scored