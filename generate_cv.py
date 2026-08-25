from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib.colors import HexColor, white, Color
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
OUTPUT_TEMP = os.path.join(BASE_DIR, "CV_Ander_Resano_new.pdf")
OUTPUT_FINAL = os.path.join(BASE_DIR, "CV_Ander_Resano.pdf")

W, H = A4

# Colors
DARK_BG = HexColor("#1a1a2e")
GREEN = HexColor("#10b981")
GREEN_DARK = HexColor("#0d9668")
LIGHT_GREEN = HexColor("#d1fae5")
TEXT_DARK = HexColor("#1f2937")
TEXT_MED = HexColor("#4b5563")
TEXT_LIGHT = HexColor("#6b7280")
SECTION_BG = HexColor("#f8fafb")
LINE_COLOR = HexColor("#e5e7eb")
TAG_BG = HexColor("#ecfdf5")
TAG_BORDER = HexColor("#a7f3d0")
WHITE = white


def draw_rounded_rect(c, x, y, w, h, r, fill_color=None, stroke_color=None):
    p = c.beginPath()
    p.moveTo(x + r, y)
    p.lineTo(x + w - r, y)
    p.arcTo(x + w - r, y, x + w, y + r, 90)
    p.lineTo(x + w, y + h - r)
    p.arcTo(x + w, y + h - r, x + w - r, y + h, 90)
    p.lineTo(x + r, y + h)
    p.arcTo(x + r, y + h, x, y + h - r, 90)
    p.lineTo(x, y + r)
    p.arcTo(x, y + r, x + r, y, 90)
    p.close()
    if fill_color:
        c.setFillColor(fill_color)
    if stroke_color:
        c.setStrokeColor(stroke_color)
        c.drawPath(p, fill=1 if fill_color else 0, stroke=1)
    else:
        c.drawPath(p, fill=1 if fill_color else 0, stroke=0)


def draw_skill_tag(c, x, y, text, font_size=7):
    c.setFont("Helvetica", font_size)
    tw = c.stringWidth(text, "Helvetica", font_size)
    pad_x = 5
    pad_y = 2.5
    tag_w = tw + pad_x * 2
    tag_h = font_size + pad_y * 2

    draw_rounded_rect(c, x, y - pad_y, tag_w, tag_h, 3, fill_color=TAG_BG, stroke_color=TAG_BORDER)
    c.setFillColor(GREEN_DARK)
    c.setFont("Helvetica", font_size)
    c.drawString(x + pad_x, y + 1, text)
    return tag_w + 4


def draw_section_header(c, y, title):
    c.setFillColor(GREEN)
    c.rect(22 * mm, y - 1, 3, 12, fill=1, stroke=0)
    c.setFillColor(DARK_BG)
    c.setFont("Helvetica-Bold", 10.5)
    c.drawString(26 * mm, y, title.upper())
    c.setStrokeColor(LINE_COLOR)
    c.setLineWidth(0.5)
    c.line(26 * mm, y - 3, W - 22 * mm, y - 3)
    return y - 18


def wrap_text(c, text, font, size, max_width):
    words = text.split()
    lines = []
    current = ""
    for word in words:
        test = f"{current} {word}".strip()
        if c.stringWidth(test, font, size) <= max_width:
            current = test
        else:
            if current:
                lines.append(current)
            current = word
    if current:
        lines.append(current)
    return lines


def build_cv():
    c = canvas.Canvas(OUTPUT_TEMP, pagesize=A4)
    c.setTitle("CV Ander Resano Farelo")
    c.setAuthor("Ander Resano Farelo")
    c.setSubject("Curriculum Vitae - Desarrollador de Software")
    c.setKeywords("C# Python .NET Revit BIM Developer Software NTT Data")

    margin = 22 * mm
    content_w = W - 2 * margin

    # ========== HEADER BAND ==========
    header_h = 62 * mm
    c.setFillColor(DARK_BG)
    c.rect(0, H - header_h, W, header_h, fill=1, stroke=0)

    # Green accent line at bottom of header
    c.setFillColor(GREEN)
    c.rect(0, H - header_h, W, 2.5, fill=1, stroke=0)

    # Name
    c.setFillColor(WHITE)
    c.setFont("Helvetica-Bold", 24)
    c.drawCentredString(W / 2, H - 20 * mm, "ANDER RESANO FARELO")

    # Title
    c.setFillColor(GREEN)
    c.setFont("Helvetica", 11)
    c.drawCentredString(W / 2, H - 28 * mm, "Desarrollador de Software  |  C#  ·  Python  ·  IA")

    # Contact line 1
    c.setFillColor(HexColor("#cbd5e1"))
    c.setFont("Helvetica", 8.5)
    c.drawCentredString(W / 2, H - 37 * mm, "ander.resano@gmail.com   |   Navarra, España")

    # Links
    c.setFillColor(GREEN)
    c.setFont("Helvetica", 8.5)
    links_y = H - 44 * mm

    portfolio_text = "Portfolio Web"
    github_text = "GitHub"
    linkedin_text = "LinkedIn"
    sep = "   |   "
    full_links = f"{portfolio_text}{sep}{github_text}{sep}{linkedin_text}"
    total_w = c.stringWidth(full_links, "Helvetica", 8.5)
    start_x = (W - total_w) / 2

    x = start_x
    c.drawString(x, links_y, portfolio_text)
    link_w = c.stringWidth(portfolio_text, "Helvetica", 8.5)
    c.linkURL("https://resano96.github.io/Portfolio", (x, links_y - 2, x + link_w, links_y + 10))
    x += link_w

    c.setFillColor(HexColor("#cbd5e1"))
    c.drawString(x, links_y, sep)
    x += c.stringWidth(sep, "Helvetica", 8.5)

    c.setFillColor(GREEN)
    c.drawString(x, links_y, github_text)
    link_w = c.stringWidth(github_text, "Helvetica", 8.5)
    c.linkURL("https://github.com/Resano96", (x, links_y - 2, x + link_w, links_y + 10))
    x += link_w

    c.setFillColor(HexColor("#cbd5e1"))
    c.drawString(x, links_y, sep)
    x += c.stringWidth(sep, "Helvetica", 8.5)

    c.setFillColor(GREEN)
    c.drawString(x, links_y, linkedin_text)
    link_w = c.stringWidth(linkedin_text, "Helvetica", 8.5)
    c.linkURL("https://linkedin.com/in/ander-resano-farelo-136661129", (x, links_y - 2, x + link_w, links_y + 10))

    # Small decorative dots in header corners
    c.setFillColor(HexColor("#2a2a4e"))
    for dx in range(0, 40, 12):
        for dy in range(0, 25, 12):
            c.circle(15 + dx, H - 8 - dy, 1, fill=1, stroke=0)
            c.circle(W - 15 - dx, H - 8 - dy, 1, fill=1, stroke=0)

    # ========== BODY ==========
    y = H - header_h - 14 * mm

    # --- PERFIL PROFESIONAL ---
    y = draw_section_header(c, y, "Perfil Profesional")

    profile = (
        "Desarrollador de software con experiencia profesional en NTT Data desarrollando plugins para "
        "Autodesk Revit con C#, .NET 8 y WPF. Casi 2 años programando de forma continua, con formación en "
        "desarrollo de aplicaciones multiplataforma e inteligencia artificial. Perfil versátil que combina "
        "conocimientos de programación, IA y sector BIM/construcción."
    )
    lines = wrap_text(c, profile, "Helvetica", 8.5, content_w)
    c.setFont("Helvetica", 8.5)
    c.setFillColor(TEXT_MED)
    for line in lines:
        c.drawString(margin, y, line)
        y -= 11

    y -= 6

    # --- EXPERIENCIA PROFESIONAL ---
    y = draw_section_header(c, y, "Experiencia Profesional")

    c.setFillColor(TEXT_DARK)
    c.setFont("Helvetica-Bold", 9)
    c.drawString(margin, y, "NTT Data")
    c.setFillColor(TEXT_LIGHT)
    c.setFont("Helvetica", 8.5)
    c.drawRightString(W - margin, y, "2025  ·  4 meses")
    y -= 12

    c.setFillColor(GREEN_DARK)
    c.setFont("Helvetica-Oblique", 8.5)
    c.drawString(margin, y, "Desarrollador de Plugins — Revit API & C#")
    y -= 13

    exp_text = (
        "Desarrollo de plugins para Autodesk Revit con C#, .NET 8 y WPF. Automatización de flujos de trabajo "
        "BIM, gestión de transacciones con la Revit API e integración en entorno corporativo."
    )
    lines = wrap_text(c, exp_text, "Helvetica", 8.2, content_w - 6 * mm)
    c.setFont("Helvetica", 8.2)
    c.setFillColor(TEXT_MED)

    # Bullet
    c.setFillColor(GREEN)
    c.circle(margin + 2, y + 2.5, 1.5, fill=1, stroke=0)
    c.setFillColor(TEXT_MED)

    for i, line in enumerate(lines):
        c.drawString(margin + 6 * mm, y, line)
        y -= 10.5

    y -= 5

    # --- HABILIDADES TÉCNICAS ---
    y = draw_section_header(c, y, "Habilidades Técnicas")

    skills_categories = [
        ("Lenguajes", ["C#", "Python", "Java", "Kotlin", "JavaScript", "SQL", "HTML/CSS"]),
        ("Frameworks", [".NET 8", "ASP.NET Core", "EF Core", "WPF", "Unity", "React", "Django", "Flask", "FastAPI"]),
        ("IA & Automatización", ["Prompting", "IA Local", "Modelos", "RAG", "scikit-learn", "n8n"]),
        ("BIM & CAD", ["Revit API", "Dynamo", "AutoCAD", "pyRevit"]),
        ("Herramientas", ["Git/GitHub", "Docker", "Linux", "CI/CD", "SQL Server", "PostgreSQL"]),
    ]

    for cat_name, tags in skills_categories:
        c.setFillColor(TEXT_DARK)
        c.setFont("Helvetica-Bold", 8)
        c.drawString(margin, y + 1, f"{cat_name}:")
        label_w = c.stringWidth(f"{cat_name}:", "Helvetica-Bold", 8) + 4

        x = margin + label_w + 2
        for tag in tags:
            tag_w = draw_skill_tag(c, x, y, tag, font_size=7)
            x += tag_w
            if x > W - margin - 10:
                y -= 14
                x = margin + label_w + 2
        y -= 17

    y -= 0

    # --- FORMACIÓN ACADÉMICA ---
    y = draw_section_header(c, y, "Formación Académica")

    education = [
        ("Grado Superior en Desarrollo de Aplicaciones Multiplataforma (DAM)", "Pendiente de prácticas"),
        ("Máster en Desarrollo con Inteligencia Artificial", "En curso"),
        ("Máster en Análisis de Datos (Big Data & BI)", "En curso"),
        ("Máster en Modelado BIM con Revit", "Finalizado"),
        ("Grado Superior en Proyectos de Edificación", "Finalizado"),
    ]

    for title, status in education:
        c.setFillColor(GREEN)
        c.circle(margin + 2, y + 2.5, 1.5, fill=1, stroke=0)

        c.setFillColor(TEXT_DARK)
        c.setFont("Helvetica-Bold", 8.2)
        c.drawString(margin + 6 * mm, y, title)

        c.setFillColor(TEXT_LIGHT)
        c.setFont("Helvetica", 7.5)
        status_w = c.stringWidth(f" — {status}", "Helvetica", 7.5)
        title_w = c.stringWidth(title, "Helvetica-Bold", 8.2)

        if margin + 6 * mm + title_w + status_w < W - margin:
            c.drawString(margin + 6 * mm + title_w + 2, y, f" — {status}")
        else:
            c.drawString(margin + 6 * mm, y - 10, f"— {status}")
            y -= 10

        y -= 13

    y -= 0

    # --- PROYECTOS DESTACADOS ---
    y = draw_section_header(c, y, "Proyectos Destacados")

    projects = [
        ("Pipeline MLOps", "Modelo scikit-learn servido con FastAPI, Docker multi-stage, TDD y CI/CD en GitHub Actions."),
        ("UserManager API", "API REST con ASP.NET Core y EF Core sobre PostgreSQL. Arquitectura por capas y Docker Compose."),
        ("ActiveBreak", "App Android en Kotlin con rutinas guiadas, vídeo ExoPlayer y temporizador sincronizado."),
        ("Gestor de Archivos con IA", "Herramienta de consola en Python con asistente Mistral vía API de Hugging Face."),
        ("Portfolio Web", "Web responsive con HTML/CSS/JS vanilla, traducción ES/EN y generador de CV en PDF."),
    ]

    for title, desc in projects:
        c.setFillColor(GREEN)
        c.circle(margin + 2, y + 2.5, 1.5, fill=1, stroke=0)

        c.setFillColor(TEXT_DARK)
        c.setFont("Helvetica-Bold", 8.2)
        c.drawString(margin + 6 * mm, y, f"{title}:")

        c.setFillColor(TEXT_MED)
        c.setFont("Helvetica", 8.2)
        title_w = c.stringWidth(f"{title}: ", "Helvetica-Bold", 8.2)
        remaining_w = content_w - 6 * mm - title_w
        desc_x = margin + 6 * mm + title_w

        if c.stringWidth(desc, "Helvetica", 8.2) <= remaining_w:
            c.drawString(desc_x, y, desc)
        else:
            words = desc.split()
            line1 = ""
            rest_words = []
            for i, word in enumerate(words):
                test = f"{line1} {word}".strip()
                if c.stringWidth(test, "Helvetica", 8.2) <= remaining_w:
                    line1 = test
                else:
                    rest_words = words[i:]
                    break
            c.drawString(desc_x, y, line1)
            if rest_words:
                y -= 10.5
                c.drawString(margin + 6 * mm, y, " ".join(rest_words))

        y -= 13

    y -= 0

    # --- IDIOMAS & COMPETENCIAS ---
    y = draw_section_header(c, y, "Idiomas & Competencias")

    col1_x = margin
    col2_x = margin + content_w * 0.35

    # Row 1: Español + competencia 1
    c.setFillColor(TEXT_DARK)
    c.setFont("Helvetica-Bold", 8.2)
    c.drawString(col1_x, y, "Español:")
    c.setFillColor(TEXT_MED)
    c.setFont("Helvetica", 8.2)
    c.drawString(col1_x + c.stringWidth("Español: ", "Helvetica-Bold", 8.2), y, "Nativo")

    c.setFillColor(GREEN)
    c.circle(col2_x + 2, y + 2.5, 1.5, fill=1, stroke=0)
    c.setFillColor(TEXT_MED)
    c.setFont("Helvetica", 8.2)
    c.drawString(col2_x + 6 * mm, y, "Resolución de problemas y pensamiento analítico")

    y -= 13

    # Row 2: Inglés + competencia 2
    c.setFillColor(TEXT_DARK)
    c.setFont("Helvetica-Bold", 8.2)
    c.drawString(col1_x, y, "Inglés:")
    c.setFillColor(TEXT_MED)
    c.setFont("Helvetica", 8.2)
    c.drawString(col1_x + c.stringWidth("Inglés: ", "Helvetica-Bold", 8.2), y, "Alto leído, intermedio hablado")

    c.setFillColor(GREEN)
    c.circle(col2_x + 2, y + 2.5, 1.5, fill=1, stroke=0)
    c.setFillColor(TEXT_MED)
    c.setFont("Helvetica", 8.2)
    c.drawString(col2_x + 6 * mm, y, "Aprendizaje autónomo y rápido")

    y -= 13

    # Row 3: empty left + competencia 3
    c.setFillColor(GREEN)
    c.circle(col2_x + 2, y + 2.5, 1.5, fill=1, stroke=0)
    c.setFillColor(TEXT_MED)
    c.setFont("Helvetica", 8.2)
    c.drawString(col2_x + 6 * mm, y, "Adaptabilidad y curiosidad tecnológica")

    y -= 13

    # Row 4: empty left + competencia 4
    c.setFillColor(GREEN)
    c.circle(col2_x + 2, y + 2.5, 1.5, fill=1, stroke=0)
    c.setFillColor(TEXT_MED)
    c.setFont("Helvetica", 8.2)
    c.drawString(col2_x + 6 * mm, y, "Trabajo en equipo y comunicación")

    # ========== FOOTER ==========
    c.setFillColor(LINE_COLOR)
    c.setLineWidth(0.3)
    c.line(margin, 12 * mm, W - margin, 12 * mm)
    c.setFillColor(TEXT_LIGHT)
    c.setFont("Helvetica", 6.5)
    c.drawCentredString(W / 2, 8 * mm, "Ander Resano Farelo  ·  ander.resano@gmail.com  ·  github.com/Resano96")

    c.save()
    try:
        if os.path.exists(OUTPUT_FINAL):
            os.remove(OUTPUT_FINAL)
        os.rename(OUTPUT_TEMP, OUTPUT_FINAL)
        print(f"CV generado: {OUTPUT_FINAL}")
    except PermissionError:
        print(f"CV generado como: {OUTPUT_TEMP}")
        print("(Cierra el PDF antiguo y renómbralo manualmente a CV_Ander_Resano.pdf)")


if __name__ == "__main__":
    build_cv()
