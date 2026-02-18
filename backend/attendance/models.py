"""
Attendance model for HRMS Lite.
"""

from django.db import models
from employees.models import Employee


class Attendance(models.Model):
    """Tracks daily attendance for employees."""

    STATUS_CHOICES = [
        ("present", "Present"),
        ("absent", "Absent"),
    ]

    employee = models.ForeignKey(
        Employee,
        on_delete=models.CASCADE,
        related_name="attendance_records",
        help_text="The employee this attendance record belongs to",
    )
    date = models.DateField(
        help_text="Date of attendance",
    )
    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        help_text="Attendance status: present or absent",
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-date", "employee__full_name"]
        unique_together = ["employee", "date"]
        verbose_name = "Attendance Record"
        verbose_name_plural = "Attendance Records"

    def __str__(self):
        return f"{self.employee.full_name} — {self.date} — {self.get_status_display()}"
