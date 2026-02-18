"""
Serializers for Attendance model.
"""

from rest_framework import serializers
from .models import Attendance
from employees.models import Employee


class AttendanceSerializer(serializers.ModelSerializer):
    """Serializer for Attendance records."""

    employee_name = serializers.CharField(
        source="employee.full_name", read_only=True
    )
    employee_id_str = serializers.CharField(
        source="employee.employee_id", read_only=True
    )
    status_display = serializers.CharField(
        source="get_status_display", read_only=True
    )

    class Meta:
        model = Attendance
        fields = [
            "id",
            "employee",
            "employee_name",
            "employee_id_str",
            "date",
            "status",
            "status_display",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]

    def validate_status(self, value):
        """Ensure status is valid."""
        valid_statuses = [choice[0] for choice in Attendance.STATUS_CHOICES]
        if value not in valid_statuses:
            raise serializers.ValidationError(
                f"Invalid status. Choose from: {', '.join(valid_statuses)}"
            )
        return value

    def validate(self, data):
        """Check for duplicate attendance on the same date."""
        employee = data.get("employee")
        date = data.get("date")

        if employee and date:
            queryset = Attendance.objects.filter(employee=employee, date=date)
            if self.instance:
                queryset = queryset.exclude(pk=self.instance.pk)
            if queryset.exists():
                raise serializers.ValidationError(
                    {
                        "date": f"Attendance for this employee on {date} has already been recorded."
                    }
                )
        return data


class BulkAttendanceSerializer(serializers.Serializer):
    """Serializer for marking attendance for multiple employees at once."""

    date = serializers.DateField()
    records = serializers.ListField(
        child=serializers.DictField(),
        min_length=1,
    )

    def validate_records(self, value):
        """Validate each record in the bulk list."""
        valid_statuses = [choice[0] for choice in Attendance.STATUS_CHOICES]
        for i, record in enumerate(value):
            if "employee_id" not in record:
                raise serializers.ValidationError(
                    f"Record {i}: 'employee_id' is required."
                )
            if "status" not in record:
                raise serializers.ValidationError(
                    f"Record {i}: 'status' is required."
                )
            if record["status"] not in valid_statuses:
                raise serializers.ValidationError(
                    f"Record {i}: Invalid status '{record['status']}'. Choose from: {', '.join(valid_statuses)}"
                )
        return value
