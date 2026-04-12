# Django backend for the current frontend

## Setup

1. Install Python 3.11+.
2. Create a virtual environment inside `backend/`.
3. Install dependencies with `pip install -r requirements.txt`.
4. Create migrations with `python manage.py makemigrations`.
5. Apply migrations with `python manage.py migrate`.
6. Start the API with `python manage.py runserver`.

The React frontend should use `VITE_API_URL=http://127.0.0.1:8000/api`.

## Endpoints

- `POST /api/auth/register/`
- `POST /api/auth/complete-profile/`
- `POST /api/auth/login/`
- `POST /api/auth/oauth/`
- `GET /api/auth/me/`
- `PUT /api/auth/profile/`
- `GET /api/articles/`
- `POST /api/articles/`
- `GET /api/articles/<id>/`
- `PUT /api/articles/<id>/`
- `PATCH /api/articles/<id>/`
- `DELETE /api/articles/<id>/`
- `GET /api/shop/products/`
- `POST /api/shop/products/`
- `GET /api/shop/products/<id>/`
- `PUT /api/shop/products/<id>/`
- `PATCH /api/shop/products/<id>/`
- `DELETE /api/shop/products/<id>/`
- `GET /api/shop/cart/`
- `POST /api/shop/cart/`
- `GET /api/shop/cart/<id>/`
- `PUT /api/shop/cart/<id>/`
- `PATCH /api/shop/cart/<id>/`
- `DELETE /api/shop/cart/<id>/`
- `GET /api/advisory/meta/`
- `POST /api/advisory/questions/`
- `GET /api/weather/forecast/`

## Weather API

- `GET /api/weather/forecast/?location=Pokhara`
- Uses live Open-Meteo geocoding + forecast data.
- No API key is required.
