from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models.task import Task
from app.models.project import Project
from app.models.user import User

task_bp = Blueprint("tasks", __name__, url_prefix="/api/tasks")

VALID_TRANSITIONS = {
    "TO_DO": ["IN_PROGRESS"],
    "IN_PROGRESS": ["DONE"],
    "DONE": []
}

@task_bp.route("", methods=["POST"])
@jwt_required()
def create_task():
    user_id = int(get_jwt_identity())
    admin = User.query.get(user_id)

    if admin.role != "ADMIN":
        return jsonify({"message": "Access denied"}), 403

    data = request.get_json()
    required_fields = ["title", "project_id", "assigned_to"]

    if not all(field in data for field in required_fields):
        return jsonify({"message": "Missing required fields"}), 400

    project = Project.query.get(data["project_id"])
    user = User.query.get(data["assigned_to"])

    if not project or not user:
        return jsonify({"message": "Invalid project or user"}), 404

    if user not in project.users:
        return jsonify({"message": "User is not assigned to this project"}), 403

    task = Task(
        title=data["title"],
        description=data.get("description"),
        project_id=project.id,
        assigned_to=user.id,
        priority=data.get("priority", "MEDIUM"),
        due_date=data.get("due_date")
    )

    db.session.add(task)
    db.session.commit()

    return jsonify({"message": "Task created"}), 201


@task_bp.route("/<int:task_id>/status", methods=["PUT"])
@jwt_required()
def update_task_status(task_id):
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)

    task = Task.query.get(task_id)
    if not task:
        return jsonify({"message": "Task not found"}), 404

    if user.role != "ADMIN" and task.assigned_to != user.id:
        return jsonify({"message": "Access denied"}), 403

    data = request.get_json()
    new_status = data.get("status")

    if new_status not in VALID_TRANSITIONS.get(task.status, []):
        return jsonify({
            "message": f"Invalid transition from {task.status} to {new_status}"
        }), 400

    task.status = new_status
    db.session.commit()

    return jsonify({"message": "Task status updated"}), 200


@task_bp.route("/my-tasks", methods=["GET"])
@jwt_required()
def get_my_tasks():
    user_id = int(get_jwt_identity())
    tasks = Task.query.filter_by(assigned_to=user_id).all()

    return jsonify([
        {
            "id": t.id,
            "title": t.title,
            "description": t.description,
            "status": t.status,
            "priority": t.priority,
            "due_date": str(t.due_date) if t.due_date else None,
            "project_id": t.project_id,
            "assigned_to": t.assigned_to
        }
        for t in tasks
    ]), 200


# ✅ NEW: Admin endpoint — get ALL tasks across all projects
@task_bp.route("/all", methods=["GET"])
@jwt_required()
def get_all_tasks():
    user_id = int(get_jwt_identity())
    admin = User.query.get(user_id)

    if admin.role != "ADMIN":
        return jsonify({"message": "Access denied"}), 403

    tasks = Task.query.all()

    return jsonify([
        {
            "id": t.id,
            "title": t.title,
            "description": t.description,
            "status": t.status,
            "priority": t.priority,
            "due_date": str(t.due_date) if t.due_date else None,
            "project_id": t.project_id,
            "assigned_to": t.assigned_to,
            "assignee_name": t.assignee.username if t.assignee else "Unassigned"
        }
        for t in tasks
    ]), 200


# ✅ NEW: Admin endpoint — get ALL users in the system
@task_bp.route("/users-list", methods=["GET"])
@jwt_required()
def get_all_users():
    user_id = int(get_jwt_identity())
    admin = User.query.get(user_id)

    if admin.role != "ADMIN":
        return jsonify({"message": "Access denied"}), 403

    users = User.query.all()

    return jsonify([
        {
            "id": u.id,
            "username": u.username,
            "email": u.email,
            "role": u.role
        }
        for u in users
    ]), 200