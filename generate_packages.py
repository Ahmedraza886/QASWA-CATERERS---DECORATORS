"""
===============================================================
  Qaswa Caterers — Package Page Generator
===============================================================
  HOW TO USE (Owner Instructions):
  ─────────────────────────────────
  1. Open  packages_data.csv  in Excel
  2. Add or edit your packages (one menu item per row)
  3. Save the file (keep CSV format)
  4. Double-click THIS script  OR  run:  python generate_packages.py
  5. It creates a new  packages.html  automatically
  6. Upload packages.html  to your website — done!
===============================================================
"""

import csv
import os
import sys
from collections import OrderedDict

# ── File paths (edit if needed) ──────────────────────────────
CSV_FILE  = "packages_data.csv"
HTML_FILE = "packages.html"

# ── Read & parse CSV ─────────────────────────────────────────
def read_csv(path):
    if not os.path.exists(path):
        print(f"❌  ERROR: Cannot find '{path}'")
        print(f"    Make sure '{path}' is in the same folder as this script.")
        input("\nPress Enter to close...")
        sys.exit(1)

    categories = OrderedDict()

    with open(path, newline="", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        for row in reader:
            cat  = (row.get("Category Name")        or "").strip()
            desc = (row.get("Category Description") or "").strip()
            pkg  = (row.get("Package Name")         or "").strip()
            item = (row.get("Menu Item")            or "").strip()

            if not cat or not pkg or not item:
                continue

            if cat not in categories:
                categories[cat] = {"desc": "", "packages": OrderedDict()}
            if desc and not categories[cat]["desc"]:
                categories[cat]["desc"] = desc
            if pkg not in categories[cat]["packages"]:
                categories[cat]["packages"][pkg] = []
            categories[cat]["packages"][pkg].append(item)

    if not categories:
        print("❌  ERROR: No valid data found in the CSV.")
        print("    Make sure columns are: Category Name, Category Description, Package Name, Menu Item")
        input("\nPress Enter to close...")
        sys.exit(1)

    return categories

# ── Build packages HTML section ──────────────────────────────
def build_packages_html(categories):
    parts = []
    cat_list = list(categories.items())

    for idx, (cat, cat_data) in enumerate(cat_list):
        cat_id = cat.lower().replace(" ", "-").replace("&", "and")
        desc   = cat_data["desc"] or f"Explore our {cat} packages below."

        variations = ""
        for pkg_name, items in cat_data["packages"].items():
            item_rows = ""
            for i, item in enumerate(items):
                border = "border-bottom:1px solid #eee;" if i < len(items) - 1 else ""
                item_rows += f'<li style="padding:.5rem 0;{border}"><strong>{item}</strong></li>\n'

            variations += f"""
                    <div class="package-variation">
                        <div class="package-variation-content">
                            <h3>{pkg_name}</h3>
                            <ul style="list-style:none;padding:0;">
                                {item_rows}
                            </ul>
                            <a href="contact.html" class="btn" style="margin-top:1.5rem;display:inline-block;">Book This Package</a>
                        </div>
                    </div>"""

        parts.append(f"""
        <div class="package-summary">
            <h2>{cat} Packages</h2>
            <p>{desc}</p>
            <button class="read-more-btn" onclick="togglePackage('{cat_id}', event)">
                Read More <span class="arrow" id="{cat_id}-arrow">&#9660;</span>
            </button>
            <div class="package-details" id="{cat_id}-details">
                <div class="package-variations">
                    {variations}
                </div>
            </div>
        </div>""")

        if idx < len(cat_list) - 1:
            parts.append('        <div class="divider"></div>')

    return "\n".join(parts)

# ── Full HTML template ────────────────────────────────────────
def build_html(packages_html):
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Packages - Qaswa Caterers & Decorators</title>
    <link rel="stylesheet" href="style.css">
    <script src="script.js" defer></script>
    <style>
        .package-summary {{
            background: #fff;
            padding: 2rem;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            margin-bottom: 2rem;
            transition: all 0.3s ease;
        }}
        .package-summary:hover {{
            box-shadow: 0 6px 12px rgba(212,175,55,0.2);
        }}
        .package-summary h2 {{
            color: #d4af37;
            margin-bottom: 1rem;
            font-size: 2rem;
        }}
        .package-summary p {{
            color: #666;
            margin-bottom: 1.5rem;
            line-height: 1.6;
        }}
        .read-more-btn {{
            background: linear-gradient(135deg, #d4af37 0%, #aa8c2c 100%);
            color: white;
            border: none;
            padding: 12px 30px;
            border-radius: 25px;
            font-size: 1rem;
            cursor: pointer;
            transition: all 0.3s ease;
            font-weight: 600;
            display: inline-flex;
            align-items: center;
            gap: 8px;
        }}
        .read-more-btn:hover {{
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(212,175,55,0.4);
        }}
        .read-more-btn.active {{
            background: linear-gradient(135deg, #aa8c2c 0%, #d4af37 100%);
        }}
        .arrow {{
            transition: transform 0.3s ease;
            display: inline-block;
        }}
        .arrow.rotate {{
            transform: rotate(180deg);
        }}
        .package-details {{
            display: none;
            margin-top: 2rem;
            animation: slideDown 0.4s ease;
        }}
        .package-details.show {{
            display: block;
        }}
        @keyframes slideDown {{
            from {{ opacity: 0; transform: translateY(-20px); }}
            to   {{ opacity: 1; transform: translateY(0); }}
        }}
        .package-variations {{
            display: grid;
            gap: 2rem;
            margin-top: 2rem;
        }}
        .package-variation {{
            background: #f9f9f9;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            transition: transform 0.3s ease;
        }}
        .package-variation:hover {{
            transform: translateY(-5px);
            box-shadow: 0 4px 16px rgba(212,175,55,0.2);
        }}
        .package-variation-content {{
            padding: 1.5rem;
        }}
        .package-variation h3 {{
            color: #d4af37;
            margin-bottom: 1rem;
            font-size: 1.5rem;
        }}
        .divider {{
            height: 2px;
            background: linear-gradient(90deg, transparent, #d4af37, transparent);
            margin: 3rem 0;
        }}
    </style>
</head>
<body>

    <!-- Navigation Header -->
    <header>
        <nav>
            <div class="logo" style="font-weight:300;"></div>
            <ul class="nav-links" id="navLinks">
                <li class="nav-item"><a href="index.html"        class="nav-link">Home</a></li>
                <li class="nav-item"><a href="about.html"        class="nav-link">About</a></li>
                <li class="nav-item"><a href="services.html"     class="nav-link">Services</a></li>
                <li class="nav-item"><a href="menus.html"        class="nav-link">Menu</a></li>
                <li class="nav-item"><a href="packages.html"     class="nav-link active">Packages</a></li>
                <li class="nav-item"><a href="testimonials.html" class="nav-link">Testimonials</a></li>
                <li class="nav-item"><a href="contact.html"      class="nav-link">Contact</a></li>
            </ul>
            <div class="menu-toggle" id="menuToggle">
                <span></span><span></span><span></span>
            </div>
        </nav>
    </header>

    <!-- Page Header -->
    <section class="page-header" style="background-image:url('https://media.istockphoto.com/id/2208723083/photo/wedding-reception-outdoors-with-candles-and-flowers.jpg?s=2048x2048&w=is&k=20&c=4Q5UytqPQYyWkkroWeSUoJcn3T4hqjZctMo1aUQCoKQ=');">
        <h1>Our Packages</h1>
        <p>Discover our curated packages for all your special occasions</p>
    </section>

    <!-- PACKAGES SECTION -->
    <section class="page-section" id="packages">

        <p style="text-align:center;max-width:900px;margin:0 auto 3rem;color:#666;font-size:1.1rem;">
            Choose from our carefully curated packages designed to suit events of all sizes.
            Each package includes comprehensive catering and decoration services.
        </p>

{packages_html}

        <div style="text-align:center;margin-top:3rem;">
            <p style="color:#666;margin-bottom:1.5rem;">
                All packages include professional service staff, setup, and cleanup.
                Customisation available upon request.
            </p>
            <a href="contact.html" class="btn">Request Custom Package</a>
        </div>
    </section>

    <!-- Footer -->
    <footer>
        <div class="footer-content">
            <div class="logo">Qaswa Caterers &amp; Decorators</div>
            <p>&copy; 2026 Qaswa Caterers &amp; Decorators. All rights reserved.</p>
            <div class="social-links">
                <a href="https://www.facebook.com/qaswacaterers" target="_blank" aria-label="Facebook">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="#d4af37">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                </a>
                <a href="https://www.instagram.com/qaswa_caterers_?igsh=NXpycWFvdTNrM204" target="_blank" aria-label="Instagram">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="#d4af37">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                </a>
            </div>
        </div>
    </footer>

    <script>
        function togglePackage(id, event) {{
            const details = document.getElementById(id + '-details');
            const btn     = event.target.closest('.read-more-btn');

            if (details.classList.contains('show')) {{
                details.classList.remove('show');
                btn.classList.remove('active');
                btn.innerHTML = 'Read More <span class="arrow" id="' + id + '-arrow">&#9660;</span>';
            }} else {{
                details.classList.add('show');
                btn.classList.add('active');
                btn.innerHTML = 'Show Less <span class="arrow rotate" id="' + id + '-arrow">&#9660;</span>';
                setTimeout(() => details.scrollIntoView({{ behavior: 'smooth', block: 'nearest' }}), 100);
            }}
        }}
    </script>

</body>
</html>"""

# ── Main ─────────────────────────────────────────────────────
if __name__ == "__main__":
    print("=" * 50)
    print("  Qaswa Caterers — Package Page Generator")
    print("=" * 50)
    print(f"\n📖  Reading '{CSV_FILE}'...")

    categories     = read_csv(CSV_FILE)
    packages_html  = build_packages_html(categories)
    full_html      = build_html(packages_html)

    with open(HTML_FILE, "w", encoding="utf-8") as f:
        f.write(full_html)

    total_pkgs = sum(len(c["packages"]) for c in categories.values())
    print(f"✅  Done! '{HTML_FILE}' has been generated.")
    print(f"    → {len(categories)} categories, {total_pkgs} packages")
    print(f"\n📤  Now upload '{HTML_FILE}' to your website.")
    print("=" * 50)
    input("\nPress Enter to close...")
