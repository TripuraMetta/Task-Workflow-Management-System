from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models.project import Project
from app.models.user import User

project_bp = Blueprint("projects", __name__, url_prefix="/api/projects")

@project_bp.route("", methods=["POST"])
@jwt_required()
def create_project():
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)

    if user.role != "ADMIN":
        return jsonify({"message": "Access denied"}), 403

    data = request.get_json()
    if not data.get("name"):
        return jsonify({"message": "Project name is required"}), 400

    project = Project(
        name=data["name"],
        description=data.get("description"),
        created_by=user.id
    )

    project.users.append(user)

    db.session.add(project)
    db.session.commit()

    return jsonify({"message": "Project created"}), 201


@project_bp.route("/<int:project_id>/assign", methods=["POST"])
@jwt_required()
def assign_user(project_id):
    user_id = int(get_jwt_identity())
    admin = User.query.get(user_id)

    if admin.role != "ADMIN":
        return jsonify({"message": "Access denied"}), 403

    data = request.get_json()
    user = User.query.get(data.get("user_id"))
    project = Project.query.get(project_id)

    if not user or not project:
        return jsonify({"message": "User or Project not found"}), 404

    project.users.append(user)
    db.session.commit()

    return jsonify({"message": "User assigned to project"}), 200

@project_bp.route("/<int:project_id>/members", methods=["GET"])
@jwt_required()
def get_project_members(project_id):
    user_id = int(get_jwt_identity())
    admin = User.query.get(user_id)

    if admin.role != "ADMIN":
        return jsonify({"message": "Access denied"}), 403

    project = Project.query.get(project_id)
    if not project:
        return jsonify({"message": "Project not found"}), 404

    return jsonify([
        {
            "id": u.id,
            "username": u.username,
            "email": u.email,
            "role": u.role
        }
        for u in project.users
    ]), 200


@project_bp.route("", methods=["GET"])
@jwt_required()
def list_projects():
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)

    projects = user.projects.all() if hasattr(user.projects, "all") else user.projects

    return jsonify([
        {
            "id": p.id,
            "name": p.name,
            "description": p.description
        }
        for p in projects
    ]), 200