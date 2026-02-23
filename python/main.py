import re
from pathlib import Path

from PIL import Image
from jinja2 import Environment, FileSystemLoader

from markdown.treeprocessors import Treeprocessor
from markdown.extensions import Extension
import markdown
from xml.etree import ElementTree

image_regex = re.compile(r'<img([^>]*) src="([^"]+)" />')

class ImageReplacer:
    def __init__(self, directory_name):
        self.directory_name = directory_name

    def add_dimensions(self, match):
        before = match.group(1)
        src = match.group(2)

        try:
            with Image.open(Path.joinpath(self.directory_name, src)) as img:
                width, height = img.size
        except Exception as e:
            # If image can't be opened, return original tag
            return match.group(0)

        return f'<img{before} src="{src}" width="{width}" height="{height}" />'

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

        post_output_dir = OUTPUT_DIR / folder.name
        imgrep = ImageReplacer(post_output_dir)

        html_content = image_regex.sub(imgrep.add_dimensions, html_content)

        if md.Meta.get('title'):
            blog_title = md.Meta['title'][0]
        else:
            blog_title = folder.name.replace("-", " ").title()

        html_content = f"<h1>{blog_title}</h1>{html_content}"

        # Render template
        output = template.render(
            content=html_content,
            title=blog_title,
            folder=folder.name,
            thumbnailurl=md.Meta.get('thumbnailurl', ['../../images/favicon_larger.png'])[0]
        )

        # Create output directory
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
