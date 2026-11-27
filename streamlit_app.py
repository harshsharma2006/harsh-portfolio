"""
Streamlit entrypoint for Harsh Sharma's Data Science, AI/ML & Generative AI Portfolio.
Bundles index.html, styles.css, script.js, and Harsh_Sharma_Resume_2026.pdf for
seamless execution both locally (`streamlit run streamlit_app.py`) and on Streamlit Community Cloud.
"""

import base64
from pathlib import Path
import streamlit as st
import streamlit.components.v1 as components

st.set_page_config(
    page_title="Harsh Sharma — Data Science, AI/ML & Generative AI Portfolio",
    page_icon="🤖",
    layout="wide",
    initial_sidebar_state="collapsed",
)

# Remove default Streamlit outer padding/chrome so the portfolio fills the viewport cleanly
st.markdown(
    """
    <style>
      #MainMenu, header[data-testid="stHeader"], footer { display: none !important; }
      .block-container {
        padding: 0 !important;
        margin: 0 !important;
        max-width: 100% !important;
      }
      iframe {
        display: block;
        width: 100% !important;
        border: none !important;
      }
    </style>
    """,
    unsafe_allow_html=True,
)


def build_bundled_html(base_dir: Path) -> str:
    html = (base_dir / "index.html").read_text(encoding="utf-8")
    css = (base_dir / "styles.css").read_text(encoding="utf-8")
    js = (base_dir / "script.js").read_text(encoding="utf-8")

    # Inline stylesheet and script so components.html resolves all assets inside iframe
    html = html.replace('<link rel="stylesheet" href="styles.css" />', f"<style>\n{css}\n</style>")
    html = html.replace('<script src="script.js"></script>', f"<script>\n{js}\n</script>")

    # Embed Resume PDF as base64 data URI for 1-click download inside Streamlit iframe
    pdf_path = base_dir / "assets" / "Harsh_Sharma_Resume_2026.pdf"
    if pdf_path.exists():
        b64_pdf = base64.b64encode(pdf_path.read_bytes()).decode("ascii")
        data_uri = f"data:application/pdf;base64,{b64_pdf}"
        html = html.replace("assets/Harsh_Sharma_Resume_2026.pdf", data_uri)

    return html


BASE_DIR = Path(__file__).resolve().parent
bundled_html = build_bundled_html(BASE_DIR)
components.html(bundled_html, height=6700, scrolling=True)
