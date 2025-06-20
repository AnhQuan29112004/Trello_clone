# Django + React Native Project

## Getting Started

This is a full-stack project combining Django (backend) and React Native (mobile frontend).

---

## Backend: Django

### Step 1: Set up virtual environment

```bash
python -m venv venv

# Activate virtual environment
# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate
```

### Step 2: Install dependencies

```bash
pip install -r requirements.txt
```

If you don't have a `requirements.txt` file:

```bash
pip freeze > requirements.txt
```

### Step 3: Apply migrations

```bash
python manage.py migrate
```

### Step 4: Create superuser (optional)

```bash
python manage.py createsuperuser
```

### Step 5: Run Django server

```bash
python manage.py runserver
```

API will be available at [http://127.0.0.1:8000/](http://127.0.0.1:8000/)

---

## Frontend: React Native

### Step 1: Start Metro

```bash
# Using npm
npm start

# OR using yarn
yarn start
```

### Step 2: Run the app

#### Android

```bash
npm run android
# OR
yarn android
```

#### iOS

Make sure CocoaPods dependencies are installed:

```bash
bundle install
bundle exec pod install
```

Then run:

```bash
npm run ios
# OR
yarn ios
```

---

## Connecting Django and React Native

* Update React Native code to fetch data from your Django server API (e.g., `http://127.0.0.1:8000/api/...`).
* Consider using tools like [Axios](https://axios-http.com/) or `fetch` in React Native.
* Handle CORS in Django by installing and configuring `django-cors-headers`:

```bash
pip install django-cors-headers
```

Add to `INSTALLED_APPS` and `MIDDLEWARE`, then configure allowed origins.

---

## Troubleshooting

* Ensure Django server and Metro server are running simultaneously.
* Make sure your mobile app can reach your Django server (check device/emulator network settings).
* Consult [Django docs](https://docs.djangoproject.com/en/stable/) and [React Native docs](https://reactnative.dev/) as needed.

---

## Learn More

* [Django](https://www.djangoproject.com/)
* [React Native](https://reactnative.dev/)
* [Django REST Framework](https://www.django-rest-framework.org/)
* [Axios](https://axios-http.com/)
