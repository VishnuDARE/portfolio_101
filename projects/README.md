# Project Upload Guide

This portfolio is static and GitHub Pages-ready. Project cards are powered by each folder's `project.json` file, while media is discovered by naming convention.

To add or update a project:

1. Create a folder inside `projects/`, for example `projects/new-project/`.
2. Add `project.json` with the same fields used by the existing projects.
3. Add screenshots inside `screenshots/` named `screen1.png`, `screen2.png`, `screen3.png`, and so on.
4. Add PDF documentation inside `documents/` named `documentation.pdf`, `doc1.pdf`, or `doc2.pdf`.
5. Add videos inside `videos/` named `video1.mp4`, `video2.mp4`, and so on.
6. Add the folder name to `assets/data/site.json` under `projectFolders`.

The JavaScript probes common filenames automatically, so replacing or adding media files does not require JavaScript changes.
