"""
Root URL configuration for HRMS Lite.
"""

from django.contrib import admin
from django.urls import path, include
from rest_framework.response import Response
from rest_framework.decorators import api_view


@api_view(["GET"])
def api_root(request):
    """API root endpoint with system info."""
    return Response(
        {
            "name": "HRMS Lite API",
            "version": "1.0.0",
            "endpoints": {
                "employees": "/api/employees/",
                "attendance": "/api/attendance/",
            },
        }
    )


urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", api_root, name="api-root"),
    path("api/employees/", include("employees.urls")),
    path("api/attendance/", include("attendance.urls")),
]
