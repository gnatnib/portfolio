#!/usr/bin/env python3
"""Render the CV PDF into page images for the site's resume viewer.

The resume is displayed as images rather than an embedded PDF: browser PDF
plugins are unreliable, and download managers (IDM) intercept the file and
leave a blank frame, forcing visitors to download it just to read it.

Usage:
    pip install pymupdf
    python scripts/render-cv.py path/to/CV.pdf

Copies the PDF to public/ for the download button and writes
src/assets/cv/page-N.png, which the resume page picks up on the next build.
Bump `resume.version` in src/data.ts afterwards.
"""

import os
import shutil
import sys

try:
    import fitz  # PyMuPDF
except ImportError:
    sys.exit("PyMuPDF is required:  pip install pymupdf")

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PUBLIC = os.path.join(ROOT, "public")
PAGES_DIR = os.path.join(ROOT, "src", "assets", "cv")
PDF_NAME = "CV_Bintang_Syafrian_Rizal.pdf"
# 2.4x ≈ 173 DPI — crisp on HiDPI screens without bloating the payload.
SCALE = 2.4


def main() -> None:
    source = sys.argv[1] if len(sys.argv) > 1 else os.path.join(PUBLIC, PDF_NAME)
    if not os.path.isfile(source):
        sys.exit(f"No such PDF: {source}")

    os.makedirs(PAGES_DIR, exist_ok=True)

    target_pdf = os.path.join(PUBLIC, PDF_NAME)
    if os.path.abspath(source) != os.path.abspath(target_pdf):
        shutil.copy(source, target_pdf)
        print(f"copied -> public/{PDF_NAME}")

    # Drop stale pages so a shorter CV doesn't leave orphans behind.
    for stale in os.listdir(PAGES_DIR):
        if stale.startswith("page-") and stale.endswith(".png"):
            os.remove(os.path.join(PAGES_DIR, stale))

    doc = fitz.open(target_pdf)
    for index, page in enumerate(doc, start=1):
        pix = page.get_pixmap(matrix=fitz.Matrix(SCALE, SCALE), alpha=False)
        name = f"page-{index}.png"
        pix.save(os.path.join(PAGES_DIR, name))
        size_kb = os.path.getsize(os.path.join(PAGES_DIR, name)) // 1024
        print(f"src/assets/cv/{name}  {pix.width}x{pix.height}  {size_kb}KB")

    print("\nNow bump resume.version in src/data.ts.")


if __name__ == "__main__":
    main()
