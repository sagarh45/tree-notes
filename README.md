# Trees Lab - Unit IV

Local React/Vite study app for WIT's **25ITU3CC2T Data Structures, 2026-27**.

## Run

```sh
npm install
npm run dev
```

Open http://localhost:4321. If that port is occupied, use `npm run dev -- --port 4322`.

## Study Pages

- **Syllabus (home):** six master sections: Tree Basics, Binary Tree, Binary Search Tree, Multiway Trees, B Tree and AVL Tree. Topics progress from basics and creation to operations and advanced examples. Each topic keeps its theory, diagrams, algorithms, syntax and programs together.
- **Reference:** all 13 chapters and 54 source topics, including optional material outside the core syllabus.
- **Visualizer:** traversals, BST, AVL, B-Tree, heap, Red-Black, Huffman and trie; example trees, playback, variables and code.
- **Programs:** 36 complete C listings, including general-tree creation/subtree deletion, unbalanced multiway operations and full B-Tree deletion; also embedded in their matching topics. Source uses C syntax highlighting, a 17px default font, adjustable font size and optional line wrapping.
- **Practice / Revise:** questions, formulas, complexity comparisons and exam revision.

The light layout includes a master syllabus index, a mobile section selector, topic search, next/previous sections and straight directed tree edges. There are 121 prepared case sequences. Case players have step buttons, speed, autoplay, restart, a step slider and a transcript. LR/RL always include the intermediate rotation. AVL deletion includes all six child-balance cases. Old ten-point URLs redirect to their matching new sections. The library distinguishes unordered binary-tree operations from BST operations.

## C Program Execution

Every full listing has editable stdin, Run, Stop, sample reset, stdout and exit status. These are real C executables, not JavaScript simulations or prerecorded outputs. Source is read-only; syntax fragments without `main` are not standalone executables.

`predev` and `prebuild` compile each unique source to WASI WebAssembly using the build-only `@yowasp/clang` toolchain. A SHA-256 source hash addresses the matching executable. The browser downloads only the selected small executable and runs it in a dedicated worker using `@bjorn3/browser_wasi_shim`. No compiler API, user account or server-side code execution is required; stdin stays in the browser. [WASI runtime](https://github.com/bjorn3/browser_wasi_shim) and [compiler](https://github.com/YoWASP/clang) are dependencies with their respective licenses.

Execution has a 5-second limit after loading, 32 MB maximum WASM memory, 16,000 input characters and 64 KB output limits. Stop/navigation terminates the worker. Invalid or oversized C inputs can fail just as in native C; they cannot access the host filesystem or network. Generated `public/programs/*.wasm` files are ignored by Git and generated again on Vercel during the build.

## Syllabus And Notes

Coverage is matched to `../DS Syllabus Updated 2026.pdf` relative to the Unit IV folder: printed page 17, Unit IV, Trees (7 hours). The older `DS Syllabus.pdf` and `Updated SY Data Structure Syllabus WIT.pdf` specify the same Tree topics.

Required topics: definition, traversal, linked implementation, binary-tree and BST insert/delete/search, multiway trees, B-Trees, and AVL single/double rotations.

Supporting source files under `Final Notes` in the Unit IV folder:

- `Final/Tree Notes.pdf`, `Final/Tree Notes Part 1.pdf`, `Final/Tree Reference Book.pdf`
- `Final/BINARY SEARCH TREES.pdf`, `Final/AVL Trees.pdf`
- `Final/M- WAY TREES.pdf`, `Final/B-Trees.pdf`
- `DataStructures_Unit_3.pdf`, `chap7b.pdf`, `AVL Tree.pdf`
- Six TechVidvan PDFs covering trees, binary trees, C implementation, traversal, BST and AVL.

General trees, threaded trees, reconstruction and extended binary-tree operations are included in the matching six sections. Heaps, Huffman, Red-Black, trie and B+ remain extra reference reading. Supporting advanced topics are not a claim that every exercise is named in the official syllabus.

Height is counted in edges (leaf 0, empty tree -1). Some class notes use "complete" for "perfect" and "almost complete" for the usual complete-tree shape; the binary-tree chapter explains this naming difference.

## Checks

```sh
npm run lint
npm run build
npm run verify:notes
npm run verify:runner
```

The checkers require GCC on PATH. Notes checks render source and course diagrams, verify coverage, straight edges and rotation intermediate states, and syntax-check all 36 C listings. Randomized tests cover full-tree AVL traces, cascading deletion repair and 30 complete B-Tree C insert/search/delete runs. Runner checks execute every C sample in the same WASI runtime as the browser and compare stdout with native GCC, plus both rotation samples, custom input, error exits and 15 randomized multiway deletion runs.

Generated native executables, screenshots and logs belong in the ignored `.verification` directory. Build before running the runner checker so that the WASM executables exist.

The free-form visualizer animates B-Tree insertion. The B-Tree syllabus point contains prepared deletion case players (both borrow directions, merge, internal replacement and root shrink), plus a full order-4 C program. The deletion drawings use order 3 with bottom-up repair; the program uses minimum degree 2 with top-down repair, explicitly labelled in the lesson.

## Production

Canonical site: https://tree-notes1.vercel.app/

GitHub source branch: `trees-lab-syllabus-refresh`. The existing `main` branch is preserved and is not this redesign. Deploy explicitly to the existing `tree-notes1` project:

```sh
vercel link --yes --project tree-notes1 --scope sagar-somayya-hiremaths-projects
vercel deploy --prod --yes --project tree-notes1
```

The old `tree-notes` Vercel project was removed. Do not recreate it. Local verification files are excluded through both `.gitignore` and `.vercelignore`.
