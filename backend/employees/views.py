"""
Views for Employee management API.
"""

from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Employee
from .serializers import EmployeeSerializer


class EmployeeViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing employees.

    list:    GET    /api/employees/
    create:  POST   /api/employees/
    retrieve: GET   /api/employees/{id}/
    destroy: DELETE /api/employees/{id}/
    """

    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer
    http_method_names = ["get", "post", "delete", "head", "options"]

    def get_queryset(self):
        """Allow filtering by department and search by name."""
        queryset = Employee.objects.all()
        department = self.request.query_params.get("department")
        search = self.request.query_params.get("search")

        if department:
            queryset = queryset.filter(department=department)
        if search:
            queryset = queryset.filter(full_name__icontains=search)

        return queryset

    def create(self, request, *args, **kwargs):
        """Create a new employee with duplicate check."""
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                {"error": "Validation failed", "details": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Check for duplicate employee_id
        employee_id = serializer.validated_data.get("employee_id", "")
        if Employee.objects.filter(employee_id=employee_id).exists():
            return Response(
                {
                    "error": "Duplicate employee",
                    "message": f"Employee with ID '{employee_id}' already exists.",
                },
                status=status.HTTP_409_CONFLICT,
            )

        employee = serializer.save()
        return Response(
            EmployeeSerializer(employee).data,
            status=status.HTTP_201_CREATED,
        )

    def destroy(self, request, *args, **kwargs):
        """Delete an employee and their attendance records."""
        instance = self.get_object()
        employee_name = instance.full_name
        self.perform_destroy(instance)
        return Response(
            {"message": f"Employee '{employee_name}' has been deleted."},
            status=status.HTTP_200_OK,
        )

    @action(detail=False, methods=["get"])
    def departments(self, request):
        """Return the list of available departments."""
        return Response(
            [
                {"value": choice[0], "label": choice[1]}
                for choice in Employee.DEPARTMENT_CHOICES
            ]
        )

    @action(detail=False, methods=["get"])
    def stats(self, request):
        """Return basic employee stats."""
        total = Employee.objects.count()
        by_department = {}
        for choice_value, choice_label in Employee.DEPARTMENT_CHOICES:
            count = Employee.objects.filter(department=choice_value).count()
            if count > 0:
                by_department[choice_label] = count

        return Response(
            {
                "total_employees": total,
                "by_department": by_department,
            }
        )
