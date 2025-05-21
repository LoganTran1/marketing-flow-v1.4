import streamlit as st
from PIL import Image
import os

# Set page config
st.set_page_config(
    page_title="RSOC Flow",
    layout="wide",
    initial_sidebar_state="collapsed"
)

# Custom CSS to match React Flow styling
st.markdown("""
<style>
    /* Reset and base styles */
    .stApp {
        background-color: rgb(249, 250, 251);
    }
    
    /* Main container */
    .main-container {
        background: white;
        border-radius: 0.5rem;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        padding: 1rem;
        margin: 2rem auto;
        max-width: 95%;
    }
    
    /* iPhone frame styling */
    .iphone-frame {
        background: rgb(31, 41, 55);
        border-radius: 40px;
        padding: 12px;
        margin: 10px;
    }
    
    .iphone-screen {
        background: black;
        border: 6px solid black;
        border-radius: 35px;
        overflow: hidden;
    }
    
    .iphone-content {
        background: white;
        border-radius: 28px;
        overflow: hidden;
    }
    
    /* Node styling */
    .node {
        text-align: center;
        margin-bottom: 1rem;
    }
    
    .node-title {
        font-size: 1.25rem;
        font-weight: 600;
        color: rgb(31, 41, 55);
        margin: 0.5rem 0;
    }
    
    .node-description {
        color: rgb(5, 150, 105);
        font-size: 0.875rem;
        margin-bottom: 0.5rem;
    }
    
    /* Arrow styling */
    .arrow {
        color: rgb(5, 150, 105);
        font-size: 2rem;
        margin: 1rem 0;
        animation: flowAnimation 2s infinite;
    }
    
    @keyframes flowAnimation {
        0% { opacity: 0.5; transform: translateX(0); }
        50% { opacity: 1; transform: translateX(10px); }
        100% { opacity: 0.5; transform: translateX(0); }
    }
    
    /* Button styling */
    .stButton>button {
        background-color: rgb(59, 130, 246);
        color: white;
        border: none;
        border-radius: 0.5rem;
        padding: 0.5rem 1rem;
        font-weight: 500;
        transition: all 0.2s;
    }
    
    .stButton>button:hover {
        background-color: rgb(37, 99, 235);
    }
</style>
""", unsafe_allow_html=True)

# Title
st.markdown('<h1 class="node-title" style="font-size: 1.5rem; margin: 2rem 0;">RSOC Flow</h1>', unsafe_allow_html=True)

# Main container
st.markdown('<div class="main-container">', unsafe_allow_html=True)

# Create three columns for nodes
col1, arrow1, col2, arrow2, col3 = st.columns([3, 1, 3, 1, 3])

# Node 1: Lead Gen Partner Ad
with col1:
    st.markdown('<div class="node">', unsafe_allow_html=True)
    st.markdown('<div class="node-title">Lead Gen Partner Ad</div>', unsafe_allow_html=True)
    st.markdown('<div class="node-description">User sees and clicks on partner advertisement</div>', unsafe_allow_html=True)
    st.markdown('<div class="iphone-frame"><div class="iphone-screen"><div class="iphone-content">', unsafe_allow_html=True)
    st.image('dist/assets/Thank-you-page-DE3Ligmp.png', use_column_width=True)
    st.image('dist/assets/Thank-you-page-button-MygGSPCQ.png', use_column_width=True)
    st.markdown('</div></div></div>', unsafe_allow_html=True)
    st.markdown('</div>', unsafe_allow_html=True)

# Arrow 1
with arrow1:
    st.markdown('<div class="arrow">➡️</div>', unsafe_allow_html=True)

# Node 2: Content Page
with col2:
    st.markdown('<div class="node">', unsafe_allow_html=True)
    st.markdown('<div class="node-title">Content Page with Keyword Block</div>', unsafe_allow_html=True)
    st.markdown('<div class="node-description">User lands on content page and clicks keyword block with search terms</div>', unsafe_allow_html=True)
    st.markdown('<div class="iphone-frame"><div class="iphone-screen"><div class="iphone-content">', unsafe_allow_html=True)
    
    # Toggle state for content page
    if 'content_toggle' not in st.session_state:
        st.session_state.content_toggle = False
    
    current_content = 'dist/assets/Content-page-Nation2-Cf7WwrIl.png' if st.session_state.content_toggle else 'dist/assets/Content-page-Nation-CZsdrAwI.png'
    st.image(current_content, use_column_width=True)
    
    if st.button('Toggle Content View', key='content'):
        st.session_state.content_toggle = not st.session_state.content_toggle
        st.rerun()
    
    st.markdown('</div></div></div>', unsafe_allow_html=True)
    st.markdown('</div>', unsafe_allow_html=True)

# Arrow 2
with arrow2:
    st.markdown('<div class="arrow">➡️</div>', unsafe_allow_html=True)

# Node 3: SERP
with col3:
    st.markdown('<div class="node">', unsafe_allow_html=True)
    st.markdown('<div class="node-title">SERP (Search Engine Results Page)</div>', unsafe_allow_html=True)
    st.markdown('<div class="node-description">Search results page shows sponsored ads. When user clicks "Visit Website", this becomes the monetization event.</div>', unsafe_allow_html=True)
    st.markdown('<div class="iphone-frame"><div class="iphone-screen"><div class="iphone-content">', unsafe_allow_html=True)
    
    # Toggle state for SERP
    if 'serp_toggle' not in st.session_state:
        st.session_state.serp_toggle = False
    
    current_serp = 'dist/assets/SERP-NATION-Arrow-BvcBo0nY.png' if st.session_state.serp_toggle else 'dist/assets/SERP-NATION-Jxu5Yzab.png'
    st.image(current_serp, use_column_width=True)
    
    if st.button('Toggle SERP View', key='serp'):
        st.session_state.serp_toggle = not st.session_state.serp_toggle
        st.rerun()
    
    st.markdown('</div></div></div>', unsafe_allow_html=True)
    st.markdown('</div>', unsafe_allow_html=True)

st.markdown('</div>', unsafe_allow_html=True)

# Key Terms (in an expander to save space)
with st.expander("Key Terms"):
    col1, col2 = st.columns(2)
    with col1:
        st.markdown("""
        **Keyword Block Widget**
        - An iframe containing search terms (ForceKeys)
        - Clicks on terms go to the SERP
        - Related searches on content (RSOC)
        """)
    with col2:
        st.markdown("""
        **ForceKeys**
        - Optimized search terms/keywords
        - Passed in URL
        - Requested to be shown by Google
        """)

# Action buttons
col1, col2 = st.columns(2)
with col1:
    st.link_button("Start Consultation", "https://www.invisalign.com/get-started/consultation")
with col2:
    st.link_button("Find Invisalign Near Me", "https://www.google.com/search?q=invisalign+near+me") 