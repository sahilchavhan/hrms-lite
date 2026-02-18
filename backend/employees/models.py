"""
Employee model for HRMS Lite.
"""

from django.db import models
from django.core.validators import EmailValidator


class Employee(models.Model):
    """Represents an employee in the organization."""

    DEPARTMENT_CHOICES = [
        ("engineering", "Engineering"),
        ("marketing", "Marketing"),
        ("sales", "Sales"),
        ("hr", "Human Resources"),
        ("finance", "Finance"),
        ("operations", "Operations"),
        ("design", "Design"),
        ("product", "Product"),
        ("support", "Customer Support"),
        ("other", "Other"),
    ]

    employee_id = models.CharField(
        max_length=20,
        unique=True,
        help_text="Unique employee identifier (e.g., EMP001)",
    )
    full_name = models.CharField(
        max_length=150,
        help_text="Full name of the employee",
    )
    email = models.EmailField(
        unique=True,
        validators=[EmailValidator()],
        help_text="Employee email address",
    )
    department = models.CharField(
        max_length=50,
        choices=DEPARTMENT_CHOICES,
        help_text="Department the employee belongs to",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Employee"
        verbose_name_plural = "Employees"

    def __str__(self):
        return f"{self.employee_id} — {self.full_name}"
