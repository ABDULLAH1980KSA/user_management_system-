# 📦 الكود الكامل – مدرسة الشقيق الابتدائية بنين

> انسخ كل ملف وضعه في المسار المكتوب في العنوان.

---

## طريقة التشغيل السريع

```bash
# 1. ثبّت Django
pip install Django

# 2. طبّق قاعدة البيانات
python manage.py migrate

# 3. شغّل السيرفر
python manage.py runserver
```

ثم افتح: **http://127.0.0.1:8000/**

---

## هيكل المجلدات

```
مشروعك/
├── manage.py
├── requirements.txt
├── run.sh
├── school_system/
│   ├── __init__.py   (فارغ)
│   ├── settings.py
│   ├── urls.py
│   ├── wsgi.py
│   └── asgi.py
├── questions/
│   ├── __init__.py   (فارغ)
│   ├── models.py
│   ├── views.py
│   ├── urls.py
│   ├── admin.py
│   ├── apps.py
│   └── migrations/
│       ├── __init__.py   (فارغ)
│       └── 0001_initial.py
├── static/
│   ├── css/
│   │   └── word-editor.css
│   └── js/
│       └── ckeditor_init.js
└── templates/
    ├── base.html
    └── questions/
        ├── editor.html
        ├── list.html
        └── detail.html
```

---

## 📄 الملف: `requirements.txt`

```
Django>=6.0,<7.0
```

---

## 📄 الملف: `manage.py`

```python
#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys


def main():
    """Run administrative tasks."""
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'school_system.settings')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    execute_from_command_line(sys.argv)


if __name__ == '__main__':
    main()
```

---

## �� الملف: `run.sh`

```bash
#!/bin/bash
# سكريبت تشغيل مدرسة الشقيق الابتدائية
# الاستخدام:  bash run.sh
#             bash run.sh 0.0.0.0:8000

set -e

PORT="${1:-0.0.0.0:8000}"

echo "========================================"
echo "  مدرسة الشقيق الابتدائية بنين"
echo "  نظام إدارة الأسئلة الإلكترونية"
echo "========================================"

if ! command -v python3 &>/dev/null; then
    echo "[خطأ] Python3 غير مثبّت."
    exit 1
fi
echo "[✔] Python: $(python3 --version)"

echo ""
echo "[...] تثبيت المتطلبات..."
pip3 install -r requirements.txt --quiet
echo "[✔] تم تثبيت المتطلبات"

echo ""
echo "[...] تطبيق تحديثات قاعدة البيانات..."
python3 manage.py migrate --run-syncdb
echo "[✔] قاعدة البيانات جاهزة"

echo ""
echo "========================================"
echo "  السيرفر يعمل على: http://$PORT"
echo "  اضغط Ctrl+C للإيقاف"
echo "========================================"
echo ""

python3 manage.py runserver "$PORT"
```

---

## 📄 الملف: `school_system/__init__.py`

```python
```
*(ملف فارغ)*

---

## 📄 الملف: `school_system/settings.py`

```python
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = 'django-insecure-^3u#z$9$e2v873!uwo5hidb7%ynfe-y2hg#_p4at^er)(b65!='

DEBUG = True

ALLOWED_HOSTS = ['*']

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'questions',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'school_system.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'school_system.wsgi.application'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

LANGUAGE_CODE = 'ar'
TIME_ZONE = 'Asia/Riyadh'
USE_I18N = True
USE_TZ = True

STATIC_URL = 'static/'
STATICFILES_DIRS = [BASE_DIR / 'static']

MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
```

---

## 📄 الملف: `school_system/urls.py`

```python
"""URL configuration for school_system project."""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('questions.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
```

---

## 📄 الملف: `school_system/wsgi.py`

```python
import os
from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'school_system.settings')
application = get_wsgi_application()
```

---

## 📄 الملف: `school_system/asgi.py`

```python
import os
from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'school_system.settings')
application = get_asgi_application()
```

---

## 📄 الملف: `questions/__init__.py`

*(ملف فارغ)*

---

## 📄 الملف: `questions/apps.py`

```python
from django.apps import AppConfig

class QuestionsConfig(AppConfig):
    name = 'questions'
```

---

## 📄 الملف: `questions/models.py`

```python
from django.db import models


class Question(models.Model):
    """نموذج السؤال."""

    SUBJECT_CHOICES = [
        ('arabic', 'اللغة العربية'),
        ('math', 'الرياضيات'),
        ('science', 'العلوم'),
        ('social', 'الدراسات الاجتماعية'),
        ('english', 'اللغة الإنجليزية'),
        ('islamic', 'التربية الإسلامية'),
        ('other', 'أخرى'),
    ]

    GRADE_CHOICES = [(str(i), f'الصف {i}') for i in range(1, 7)]

    title = models.CharField(max_length=500, verbose_name='عنوان السؤال')
    content = models.TextField(verbose_name='محتوى السؤال')
    subject = models.CharField(
        max_length=50,
        choices=SUBJECT_CHOICES,
        default='arabic',
        verbose_name='المادة',
    )
    grade = models.CharField(
        max_length=2,
        choices=GRADE_CHOICES,
        default='1',
        verbose_name='الصف',
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='تاريخ الإنشاء')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='تاريخ التعديل')

    class Meta:
        verbose_name = 'سؤال'
        verbose_name_plural = 'الأسئلة'
        ordering = ['-created_at']

    def __str__(self):
        return self.title
```

---

## 📄 الملف: `questions/admin.py`

```python
from django.contrib import admin
from .models import Question


@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ('title', 'subject', 'grade', 'created_at')
    list_filter = ('subject', 'grade')
    search_fields = ('title', 'content')
    date_hierarchy = 'created_at'
```

---

## 📄 الملف: `questions/urls.py`

```python
from django.urls import path
from . import views

urlpatterns = [
    path('', views.question_list, name='question_list'),
    path('question/new/', views.question_create, name='question_create'),
    path('question/<int:pk>/', views.question_detail, name='question_detail'),
    path('question/<int:pk>/edit/', views.question_edit, name='question_edit'),
    path('question/<int:pk>/delete/', views.question_delete, name='question_delete'),
    path('question/autosave/', views.autosave, name='autosave'),
]
```

---

## 📄 الملف: `questions/views.py`

```python
import json
from django.shortcuts import render, redirect, get_object_or_404
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from .models import Question

FONT_SIZES = [8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72]
MATH_SYMBOLS = ['∫','∑','√','∞','π','α','β','γ','≤','≥','≠','±','×','÷','°','²','³','Δ','θ','λ','μ','σ','φ','ω']


def question_list(request):
    """عرض قائمة الأسئلة."""
    questions = Question.objects.all()
    return render(request, 'questions/list.html', {'questions': questions})


def question_create(request):
    """إنشاء سؤال جديد."""
    if request.method == 'POST':
        title = request.POST.get('title', '').strip()
        content = request.POST.get('content', '').strip()
        subject = request.POST.get('subject', 'arabic')
        grade = request.POST.get('grade', '1')

        if title and content:
            question = Question.objects.create(
                title=title, content=content,
                subject=subject, grade=grade,
            )
            return redirect('question_detail', pk=question.pk)

    context = {
        'subjects': Question.SUBJECT_CHOICES,
        'grades': Question.GRADE_CHOICES,
        'font_sizes': FONT_SIZES,
        'math_symbols': MATH_SYMBOLS,
    }
    return render(request, 'questions/editor.html', context)


def question_detail(request, pk):
    """عرض تفاصيل سؤال."""
    question = get_object_or_404(Question, pk=pk)
    return render(request, 'questions/detail.html', {'question': question})


def question_edit(request, pk):
    """تعديل سؤال موجود."""
    question = get_object_or_404(Question, pk=pk)

    if request.method == 'POST':
        title = request.POST.get('title', '').strip()
        content = request.POST.get('content', '').strip()
        subject = request.POST.get('subject', 'arabic')
        grade = request.POST.get('grade', '1')

        if title and content:
            question.title = title
            question.content = content
            question.subject = subject
            question.grade = grade
            question.save()
            return redirect('question_detail', pk=question.pk)

    context = {
        'question': question,
        'subjects': Question.SUBJECT_CHOICES,
        'grades': Question.GRADE_CHOICES,
        'font_sizes': FONT_SIZES,
        'math_symbols': MATH_SYMBOLS,
    }
    return render(request, 'questions/editor.html', context)


@require_POST
def question_delete(request, pk):
    """حذف سؤال."""
    question = get_object_or_404(Question, pk=pk)
    question.delete()
    return redirect('question_list')


@require_POST
def autosave(request):
    """حفظ تلقائي للمحتوى."""
    try:
        data = json.loads(request.body)
        question_id = data.get('id')
        content = data.get('content', '')
        title = data.get('title', '')

        if question_id:
            question = get_object_or_404(Question, pk=question_id)
            question.content = content
            question.title = title
            question.save()
            return JsonResponse({'status': 'saved', 'id': question.pk})

        return JsonResponse({'status': 'draft'})
    except (json.JSONDecodeError, Exception) as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=400)
```

---

## 📄 الملف: `questions/migrations/__init__.py`

*(ملف فارغ)*

---

## 📄 الملف: `questions/migrations/0001_initial.py`

```python
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True
    dependencies = []

    operations = [
        migrations.CreateModel(
            name='Question',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=500, verbose_name='عنوان السؤال')),
                ('content', models.TextField(verbose_name='محتوى السؤال')),
                ('subject', models.CharField(
                    choices=[('arabic','اللغة العربية'),('math','الرياضيات'),('science','العلوم'),
                             ('social','الدراسات الاجتماعية'),('english','اللغة الإنجليزية'),
                             ('islamic','التربية الإسلامية'),('other','أخرى')],
                    default='arabic', max_length=50, verbose_name='المادة')),
                ('grade', models.CharField(
                    choices=[('1','الصف 1'),('2','الصف 2'),('3','الصف 3'),
                             ('4','الصف 4'),('5','الصف 5'),('6','الصف 6')],
                    default='1', max_length=2, verbose_name='الصف')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='تاريخ الإنشاء')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='تاريخ التعديل')),
            ],
            options={
                'verbose_name': 'سؤال',
                'verbose_name_plural': 'الأسئلة',
                'ordering': ['-created_at'],
            },
        ),
    ]
```

---

## 📄 الملف: `templates/base.html`

```html
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{% block title %}مدرسة الشقيق الابتدائية بنين{% endblock %}</title>

    <!-- خطوط Google العربية -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700&family=Amiri:wght@400;700&family=Tajawal:wght@300;400;500;700&family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&display=swap" rel="stylesheet">

    <!-- ملف CSS الرئيسي -->
    {% load static %}
    <link rel="stylesheet" href="{% static 'css/word-editor.css' %}">

    {% block extra_head %}{% endblock %}
</head>
<body>
    {% block content %}{% endblock %}
    {% block extra_scripts %}{% endblock %}
</body>
</html>
```

---

## 📄 الملف: `templates/questions/list.html`

```html
{% extends "base.html" %}
{% load static %}

{% block title %}قائمة الأسئلة – مدرسة الشقيق الابتدائية{% endblock %}

{% block content %}

<header class="app-header">
    <span class="app-icon">🏫</span>
    <span class="app-title">مدرسة الشقيق الابتدائية بنين — نظام إدارة الأسئلة</span>
    <div class="header-actions">
        <a href="{% url 'question_create' %}" class="btn-header">✏️ سؤال جديد</a>
        <a href="/admin/" class="btn-header">⚙️ الإدارة</a>
    </div>
</header>

<div class="pages-container" style="padding:30px 20px;">
    <div style="max-width:860px;width:100%;margin:0 auto;">

        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;">
            <div class="page-title" style="margin:0;">
                <span>📋</span>
                <span>الأسئلة المحفوظة</span>
            </div>
            <a href="{% url 'question_create' %}" class="btn-primary"
               style="text-decoration:none;padding:10px 22px;font-size:14px;border-radius:5px;display:inline-flex;align-items:center;gap:6px;">
                ✏️ إنشاء سؤال جديد
            </a>
        </div>

        {% if questions %}
            {% for q in questions %}
            <div class="question-card">
                <div class="q-info">
                    <h3>{{ q.title }}</h3>
                    <div class="q-meta">
                        <span>📚 {{ q.get_subject_display }}</span>
                        <span>🎓 {{ q.get_grade_display }}</span>
                        <span>📅 {{ q.created_at|date:"Y/m/d" }}</span>
                    </div>
                </div>
                <div class="q-actions">
                    <a href="{% url 'question_detail' q.pk %}" class="btn-action btn-view">👁️ عرض</a>
                    <a href="{% url 'question_edit' q.pk %}" class="btn-action btn-edit">✏️ تعديل</a>
                    <form method="post" action="{% url 'question_delete' q.pk %}" style="display:inline;"
                          onsubmit="return confirm('هل أنت متأكد من حذف هذا السؤال؟')">
                        {% csrf_token %}
                        <button type="submit" class="btn-action btn-delete">🗑️ حذف</button>
                    </form>
                </div>
            </div>
            {% endfor %}
        {% else %}
            <div class="editor-page" style="min-height:auto;text-align:center;padding:60px 40px;">
                <div style="font-size:70px;margin-bottom:16px;">📝</div>
                <p style="font-size:17px;color:#555;margin-bottom:24px;">لا توجد أسئلة بعد. ابدأ بإنشاء سؤال جديد!</p>
                <a href="{% url 'question_create' %}" class="btn-primary"
                   style="text-decoration:none;padding:12px 28px;font-size:15px;border-radius:5px;display:inline-flex;align-items:center;gap:8px;">
                    ✏️ إنشاء أول سؤال
                </a>
            </div>
        {% endif %}

    </div>
</div>

<div class="status-bar">
    <div class="status-left">
        <span class="status-item">🏫 مدرسة الشقيق الابتدائية بنين</span>
    </div>
    <div class="status-right">
        <span class="status-item">إجمالي الأسئلة: <strong>{{ questions|length }}</strong></span>
        <span class="status-item">العربية</span>
    </div>
</div>

{% endblock %}
```

---

## 📄 الملف: `templates/questions/detail.html`

```html
{% extends "base.html" %}
{% load static %}

{% block title %}{{ question.title }} – مدرسة الشقيق الابتدائية{% endblock %}

{% block content %}

<header class="app-header no-print">
    <span class="app-icon">📄</span>
    <span class="app-title">{{ question.title }} — مدرسة الشقيق الابتدائية بنين</span>
    <div class="header-actions">
        <a href="{% url 'question_list' %}" class="btn-header">📋 قائمة الأسئلة</a>
        <a href="{% url 'question_edit' question.pk %}" class="btn-header">✏️ تعديل</a>
        <button class="btn-header" onclick="window.print()">🖨️ طباعة</button>
    </div>
</header>

<div class="pages-container">
    <div class="editor-page">

        <div class="question-meta no-print"
             style="border-bottom:2px solid #2b579a;padding-bottom:12px;margin-bottom:20px;grid-template-columns:1fr 1fr 1fr;">
            <div class="meta-field">
                <label>المادة</label>
                <div style="padding:6px 10px;background:#f0f4fa;border-radius:4px;font-size:13px;">
                    📚 {{ question.get_subject_display }}
                </div>
            </div>
            <div class="meta-field">
                <label>الصف</label>
                <div style="padding:6px 10px;background:#f0f4fa;border-radius:4px;font-size:13px;">
                    🎓 {{ question.get_grade_display }}
                </div>
            </div>
            <div class="meta-field">
                <label>تاريخ الإنشاء</label>
                <div style="padding:6px 10px;background:#f0f4fa;border-radius:4px;font-size:13px;">
                    📅 {{ question.created_at|date:"Y/m/d H:i" }}
                </div>
            </div>
        </div>

        <div style="font-size:20px;font-weight:700;color:#2b579a;margin-bottom:20px;
                    padding-bottom:10px;border-bottom:1px solid #e0e0e0;">
            {{ question.title }}
        </div>

        <div class="question-content ck-content"
             style="font-size:14pt;line-height:1.8;direction:rtl;text-align:right;">
            {{ question.content|safe }}
        </div>

    </div>
</div>

<div class="status-bar no-print">
    <div class="status-left">
        <span class="status-item">🏫 مدرسة الشقيق الابتدائية بنين</span>
    </div>
    <div class="status-right">
        <span class="status-item">الصفحة 1</span>
        <span class="status-item">العربية</span>
    </div>
</div>

{% endblock %}
```

---

## 📄 الملف: `templates/questions/editor.html`

```html
{% extends "base.html" %}
{% load static %}

{% block title %}
    {% if question %}تعديل سؤال{% else %}إنشاء سؤال جديد{% endif %} – مدرسة الشقيق الابتدائية
{% endblock %}

{% block extra_head %}
    <script src="https://cdn.ckeditor.com/ckeditor5/41.4.2/classic/ckeditor.js"></script>
    <script src="https://cdn.ckeditor.com/ckeditor5/41.4.2/classic/translations/ar.js"></script>
{% endblock %}

{% block content %}

<header class="app-header no-print">
    <span class="app-icon">📝</span>
    <span class="app-title">
        {% if question %}تعديل: {{ question.title }}{% else %}سؤال جديد{% endif %}
        — مدرسة الشقيق الابتدائية بنين
    </span>
    <div class="header-actions">
        <a href="{% url 'question_list' %}" class="btn-header">📋 قائمة الأسئلة</a>
        <button class="btn-header" onclick="saveForm()">💾 حفظ</button>
        <button class="btn-header" onclick="printPreview()">🖨️ طباعة</button>
        <button class="btn-header" onclick="toggleFullscreen()">⛶ ملء الشاشة</button>
    </div>
</header>

<div class="ribbon-wrapper no-print">

    <div class="ribbon-tabs">
        <button class="ribbon-tab active" data-panel="panel-home">الصفحة الرئيسية</button>
        <button class="ribbon-tab" data-panel="panel-insert">إدراج</button>
        <button class="ribbon-tab" data-panel="panel-paragraph">فقرة</button>
        <button class="ribbon-tab" data-panel="panel-styles">أنماط</button>
        <button class="ribbon-tab" data-panel="panel-tools">أدوات</button>
    </div>

    <!-- لوحة: الصفحة الرئيسية -->
    <div class="ribbon-content ribbon-panel" id="panel-home">

        <div class="ribbon-section">
            <button class="ribbon-btn" onclick="execUndo()" title="تراجع (Ctrl+Z)">
                <span class="btn-icon">↩</span><span class="btn-label">تراجع</span>
            </button>
            <button class="ribbon-btn" onclick="execRedo()" title="إعادة (Ctrl+Y)">
                <span class="btn-icon">↪</span><span class="btn-label">إعادة</span>
            </button>
        </div>

        <div class="ribbon-section">
            <select class="ribbon-select font-name-select" onchange="changeFontFamily(this.value)" title="نوع الخط">
                <option value="">الخط الافتراضي</option>
                <option value="Cairo, sans-serif">Cairo</option>
                <option value="Amiri, serif">Amiri</option>
                <option value="Tajawal, sans-serif">Tajawal</option>
                <option value="Scheherazade New, serif">Scheherazade</option>
                <option value="IBM Plex Sans Arabic, sans-serif">IBM Plex Arabic</option>
                <option value="Arial, Helvetica, sans-serif">Arial</option>
                <option value="Times New Roman, serif">Times New Roman</option>
                <option value="Courier New, monospace">Courier New</option>
            </select>
            <select class="ribbon-select font-size-select" onchange="changeFontSize(this.value)" title="حجم الخط">
                <option value="">حجم</option>
                {% for size in font_sizes %}
                <option value="{{ size }}">{{ size }}</option>
                {% endfor %}
            </select>
        </div>

        <div class="ribbon-section">
            <button id="btn-bold" class="ribbon-btn" onclick="execBold()" title="غامق (Ctrl+B)">
                <span class="btn-icon" style="font-weight:bold;">ب</span>
                <span class="btn-label">غامق</span>
            </button>
            <button id="btn-italic" class="ribbon-btn" onclick="execItalic()" title="مائل (Ctrl+I)">
                <span class="btn-icon" style="font-style:italic;">م</span>
                <span class="btn-label">مائل</span>
            </button>
            <button id="btn-underline" class="ribbon-btn" onclick="execUnderline()" title="تحته خط (Ctrl+U)">
                <span class="btn-icon" style="text-decoration:underline;">س</span>
                <span class="btn-label">تسطير</span>
            </button>
            <button id="btn-strikethrough" class="ribbon-btn" onclick="execStrikethrough()" title="يتوسطه خط">
                <span class="btn-icon" style="text-decoration:line-through;">ح</span>
                <span class="btn-label">شطب</span>
            </button>
            <button class="ribbon-btn" onclick="execRemoveFormat()" title="مسح التنسيق">
                <span class="btn-icon">🚫</span><span class="btn-label">مسح</span>
            </button>
        </div>

        <div class="ribbon-section">
            <button class="ribbon-btn" onclick="execAlignment('right')" title="يميناً">
                <span class="btn-icon">⬜▰▰▰</span><span class="btn-label">يمين</span>
            </button>
            <button class="ribbon-btn" onclick="execAlignment('center')" title="وسطاً">
                <span class="btn-icon">≡</span><span class="btn-label">وسط</span>
            </button>
            <button class="ribbon-btn" onclick="execAlignment('left')" title="يساراً">
                <span class="btn-icon">▰▰▰⬜</span><span class="btn-label">يسار</span>
            </button>
            <button class="ribbon-btn" onclick="execAlignment('justify')" title="ضبط">
                <span class="btn-icon">☰</span><span class="btn-label">ضبط</span>
            </button>
        </div>

        <div class="ribbon-section">
            <button id="btn-bulletedList" class="ribbon-btn" onclick="execBulletedList()" title="قائمة نقطية">
                <span class="btn-icon">•≡</span><span class="btn-label">نقطي</span>
            </button>
            <button id="btn-numberedList" class="ribbon-btn" onclick="execNumberedList()" title="قائمة مرقمة">
                <span class="btn-icon">1≡</span><span class="btn-label">مرقم</span>
            </button>
            <button class="ribbon-btn" onclick="execOutdent()" title="تقليل المسافة البادئة">
                <span class="btn-icon">⇤</span><span class="btn-label">تقليل</span>
            </button>
            <button class="ribbon-btn" onclick="execIndent()" title="زيادة المسافة البادئة">
                <span class="btn-icon">⇥</span><span class="btn-label">زيادة</span>
            </button>
        </div>
    </div>

    <!-- لوحة: إدراج -->
    <div class="ribbon-content ribbon-panel hidden" id="panel-insert">
        <div class="ribbon-section">
            <button class="ribbon-btn" onclick="openImageModal()">
                <span class="btn-icon">🖼️</span><span class="btn-label">صورة</span>
            </button>
            <button class="ribbon-btn" onclick="openTableModal()">
                <span class="btn-icon">🗃️</span><span class="btn-label">جدول</span>
            </button>
            <button class="ribbon-btn" onclick="openLinkModal()">
                <span class="btn-icon">🔗</span><span class="btn-label">رابط</span>
            </button>
            <button class="ribbon-btn" onclick="insertHorizontalLine()">
                <span class="btn-icon">➖</span><span class="btn-label">خط</span>
            </button>
        </div>
        <div class="ribbon-section">
            <span style="font-size:11px;color:#666;align-self:flex-start;padding-top:4px;">رموز رياضية:</span>
            {% for sym in math_symbols %}
            <button class="ribbon-btn" onclick="insertMathSymbol('{{ sym }}')"
                    title="{{ sym }}" style="min-width:32px;font-size:15px;">{{ sym }}</button>
            {% endfor %}
        </div>
    </div>

    <!-- لوحة: فقرة -->
    <div class="ribbon-content ribbon-panel hidden" id="panel-paragraph">
        <div class="ribbon-section">
            <label style="font-size:12px;color:#555;">تباعد الأسطر:</label>
            <select class="ribbon-select" onchange="changeLineSpacing(this.value)">
                <option value="1">1.0</option>
                <option value="1.15" selected>1.15</option>
                <option value="1.5">1.5</option>
                <option value="2">2.0</option>
                <option value="2.5">2.5</option>
                <option value="3">3.0</option>
            </select>
        </div>
    </div>

    <!-- لوحة: أنماط -->
    <div class="ribbon-content ribbon-panel hidden" id="panel-styles">
        <div class="ribbon-section">
            <button class="ribbon-btn" onclick="changeHeading('paragraph')" style="min-width:80px;">
                <span style="font-size:12px;">فقرة عادية</span>
            </button>
            <button class="ribbon-btn" onclick="changeHeading('heading1')" style="min-width:80px;">
                <span style="font-size:18px;font-weight:700;">عنوان 1</span>
            </button>
            <button class="ribbon-btn" onclick="changeHeading('heading2')" style="min-width:80px;">
                <span style="font-size:16px;font-weight:600;">عنوان 2</span>
            </button>
            <button class="ribbon-btn" onclick="changeHeading('heading3')" style="min-width:80px;">
                <span style="font-size:14px;font-weight:600;">عنوان 3</span>
            </button>
        </div>
    </div>

    <!-- لوحة: أدوات -->
    <div class="ribbon-content ribbon-panel hidden" id="panel-tools">
        <div class="ribbon-section">
            <button class="ribbon-btn" onclick="openFindReplace()">
                <span class="btn-icon">🔍</span><span class="btn-label">بحث</span>
            </button>
            <button class="ribbon-btn" onclick="printPreview()">
                <span class="btn-icon">🖨️</span><span class="btn-label">طباعة</span>
            </button>
            <button class="ribbon-btn" onclick="toggleFullscreen()">
                <span class="btn-icon">⛶</span><span class="btn-label">ملء الشاشة</span>
            </button>
        </div>
    </div>

</div><!-- /ribbon-wrapper -->

<div class="ruler-horizontal no-print">
    <div class="ruler-marks"></div>
</div>

<div class="pages-container">
    <div class="editor-page">
        <form id="question-form" method="post">
            {% csrf_token %}
            <input type="hidden" id="question-id"
                   value="{% if question %}{{ question.pk }}{% else %}draft{% endif %}">

            <div class="question-meta no-print">
                <div class="meta-field">
                    <label for="id_title">عنوان السؤال</label>
                    <input type="text" id="id_title" name="title" required
                           placeholder="أدخل عنوان السؤال..."
                           value="{% if question %}{{ question.title }}{% endif %}">
                </div>
                <div class="meta-field">
                    <label for="id_subject">المادة</label>
                    <select id="id_subject" name="subject">
                        {% for value, label in subjects %}
                        <option value="{{ value }}"
                            {% if question and question.subject == value %}selected{% endif %}>
                            {{ label }}
                        </option>
                        {% endfor %}
                    </select>
                </div>
                <div class="meta-field">
                    <label for="id_grade">الصف</label>
                    <select id="id_grade" name="grade">
                        {% for value, label in grades %}
                        <option value="{{ value }}"
                            {% if question and question.grade == value %}selected{% endif %}>
                            {{ label }}
                        </option>
                        {% endfor %}
                    </select>
                </div>
            </div>

            <div class="ck-editor-container">
                <textarea id="ckeditor" name="content">{% if question %}{{ question.content }}{% endif %}</textarea>
            </div>
        </form>
    </div>
</div>

<div class="status-bar no-print">
    <div class="status-left">
        <div class="autosave-indicator">
            <div class="autosave-dot"></div>
            <span id="autosave-label">يحفظ تلقائياً</span>
        </div>
    </div>
    <div class="status-right">
        <span class="status-item">الكلمات: <strong id="word-count">0</strong></span>
        <span class="status-item">الأحرف: <strong id="char-count">0</strong></span>
        <span class="status-item">الصفحة 1</span>
        <span class="status-item">العربية</span>
    </div>
</div>

<!-- نافذة إدراج صورة -->
<div id="image-modal" class="modal-overlay hidden">
    <div class="modal-box">
        <h3>🖼️ إدراج صورة</h3>
        <div class="form-group">
            <label>رابط الصورة (URL)</label>
            <input type="url" id="image-url-input" placeholder="https://...">
        </div>
        <div class="modal-actions">
            <button class="btn-secondary" onclick="closeModal('image-modal')">إلغاء</button>
            <button class="btn-primary" onclick="insertImageFromUrl()">إدراج</button>
        </div>
    </div>
</div>

<!-- نافذة إدراج جدول -->
<div id="table-modal" class="modal-overlay hidden">
    <div class="modal-box">
        <h3>🗃️ إدراج جدول</h3>
        <div class="form-group">
            <label>عدد الصفوف</label>
            <input type="number" id="table-rows" value="3" min="1" max="20">
        </div>
        <div class="form-group">
            <label>عدد الأعمدة</label>
            <input type="number" id="table-cols" value="3" min="1" max="10">
        </div>
        <div class="modal-actions">
            <button class="btn-secondary" onclick="closeModal('table-modal')">إلغاء</button>
            <button class="btn-primary" onclick="insertTable()">إدراج</button>
        </div>
    </div>
</div>

<!-- نافذة إدراج رابط -->
<div id="link-modal" class="modal-overlay hidden">
    <div class="modal-box">
        <h3>🔗 إدراج رابط</h3>
        <div class="form-group">
            <label>الرابط (URL)</label>
            <input type="url" id="link-url-input" placeholder="https://...">
        </div>
        <div class="form-group">
            <label>نص الرابط (اختياري)</label>
            <input type="text" id="link-text-input" placeholder="نص الرابط...">
        </div>
        <div class="modal-actions">
            <button class="btn-secondary" onclick="closeModal('link-modal')">إلغاء</button>
            <button class="btn-primary" onclick="insertLink()">إدراج</button>
        </div>
    </div>
</div>

{% endblock %}

{% block extra_scripts %}
<script src="{% static 'js/ckeditor_init.js' %}"></script>
{% endblock %}
```

---

## 📄 الملف: `static/css/word-editor.css`

```css
/* ===================================================
   word-editor.css – تصميم محرر شبيه بـ Microsoft Word
   مدرسة الشقيق الابتدائية بنين الإلكترونية
   =================================================== */

/* استيراد خطوط Google العربية */
@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700&family=Amiri:wght@400;700&family=Tajawal:wght@300;400;500;700&family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&display=swap');

/* ===== متغيرات اللون ===== */
:root {
    --word-blue: #2b579a;
    --word-blue-light: #d0e4f7;
    --word-toolbar-bg: #f3f3f3;
    --word-toolbar-border: #c6c6c6;
    --word-ribbon-bg: #ffffff;
    --word-page-bg: #f0f0f0;
    --word-shadow: 0 4px 16px rgba(0, 0, 0, 0.18);
    --word-font: 'Cairo', 'Tajawal', Arial, sans-serif;
    --status-bar-height: 32px;
    --app-header-height: 42px;
    --ribbon-tabs-height: 36px;
    --ribbon-content-height: 68px;
    --ruler-top: calc(var(--app-header-height) + var(--ribbon-tabs-height) + var(--ribbon-content-height));
}

/* ===== الجسم العام ===== */
body {
    font-family: var(--word-font);
    direction: rtl;
    background: var(--word-page-bg);
    margin: 0;
    padding: 0;
    min-height: 100vh;
    color: #222;
}

/* ===== شريط التطبيق العلوي ===== */
.app-header {
    background: var(--word-blue);
    color: #fff;
    padding: 6px 20px;
    display: flex;
    align-items: center;
    gap: 12px;
    box-shadow: 0 2px 6px rgba(0,0,0,0.25);
    z-index: 200;
    position: relative;
}

.app-header .app-icon {
    font-size: 22px;
}

.app-header .app-title {
    font-size: 15px;
    font-weight: 600;
    flex: 1;
}

.app-header .header-actions {
    display: flex;
    gap: 8px;
}

.app-header .btn-header {
    background: rgba(255,255,255,0.15);
    border: 1px solid rgba(255,255,255,0.3);
    color: #fff;
    border-radius: 4px;
    padding: 4px 12px;
    font-size: 13px;
    cursor: pointer;
    font-family: var(--word-font);
    transition: background 0.2s;
}

.app-header .btn-header:hover {
    background: rgba(255,255,255,0.3);
}

/* ===== شريط أدوات الـ Ribbon ===== */
.ribbon-wrapper {
    background: var(--word-ribbon-bg);
    border-bottom: 2px solid var(--word-blue);
    position: sticky;
    top: 0;
    z-index: 150;
}

/* علامات تبويب الـ Ribbon */
.ribbon-tabs {
    display: flex;
    background: #f3f2f1;
    border-bottom: 1px solid var(--word-toolbar-border);
    gap: 0;
    padding: 0 10px;
}

.ribbon-tab {
    padding: 7px 18px;
    font-size: 13px;
    color: #444;
    cursor: pointer;
    border: none;
    background: transparent;
    font-family: var(--word-font);
    border-bottom: 3px solid transparent;
    transition: all 0.15s;
}

.ribbon-tab:hover {
    background: rgba(0,0,0,0.05);
    color: #222;
}

.ribbon-tab.active {
    color: var(--word-blue);
    border-bottom: 3px solid var(--word-blue);
    background: #fff;
    font-weight: 600;
}

/* محتوى الـ Ribbon */
.ribbon-content {
    padding: 6px 10px;
    background: var(--word-ribbon-bg);
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    align-items: center;
    min-height: 56px;
}

.ribbon-section {
    display: flex;
    align-items: center;
    gap: 3px;
    padding: 0 8px;
    border-left: 1px solid #ddd;
}

.ribbon-section:last-child {
    border-left: none;
}

.ribbon-section-label {
    font-size: 10px;
    color: #888;
    text-align: center;
    padding-top: 2px;
    width: 100%;
    display: block;
}

/* أزرار الـ Ribbon */
.ribbon-btn {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-width: 36px;
    padding: 4px 6px;
    border: 1px solid transparent;
    border-radius: 3px;
    background: transparent;
    cursor: pointer;
    font-family: var(--word-font);
    font-size: 11px;
    color: #333;
    transition: all 0.15s;
    gap: 2px;
}

.ribbon-btn:hover {
    background: var(--word-blue-light);
    border-color: #a0b8d8;
}

.ribbon-btn.active,
.ribbon-btn:active {
    background: #c7dff7;
    border-color: var(--word-blue);
}

.ribbon-btn .btn-icon {
    font-size: 16px;
    line-height: 1;
}

.ribbon-btn .btn-label {
    font-size: 10px;
    white-space: nowrap;
}

/* قوائم منسدلة في الـ Ribbon */
.ribbon-select {
    border: 1px solid #ccc;
    border-radius: 3px;
    padding: 4px 6px;
    font-family: var(--word-font);
    font-size: 12px;
    background: #fff;
    color: #333;
    cursor: pointer;
    min-width: 60px;
    max-width: 160px;
}

.ribbon-select:hover,
.ribbon-select:focus {
    border-color: var(--word-blue);
    outline: none;
    box-shadow: 0 0 0 2px rgba(43,87,154,0.15);
}

.font-name-select {
    min-width: 130px;
}

.font-size-select {
    min-width: 55px;
}

/* فاصل عمودي */
.ribbon-separator {
    width: 1px;
    height: 36px;
    background: #ddd;
    margin: 0 4px;
}

/* ===== منطقة المحتوى الرئيسية ===== */
.editor-wrapper {
    display: flex;
    flex-direction: column;
    min-height: calc(100vh - 200px);
}

/* مسطرة أفقية */
.ruler-horizontal {
    background: #f9f9f9;
    border-bottom: 1px solid #ddd;
    height: 24px;
    position: sticky;
    top: var(--ruler-top);
    z-index: 100;
    overflow: hidden;
    display: flex;
    align-items: flex-end;
    padding: 0 calc(50% - 10.5cm);
}

.ruler-marks {
    display: flex;
    width: 21cm;
    position: relative;
    height: 100%;
}

.ruler-mark {
    position: absolute;
    bottom: 0;
    width: 1px;
    background: #aaa;
    font-size: 9px;
    color: #888;
    text-align: center;
}

.ruler-mark.major {
    height: 10px;
}

.ruler-mark.minor {
    height: 5px;
}

.ruler-mark span {
    position: absolute;
    bottom: 11px;
    right: -4px;
    font-size: 9px;
    color: #666;
}

/* منطقة الصفحات */
.pages-container {
    flex: 1;
    background: var(--word-page-bg);
    padding: 30px 20px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
}

/* صفحة A4 */
.editor-page {
    background: #ffffff;
    width: 21cm;
    min-height: 29.7cm;
    padding: 2.54cm;
    box-shadow: var(--word-shadow);
    position: relative;
    box-sizing: border-box;
}

/* حقول البيانات في أعلى الصفحة */
.question-meta {
    border-bottom: 2px solid var(--word-blue);
    padding-bottom: 12px;
    margin-bottom: 20px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
}

.meta-field {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.meta-field label {
    font-size: 12px;
    color: #666;
    font-weight: 600;
}

.meta-field input,
.meta-field select {
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 6px 10px;
    font-family: var(--word-font);
    font-size: 13px;
    background: #fafafa;
    color: #333;
    width: 100%;
    box-sizing: border-box;
    transition: border 0.2s;
}

.meta-field input:focus,
.meta-field select:focus {
    border-color: var(--word-blue);
    outline: none;
    background: #fff;
    box-shadow: 0 0 0 2px rgba(43,87,154,0.1);
}

/* ===== محرر CKEditor ===== */
.ck-editor-container {
    min-height: 400px;
}

/* تخصيص CKEditor ليبدو كـ Word */
.ck.ck-editor {
    width: 100% !important;
}

.ck.ck-editor__main .ck-editor__editable {
    min-height: 400px;
    font-family: 'Cairo', 'Tajawal', Arial, sans-serif !important;
    font-size: 14pt;
    line-height: 1.6;
    direction: rtl;
    text-align: right;
    border: none !important;
    box-shadow: none !important;
    padding: 0 !important;
    background: transparent !important;
}

.ck.ck-editor__main .ck-editor__editable:focus {
    outline: none !important;
    box-shadow: none !important;
}

.ck.ck-toolbar {
    display: none !important; /* نخفي شريط CKEditor الافتراضي ونستخدم Ribbon مخصص */
}

/* ===== شريط الحالة ===== */
.status-bar {
    background: var(--word-blue);
    color: rgba(255,255,255,0.9);
    padding: 5px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 12px;
    font-family: var(--word-font);
    height: var(--status-bar-height);
    box-sizing: border-box;
    position: sticky;
    bottom: 0;
    z-index: 150;
}

.status-bar .status-left,
.status-bar .status-right {
    display: flex;
    gap: 20px;
    align-items: center;
}

.status-bar .status-item {
    display: flex;
    align-items: center;
    gap: 4px;
    cursor: default;
}

.status-bar .status-item:hover {
    background: rgba(255,255,255,0.1);
    border-radius: 3px;
    padding: 2px 6px;
    margin: -2px -6px;
}

.status-bar .autosave-indicator {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 11px;
}

.autosave-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #4caf50;
    animation: pulse 2s infinite;
}

.autosave-dot.saving {
    background: #ff9800;
    animation: spin 1s linear infinite;
}

@keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
}

@keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}

/* ===== نافذة منبثقة (Modal) ===== */
.modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.5);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
}

.modal-overlay.hidden {
    display: none;
}

.modal-box {
    background: #fff;
    border-radius: 6px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.3);
    padding: 24px;
    min-width: 360px;
    max-width: 90vw;
    direction: rtl;
    font-family: var(--word-font);
}

.modal-box h3 {
    margin: 0 0 16px;
    color: var(--word-blue);
    font-size: 16px;
    border-bottom: 1px solid #eee;
    padding-bottom: 10px;
}

.modal-box .form-group {
    margin-bottom: 12px;
}

.modal-box label {
    display: block;
    font-size: 13px;
    color: #555;
    margin-bottom: 4px;
}

.modal-box input,
.modal-box select {
    width: 100%;
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 7px 10px;
    font-family: var(--word-font);
    font-size: 13px;
    box-sizing: border-box;
}

.modal-box input:focus,
.modal-box select:focus {
    border-color: var(--word-blue);
    outline: none;
    box-shadow: 0 0 0 2px rgba(43,87,154,0.15);
}

.modal-actions {
    display: flex;
    gap: 10px;
    justify-content: flex-end;
    margin-top: 16px;
}

.btn-primary {
    background: var(--word-blue);
    color: #fff;
    border: none;
    border-radius: 4px;
    padding: 8px 20px;
    font-family: var(--word-font);
    font-size: 13px;
    cursor: pointer;
    transition: background 0.2s;
}

.btn-primary:hover {
    background: #1e4080;
}

.btn-secondary {
    background: #f3f3f3;
    color: #333;
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 8px 20px;
    font-family: var(--word-font);
    font-size: 13px;
    cursor: pointer;
    transition: all 0.2s;
}

.btn-secondary:hover {
    background: #e0e0e0;
}

/* ===== لوحة الرموز الرياضية ===== */
.math-symbols-grid {
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    gap: 6px;
    max-height: 200px;
    overflow-y: auto;
    padding: 4px;
}

.symbol-btn {
    background: #f5f5f5;
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 8px;
    font-size: 18px;
    cursor: pointer;
    text-align: center;
    transition: all 0.15s;
    line-height: 1;
}

.symbol-btn:hover {
    background: var(--word-blue-light);
    border-color: var(--word-blue);
    transform: scale(1.1);
}

/* ===== صفحة القائمة ===== */
.question-list-page {
    max-width: 900px;
    margin: 30px auto;
    padding: 0 20px;
    font-family: var(--word-font);
}

.page-title {
    color: var(--word-blue);
    font-size: 22px;
    font-weight: 700;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 10px;
}

.question-list-page .page-title {
    margin-bottom: 20px;
}

.question-card {
    background: #fff;
    border: 1px solid #e0e0e0;
    border-right: 4px solid var(--word-blue);
    border-radius: 6px;
    padding: 16px 20px;
    margin-bottom: 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 2px 6px rgba(0,0,0,0.06);
    transition: box-shadow 0.2s, border-right-color 0.2s;
}

.question-card:hover {
    box-shadow: 0 4px 12px rgba(0,0,0,0.12);
    border-right-color: #1e4080;
}

.question-card .q-info h3 {
    margin: 0 0 6px;
    font-size: 15px;
    color: #222;
}

.question-card .q-info .q-meta {
    font-size: 12px;
    color: #888;
    display: flex;
    gap: 12px;
}

.question-card .q-actions {
    display: flex;
    gap: 8px;
}

.btn-action {
    padding: 6px 14px;
    border-radius: 4px;
    font-size: 12px;
    font-family: var(--word-font);
    cursor: pointer;
    border: 1px solid transparent;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 4px;
}

.btn-edit {
    background: #e3f0fd;
    color: var(--word-blue);
    border-color: #b3d1f5;
}

.btn-edit:hover {
    background: var(--word-blue-light);
}

.btn-delete {
    background: #fdecea;
    color: #c62828;
    border-color: #f5b8b5;
}

.btn-delete:hover {
    background: #ffd0cc;
}

.btn-view {
    background: #e8f5e9;
    color: #2e7d32;
    border-color: #a5d6a7;
}

.btn-view:hover {
    background: #c8e6c9;
}

/* ===== صفحة التفاصيل ===== */
.question-detail-page {
    max-width: 21cm;
    margin: 30px auto;
    padding: 0 20px;
    font-family: var(--word-font);
}

.detail-card {
    background: #fff;
    box-shadow: var(--word-shadow);
    padding: 2.54cm;
    min-height: 15cm;
}

.detail-card .question-title {
    font-size: 20px;
    font-weight: 700;
    color: var(--word-blue);
    margin-bottom: 16px;
    border-bottom: 2px solid var(--word-blue);
    padding-bottom: 10px;
}

.detail-card .question-content {
    font-size: 14pt;
    line-height: 1.8;
    direction: rtl;
    text-align: right;
}

/* ===== بحث واستبدال ===== */
.find-replace-panel {
    background: #fff;
    border: 1px solid var(--word-toolbar-border);
    border-radius: 6px;
    padding: 16px;
    box-shadow: 0 4px 16px rgba(0,0,0,0.15);
    min-width: 320px;
}

/* ===== معاينة قبل الطباعة ===== */
@media print {
    .ribbon-wrapper,
    .app-header,
    .status-bar,
    .ruler-horizontal,
    .no-print {
        display: none !important;
    }

    body {
        background: #fff;
    }

    .pages-container {
        padding: 0;
        background: #fff;
    }

    .editor-page {
        box-shadow: none;
        width: 100%;
        min-height: auto;
    }

    .ck.ck-editor__main .ck-editor__editable {
        border: none !important;
    }
}

/* ===== تصميم متجاوب (Responsive) ===== */
@media (max-width: 900px) {
    .editor-page {
        width: 100%;
        min-height: auto;
        padding: 1.5cm 1cm;
    }

    .ruler-horizontal {
        display: none;
    }

    .ribbon-content {
        flex-wrap: wrap;
        gap: 6px;
    }

    .ribbon-tabs {
        overflow-x: auto;
    }

    .question-meta {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 600px) {
    .pages-container {
        padding: 10px 5px;
    }

    .ribbon-btn .btn-label {
        display: none;
    }

    .status-bar .status-right {
        display: none;
    }
}

/* ===== تحسينات إضافية على CKEditor ===== */
.ck-content h1 {
    font-size: 24pt;
    color: var(--word-blue);
    font-weight: 700;
    margin-bottom: 12px;
}

.ck-content h2 {
    font-size: 18pt;
    color: #333;
    font-weight: 600;
    margin-bottom: 10px;
}

.ck-content h3 {
    font-size: 14pt;
    color: #444;
    font-weight: 600;
    margin-bottom: 8px;
}

.ck-content blockquote {
    border-right: 4px solid var(--word-blue);
    border-left: none;
    margin: 12px 0;
    padding: 8px 16px;
    color: #555;
    background: #f0f4fa;
    font-style: italic;
}

.ck-content table {
    border-collapse: collapse;
    width: 100%;
}

.ck-content table td,
.ck-content table th {
    border: 1px solid #ccc;
    padding: 8px 12px;
}

.ck-content table th {
    background: #e8edf5;
    font-weight: 600;
}

```

---

## 📄 الملف: `static/js/ckeditor_init.js`

```javascript
/**
 * ckeditor_init.js – تهيئة محرر CKEditor 5 بإعدادات متقدمة
 * مدرسة الشقيق الابتدائية بنين الإلكترونية
 */

/* ======================================================
   متغيرات عامة
   ====================================================== */
let editorInstance = null;        // مثيل CKEditor
let wordCount = 0;                // عداد الكلمات
let charCount = 0;                // عداد الأحرف
let autosaveTimer = null;         // مؤقت الحفظ التلقائي
let lastSavedContent = '';        // آخر محتوى محفوظ
const AUTOSAVE_INTERVAL = 30000;  // كل 30 ثانية

/* ======================================================
   تهيئة CKEditor 5
   ====================================================== */
function initEditor() {
    const editorEl = document.querySelector('#ckeditor');
    if (!editorEl) return;

    // محاولة تهيئة CKEditor 5 Classic
    if (typeof ClassicEditor === 'undefined') {
        console.error('CKEditor 5 غير محمّل. تحقق من رابط CDN.');
        showFallbackEditor(editorEl);
        return;
    }

    ClassicEditor
        .create(editorEl, {
            language: {
                ui: 'ar',
                content: 'ar',
            },
            toolbar: {
                items: [
                    'heading', '|',
                    'fontSize', 'fontFamily', 'fontColor', 'fontBackgroundColor', '|',
                    'bold', 'italic', 'underline', 'strikethrough', '|',
                    'alignment', '|',
                    'numberedList', 'bulletedList', '|',
                    'indent', 'outdent', '|',
                    'link', 'insertImage', 'insertTable', 'mediaEmbed', '|',
                    'blockQuote', 'horizontalLine', 'specialCharacters', '|',
                    'undo', 'redo', '|',
                    'findAndReplace', 'removeFormat',
                ],
                shouldNotGroupWhenFull: true,
            },
            fontSize: {
                options: [8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72],
                supportAllValues: true,
            },
            fontFamily: {
                options: [
                    'default',
                    'Cairo, sans-serif',
                    'Amiri, serif',
                    'Tajawal, sans-serif',
                    'Scheherazade New, serif',
                    'IBM Plex Sans Arabic, sans-serif',
                    'Arial, Helvetica, sans-serif',
                    'Courier New, monospace',
                    'Times New Roman, serif',
                ],
                supportAllValues: true,
            },
            heading: {
                options: [
                    { model: 'paragraph', title: 'فقرة', class: 'ck-heading_paragraph' },
                    { model: 'heading1', view: 'h1', title: 'عنوان 1', class: 'ck-heading_heading1' },
                    { model: 'heading2', view: 'h2', title: 'عنوان 2', class: 'ck-heading_heading2' },
                    { model: 'heading3', view: 'h3', title: 'عنوان 3', class: 'ck-heading_heading3' },
                ],
            },
            image: {
                toolbar: [
                    'imageTextAlternative',
                    'imageStyle:inline',
                    'imageStyle:block',
                    'imageStyle:side',
                    'linkImage',
                ],
            },
            table: {
                contentToolbar: [
                    'tableColumn',
                    'tableRow',
                    'mergeTableCells',
                    'tableCellProperties',
                    'tableProperties',
                ],
            },
            link: {
                decorators: {
                    openInNewTab: {
                        mode: 'manual',
                        label: 'فتح في نافذة جديدة',
                        attributes: {
                            target: '_blank',
                            rel: 'noopener noreferrer',
                        },
                    },
                },
            },
            specialCharacters: {
                order: 'asc',
            },
        })
        .then(editor => {
            editorInstance = editor;
            console.info('CKEditor 5 تم تهيئته بنجاح ✔');

            // إخفاء شريط CKEditor الافتراضي (نستخدم Ribbon مخصص)
            const toolbar = editor.ui.view.toolbar.element;
            if (toolbar) toolbar.style.display = 'none';

            // استعادة المحتوى المحفوظ محلياً
            restoreFromLocalStorage(editor);

            // ربط عداد الكلمات
            editor.model.document.on('change:data', () => {
                updateWordCount(editor);
                scheduleAutosave();
            });

            // ربط أحداث لوحة المفاتيح المخصصة
            bindCustomKeyboardShortcuts(editor);

            // تحديث حالة أزرار Ribbon عند تغيّر التحديد
            editor.model.document.selection.on('change', () => {
                updateRibbonState(editor);
            });

            // حفظ أول نسخة محفوظة
            lastSavedContent = editor.getData();
        })
        .catch(error => {
            console.error('خطأ في تهيئة CKEditor:', error);
            showFallbackEditor(editorEl);
        });
}

/* ======================================================
   محرر احتياطي عند فشل CKEditor
   ====================================================== */
function showFallbackEditor(el) {
    el.style.display = 'none';
    const fallback = document.createElement('textarea');
    fallback.id = 'ckeditor-fallback';
    fallback.style.cssText = `
        width:100%; min-height:400px; font-family:Cairo,Tajawal,Arial,sans-serif;
        font-size:14pt; direction:rtl; text-align:right; border:none; resize:vertical;
        padding:0; outline:none; background:transparent;
    `;
    fallback.placeholder = 'اكتب محتوى السؤال هنا...';
    el.parentNode.insertBefore(fallback, el.nextSibling);
    console.warn('تم تفعيل المحرر الاحتياطي (textarea).');
}

/* ======================================================
   عداد الكلمات والأحرف
   ====================================================== */
function updateWordCount(editor) {
    const text = editor.getData().replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ');
    const words = text.trim().split(/\s+/).filter(w => w.length > 0);
    wordCount = words.length;
    charCount = text.replace(/\s/g, '').length;

    const wcEl = document.getElementById('word-count');
    const ccEl = document.getElementById('char-count');
    if (wcEl) wcEl.textContent = wordCount;
    if (ccEl) ccEl.textContent = charCount;
}

/* ======================================================
   الحفظ التلقائي في localStorage
   ====================================================== */
function scheduleAutosave() {
    clearTimeout(autosaveTimer);
    autosaveTimer = setTimeout(() => {
        saveToLocalStorage();
    }, AUTOSAVE_INTERVAL);
}

function saveToLocalStorage() {
    if (!editorInstance) return;
    const content = editorInstance.getData();
    const title = document.getElementById('id_title')?.value || '';
    const questionId = document.getElementById('question-id')?.value || 'draft';

    if (content === lastSavedContent) return; // لا يوجد تغيير

    const key = `question_draft_${questionId}`;
    const data = { content, title, savedAt: new Date().toISOString() };
    localStorage.setItem(key, JSON.stringify(data));
    lastSavedContent = content;

    // تحديث مؤشر الحفظ
    showAutosaveStatus('saved');
    console.info(`تم الحفظ التلقائي (${new Date().toLocaleTimeString('ar-SA')})`);
}

function restoreFromLocalStorage(editor) {
    const questionId = document.getElementById('question-id')?.value || 'draft';
    const key = `question_draft_${questionId}`;
    const saved = localStorage.getItem(key);
    if (!saved) return;

    try {
        const data = JSON.parse(saved);
        // استعادة فقط إذا لم يكن هناك محتوى مسبق (من الخادم)
        const currentContent = editor.getData().trim();
        if (!currentContent && data.content) {
            editor.setData(data.content);
            const titleEl = document.getElementById('id_title');
            if (titleEl && !titleEl.value && data.title) {
                titleEl.value = data.title;
            }
            showAutosaveStatus('restored');
            console.info(`تم استعادة المسودة من ${data.savedAt}`);
        }
    } catch (e) {
        console.warn('خطأ في استعادة المسودة:', e);
    }
}

function showAutosaveStatus(status) {
    const dot = document.querySelector('.autosave-dot');
    const label = document.getElementById('autosave-label');
    if (!dot || !label) return;

    if (status === 'saved') {
        dot.className = 'autosave-dot';
        label.textContent = 'تم الحفظ التلقائي';
        setTimeout(() => { label.textContent = 'يحفظ تلقائياً'; }, 3000);
    } else if (status === 'saving') {
        dot.className = 'autosave-dot saving';
        label.textContent = 'جاري الحفظ...';
    } else if (status === 'restored') {
        dot.className = 'autosave-dot';
        label.textContent = 'تم استعادة المسودة';
        setTimeout(() => { label.textContent = 'يحفظ تلقائياً'; }, 4000);
    }
}

/* ======================================================
   اختصارات لوحة المفاتيح المخصصة
   ====================================================== */
function bindCustomKeyboardShortcuts(editor) {
    document.addEventListener('keydown', e => {
        const ctrl = e.ctrlKey || e.metaKey;
        if (!ctrl) return;

        switch (e.key) {
            case 's':
                e.preventDefault();
                saveForm();
                break;
            case 'p':
                e.preventDefault();
                printPreview();
                break;
        }
    });
}

/* ======================================================
   وظائف الـ Ribbon (شريط الأدوات)
   ====================================================== */

// تطبيق تنسيق غامق
function execBold() {
    if (!editorInstance) return;
    editorInstance.execute('bold');
    editorInstance.editing.view.focus();
}

// تطبيق تنسيق مائل
function execItalic() {
    if (!editorInstance) return;
    editorInstance.execute('italic');
    editorInstance.editing.view.focus();
}

// تطبيق تسطير
function execUnderline() {
    if (!editorInstance) return;
    editorInstance.execute('underline');
    editorInstance.editing.view.focus();
}

// تطبيق يتوسطه خط
function execStrikethrough() {
    if (!editorInstance) return;
    editorInstance.execute('strikethrough');
    editorInstance.editing.view.focus();
}

// تغيير المحاذاة
function execAlignment(align) {
    if (!editorInstance) return;
    editorInstance.execute('alignment', { value: align });
    editorInstance.editing.view.focus();
}

// قائمة نقطية
function execBulletedList() {
    if (!editorInstance) return;
    editorInstance.execute('bulletedList');
    editorInstance.editing.view.focus();
}

// قائمة مرقمة
function execNumberedList() {
    if (!editorInstance) return;
    editorInstance.execute('numberedList');
    editorInstance.editing.view.focus();
}

// زيادة المسافة البادئة
function execIndent() {
    if (!editorInstance) return;
    editorInstance.execute('indent');
    editorInstance.editing.view.focus();
}

// تقليل المسافة البادئة
function execOutdent() {
    if (!editorInstance) return;
    editorInstance.execute('outdent');
    editorInstance.editing.view.focus();
}

// تراجع
function execUndo() {
    if (!editorInstance) return;
    editorInstance.execute('undo');
    editorInstance.editing.view.focus();
}

// إعادة
function execRedo() {
    if (!editorInstance) return;
    editorInstance.execute('redo');
    editorInstance.editing.view.focus();
}

// مسح التنسيق
function execRemoveFormat() {
    if (!editorInstance) return;
    editorInstance.execute('removeFormat');
    editorInstance.editing.view.focus();
}

// تغيير حجم الخط
function changeFontSize(size) {
    if (!editorInstance || !size) return;
    editorInstance.execute('fontSize', { value: parseInt(size) });
    editorInstance.editing.view.focus();
}

// تغيير نوع الخط
function changeFontFamily(family) {
    if (!editorInstance || !family) return;
    editorInstance.execute('fontFamily', { value: family });
    editorInstance.editing.view.focus();
}

// تغيير نمط العنوان
function changeHeading(value) {
    if (!editorInstance || !value) return;
    editorInstance.execute('heading', { value });
    editorInstance.editing.view.focus();
}

// تباعد الأسطر – يستخدم HTML مباشرة حيث CKEditor 5 لا يدعمه مدمجاً
function changeLineSpacing(value) {
    if (!editorInstance) return;
    const model = editorInstance.model;
    model.change(writer => {
        const selection = model.document.selection;
        const blocks = Array.from(selection.getSelectedBlocks());
        blocks.forEach(block => {
            writer.setAttribute('line-height', value, block);
        });
    });
    editorInstance.editing.view.focus();
}

// إدراج خط أفقي
function insertHorizontalLine() {
    if (!editorInstance) return;
    editorInstance.execute('horizontalLine');
    editorInstance.editing.view.focus();
}

// فتح نافذة إدراج صورة
function openImageModal() {
    showModal('image-modal');
}

// إدراج صورة برابط
function insertImageFromUrl() {
    const url = document.getElementById('image-url-input')?.value?.trim();
    if (!url || !editorInstance) return;
    editorInstance.execute('insertImage', { source: url });
    closeModal('image-modal');
    editorInstance.editing.view.focus();
}

// فتح نافذة إدراج جدول
function openTableModal() {
    showModal('table-modal');
}

// إدراج جدول
function insertTable() {
    const rows = parseInt(document.getElementById('table-rows')?.value) || 3;
    const cols = parseInt(document.getElementById('table-cols')?.value) || 3;
    if (!editorInstance) return;
    editorInstance.execute('insertTable', { rows, columns: cols });
    closeModal('table-modal');
    editorInstance.editing.view.focus();
}

// فتح نافذة إدراج رابط
function openLinkModal() {
    const currentUrl = '';
    const input = document.getElementById('link-url-input');
    if (input) input.value = currentUrl;
    showModal('link-modal');
}

// إدراج رابط
function insertLink() {
    const url = document.getElementById('link-url-input')?.value?.trim();
    const text = document.getElementById('link-text-input')?.value?.trim();
    if (!url || !editorInstance) return;
    editorInstance.execute('link', url);
    closeModal('link-modal');
    editorInstance.editing.view.focus();
}

// إدراج رمز رياضي
function insertMathSymbol(symbol) {
    if (!editorInstance) return;
    editorInstance.model.change(writer => {
        editorInstance.model.insertContent(writer.createText(symbol));
    });
    editorInstance.editing.view.focus();
}

// فتح نافذة بحث واستبدال
function openFindReplace() {
    if (!editorInstance) return;
    editorInstance.execute('findAndReplace');
}

// معاينة قبل الطباعة وطباعة
function printPreview() {
    window.print();
}

// ملء الشاشة
function toggleFullscreen() {
    const page = document.querySelector('.pages-container');
    if (!document.fullscreenElement) {
        page?.requestFullscreen().catch(err => console.warn('خطأ في ملء الشاشة:', err));
    } else {
        document.exitFullscreen();
    }
}

/* ======================================================
   إدارة النوافذ المنبثقة (Modals)
   ====================================================== */
function showModal(id) {
    const el = document.getElementById(id);
    if (el) {
        el.classList.remove('hidden');
        // تركيز أول حقل
        const firstInput = el.querySelector('input, select');
        if (firstInput) setTimeout(() => firstInput.focus(), 50);
    }
}

function closeModal(id) {
    const el = document.getElementById(id);
    if (el) el.classList.add('hidden');
}

// إغلاق النافذة عند النقر خارجها
document.addEventListener('click', e => {
    if (e.target.classList.contains('modal-overlay')) {
        e.target.classList.add('hidden');
    }
});

// إغلاق النافذة بـ Escape
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay:not(.hidden)').forEach(m => {
            m.classList.add('hidden');
        });
    }
});

/* ======================================================
   حفظ النموذج (Form)
   ====================================================== */
function saveForm() {
    // نقل محتوى CKEditor إلى textarea قبل الإرسال
    syncEditorToForm();
    const form = document.getElementById('question-form');
    if (form) form.submit();
}

function syncEditorToForm() {
    if (!editorInstance) return;
    // مزامنة المحتوى مع textarea الذي يحمل name="content"
    const contentField = document.getElementById('ckeditor');
    if (contentField) {
        contentField.value = editorInstance.getData();
    }
}

/* ======================================================
   تحديث حالة أزرار الـ Ribbon
   ====================================================== */
function updateRibbonState(editor) {
    const commands = {
        bold: editor.commands.get('bold'),
        italic: editor.commands.get('italic'),
        underline: editor.commands.get('underline'),
        strikethrough: editor.commands.get('strikethrough'),
        numberedList: editor.commands.get('numberedList'),
        bulletedList: editor.commands.get('bulletedList'),
    };

    Object.entries(commands).forEach(([name, cmd]) => {
        if (!cmd) return;
        const btn = document.getElementById(`btn-${name}`);
        if (btn) {
            btn.classList.toggle('active', !!cmd.value);
        }
    });
}

/* ======================================================
   تهيئة علامات تبويب الـ Ribbon
   ====================================================== */
function initRibbonTabs() {
    const tabs = document.querySelectorAll('.ribbon-tab');
    const panels = document.querySelectorAll('.ribbon-panel');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // إزالة الحالة النشطة من كل التبويبات
            tabs.forEach(t => t.classList.remove('active'));
            panels.forEach(p => p.classList.add('hidden'));

            // تفعيل التبويب المحدد
            tab.classList.add('active');
            const target = tab.dataset.panel;
            const panel = document.getElementById(target);
            if (panel) panel.classList.remove('hidden');
        });
    });
}

/* ======================================================
   بناء مسطرة أفقية
   ====================================================== */
function buildRuler() {
    const rulerEl = document.querySelector('.ruler-marks');
    if (!rulerEl) return;

    const pageWidthCm = 21;
    const marksPerCm = 2;
    const totalMarks = pageWidthCm * marksPerCm;
    let html = '';

    for (let i = 0; i <= totalMarks; i++) {
        const cm = i / marksPerCm;
        const pct = (cm / pageWidthCm) * 100;
        const isMajor = i % marksPerCm === 0;
        html += `<div class="ruler-mark ${isMajor ? 'major' : 'minor'}" style="right:${pct}%">
            ${isMajor && cm > 0 ? `<span>${cm}</span>` : ''}
        </div>`;
    }

    rulerEl.innerHTML = html;
}

/* ======================================================
   نقطة الدخول الرئيسية
   ====================================================== */
document.addEventListener('DOMContentLoaded', () => {
    initRibbonTabs();
    buildRuler();
    initEditor();

    // تعيين الحفظ التلقائي الدوري بشكل مستقل أيضاً
    setInterval(saveToLocalStorage, AUTOSAVE_INTERVAL);

    // ربط زر الحفظ في النموذج
    const form = document.getElementById('question-form');
    if (form) {
        form.addEventListener('submit', e => {
            syncEditorToForm();
        });
    }

    // إخفاء قسم CKEditor الافتراضي في التحرير ثم إظهار حاوية الصفحة
    console.info('محرر الأسئلة - مدرسة الشقيق الابتدائية 🏫');
});

```

---

## ✅ خطوات التثبيت النهائية

```bash
# 1. أنشئ مجلداً جديداً
mkdir school_project && cd school_project

# 2. انسخ جميع الملفات بنفس الهيكل أعلاه

# 3. ثبّت المتطلبات
pip install Django

# 4. طبّق قاعدة البيانات
python manage.py migrate

# 5. شغّل السيرفر
python manage.py runserver

# 6. افتح المتصفح على
# http://127.0.0.1:8000/
```
