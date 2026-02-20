# =====================================================
# Makefile – أوامر مختصرة لمشروع مدرسة الشقيق
# الاستخدام: make run
# =====================================================

.PHONY: run setup migrate admin help

## تشغيل السيرفر مباشرة
run:
	@echo "========================================"
	@echo "  مدرسة الشقيق الابتدائية بنين"
	@echo "========================================"
	pip3 install -r requirements.txt --quiet
	python3 manage.py migrate --run-syncdb
	python3 manage.py runserver 0.0.0.0:8000

## إعداد المشروع لأول مرة (بدون تشغيل)
setup:
	pip3 install -r requirements.txt
	python3 manage.py migrate --run-syncdb
	@echo "[✔] المشروع جاهز. شغّل: make run"

## تطبيق تحديثات قاعدة البيانات فقط
migrate:
	python3 manage.py migrate --run-syncdb

## إنشاء مستخدم مدير
admin:
	python3 manage.py createsuperuser

## عرض المساعدة
help:
	@echo ""
	@echo "الأوامر المتاحة:"
	@echo "  make run     – تثبيت + تهيئة + تشغيل السيرفر"
	@echo "  make setup   – إعداد المشروع لأول مرة"
	@echo "  make migrate – تطبيق تحديثات قاعدة البيانات"
	@echo "  make admin   – إنشاء مستخدم مدير"
	@echo ""
