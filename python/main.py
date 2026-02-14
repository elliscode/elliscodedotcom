import markdown
from pathlib import Path
from jinja2 import Environment, FileSystemLoader

CONTENT_DIR = Path("content")
OUTPUT_DIR = Path("../s3/blog")

# Setup Jinja once
env = Environment(loader=FileSystemLoader("templates"))
template = env.get_template("post.html")

for folder in CONTENT_DIR.iterdir():
    if folder.is_dir():
        md_file = folder / "index.md"

        if not md_file.exists():
            continue  # Skip folders without index.md

        print(f"Building {folder.name}...")

        # Read markdown
        md_text = md_file.read_text()

        # Convert to HTML
        html_content = markdown.markdown(
            md_text,
            extensions=["extra", "codehilite", "toc"]
        )

        # Render template
        output = template.render(
            content=html_content,
            title=folder.name.replace("-", " ").title()
        )

        # Create output directory
        post_output_dir = OUTPUT_DIR / folder.name
        post_output_dir.mkdir(parents=True, exist_ok=True)

        # Write file
        (post_output_dir / "index.html").write_text(output)

print("Build complete.")
