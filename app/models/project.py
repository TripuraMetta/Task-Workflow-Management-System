from app.extensions import db
from datetime import datetime
from .association import project_users

class Project(db.Model):
    __tablename__ = "projects"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150), nullable=False)
    description = db.Column(db.Text)
    created_by = db.Column(db.Integer, db.ForeignKey("users.id"))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    users = db.relationship(
        "User",
        secondary=project_users,
        backref=db.backref("projects", lazy="dynamic")
    )

    tasks = db.relationship("Task", backref="project", lazy=True)
