from django.contrib import admin
from .models import Question


@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ('title', 'subject', 'grade', 'created_at')
    list_filter = ('subject', 'grade')
    search_fields = ('title', 'content')
    date_hierarchy = 'created_at'
