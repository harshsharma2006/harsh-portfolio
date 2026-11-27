"""
Streamlit entrypoint for Harsh Sharma's Data Science, AI/ML & Generative AI Portfolio.
Inlines styles.css, script.js, profile photo, project screenshots, certificate PNGs,
and provides both a native Streamlit Resume PDF download bar and embedded data-URI download.
"""

import base64
import mimetypes
import re
from pathlib import Path
import streamlit as st
import streamlit.components.v1 as components

st.set_page_config(
    page_title="Harsh Sharma — Data Science, AI/ML & Generative AI Portfolio",
    page_icon="🤖",
    layout="wide",
    initial_sidebar_state="collapsed",
)

st.markdown(
    """
    <style>
      #MainMenu, header[data-testid="stHeader"], footer { display: none !important; }
      .block-container {
        padding: 0.45rem 0.75rem 0 0.75rem !important;
        margin: 0 !important;
        max-width: 100% !important;
      }
      .stApp {
        background: #050814 !important;
      }
      iframe {
        display: block;
        width: 100% !important;
        border: none !important;
        border-radius: 14px;
      }
    </style>
    """,
    unsafe_allow_html=True,
)


def to_data_uri(file_path: Path) -> str:
    mime, _ = mimetypes.guess_type(str(file_path))
    if not mime:
        mime = "application/octet-stream"
    b64 = base64.b64encode(file_path.read_bytes()).decode("ascii")
    return f"data:{mime};base64,{b64}"


def build_bundled_html(base_dir: Path) -> str:
    html = (base_dir / "index.html").read_text(encoding="utf-8")
    css = (base_dir / "styles.css").read_text(encoding="utf-8")
    js = (base_dir / "script.js").read_text(encoding="utf-8")

    html = html.replace('<link rel="stylesheet" href="styles.css" />', f"<style>\n{css}\n</style>")
    html = html.replace('<script src="script.js"></script>', f"<script>\n{js}\n</script>")

    # Inline all assets/* references (images + Resume PDF) as data URIs for srcdoc iframe
    asset_cache = {}

    def replace_asset(match):
        rel = match.group(0)
        if rel not in asset_cache:
            target = base_dir / rel
            asset_cache[rel] = to_data_uri(target) if target.exists() else rel
        return asset_cache[rel]

    html = re.sub(r"assets/[A-Za-z0-9_./\-]+", replace_asset, html)
    return html


BASE_DIR = Path(__file__).resolve().parent
RESUME_PDF = BASE_DIR / "assets" / "Harsh_Sharma_Resume_2026.pdf"

# Native Streamlit top action bar for guaranteed 1-click PDF download in Streamlit Cloud
c1, c2, c3 = st.columns([3, 1.3, 1.3])
with c1:
    st.markdown(
        "<div style='color:#f8fafc;font-weight:600;padding-top:6px;font-size:15px;'>"
        "🚀 Harsh Sharma — Data Science, AI/ML &amp; Generative AI Portfolio</div>",
        unsafe_allow_html=True,
    )
with c2:
    if RESUME_PDF.exists():
        st.download_button(
            "⬇ Download 2026 Resume (PDF)",
            data=RESUME_PDF.read_bytes(),
            file_name="Harsh_Sharma_Resume_2026.pdf",
            mime="application/pdf",
            use_container_width=True,
        )
with c3:
    st.link_button(
        "🌐 TalentSphere 2.0 Live",
        "https://talentsphereenterprise20-hq239uebmxwggycjex9icv.streamlit.app/",
        use_container_width=True,
    )

bundled_html = build_bundled_html(BASE_DIR)
components.html(bundled_html, height=7900, scrolling=True)
