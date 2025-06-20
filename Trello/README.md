﻿# Trello_clone
# This is a new Django project

## Getting Started

**Note:** Make sure you have Python and Django installed. It is recommended to use a virtual environment.

---

### Step 1: Set up virtual environment

Create and activate a virtual environment:

```bash
# Create virtual environment (if not created yet)
python -m venv venv

# Activate virtual environment
# On Windows
venv\Scripts\activate

# On macOS/Linux
source venv/bin/activate
```

---

### Step 2: Install dependencies

```bash
pip install -r requirements.txt
```

If you don't have a `requirements.txt` file yet, you can generate one:

```bash
pip freeze > requirements.txt
```

---

### Step 3: Apply migrations

Run initial database migrations:

```bash
python manage.py migrate
```

---

### Step 4: Create a superuser (admin account)

```bash
python manage.py createsuperuser
```

Follow the prompts to set username, email, and password.

---

### Step 5: Run development server

```bash
python manage.py runserver
```

Visit [http://127.0.0.1:8000/](http://127.0.0.1:8000/) in your browser.

---

### Step 6: Modify your app

Open your Django apps (in your text editor or IDE of choice) and make changes. The server will automatically reload when you save files.

---

## Now what?

* If you want to add frontend code, consider integrating with React, Vue, or another frontend framework.
* If you want to deploy your project, check out [Django Deployment Checklist](https://docs.djangoproject.com/en/stable/howto/deployment/checklist/).

---

## Troubleshooting

If you run into issues:

* Check the [Django documentation](https://docs.djangoproject.com/en/stable/).
* Review error messages carefully — they often point to the root cause.
* Make sure your virtual environment is activated.

---

## Learn More

* [Django Website](https://www.djangoproject.com/) - Official Django site.
* [Django Documentation](https://docs.djangoproject.com/en/stable/) - Full documentation.
* [Django Girls Tutorial](https://tutorial.djangogirls.org/) - Beginner-friendly Django tutorial.
* [Awesome Django](https://github.com/wsvincent/awesome-django) - Curated list of Django resources.
