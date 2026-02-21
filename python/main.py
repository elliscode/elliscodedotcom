from pathlib import Path
from jinja2 import Environment, FileSystemLoader

from markdown.treeprocessors import Treeprocessor
from markdown.extensions import Extension
import markdown
from xml.etree import ElementTree


class ImageToFigure(Treeprocessor):
    def run(self, root):
        for parent in root.iter():
            children = list(parent)

            for i, child in enumerate(children):
                # Only wrap <p> that contains exactly one <img>
                if child.tag == "p" and len(child) == 1:
                    img = child[0]

                    if img.tag == "img" and img.get("alt"):
                        # Create <figure>
                        figure = ElementTree.Element("figure")

                        link = ElementTree.Element("a")

                        # Move <img> into <figure>
                        parent.remove(child)
                        figure.append(link)
                        link.append(img)

                        # Add <figcaption>
                        caption = ElementTree.SubElement(figure, "figcaption")
                        caption.text = img.get("alt")

                        link.set("href", img.get("src"))

                        # Insert <figure> at original position
                        parent.insert(i, figure)


class FigureExtension(Extension):
    def extendMarkdown(self, md):
        md.treeprocessors.register(ImageToFigure(md), "img_to_figure", 15)

CONTENT_DIR = Path("content")
OUTPUT_DIR = Path("../s3/blog")

# Setup Jinja once
env = Environment(loader=FileSystemLoader("templates"))
template = env.get_template("post.html")

current_directory_list = []

md = markdown.Markdown(extensions=["extra", "codehilite", "toc", "meta", FigureExtension()])

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

        if md.Meta.get('title'):
            blog_title = md.Meta['title'][0]
        else:
            blog_title = folder.name.replace("-", " ").title()

        html_content = f"<h1>{blog_title}</h1>{html_content}"

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
            current_directory_list.append(f"* {md.Meta['date'][0]} &mdash; [{blog_title}]({folder.name}/)")

current_directory_list.sort(reverse=True)

# Convert to HTML
html_content = md.convert(
    "\n".join(current_directory_list)
)

directory_template = env.get_template("directory.html")

# Render template
output = directory_template.render(
    content=html_content,
)

(OUTPUT_DIR / "index.html").write_text(output)

print("Build complete.")
