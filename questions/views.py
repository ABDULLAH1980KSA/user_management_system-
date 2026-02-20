import json
from django.shortcuts import render, redirect, get_object_or_404
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from .models import Question


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
                title=title,
                content=content,
                subject=subject,
                grade=grade,
            )
            return redirect('question_detail', pk=question.pk)

    context = {
        'subjects': Question.SUBJECT_CHOICES,
        'grades': Question.GRADE_CHOICES,
        'font_sizes': [8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72],
        'math_symbols': ['∫', '∑', '√', '∞', 'π', 'α', 'β', 'γ', '≤', '≥', '≠', '±', '×', '÷', '°', '²', '³', 'Δ', 'θ', 'λ', 'μ', 'σ', 'φ', 'ω'],
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
        'font_sizes': [8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72],
        'math_symbols': ['∫', '∑', '√', '∞', 'π', 'α', 'β', 'γ', '≤', '≥', '≠', '±', '×', '÷', '°', '²', '³', 'Δ', 'θ', 'λ', 'μ', 'σ', 'φ', 'ω'],
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
