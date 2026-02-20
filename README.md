# مدرسة الشقيق الابتدائية بنين الإلكترونية

نظام إدارة أسئلة الاختبارات بمحرر نصوص احترافي شبيه بـ Microsoft Word.

## ⚡ تشغيل السيرفر (أمر واحد)

```bash
bash run.sh
```

أو باستخدام `make`:

```bash
make run
```

ثم افتح المتصفح على: **http://127.0.0.1:8000/**

> للتشغيل على سيرفر خارجي (مثل AWS/VPS) مع منفذ محدد:
> ```bash
> bash run.sh 0.0.0.0:8000
> ```

## 🗂️ هيكل الكود الأخير

```
user_management_system-/
│
├── manage.py                        # نقطة دخول Django
├── requirements.txt                 # المتطلبات (Django)
│
├── school_system/                   # إعدادات المشروع
│   ├── settings.py                  # الإعدادات (عربي، الرياض)
│   ├── urls.py                      # الروابط الرئيسية
│   ├── wsgi.py
│   └── asgi.py
│
├── questions/                       # تطبيق الأسئلة
│   ├── models.py                    # نموذج Question
│   ├── views.py                     # العروض (list/create/edit/delete)
│   ├── urls.py                      # روابط التطبيق
│   ├── admin.py                     # لوحة الإدارة
│   └── migrations/
│       └── 0001_initial.py
│
├── static/
│   ├── css/
│   │   └── word-editor.css          # تصميم شبيه Microsoft Word
│   └── js/
│       └── ckeditor_init.js         # إعدادات CKEditor 5 + حفظ تلقائي
│
└── templates/
    ├── base.html                    # القالب الأساسي (خطوط عربية)
    └── questions/
        ├── editor.html              # محرر الأسئلة (Ribbon UI)
        ├── list.html                # قائمة الأسئلة
        └── detail.html              # عرض سؤال + طباعة
```

## 🚀 كيفية التشغيل

### 1. تثبيت المتطلبات
```bash
pip install -r requirements.txt
```

### 2. تهيئة قاعدة البيانات
```bash
python manage.py migrate
```

### 3. (اختياري) إنشاء مستخدم مدير
```bash
python manage.py createsuperuser
```

### 4. تشغيل الخادم
```bash
python manage.py runserver
```

ثم افتح المتصفح على: **http://127.0.0.1:8000/**

## ✨ مميزات المحرر

| الميزة | الوصف |
|--------|-------|
| 🎨 تصميم Word | شريط Ribbon أزرق متعدد التبويبات |
| 📝 CKEditor 5 | محرر غني بالمميزات مع دعم عربي كامل |
| 🔤 خطوط عربية | Cairo، Amiri، Tajawal، IBM Plex Sans Arabic |
| 📐 مسطرة أفقية | تُبنى ديناميكياً بـ JavaScript |
| 💾 حفظ تلقائي | كل 30 ثانية في localStorage |
| 📊 عداد الكلمات | في الوقت الفعلي في شريط الحالة |
| 🔢 رموز رياضية | 24 رمزاً (∫ ∑ √ ∞ π α β γ…) |
| 🖨️ طباعة | إخفاء أدوات UI تلقائياً عند الطباعة |
| 📱 متجاوب | يعمل على الأجهزة المحمولة |
| 🌐 RTL | دعم كامل للغة العربية |

## 📋 الصفحات

| الصفحة | الرابط |
|--------|--------|
| قائمة الأسئلة | `/` |
| إنشاء سؤال جديد | `/question/new/` |
| تعديل سؤال | `/question/<id>/edit/` |
| عرض سؤال | `/question/<id>/` |
| لوحة الإدارة | `/admin/` |

## 🛠️ المتطلبات التقنية

- Python 3.10+
- Django 6.0+
- CKEditor 5 (يُحمَّل من CDN تلقائياً)
- خطوط Google (تُحمَّل من CDN تلقائياً)
