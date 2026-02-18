from django.contrib import admin
from employees.models import Employee
from attendance.models import Attendance


@admin.register(Employee)
class EmployeeAdmin(admin.ModelAdmin):
    list_display = ["employee_id", "full_name", "email", "department", "created_at"]
    list_filter = ["department"]
    search_fields = ["employee_id", "full_name", "email"]


@admin.register(Attendance)
class AttendanceAdmin(admin.ModelAdmin):
    list_display = ["employee", "date", "status", "created_at"]
    list_filter = ["status", "date"]
    search_fields = ["employee__full_name", "employee__employee_id"]
