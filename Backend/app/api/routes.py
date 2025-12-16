from flask import Blueprint
from app.api.endpoints.recommendations import bp as rec_bp
from app.api.endpoints.geocode import geo_bp
from app.api.test_llm import test_llm_bp

def register_api(app):
    app.register_blueprint(rec_bp, url_prefix="/api")
    app.register_blueprint(geo_bp, url_prefix="/api")
    app.register_blueprint(test_llm_bp, url_prefix="/api")
