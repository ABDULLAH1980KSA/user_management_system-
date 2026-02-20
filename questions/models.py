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
