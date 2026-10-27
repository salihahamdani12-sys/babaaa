import { FlashcardWord, BookId } from '../types';
import { inferCategory } from './vocabularyService';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export interface ExportOptions {
  bookFilter?: BookId | 'all';
  categoryFilter?: string;
  scopeLabel?: string;
  novelTitle?: string;
}

const BOOK_NAMES_AR: Record<string, string> = {
  la_boite_a_merveilles: 'علبة العجائب (La Boîte à Merveilles)',
  antigone: 'أنتيجون (Antigone)',
  le_dernier_jour_dun_condamne: "آخر يوم لمحكوم عليه بالإعدام (Le Dernier Jour d'un Condamné)",
  all: 'جميع المؤلفات المقررة (الامتحان الجهوي للأولى باكالوريا)',
};

const CATEGORY_NAMES_AR: Record<string, string> = {
  verb: 'فعل (Verbe)',
  adverb: 'ظرف / أداة (Adverbe / Locution)',
  term: 'مصطلح دلالي (Terme)',
  character: 'شخصية (Personnage)',
  theme: 'تيمة محورية (Thème)',
  exam_key: 'مفردة مفتاحية للامتحان (Mot-clé)',
  all: 'عام',
};

function sanitizeForCSV(text: string | undefined): string {
  if (!text) return '""';
  // Escape quotes
  const escaped = text.replace(/"/g, '""').replace(/[\r\n]+/g, ' ').trim();
  return `"${escaped}"`;
}

function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Exports vocabulary cards to a UTF-8 CSV file compatible with Microsoft Excel, Google Sheets & Numbers
 */
export function exportVocabularyToCSV(cards: FlashcardWord[], options: ExportOptions = {}): void {
  const dateStr = new Date().toISOString().split('T')[0];
  const novelName = options.novelTitle || BOOK_NAMES_AR[options.bookFilter || 'all'] || 'المؤلفات المقررة';

  // UTF-8 BOM to ensure Excel properly renders Arabic and French accents
  const bom = '\uFEFF';
  const headers = [
    'المصطلح بالفرنسية (Mot)',
    'الترجمة بالعربية (Traduction)',
    'التصنيف (Catégorie)',
    'المؤلف (Œuvre)',
    'رقم الصفحة (Page)',
    'السياق والشرح في الرواية (Contexte & Définition)',
    'المرادفات الأدبية (Synonymes)',
    'شاهد من النص بالفرنسية (Exemple)',
    'مستوى الحفظ (Maîtrise)',
  ];

  const rows = cards.map((card) => {
    const cat = card.category || inferCategory(card);
    const catName = CATEGORY_NAMES_AR[cat] || cat || 'مصطلح';
    const bookLabel = BOOK_NAMES_AR[card.bookId] || card.bookId;
    const synonymsStr = (card.synonyms || []).join(' / ');
    const contextExplanation = card.contextualMeaning || card.definitionArabic || card.arabicMeaning;
    const masteryLabel =
      card.masteryLevel === 'mastered'
        ? 'تم الحفظ (Maîtrisé)'
        : card.masteryLevel === 'learning'
        ? 'قيد التثبيت (En cours)'
        : 'جديدة (Nouveau)';

    return [
      sanitizeForCSV(card.frenchWord),
      sanitizeForCSV(card.arabicMeaning),
      sanitizeForCSV(catName),
      sanitizeForCSV(bookLabel),
      sanitizeForCSV(card.pageNumber ? `صفحة ${card.pageNumber}` : '-'),
      sanitizeForCSV(contextExplanation),
      sanitizeForCSV(synonymsStr),
      sanitizeForCSV(card.exampleContextFrench || ''),
      sanitizeForCSV(masteryLabel),
    ].join(',');
  });

  const csvContent = bom + headers.join(',') + '\n' + rows.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const filename = `fiches_vocabulaire_1bac_${options.bookFilter || 'all'}_${dateStr}.csv`;
  triggerDownload(blob, filename);
}

/**
 * Exports vocabulary in Anki / Quizlet Tab-Separated Values (TSV) format for instant flashcard import
 */
export function exportVocabularyToAnki(cards: FlashcardWord[], options: ExportOptions = {}): void {
  const dateStr = new Date().toISOString().split('T')[0];

  const lines = cards.map((card) => {
    const cat = card.category || inferCategory(card);
    const catName = CATEGORY_NAMES_AR[cat] || cat;
    const bookLabel = BOOK_NAMES_AR[card.bookId] || card.bookId;
    const synonymsStr = (card.synonyms || []).join(', ');
    const context = card.contextualMeaning || card.definitionArabic || '';
    const example = card.exampleContextFrench ? `<blockquote>« ${card.exampleContextFrench} »</blockquote>` : '';

    // Front of the card: French word, part of speech, novel, and page
    const front = `${card.frenchWord} <br><small style="color:#64748b">(${catName} • ${bookLabel}${card.pageNumber ? ` • p.${card.pageNumber}` : ''})</small>`;

    // Back of the card: Arabic translation + contextual explanation + synonyms + example
    let back = `<div dir="rtl" style="font-family:sans-serif; text-align:right">`;
    back += `<b style="font-size:1.25em; color:#047857">${card.arabicMeaning}</b><br>`;
    if (context) {
      back += `<p style="margin:6px 0; color:#334155; font-size:0.95em">${context}</p>`;
    }
    if (synonymsStr) {
      back += `<small style="color:#475569"><b>المرادفات:</b> ${synonymsStr}</small><br>`;
    }
    back += `</div>`;
    if (example) {
      back += `<div style="font-style:italic; font-size:0.9em; color:#475569; margin-top:8px">${example}</div>`;
    }

    // Tab separated: Front \t Back
    return `${front.replace(/\t/g, ' ')}\t${back.replace(/\t/g, ' ')}`;
  });

  const content = `#separator:tab\n#html:true\n#tags:1bac vocabulaire ${options.bookFilter || 'all'}\n` + lines.join('\n');
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
  const filename = `anki_vocabulaire_1bac_${options.bookFilter || 'all'}_${dateStr}.txt`;
  triggerDownload(blob, filename);
}

/**
 * Exports complete vocabulary JSON data
 */
export function exportVocabularyToJSON(cards: FlashcardWord[], options: ExportOptions = {}): void {
  const dateStr = new Date().toISOString().split('T')[0];
  const payload = {
    exportedAt: new Date().toISOString(),
    curriculum: 'Moroccan 1st Baccalaureate French Regional Exam (الامتحان الجهوي الموحد للأولى باكالوريا)',
    novel: options.novelTitle || BOOK_NAMES_AR[options.bookFilter || 'all'] || 'جميع المؤلفات المقررة',
    totalTermsCount: cards.length,
    terms: cards.map((c) => ({
      id: c.id,
      frenchWord: c.frenchWord,
      arabicMeaning: c.arabicMeaning,
      category: c.category || inferCategory(c),
      categoryLabelArabic: CATEGORY_NAMES_AR[c.category || inferCategory(c)] || 'عام',
      bookId: c.bookId,
      bookTitleArabic: BOOK_NAMES_AR[c.bookId] || c.bookId,
      pageNumber: c.pageNumber || null,
      contextualMeaning: c.contextualMeaning || null,
      definitionArabic: c.definitionArabic || null,
      definitionFrench: c.definitionFrench || null,
      synonyms: c.synonyms || [],
      exampleContextFrench: c.exampleContextFrench || null,
      exampleContextArabic: c.exampleContextArabic || null,
      masteryLevel: c.masteryLevel,
    })),
  };

  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json;charset=utf-8;' });
  const filename = `vocabulaire_1bac_data_${options.bookFilter || 'all'}_${dateStr}.json`;
  triggerDownload(blob, filename);
}

/**
 * Copies formatted text table of vocabulary to clipboard
 */
export async function copyVocabularyToClipboard(cards: FlashcardWord[], options: ExportOptions = {}): Promise<boolean> {
  const novelName = options.novelTitle || BOOK_NAMES_AR[options.bookFilter || 'all'] || 'المقرر الجهوي للأولى باك';
  
  let text = `📚 مستودع بطاقات المفردات للامتحان الجهوي للأولى باكالوريا\n`;
  text += `📖 المؤلف: ${novelName}\n`;
  text += `📊 عدد المفردات: ${cards.length}\n`;
  text += `══════════════════════════════════════════════════════════════\n\n`;

  cards.forEach((c, idx) => {
    const cat = c.category || inferCategory(c);
    const catName = CATEGORY_NAMES_AR[cat] || cat;
    const page = c.pageNumber ? `(ص. ${c.pageNumber})` : '';
    const syns = c.synonyms && c.synonyms.length > 0 ? ` [مرادفات: ${c.synonyms.slice(0, 3).join(', ')}]` : '';
    const context = c.contextualMeaning || c.definitionArabic || '';

    text += `${idx + 1}. « ${c.frenchWord} » ➔ ${c.arabicMeaning} ${page}\n`;
    text += `   • الصنف: ${catName}${syns}\n`;
    if (context) {
      text += `   • السياق والشرح: ${context}\n`;
    }
    if (c.exampleContextFrench) {
      text += `   • شاهد من النص: "${c.exampleContextFrench}"\n`;
    }
    text += `──────────────────────────────────────────────────────────────\n`;
  });

  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.warn('Clipboard copy failed:', err);
    return false;
  }
}

/**
 * Generates and downloads a high-fidelity vector/canvas PDF document directly to the user's device
 * Uses jsPDF and html2canvas with pixel-perfect Arabic & French typography, Moroccan 1st Baccalaureate styling,
 * pagination, and exam tips.
 */
export async function exportVocabularyToPDF(
  cards: FlashcardWord[],
  options: ExportOptions = {},
  onProgress?: (percent: number, statusText: string) => void
): Promise<void> {
  const dateStr = new Date().toISOString().split('T')[0];
  const novelName = options.novelTitle || BOOK_NAMES_AR[options.bookFilter || 'all'] || 'المؤلفات المقررة للأولى باكالوريا';
  const currentDate = new Date().toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  if (!cards || cards.length === 0) {
    throw new Error('لا توجد مفردات لتصديرها.');
  }

  onProgress?.(5, 'تهيئة وثيقة الـ PDF وصفحات المراجعة...');

  // Chunk cards across pages so no rows are awkwardly cut in half
  // Page 1 has official Moroccan header + tips box: fits 8 rows
  // Subsequent pages have compact header: fits 10 rows
  const pages: FlashcardWord[][] = [];
  const firstPageCards = cards.slice(0, 8);
  pages.push(firstPageCards);

  let remainingCards = cards.slice(8);
  while (remainingCards.length > 0) {
    pages.push(remainingCards.slice(0, 10));
    remainingCards = remainingCards.slice(10);
  }

  const totalPages = pages.length;

  // Create isolated off-screen rendering container
  const container = document.createElement('div');
  container.id = 'pdf-export-render-sandbox';
  container.style.position = 'fixed';
  container.style.left = '-9999px';
  container.style.top = '0';
  container.style.width = '794px';
  container.style.background = '#ffffff';
  container.style.zIndex = '-9999';
  container.style.color = '#1e293b';
  container.style.fontFamily = "'Cairo', 'Amiri', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  container.setAttribute('dir', 'rtl');

  document.body.appendChild(container);

  try {
    const pageElements: HTMLElement[] = [];
    let globalIndex = 1;

    pages.forEach((pageCards, pageIdx) => {
      const pageDiv = document.createElement('div');
      pageDiv.style.width = '794px';
      pageDiv.style.height = '1123px';
      pageDiv.style.minHeight = '1123px';
      pageDiv.style.maxHeight = '1123px';
      pageDiv.style.padding = '24px 28px';
      pageDiv.style.boxSizing = 'border-box';
      pageDiv.style.position = 'relative';
      pageDiv.style.background = '#ffffff';
      pageDiv.style.overflow = 'hidden';
      pageDiv.style.display = 'flex';
      pageDiv.style.flexDirection = 'column';

      const isFirstPage = pageIdx === 0;

      let rowsHtml = '';
      pageCards.forEach((c) => {
        const cat = c.category || inferCategory(c);
        const catName = CATEGORY_NAMES_AR[cat] || cat;
        const syns = (c.synonyms || []).slice(0, 3).join(' • ');
        const context = c.contextualMeaning || c.definitionArabic || c.arabicMeaning;

        rowsHtml += `
          <tr style="border-bottom: 1px solid #e2e8f0; background-color: ${globalIndex % 2 === 0 ? '#f8fafc' : '#ffffff'};">
            <td style="padding: 6px 8px; text-align: center; font-weight: bold; color: #78350f; font-size: 11px; width: 32px;">
              ${globalIndex}
            </td>
            <td style="padding: 6px 10px; width: 140px; direction: ltr; text-align: left;">
              <div style="font-family: Georgia, serif; font-size: 14px; font-weight: 700; color: #0f172a;">
                ${escapeHtml(c.frenchWord)}
              </div>
              <div style="font-size: 9px; color: #854d0e; font-weight: 600; margin-top: 2px; direction: rtl; text-align: right;">
                ${escapeHtml(catName)}
              </div>
            </td>
            <td style="padding: 6px 10px; width: 130px; font-weight: 700; color: #047857; font-size: 12px;">
              ${escapeHtml(c.arabicMeaning)}
            </td>
            <td style="padding: 6px 10px; font-size: 10.5px; color: #334155; line-height: 1.45;">
              <div>${escapeHtml(context)}</div>
              ${syns ? `<div style="margin-top: 3px; font-size: 9.5px; color: #64748b; border-top: 1px dashed #e2e8f0; padding-top: 2px;"><b>المرادفات:</b> ${escapeHtml(syns)}</div>` : ''}
              ${c.exampleContextFrench ? `<div style="margin-top: 2px; font-style: italic; color: #475569; font-size: 9.5px; direction: ltr; text-align: left;">« ${escapeHtml(c.exampleContextFrench)} »</div>` : ''}
            </td>
            <td style="padding: 6px 8px; text-align: center; font-size: 10px; color: #64748b; font-weight: 600; width: 44px;">
              ${c.pageNumber ? `ص ${c.pageNumber}` : '-'}
            </td>
          </tr>
        `;
        globalIndex++;
      });

      let headerHtml = '';
      if (isFirstPage) {
        headerHtml = `
          <div style="border-bottom: 2.5px solid #78350f; padding-bottom: 10px; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: flex-start;">
            <div>
              <div style="font-size: 11px; font-weight: 800; color: #92400e; margin-bottom: 2px;">
                المملكة المغربية • وزارة التربية الوطنية • الأولى باكالوريا (1ère Bac)
              </div>
              <h1 style="margin: 0; font-size: 18px; font-weight: 800; color: #78350f; line-height: 1.25;">
                مستودع بطاقات ومفردات الامتحان الجهوي الموحد
              </h1>
              <div style="font-size: 13px; font-weight: 700; color: #047857; margin-top: 3px;">
                📖 ${escapeHtml(novelName)}
              </div>
            </div>
            <div style="text-align: left; font-size: 10px; color: #64748b;">
              <div>تاريخ التصدير: ${escapeHtml(currentDate)}</div>
              <div style="display: inline-block; background: #fef3c7; color: #92400e; padding: 2px 8px; border-radius: 6px; font-weight: 700; margin-top: 4px; border: 1px solid #fde68a;">
                📌 إجمالي ${cards.length} مفردة مصنفة
              </div>
            </div>
          </div>

          <div style="background: #fdf8f6; border: 1px solid #fed7aa; border-radius: 8px; padding: 7px 12px; font-size: 10px; color: #7c2d12; margin-bottom: 10px; line-height: 1.4;">
            💡 <strong>إرشاد للامتحان الجهوي:</strong> ركز على السياق الدلالي للمفردات في النص (Champs Lexicaux & Tonalités)؛ ففهم المصطلحات يمكن التلميذ من إجابة أسئلة الفهم (Compréhension) بدقة وكتابة موضوع إنشائي (Production Écrite) متميز ولغة سليمة.
          </div>
        `;
      } else {
        headerHtml = `
          <div style="border-bottom: 1.5px solid #78350f; padding-bottom: 6px; margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center; font-size: 11px;">
            <div style="font-weight: 700; color: #78350f;">
              بطاقات مفردات الامتحان الجهوي • ${escapeHtml(novelName)}
            </div>
            <div style="font-size: 10px; color: #64748b;">
              صفحة ${pageIdx + 1} من ${totalPages}
            </div>
          </div>
        `;
      }

      pageDiv.innerHTML = `
        ${headerHtml}

        <div style="flex: 1; overflow: hidden;">
          <table style="width: 100%; border-collapse: collapse; text-align: right;">
            <thead>
              <tr style="background-color: #78350f; color: #ffffff; font-size: 10.5px;">
                <th style="padding: 6px 8px; text-align: center; width: 32px;">#</th>
                <th style="padding: 6px 10px; width: 140px;">المصطلح بالفرنسية (Mot)</th>
                <th style="padding: 6px 10px; width: 130px;">المعنى العربي</th>
                <th style="padding: 6px 10px;">السياق والشرح الأدبي والشواهد</th>
                <th style="padding: 6px 8px; text-align: center; width: 44px;">الصفحة</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
          </table>
        </div>

        <div style="height: 28px; margin-top: auto; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; font-size: 9.5px; color: #94a3b8; padding-top: 4px;">
          <span>منصة علبة العجائب الرقمية • رفيقك الشامل للتفوق في الامتحان الجهوي للأولى باكالوريا 🇲🇦</span>
          <span style="font-weight: bold; color: #64748b;">صفحة ${pageIdx + 1} من ${totalPages}</span>
        </div>
      `;

      container.appendChild(pageDiv);
      pageElements.push(pageDiv);
    });

    // Small delay to ensure all font glyphs and styles are fully computed
    await new Promise((r) => setTimeout(r, 200));

    // Initialize jsPDF document (A4 portrait: 210mm x 297mm)
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    for (let i = 0; i < pageElements.length; i++) {
      const currentPercent = Math.round(((i + 1) / (totalPages + 1)) * 90);
      onProgress?.(currentPercent, `جارٍ تحويل وتنسيق الصفحة ${i + 1} من ${totalPages}...`);

      const canvas = await html2canvas(pageElements[i], {
        scale: 2, // High resolution rendering
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.95);

      if (i > 0) {
        pdf.addPage('a4', 'portrait');
      }

      pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297, undefined, 'FAST');
    }

    onProgress?.(95, 'جارٍ حفظ وتنزيل ملف الـ PDF...');
    const filename = `fiches_vocabulaire_1bac_${options.bookFilter || 'all'}_${dateStr}.pdf`;
    pdf.save(filename);

    onProgress?.(100, 'تم تنزيل ملف الـ PDF بنجاح!');
  } finally {
    // Always clean up offscreen DOM container
    if (container.parentNode) {
      document.body.removeChild(container);
    }
  }
}

/**
 * Generates an elegant print-ready revision sheet (Fiche de révision imprimable)
 * using a sandboxed invisible iframe to bypass popup blockers and security restrictions.
 */
export function printVocabularyRevisionSheet(cards: FlashcardWord[], options: ExportOptions = {}): void {
  const novelName = options.novelTitle || BOOK_NAMES_AR[options.bookFilter || 'all'] || 'المؤلفات المقررة للأولى باكالوريا';
  const currentDate = new Date().toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const tableRows = cards
    .map((c, i) => {
      const cat = c.category || inferCategory(c);
      const catName = CATEGORY_NAMES_AR[cat] || cat;
      const syns = (c.synonyms || []).slice(0, 3).join(' • ');
      const context = c.contextualMeaning || c.definitionArabic || c.arabicMeaning;

      return `
        <tr>
          <td class="col-num">${i + 1}</td>
          <td class="col-fr">
            <strong>${escapeHtml(c.frenchWord)}</strong>
            <div class="meta-tag">${escapeHtml(catName)}</div>
          </td>
          <td class="col-ar">${escapeHtml(c.arabicMeaning)}</td>
          <td class="col-context">
            <div>${escapeHtml(context)}</div>
            ${syns ? `<div class="syns"><b>المرادفات:</b> ${escapeHtml(syns)}</div>` : ''}
            ${c.exampleContextFrench ? `<div class="quote">« ${escapeHtml(c.exampleContextFrench)} »</div>` : ''}
          </td>
          <td class="col-page">${c.pageNumber ? `ص ${c.pageNumber}` : '-'}</td>
        </tr>
      `;
    })
    .join('');

  const html = `
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
      <meta charset="UTF-8">
      <title>ورقة مراجعة مفردات الامتحان الجهوي للأولى باكالوريا - ${escapeHtml(novelName)}</title>
      <style>
        @page {
          size: A4;
          margin: 10mm 12mm 12mm 12mm;
        }
        * {
          box-sizing: border-box;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        body {
          font-family: 'Cairo', 'Amiri', system-ui, -apple-system, sans-serif;
          margin: 0;
          padding: 12px;
          color: #1e293b;
          background: #ffffff;
          line-height: 1.45;
        }
        .header {
          border-bottom: 2px solid #78350f;
          padding-bottom: 10px;
          margin-bottom: 12px;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }
        .title-area h1 {
          margin: 0 0 4px 0;
          font-size: 18px;
          color: #78350f;
          font-weight: 800;
        }
        .title-area h2 {
          margin: 0;
          font-size: 13px;
          color: #047857;
          font-weight: 700;
        }
        .meta-area {
          text-align: left;
          font-size: 11px;
          color: #64748b;
        }
        .stats-badge {
          display: inline-block;
          background: #fef3c7;
          color: #92400e;
          padding: 2px 8px;
          border-radius: 6px;
          font-weight: 700;
          font-size: 11px;
          border: 1px solid #fde68a;
          margin-top: 4px;
        }
        .instructions {
          background: #fdf8f6;
          border: 1px solid #fed7aa;
          border-radius: 6px;
          padding: 6px 10px;
          font-size: 10.5px;
          color: #7c2d12;
          margin-bottom: 10px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          font-size: 11px;
        }
        th {
          background-color: #78350f;
          color: #ffffff;
          text-align: right;
          padding: 7px 9px;
          font-weight: 700;
          border: 1px solid #78350f;
        }
        td {
          padding: 6px 9px;
          border: 1px solid #cbd5e1;
          vertical-align: top;
        }
        tr:nth-child(even) {
          background-color: #f8fafc;
        }
        .col-num {
          width: 30px;
          text-align: center;
          color: #64748b;
          font-weight: bold;
        }
        .col-fr {
          width: 22%;
          direction: ltr;
          text-align: left;
          font-family: Georgia, serif;
          font-size: 13.5px;
        }
        .col-ar {
          width: 20%;
          font-weight: bold;
          color: #065f46;
          font-size: 12px;
        }
        .col-context {
          width: 48%;
          color: #334155;
          font-size: 10.5px;
        }
        .col-page {
          width: 8%;
          text-align: center;
          font-size: 10px;
          color: #64748b;
        }
        .meta-tag {
          font-size: 9px;
          color: #854d0e;
          margin-top: 2px;
          direction: rtl;
        }
        .syns {
          margin-top: 3px;
          font-size: 9.5px;
          color: #64748b;
          border-top: 1px dashed #e2e8f0;
          padding-top: 2px;
        }
        .quote {
          margin-top: 2px;
          font-style: italic;
          color: #475569;
          font-size: 9.5px;
          direction: ltr;
          text-align: left;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="title-area">
          <h1>المملكة المغربية • وزارة التربية الوطنية • الأولى باكالوريا</h1>
          <h2>ورقة المراجعة الشاملة لمفردات الامتحان الجهوي: ${escapeHtml(novelName)}</h2>
          <div class="stats-badge">📌 تم تجميع ${cards.length} مفردة وتظليل سياقي مصنف للامتحان</div>
        </div>
        <div class="meta-area">
          <div>تاريخ التصدير: ${escapeHtml(currentDate)}</div>
          <div>مقرر الفرنسية الجهوي (1ère Bac)</div>
        </div>
      </div>

      <div class="instructions">
        💡 <strong>نصيحة للمراجعة:</strong> احرص على مراجعة المصطلحات في سياقها الدلالي بالرواية، مع التركيز على دلالة الحقول المعجمية (Champs Lexicaux) ونبرة النص (Tonalités) في أسئلة الفهم (Compréhension).
      </div>

      <table>
        <thead>
          <tr>
            <th class="col-num">#</th>
            <th class="col-fr">المفردة بالفرنسية (Mot)</th>
            <th class="col-ar">المعنى العربي الدقيق</th>
            <th class="col-context">السياق الروائي والمرادفات الأدبية</th>
            <th class="col-page">الصفحة</th>
          </tr>
        </thead>
        <tbody>
          ${tableRows}
        </tbody>
      </table>
    </body>
    </html>
  `;

  // Use invisible iframe to bypass popup blockers reliably
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  iframe.style.opacity = '0';
  iframe.style.pointerEvents = 'none';
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document || iframe.contentDocument;
  if (!doc) {
    window.print();
    return;
  }

  doc.open();
  doc.write(html);
  doc.close();

  setTimeout(() => {
    try {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    } catch (e) {
      console.warn('Iframe print failed, falling back:', e);
      window.print();
    }
    setTimeout(() => {
      try {
        if (iframe.parentNode) {
          document.body.removeChild(iframe);
        }
      } catch {}
    }, 60000);
  }, 400);
}

function escapeHtml(text: string | undefined): string {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
