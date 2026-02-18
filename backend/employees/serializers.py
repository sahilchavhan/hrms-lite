"""
Serializers for Employee model.
"""

from rest_framework import serializers
from .models import Employee


class EmployeeSerializer(serializers.ModelSerializer):
    """Serializer for Employee with full validation."""

    department_display = serializers.CharField(
        source="get_department_display", read_only=True
    )

    class Meta:
        model = Employee
        fields = [
            "id",
            "employee_id",
            "full_name",
            "email",
            "department",
            "department_display",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

    def validate_employee_id(self, value):
        """Ensure employee_id is not empty and properly formatted."""
        value = value.strip().upper()
        if not value:
            raise serializers.ValidationError("Employee ID is required.")
        return value

    def validate_full_name(self, value):
        """Ensure full_name is not empty."""
        value = value.strip()
        if not value:
            raise serializers.ValidationError("Full name is required.")
        if len(value) < 2:
            raise serializers.ValidationError(
                "Full name must be at least 2 characters."
            )
        return value

    def validate_email(self, value):
        """Ensure email uniqueness on create."""
        value = value.strip().lower()
        if not value:
            raise serializers.ValidationError("Email is required.")
        # Check uniqueness (exclude current instance on update)
        queryset = Employee.objects.filter(email=value)
        if self.instance:
            queryset = queryset.exclude(pk=self.instance.pk)
        if queryset.exists():
            raise serializers.ValidationError(
                "An employee with this email already exists."
            )
        return value

    def validate_department(self, value):
        """Ensure department is valid."""
        valid_departments = [choice[0] for choice in Employee.DEPARTMENT_CHOICES]
        if value not in valid_departments:
            raise serializers.ValidationError(
                f"Invalid department. Choose from: {', '.join(valid_departments)}"
            )
        return value
