"""
Views for Attendance management API.
"""

from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Attendance
from .serializers import AttendanceSerializer, BulkAttendanceSerializer
from employees.models import Employee


class AttendanceViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing attendance records.

    list:    GET    /api/attendance/
    create:  POST   /api/attendance/
    retrieve: GET   /api/attendance/{id}/
    """

    queryset = Attendance.objects.select_related("employee").all()
    serializer_class = AttendanceSerializer
    http_method_names = ["get", "post", "delete", "head", "options"]

    def get_queryset(self):
        """Allow filtering by employee and date range."""
        queryset = Attendance.objects.select_related("employee").all()

        employee_id = self.request.query_params.get("employee")
        date_from = self.request.query_params.get("date_from")
        date_to = self.request.query_params.get("date_to")
        date = self.request.query_params.get("date")
        status_filter = self.request.query_params.get("status")

        if employee_id:
            queryset = queryset.filter(employee__id=employee_id)
        if date_from:
            queryset = queryset.filter(date__gte=date_from)
        if date_to:
            queryset = queryset.filter(date__lte=date_to)
        if date:
            queryset = queryset.filter(date=date)
        if status_filter:
            queryset = queryset.filter(status=status_filter)

        return queryset

    def create(self, request, *args, **kwargs):
        """Create an attendance record with validation."""
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                {"error": "Validation failed", "details": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST,
            )
        attendance = serializer.save()
        return Response(
            AttendanceSerializer(attendance).data,
            status=status.HTTP_201_CREATED,
        )

    @action(detail=False, methods=["post"])
    def bulk_mark(self, request):
        """Mark attendance for multiple employees at once."""
        serializer = BulkAttendanceSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                {"error": "Validation failed", "details": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST,
            )

        date = serializer.validated_data["date"]
        records = serializer.validated_data["records"]
        created = []
        errors = []

        for record in records:
            try:
                employee = Employee.objects.get(id=record["employee_id"])
            except Employee.DoesNotExist:
                errors.append(
                    {
                        "employee_id": record["employee_id"],
                        "error": "Employee not found.",
                    }
                )
                continue

            # Check for existing record
            existing = Attendance.objects.filter(
                employee=employee, date=date
            ).first()
            if existing:
                # Update existing record
                existing.status = record["status"]
                existing.save()
                created.append(AttendanceSerializer(existing).data)
            else:
                attendance = Attendance.objects.create(
                    employee=employee,
                    date=date,
                    status=record["status"],
                )
                created.append(AttendanceSerializer(attendance).data)

        return Response(
            {
                "message": f"Processed {len(created)} attendance records.",
                "created": created,
                "errors": errors,
            },
            status=status.HTTP_201_CREATED if created else status.HTTP_400_BAD_REQUEST,
        )

    @action(detail=False, methods=["get"])
    def by_employee(self, request):
        """Get attendance records grouped by employee."""
        employee_pk = request.query_params.get("employee_id")
        if not employee_pk:
            return Response(
                {"error": "employee_id query parameter is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            employee = Employee.objects.get(id=employee_pk)
        except Employee.DoesNotExist:
            return Response(
                {"error": "Employee not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        records = Attendance.objects.filter(employee=employee).order_by("-date")
        serializer = AttendanceSerializer(records, many=True)

        total = records.count()
        present = records.filter(status="present").count()
        absent = records.filter(status="absent").count()

        return Response(
            {
                "employee": {
                    "id": employee.id,
                    "employee_id": employee.employee_id,
                    "full_name": employee.full_name,
                    "department": employee.get_department_display(),
                },
                "summary": {
                    "total_records": total,
                    "present": present,
                    "absent": absent,
                    "attendance_rate": round(
                        (present / total * 100) if total > 0 else 0, 1
                    ),
                },
                "records": serializer.data,
            }
        )
