"""Generate the three Goodnbad Learning Lab fill-in PDF templates.

Run:  uv run --with reportlab python make_templates.py
Outputs three A4 PDFs next to this script. Blank field lines are intentional:
learner name and details are filled in per engagement (by hand or a fill step later).
"""

import os

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import (
    BaseDocTemplate, Frame, KeepTogether, PageTemplate, Paragraph, Spacer,
    Table, TableStyle,
)

HERE = os.path.dirname(os.path.abspath(__file__))

PAGE_W, PAGE_H = A4
MARGIN = 18 * mm
HEADER_H = 24 * mm
FOOTER_H = 14 * mm

INK = colors.HexColor("#101418")
BAND = colors.HexColor("#0C1116")
ACCENT = colors.HexColor("#0E6B5C")
FAINT = colors.HexColor("#9AA3AB")
LINE = colors.HexColor("#C7CDD2")
BOX_BG = colors.HexColor("#F2F4F5")

BRAND_LINE = "Think like a human. Execute like a machine. Teach like a professor."

S_TITLE = ParagraphStyle("title", fontName="Helvetica-Bold", fontSize=17,
                         leading=21, textColor=INK, spaceAfter=1 * mm)
S_SUB = ParagraphStyle("sub", fontName="Helvetica", fontSize=9.5, leading=13,
                       textColor=colors.HexColor("#4A5560"))
S_SECTION = ParagraphStyle("section", fontName="Courier-Bold", fontSize=10,
                           leading=13, textColor=ACCENT, spaceBefore=5 * mm,
                           spaceAfter=2 * mm)
S_LABEL = ParagraphStyle("label", fontName="Helvetica", fontSize=8.5,
                         leading=11, textColor=colors.HexColor("#4A5560"))
S_BODY = ParagraphStyle("body", fontName="Helvetica", fontSize=9.5, leading=13.5,
                        textColor=INK)
S_BOX = ParagraphStyle("box", fontName="Helvetica", fontSize=9.5, leading=14,
                       textColor=INK)
S_CELL = ParagraphStyle("cell", fontName="Helvetica", fontSize=8.5, leading=11,
                        textColor=INK)
S_CELL_HEAD = ParagraphStyle("cellhead", fontName="Courier-Bold", fontSize=8,
                             leading=10, textColor=colors.white)


def section(title):
    return Paragraph(title, S_SECTION)


def field_rows(rows, col_widths):
    """rows: list of lists of (label, width_fraction_ignored) label strings.

    Renders label above a blank fill line for each cell.
    """
    data, styles = [], []
    for r, row in enumerate(rows):
        data.append([Paragraph(lbl, S_LABEL) for lbl in row])
        for c in range(len(row)):
            if row[c]:
                styles.append(("LINEBELOW", (c, r), (c, r), 0.7, LINE))
    t = Table(data, colWidths=col_widths, rowHeights=11 * mm)
    t.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 1),
        ("RIGHTPADDING", (0, 0), (-1, -1), 8),
        ("TOPPADDING", (0, 0), (-1, -1), 2),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
        *styles,
    ]))
    return t


def write_lines(label, n_lines):
    """A labelled block of ruled writing lines."""
    data = [[Paragraph(label, S_LABEL)]] + [[""] for _ in range(n_lines)]
    t = Table(data, colWidths=[PAGE_W - 2 * MARGIN],
              rowHeights=[5 * mm] + [8 * mm] * n_lines)
    style = [
        ("LEFTPADDING", (0, 0), (-1, -1), 1),
        ("TOPPADDING", (0, 0), (-1, -1), 0),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
    ]
    for i in range(1, n_lines + 1):
        style.append(("LINEBELOW", (0, i), (0, i), 0.7, LINE))
    t.setStyle(TableStyle(style))
    return t


def grid(headers, col_widths, n_rows, first_col=None):
    """A bordered data-entry table with a dark header row."""
    head = [Paragraph(h, S_CELL_HEAD) for h in headers]
    body = []
    for i in range(n_rows):
        row = ["" for _ in headers]
        if first_col:
            row[0] = Paragraph(first_col(i), S_CELL)
        body.append(row)
    t = Table([head] + body, colWidths=col_widths,
              rowHeights=[7 * mm] + [9 * mm] * n_rows)
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), BAND),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("GRID", (0, 1), (-1, -1), 0.5, LINE),
        ("BOX", (0, 0), (-1, -1), 0.8, BAND),
        ("LEFTPADDING", (0, 0), (-1, -1), 4),
        ("RIGHTPADDING", (0, 0), (-1, -1), 4),
    ]))
    return t


def checks(label, options):
    txt = "&nbsp;&nbsp;".join(f"<font face='Courier'>[ ]</font> {o}" for o in options)
    return Table(
        [[Paragraph(label, S_LABEL)], [Paragraph(txt, S_BODY)]],
        colWidths=[PAGE_W - 2 * MARGIN], rowHeights=[5 * mm, 8 * mm],
        style=TableStyle([
            ("LEFTPADDING", (0, 0), (-1, -1), 1),
            ("TOPPADDING", (0, 0), (-1, -1), 0),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 1),
        ]),
    )


def boxed(title, text):
    inner = [
        Paragraph(title, ParagraphStyle("bt", parent=S_SECTION, spaceBefore=0)),
        Paragraph(text, S_BOX),
    ]
    t = Table([[inner]], colWidths=[PAGE_W - 2 * MARGIN])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), BOX_BG),
        ("BOX", (0, 0), (-1, -1), 1, ACCENT),
        ("LEFTPADDING", (0, 0), (-1, -1), 10),
        ("RIGHTPADDING", (0, 0), (-1, -1), 10),
        ("TOPPADDING", (0, 0), (-1, -1), 8),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
    ]))
    return t


def signatures(left="Prepared by (instructor)", right="Learner acknowledgment"):
    w = (PAGE_W - 2 * MARGIN - 12 * mm) / 2
    return field_rows(
        [[f"{left} - signature / date", f"{right} - signature / date"]],
        [w + 6 * mm, w + 6 * mm],
    )


def make_doc(path, doc_code, on_first_page_title):
    def draw_chrome(canv, doc):
        canv.saveState()
        # header band
        canv.setFillColor(BAND)
        canv.rect(0, PAGE_H - HEADER_H, PAGE_W, HEADER_H, stroke=0, fill=1)
        canv.setFillColor(colors.white)
        canv.setFont("Courier-Bold", 10)
        canv.drawString(MARGIN, PAGE_H - HEADER_H + 9.5 * mm,
                        "GOODNBAD.EXE // LEARNING LAB")
        canv.setFillColor(colors.HexColor("#7BE0C8"))
        canv.setFont("Courier", 7.5)
        canv.drawString(MARGIN, PAGE_H - HEADER_H + 5 * mm,
                        "PERSONALIZED TECHNICAL LEARNING - goodnbad.info")
        canv.setFillColor(colors.white)
        canv.setFont("Courier-Bold", 9)
        canv.drawRightString(PAGE_W - MARGIN, PAGE_H - HEADER_H + 9.5 * mm, doc_code)
        canv.setFillColor(FAINT)
        canv.setFont("Courier", 7)
        canv.drawRightString(PAGE_W - MARGIN, PAGE_H - HEADER_H + 5 * mm,
                             "CONFIDENTIAL - LEARNER RECORD")
        canv.setStrokeColor(ACCENT)
        canv.setLineWidth(2)
        canv.line(0, PAGE_H - HEADER_H, PAGE_W, PAGE_H - HEADER_H)
        # footer
        canv.setStrokeColor(LINE)
        canv.setLineWidth(0.6)
        canv.line(MARGIN, FOOTER_H, PAGE_W - MARGIN, FOOTER_H)
        canv.setFillColor(FAINT)
        canv.setFont("Helvetica", 7)
        canv.drawString(MARGIN, FOOTER_H - 4 * mm, BRAND_LINE)
        canv.drawRightString(PAGE_W - MARGIN, FOOTER_H - 4 * mm,
                             f"Page {canv.getPageNumber()}")
        canv.restoreState()

    doc = BaseDocTemplate(
        path, pagesize=A4,
        leftMargin=MARGIN, rightMargin=MARGIN,
        topMargin=HEADER_H + 8 * mm, bottomMargin=FOOTER_H + 6 * mm,
        title=on_first_page_title, author="Goodnbad Learning Lab",
    )
    frame = Frame(MARGIN, FOOTER_H + 6 * mm, PAGE_W - 2 * MARGIN,
                  PAGE_H - HEADER_H - FOOTER_H - 14 * mm, id="main")
    doc.addPageTemplates([PageTemplate(id="all", frames=[frame],
                                       onPage=draw_chrome)])
    return doc


FULL = PAGE_W - 2 * MARGIN
HALF = FULL / 2 - 3 * mm
THIRD = FULL / 3 - 2 * mm


def learner_record(extra_rows=None):
    rows = [
        ["Learner name", "Reference no."],
        ["Email", "Date issued"],
        ["Country / timezone", "Current role / education level"],
    ]
    flow = [section("01 // LEARNER RECORD"),
            field_rows(rows, [HALF + 6 * mm, HALF]),
            checks("Preferred language", ["English", "Arabic", "Bilingual"])]
    if extra_rows:
        flow.append(field_rows(extra_rows, [HALF + 6 * mm, HALF]))
    return flow


def build_guided_path():
    doc = make_doc(os.path.join(HERE, "guided-path-learning-plan-template.pdf"),
                   "GNB-LL / GP-01", "Guided Path - Personalized Learning Plan")
    story = [
        Paragraph("Guided Path", S_TITLE),
        Paragraph("Personalized Learning Plan - asynchronous guided learning, "
                  "delivered and reviewed step by step.", S_SUB),
        *learner_record(),
        section("02 // DIAGNOSTIC SUMMARY"),
        checks("Assessed starting level",
               ["Beginner", "Intermediate", "Advanced"]),
        write_lines("Desired outcome (what the learner should be able to do)", 2),
        write_lines("Identified knowledge gaps", 2),
        field_rows([["Available time per week", "Target completion date"],
                    ["Preferred explanation style", "Accessibility notes"]],
                   [HALF + 6 * mm, HALF]),
        KeepTogether([
            section("03 // LEARNING PATH (modules unlock progressively)"),
            grid(["#", "MODULE", "OBJECTIVE", "EST. TIME", "STATUS"],
                 [8 * mm, 52 * mm, 66 * mm, 22 * mm, 26 * mm], 8,
                 first_col=lambda i: f"{i + 1:02d}"),
        ]),
        KeepTogether([
            section("04 // MILESTONES AND DEADLINES"),
            grid(["MILESTONE", "DELIVERY DATE", "SUBMISSION DUE", "FEEDBACK DUE"],
                 [70 * mm, 34 * mm, 36 * mm, 34 * mm], 5),
        ]),
        section("05 // TERMS OF THIS PLAN"),
        Paragraph(
            "One revision / clarification cycle is included. Written feedback is "
            "delivered within the stated response window. Modules unlock only after "
            "the previous step is verified. Materials are personalized, confidential, "
            "and non-transferable. Nothing substantial is released before payment is "
            "verified.", S_BODY),
        Spacer(1, 8 * mm),
        signatures(),
    ]
    doc.build(story)


def build_academic_sprint():
    doc = make_doc(os.path.join(HERE, "academic-sprint-brief-template.pdf"),
                   "GNB-LL / AS-01", "Academic Sprint - Support Brief")
    story = [
        Paragraph("Academic Sprint", S_TITLE),
        Paragraph("Academic Support Brief - focused guidance for university "
                  "projects, assignments, and practical coursework.", S_SUB),
        *learner_record(extra_rows=[["Institution / level", "Module / subject"]]),
        section("02 // ASSIGNMENT BRIEF"),
        write_lines("Brief summary (in the learner's own words)", 2),
        field_rows([["Official deadline", "Citation style"],
                    ["Permitted AI use (per institution rules)",
                     "Rubric received (yes / no)"]],
                   [HALF + 6 * mm, HALF]),
        write_lines("Files received", 1),
        write_lines("Work already completed by the learner", 2),
        KeepTogether([
            section("03 // EXECUTION PLAN (approx. one week, scope-configurable)"),
            grid(["M#", "FOCUS", "DATE", "CHECKPOINT"],
                 [12 * mm, 84 * mm, 30 * mm, 48 * mm], 6,
                 first_col=lambda i: f"M{i + 1}"),
        ]),
        KeepTogether([
            section("04 // REVIEW AND FEEDBACK LOG"),
            grid(["DATE", "SUBMITTED ITEM", "FEEDBACK DELIVERED", "NOTES"],
                 [26 * mm, 58 * mm, 40 * mm, 50 * mm], 4),
        ]),
        Spacer(1, 5 * mm),
        boxed("05 // ACADEMIC INTEGRITY COMMITMENT",
              "This service teaches, guides, reviews, debugs, and explains. It does "
              "not impersonate the learner, fabricate research, complete "
              "examinations, or submit assessed work on the learner's behalf. The "
              "learner remains the sole author of all work they submit for "
              "assessment, and agrees to use this support within their "
              "institution's rules."),
        Spacer(1, 8 * mm),
        signatures(right="Learner integrity agreement"),
    ]
    doc.build(story)


def build_private_mentorship():
    doc = make_doc(os.path.join(HERE, "private-mentorship-session-template.pdf"),
                   "GNB-LL / PM-01", "Private Mentorship - Session Record")
    story = [
        Paragraph("Private Mentorship", S_TITLE),
        Paragraph("Live Session Record - one-to-one teaching, prepared, "
                  "delivered, and followed up in one document.", S_SUB),
        *learner_record(extra_rows=[["Session no. (of bundle)",
                                     "Single session / bundle"]]),
        section("02 // BOOKING"),
        field_rows([["Session date", "Start time (learner timezone)"],
                    ["Duration", "Platform / channel"]],
                   [HALF + 6 * mm, HALF]),
        checks("Recording consent (recording happens ONLY with explicit consent)",
               ["Granted", "Declined"]),
        section("03 // PRE-SESSION DIAGNOSTIC"),
        write_lines("Session goal", 1),
        write_lines("Questions the learner wants answered", 2),
        write_lines("Files / work to review before the session", 1),
        KeepTogether([
            section("04 // AGENDA"),
            grid(["#", "ITEM", "TIME", "NOTES"],
                 [8 * mm, 88 * mm, 22 * mm, 56 * mm], 5,
                 first_col=lambda i: f"{i + 1}"),
        ]),
        section("05 // SESSION NOTES"),
        write_lines("", 7),
        section("06 // NEXT STEPS AND FOLLOW-UP"),
        write_lines("Recommended next steps", 2),
        write_lines("Follow-up exercises (optional)", 1),
        field_rows([["Next session (optional)", "Follow-up deadline"]],
                   [HALF + 6 * mm, HALF]),
        Spacer(1, 6 * mm),
        signatures(),
    ]
    doc.build(story)


if __name__ == "__main__":
    build_guided_path()
    build_academic_sprint()
    build_private_mentorship()
    print("Generated 3 templates in", HERE)
