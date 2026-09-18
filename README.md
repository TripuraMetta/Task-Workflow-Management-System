#  Task Workflow Management System

A web-based **Task Workflow Management System** designed to organize, assign, track, and manage tasks through role-based access and a structured workflow.

The system provides separate functionality for different user roles, helping teams manage tasks while controlling access to resources based on permissions.

---

## 🚀 Live Demo

### 🌐 [Open Task Workflow Management System](https://task-workflow-management-system-88d.vercel.app/)

You can access and explore the deployed application directly from the link above.

---

## 📌 Overview

The Task Workflow Management System is designed to solve common problems in team-based task management, such as:

* Managing multiple tasks in one place
* Assigning tasks to appropriate users
* Tracking task progress
* Controlling access to resources based on user roles
* Maintaining a structured workflow
* Providing different capabilities to administrators and regular users

The application follows a **Role-Based Access Control (RBAC)** approach so that users can access resources and operations according to their assigned permissions.

---

## 🎯 Objectives

* Provide a centralized platform for task management.
* Implement role-based access control.
* Allow users to manage and track assigned tasks.
* Provide administrators with broader management capabilities.
* Maintain a structured task workflow.
* Secure application resources through authentication and authorization.
* Provide a responsive web-based interface.
* Deploy the application for online access.

---

## ✨ Key Features

### 🔐 Authentication & Authorization

The system provides authenticated access to protected application resources.

Authentication is used to identify users, while authorization determines which resources and operations a particular user is permitted to access.

---

### 👥 Role-Based Access Control

The application follows an RBAC model in which different roles have different permissions.

For example:

```text
                    User Login
                        │
                        ▼
                 Authentication
                        │
                        ▼
                  User Role
                 /          \
                /            \
           USER              ADMIN
            │                  │
            ▼                  ▼
      User Resources     Administrative
                         Resources
```

This prevents users from accessing operations outside their permitted role.

---

### 📋 Task Management

The system provides functionality for managing tasks throughout their lifecycle.

Typical task operations include:

* Creating tasks
* Viewing tasks
* Updating task information
* Assigning tasks
* Tracking task status
* Managing task workflow

---

### 🔄 Workflow Management

Tasks can progress through different stages of the workflow.

A typical workflow can be represented as:

```text
Created
   │
   ▼
Assigned
   │
   ▼
In Progress
   │
   ▼
Completed
```

This provides a structured way to monitor the progress of work.

---

### 🛡️ Protected Resources

Application resources are protected according to authentication and authorization rules.

The system separates:

```text
Authentication
      │
      ▼
"Who is the user?"
      │
      ▼
Authorization
      │
      ▼
"What is the user allowed to access?"
```

This separation is an important part of the application's security architecture.

---

### 👨‍💼 Administrative Management

Administrators have access to management capabilities that are restricted from regular users.

This provides centralized control over application resources and user/task management.

---

##  System Architecture

The application is organized into multiple layers:

```text
                   ┌─────────────────────┐
                   │      Frontend       │
                   │   User Interface    │
                   └──────────┬──────────┘
                              │
                              ▼
                   ┌─────────────────────┐
                   │   Application/API   │
                   │       Layer         │
                   └──────────┬──────────┘
                              │
                              ▼
                   ┌─────────────────────┐
                   │   Authentication    │
                   │ & Authorization     │
                   └──────────┬──────────┘
                              │
                              ▼
                   ┌─────────────────────┐
                   │      Database       │
                   │     / Storage       │
                   └─────────────────────┘
```

---

## 📂 Project Structure

The repository currently contains the following major components:

```text
Task-Workflow-Management-System/
│
├── Frontend/
│
├── app/
│
├── js/
│
├── migrations/
│
├── .gitignore
├── README.md
├── requirements.txt
├── run.py
└── runtime.txt
```

### Directory Responsibilities

| Component          | Purpose                             |
| ------------------ | ----------------------------------- |
| `Frontend/`        | Frontend application/interface      |
| `app/`             | Main application/backend components |
| `js/`              | JavaScript functionality            |
| `migrations/`      | Database migration files            |
| `run.py`           | Application entry point             |
| `requirements.txt` | Python dependencies                 |
| `runtime.txt`      | Runtime configuration               |

---

## 🛠️ Technologies

The project includes a **Python-based application layer**, frontend technologies, JavaScript components, and database migration support.

### Application

* Python
* Flask-based application structure

### Frontend

* HTML
* CSS
* JavaScript

### Database

* Database migration system

### Deployment

* Vercel

---

## 🔐 Security Model

A major part of the project is controlling access to application resources.

The security model can be viewed as:

```text
User
 │
 ▼
Login
 │
 ▼
Authentication
 │
 ▼
Authenticated User
 │
 ▼
Role Identification
 │
 ├───────────────┐
 ▼               ▼
USER            ADMIN
 │               │
 ▼               ▼
Allowed         Extended
Resources       Resources
```

This prevents authorization decisions from being based solely on the frontend interface.

---

## 🔄 Task Lifecycle

The task workflow is designed around the lifecycle of a task:

```text
┌──────────┐
│  Create  │
└────┬─────┘
     │
     ▼
┌──────────┐
│  Assign  │
└────┬─────┘
     │
     ▼
┌──────────────┐
│ In Progress  │
└──────┬───────┘
       │
       ▼
┌────────────┐
│ Completed  │
└────────────┘
```

This workflow makes it easier to understand the current state of each task.

---

## 💻 Local Setup

### 1. Clone the Repository

```bash
git clone https://github.com/TripuraMetta/Task-Workflow-Management-System.git
```

### 2. Navigate to the Project

```bash
cd Task-Workflow-Management-System
```

### 3. Create a Virtual Environment

```bash
python -m venv venv
```

Activate it on Windows:

```powershell
venv\Scripts\activate
```

### 4. Install Dependencies

```bash
pip install -r requirements.txt
```

### 5. Run the Application

```bash
python run.py
```

The exact local URL may depend on the application's runtime configuration.

---

## 🌐 Deployment

The application is deployed and available online through Vercel.

### Live Application

👉 **https://task-workflow-management-system-88d.vercel.app/**

This allows the project to be demonstrated without requiring users to configure the application locally.

---

## 🔮 Future Enhancements

Potential improvements include:

* Real-time task notifications
* Advanced task filtering and search
* Task priority management
* Due-date reminders
* Activity/audit history
* Improved dashboard analytics
* More granular permissions
* Refresh-token based session management
* Improved API security
* Automated testing
* Enhanced mobile responsiveness
* Real-time collaboration


