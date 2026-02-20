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
