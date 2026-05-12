from flask import Flask
from flask_cors import CORS
from .config import Config
from .extensions import db, migrate, jwt
from app.routes.project_routes import project_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(app)
    
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)

    from app import models
    from app.routes.auth_routes import auth_bp
    from app.routes.task_routes import task_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(project_bp)
    app.register_blueprint(task_bp)

    return app
