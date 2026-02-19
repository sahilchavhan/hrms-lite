import os


from pathlib import Path
import dj_database_url

from dotenv import load_dotenv
load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent

# SECRET KEY
SECRET_KEY = os.environ.get(
    "DJANGO_SECRET_KEY",
    "django-insecure-hrms-dev-key-change-in-production-abc123xyz"
)

# DEBUG.
DEBUG = os.environ.get("DJANGO_DEBUG", "True").lower() in ("true", "1", "yes")

# ALLOWED HOSTS
# ALLOWED_HOSTS = os.environ.get(
#     "DJANGO_ALLOWED_HOSTS", "localhost,127.0.0.1"
# ).split(",")

ALLOWED_HOSTS = [ '*' ]

# APPLICATION DEFINITION
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    # Third-party
    "rest_framework",
    "corsheaders",
    # Local apps
    "employees",
    "attendance",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "hrms_project.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "hrms_project.wsgi.application"

# DB_LIVE = os.getenv("DB_LIVE")

# if DB_LIVE in ["false", False]:
#     DATABASES = {
#         'default': {
#             'ENGINE': 'django.db.backends.sqlite3',
#             'NAME': BASE_DIR / 'db.sqlite3',
#         }
#     }
# else:
#     DATABASES = {
#         'default': {
#             'ENGINE': 'django.db.backends.postgresql',
#             'NAME': os.getenv("DB_NAME"),
#             'USER': os.getenv("DB_USER"),
#             'PASSWORD': os.getenv("DB_PASSWORD"),
#             'HOST': os.getenv("DB_HOST"),
#             'PORT': os.getenv("DB_PORT")
#         }
#     }



DB_LIVE = os.environ.get("DB_LIVE", "false").lower()  # default to "false" if not set

if DB_LIVE == "false":
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }
else:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': os.environ.get("DB_NAME"),
            'USER': os.environ.get("DB_USER"),
            'PASSWORD': os.environ.get("DB_PASSWORD"),
            'HOST': os.environ.get("DB_HOST"),
            'PORT': os.environ.get("DB_PORT")
        }
    }

POSTGRES_LOCALLY= True
if ENVIRONMENT == "production" or POSTGRES_LOCALLY == True:
    DATABASES = {
        # 'default': {
        #     'ENGINE': 'django.db.backends.postgresql',
        #     'NAME': os.environ.get("DB_NAME"),
        #     'USER': os.environ.get("DB_USER"),
        #     'PASSWORD': os.environ.get("DB_PASSWORD"),
        #     'HOST': os.environ.get("DB_HOST"),
        #     'PORT': os.environ.get("DB_PORT")
        # }
        'default': dj_database_url.config(default=os.environ.get("DATABASE_URL"))
    }
else:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }



# REST Framework
REST_FRAMEWORK = {
    "DEFAULT_RENDERER_CLASSES": [
        "rest_framework.renderers.JSONRenderer",
    ],
    "DEFAULT_PARSER_CLASSES": [
        "rest_framework.parsers.JSONParser",
    ],
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination",
    "PAGE_SIZE": 20,
}

# CORS
CORS_ALLOWED_ORIGINS = os.environ.get(
    "CORS_ALLOWED_ORIGINS",
    "http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000"
).split(",")

CORS_ALLOW_ALL_ORIGINS = DEBUG

# Internationalization
LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True

# Static files
STATIC_URL = "static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"

# Default primary key
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
