# Trees Lab - Unit IV

Local React/Vite study app for WIT's **25ITU3CC2T Data Structures, 2026-27**.

## Run

```sh
npm install
npm run dev
```

Open http://localhost:4321. If that port is occupied, use `npm run dev -- --port 4322`.

## Study Pages

- **Syllabus:** seven syllabus points with links to their notes; all 13 chapters.
- **Theory:** 54 topics with definitions, explanations, diagrams, worked examples and applicable C syntax/algorithms. Complete programs are inline or linked.
- **Visualizer:** traversals, BST, AVL, B-Tree, heap, Red-Black, Huffman and trie; example trees, playback, variables and code.
- **Programs:** 31 complete C listings, including chapter examples; search, copy, download, sample input/output where provided.
- **Practice / Revise:** questions, formulas, complexity comparisons and exam revision.

The light layout includes chapter filtering, full-note search, stable topic numbers, a syllabus-focus filter, mobile navigation and expandable diagrams. Topic and program URLs support direct links. The library also distinguishes unordered binary-tree operations from BST operations.

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

The notes checker requires GCC on PATH. It checks topic/program links, renders each diagram specification, tests duplicate insertion into B-Trees, and syntax-checks all C listings with C11. It also compiles and runs the new unordered binary-tree program against sample, empty, single-node, missing-key, root/last-deletion and duplicate-value cases.

Generated executables, screenshots and logs belong in the ignored `.verification` directory. The check does not run every interactive C program end to end.

The visualizer currently animates B-Tree insertion. B-Tree deletion is explained separately with borrow, merge and root-shrink diagrams in Theory.
