import markdown
from pathlib import Path
from jinja2 import Environment, FileSystemLoader

CONTENT_DIR = Path("content")
OUTPUT_DIR = Path("../s3/blog")

# Setup Jinja once
env = Environment(loader=FileSystemLoader("templates"))
template = env.get_template("post.html")

current_directory_list = ''

md = markdown.Markdown(extensions=["extra", "codehilite", "toc", "meta"])

for folder in CONTENT_DIR.iterdir():
    if folder.is_dir():
        md_file = folder / "index.md"

        if not md_file.exists():
            continue  # Skip folders without index.md

        print(f"Building {folder.name}...")

        # Read markdown
        md_text = md_file.read_text()

        # replace those relative paths with something else
        md_text = md_text.replace(f"../../../s3/blog/{folder.name}/", "")

        # Convert to HTML
        html_content = md.convert(
            md_text
        )

        blog_title = folder.name.replace("-", " ").title()

        # Render template
        output = template.render(
            content=html_content,
            title=blog_title
        )

        # Create output directory
        post_output_dir = OUTPUT_DIR / folder.name
        post_output_dir.mkdir(parents=True, exist_ok=True)

        # Write file
        (post_output_dir / "index.html").write_text(output)

        if md.Meta.get('date'):
            current_directory_list += f"* {md.Meta['date'][0]} &mdash; [{blog_title}]({folder.name}/)\n"


# Convert to HTML
html_content = md.convert(
    current_directory_list
)

directory_template = env.get_template("directory.html")

# Render template
output = directory_template.render(
    content=html_content,
)

(OUTPUT_DIR / "index.html").write_text(output)

print("Build complete.")
