# Trees Lab - Unit IV

Local React/Vite study app for WIT's **25ITU3CC2T Data Structures, 2026-27**.

## Run

```sh
npm install
npm run dev
```

Open http://localhost:4321. If that port is occupied, use `npm run dev -- --port 4322`.

## Study Pages

- **Syllabus (home):** ten pointwise lessons matching the Unit IV headings. Each point contains theory, diagrams, case playback, algorithms, syntax and full C programs.
- **Reference:** all 13 chapters and 54 source topics, including optional material outside the core syllabus.
- **Visualizer:** traversals, BST, AVL, B-Tree, heap, Red-Black, Huffman and trie; example trees, playback, variables and code.
- **Programs:** 34 complete C listings, including linked-memory, multiway-search and full B-Tree deletion examples; also embedded inside the relevant syllabus points.
- **Practice / Revise:** questions, formulas, complexity comparisons and exam revision.

The light layout includes a master syllabus index, a mobile point selector, topic search, next/previous lessons and straight directed tree edges. Case players have step buttons, speed, autoplay, restart, a step slider and a transcript. LR/RL always include the intermediate rotation. AVL deletion includes all six child-balance cases. Topic and program URLs support direct links. The library distinguishes unordered binary-tree operations from BST operations.

## Syllabus And Notes

Coverage is matched to `../DS Syllabus Updated 2026.pdf` relative to the Unit IV folder: printed page 17, Unit IV, Trees (7 hours). The older `DS Syllabus.pdf` and `Updated SY Data Structure Syllabus WIT.pdf` specify the same Tree topics.

Required topics: definition, traversal, linked implementation, binary-tree and BST insert/delete/search, multiway trees, B-Trees, and AVL single/double rotations.

Supporting source files under `Final Notes` in the Unit IV folder:

- `Final/Tree Notes.pdf`, `Final/Tree Notes Part 1.pdf`, `Final/Tree Reference Book.pdf`
- `Final/BINARY SEARCH TREES.pdf`, `Final/AVL Trees.pdf`
- `Final/M- WAY TREES.pdf`, `Final/B-Trees.pdf`
- `DataStructures_Unit_3.pdf`, `chap7b.pdf`, `AVL Tree.pdf`
- Six TechVidvan PDFs covering trees, binary trees, C implementation, traversal, BST and AVL.

Threads, general trees, heaps, Huffman, Red-Black, trie and B+ remain available as extra reading. The focus filter includes foundational material and supporting operations; it is not a claim that every extra exercise is named in the official syllabus.

Height is counted in edges (leaf 0, empty tree -1). Some class notes use "complete" for "perfect" and "almost complete" for the usual complete-tree shape; the binary-tree chapter explains this naming difference.

## Checks

```sh
npm run lint
npm run build
npm run verify:notes
```

The notes checker requires GCC on PATH. It checks every master point has diagrams, case playback and programs; renders diagram specifications; tests straight edges and all rotation intermediate states; and syntax-checks all 34 C listings. Randomized tests cover full-tree AVL insertion traces, cascading deletion rebalancing, and 30 complete B-Tree C insert/search/delete runs. Linked, multiway and binary-tree programs also have executable sample/edge-case tests.

Generated executables, screenshots and logs belong in the ignored `.verification` directory. The check does not run every interactive C program end to end.

The free-form visualizer animates B-Tree insertion. The B-Tree syllabus point contains prepared deletion case players (both borrow directions, merge, internal replacement and root shrink), plus a full order-4 C program. The deletion drawings use order 3 with bottom-up repair; the program uses minimum degree 2 with top-down repair, explicitly labelled in the lesson.

## Production

Canonical site: https://tree-notes1.vercel.app/

GitHub source branch: `trees-lab-syllabus-refresh`. The existing `main` branch is preserved and is not this redesign. Deploy explicitly to the existing `tree-notes1` project:

```sh
vercel link --yes --project tree-notes1 --scope sagar-somayya-hiremaths-projects
vercel deploy --prod --yes --project tree-notes1
```

The old `tree-notes` Vercel project was removed. Do not recreate it. Local verification files are excluded through both `.gitignore` and `.vercelignore`.
