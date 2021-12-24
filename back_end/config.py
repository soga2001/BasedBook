import os

class Config:
    DEBUG = False
    TESTING = False
    SECRET_KEY = os.getenv('SOCIAL_MEDIA_SECRET_KEY')
    JWT_ACCESS_LIFESPAN = {"hours": 5}
    JWT_REFRESH_LIFESPAN = {"days": 15}
    

class ProductionConfig(Config):
    MONGO_URI = os.getenv('SOCIAL_MEDIA_MONGO_URI')

class DevelopmentConfig(Config):
    MONGO_URI = "mongodb://localhost:27017/test_database"
    DEBUG = True
