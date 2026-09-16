import type { Chapter } from './types'

export const CH10_HEAP: Chapter = {
  id: 'ch10',
  number: 10,
  title: 'Heap and heap sort',
  syllabus: 'Binary heap · array representation · swim / sink · heap sort · priority queue',
  emoji: '⛰️',
  topics: [
    {
      id: 'heap-def',
      title: 'Heap — the array IS the tree',
      tagline: 'Complete shape + parent ≥ children. No pointers needed.',
      definition:
        'A <b>binary heap</b> is a <b>complete</b> binary tree stored in an <b>array</b>, plus one extra order: in a <b>max-heap</b> every parent is ≥ both children (in a min-heap, ≤). There are no left/right pointers. Index formulas replace them: for 0-based index i, parent = floor((i−1)/2), left = 2i+1, right = 2i+2.',
      simple: `
<p>Two laws, not one:</p>
<ul>
<li><b>Shape law:</b> fill level by level, left to right. The array has no holes. Insert = append at the end. Delete-max = move the last item to the root and shrink.</li>
<li><b>Order law:</b> parent ≥ children. After append the new key may be too big → <b>swim / sift-up</b>. After extract the new root may be too small → <b>sink / sift-down</b> (swap with the <i>larger</i> child).</li>
</ul>
<p>Students draw a tree OR an array. The point is they are the <b>same object</b>.</p>`,
      diagrams: [
        {
          kind: 'heap',
          title: 'Max-heap after inserting 10, 20, 5, 30',
          seq: [10, 20, 5, 30],
          caption: 'Array [30, 20, 5, 10]. Root 30 is the maximum. Parent of index 3 (10) is index 1 (20).',
        },
        {
          kind: 'heap',
          title: 'Insert 10, 20, 5, 30, 15 — tree and array stay twins',
          seq: [10, 20, 5, 30, 15],
        },
      ],
      algorithm: [
        {
          title: 'insert(key) — append, then swim',
          steps: [
            'Put the key at a[n], then n++. The tree stays complete for free.',
            'While the key is bigger than its parent: swap with the parent (swim).',
            'Stop when the parent is larger, or you reach the root.',
          ],
        },
        {
          title: 'extractMax() — steal the last leaf, then sink',
          steps: [
            'Answer = a[0] (the root) — O(1) to read.',
            'Move a[n−1] into a[0], then n−−.',
            'Sink the new root: while a child is larger, swap with the <b>larger</b> child.',
          ],
        },
      ],
      syntax: [
        {
          title: 'Index helpers + swim + sink (0-based)',
          code: `int parent(int i) { return (i - 1) / 2; }
int left(int i)   { return 2 * i + 1; }
int right(int i)  { return 2 * i + 2; }

void swim(int a[], int i) {            /* used by insert */
    while (i > 0 && a[i] > a[parent(i)]) {
        int t = a[i]; a[i] = a[parent(i)]; a[parent(i)] = t;
        i = parent(i);
    }
}

void sink(int a[], int n, int i) {     /* used by extract / heapify */
    for (;;) {
        int big = i, L = left(i), R = right(i);
        if (L < n && a[L] > a[big]) big = L;
        if (R < n && a[R] > a[big]) big = R;   /* LARGER child */
        if (big == i) return;
        int t = a[i]; a[i] = a[big]; a[big] = t;
        i = big;
    }
}`,
        },
      ],
      example: {
        title: 'insert 10, 20, 5, 30 then extract-max',
        html: `
<table class="table"><thead><tr><th>Op</th><th>Array</th><th>Why</th></tr></thead><tbody>
<tr><td>insert 10</td><td>[10]</td><td>first key = root</td></tr>
<tr><td>insert 20</td><td>[10, 20] → <b>[20, 10]</b></td><td>20 &gt; parent 10 → swim</td></tr>
<tr><td>insert 5</td><td>[20, 10, 5]</td><td>5 &lt; 20, stay</td></tr>
<tr><td>insert 30</td><td>[20, 10, 5, 30] → [20, 30, 5, 10] → <b>[30, 20, 5, 10]</b></td><td>30 swims past 10, then past 20</td></tr>
<tr><td>extract-max</td><td>answer 30; hole filled by 10 → [10, 20, 5] → sink → <b>[20, 10, 5]</b></td><td>larger child of 10 is 20</td></tr>
</tbody></table>`,
      },
      formulas: [
        'Height of n nodes = <b>floor(log₂ n)</b> — a complete tree cannot be a stick.',
        'Insert / extract = O(log n). Peek max = <b>O(1)</b>.',
      ],
      complexity: [
        { op: 'Peek max / min', avg: 'O(1)', worst: 'O(1)', note: 'Always index 0' },
        { op: 'Insert / extract', avg: 'O(log n)', worst: 'O(log n)', note: 'Height of a complete tree' },
        { op: 'Search an arbitrary key', avg: 'O(n)', worst: 'O(n)', note: 'Not a search tree' },
      ],
      lab: 'heap',
      mistakes: [
        'Calling a heap a BST. In-order of a heap is <b>not</b> sorted. 40 can sit left of 20.',
        'Sinking by swapping with the smaller child. Always pick the <b>larger</b> child in a max-heap.',
        '“Extract-max walks to a leaf and deletes it.” No — max is index 0. You steal the last leaf to fill the hole.',
      ],
    },

    {
      id: 'heap-sort',
      title: 'Heap sort and tree sort',
      tagline: 'Two ways a tree can sort. Heap sort is the one that is always O(n log n) and in-place.',
      definition:
        '<b>Tree sort</b> inserts every key into a BST and then prints <b>in-order</b>. <b>Heap sort</b> builds a max-heap in the array, then repeatedly swaps the root to the back and shrinks the heap. Tree sort needs extra memory and can become O(n²) on sorted input. Heap sort is <b>in-place</b> and <b>always O(n log n)</b>.',
      simple: `<p>Tree sort = “build a BST, read it left to right.” Heap sort = “make a heap, then pull the maximum n times, dropping each one at the end of the array.”</p>`,
      diagrams: [
        {
          kind: 'heap',
          title: 'After build-heap on 4, 10, 3, 5, 1 → [10, 5, 3, 4, 1]',
          seq: [4, 10, 3, 5, 1],
          caption: 'Root 10 is the max. Heap sort will now swap 10 with 1, shrink, and sink.',
        },
        {
          kind: 'traversal',
          title: 'Tree sort of 5, 3, 8, 1, 4 — in-order is the sorted list',
          seq: [5, 3, 8, 1, 4],
          order: 'inorder',
        },
      ],
      algorithm: [
        {
          title: 'build_heap(a, n) — O(n), not O(n log n)',
          steps: [
            'Start from the last internal node, index n/2 − 1.',
            'sink / heapify that node, then n/2 − 2, … down to 0.',
            'Leaves (the second half of the array) are already legal one-node heaps — skip them.',
          ],
        },
        {
          title: 'heap_sort(a, n)',
          steps: [
            'build_heap on the whole array.',
            'For i = n−1 down to 1: swap a[0] with a[i] (max goes to its final place).',
            'Shrink the heap to size i and sink the new root (heapify(a, i, 0) — reduced size).',
            'Array is now sorted ascending.',
          ],
        },
      ],
      syntax: [
        {
          title: 'heapify + heap_sort',
          code: `void heapify(int a[], int n, int i) {
    int big = i, l = 2 * i + 1, r = 2 * i + 2, t;
    if (l < n && a[l] > a[big]) big = l;
    if (r < n && a[r] > a[big]) big = r;
    if (big != i) {
        t = a[i]; a[i] = a[big]; a[big] = t;
        heapify(a, n, big);
    }
}

void heap_sort(int a[], int n) {
    int i, t;
    for (i = n / 2 - 1; i >= 0; i--) heapify(a, n, i);   /* build O(n) */
    for (i = n - 1; i > 0; i--) {
        t = a[0]; a[0] = a[i]; a[i] = t;                  /* max to back */
        heapify(a, i, 0);                                 /* size = i   */
    }
}`,
        },
      ],
      program: {
        title: 'heap_sort — keys from the user',
        code: `#include <stdio.h>

void heapify(int a[], int n, int i) {
    int big = i, l = 2 * i + 1, r = 2 * i + 2, t;
    if (l < n && a[l] > a[big]) big = l;
    if (r < n && a[r] > a[big]) big = r;
    if (big != i) {
        t = a[i]; a[i] = a[big]; a[big] = t;
        heapify(a, n, big);
    }
}

void heap_sort(int a[], int n) {
    int i, t;
    for (i = n / 2 - 1; i >= 0; i--) heapify(a, n, i);
    for (i = n - 1; i > 0; i--) {
        t = a[0]; a[0] = a[i]; a[i] = t;
        heapify(a, i, 0);
    }
}

int main() {
    int a[100], n, i;
    printf("How many keys? ");
    scanf("%d", &n);
    printf("Enter %d keys: ", n);
    for (i = 0; i < n; i++) scanf("%d", &a[i]);
    heap_sort(a, n);
    printf("Sorted: ");
    for (i = 0; i < n; i++) printf("%d ", a[i]);
    printf("\\n");
    return 0;
}`,
        input: `How many keys? 5
Enter 5 keys: 4 10 3 5 1`,
        output: `Sorted: 1 3 4 5 10`,
      },
      example: {
        title: 'dry run on 4, 10, 3, 5, 1',
        html: `
<ol>
<li><b>Build:</b> last internal i = 1 → heapify at 10 (children 5, 1) already fine. i = 0 → 4 vs larger child 10 → swap → [10, 4, 3, 5, 1] → sink 4 vs 5 → <b>[10, 5, 3, 4, 1]</b>.</li>
<li>Swap 10 ↔ 1 → [1, 5, 3, 4, <b>10</b>]. Heapify first 4 → [5, 4, 3, 1, 10].</li>
<li>Swap 5 ↔ 1 → [1, 4, 3, <b>5</b>, 10]. Heapify first 3 → [4, 1, 3, 5, 10].</li>
<li>Swap 4 ↔ 3 → [3, 1, <b>4</b>, 5, 10]. Then 3 ↔ 1 → <b>[1, 3, 4, 5, 10]</b>.</li>
</ol>`,
      },
      formulas: [
        'build-heap is <b>O(n)</b>: half the nodes are leaves (0 work), a quarter sink 1 level, an eighth sink 2… the sum converges to about 2n.',
        'heap sort = O(n) build + (n−1) × O(log n) extract = <b>O(n log n)</b> always.',
      ],
      lab: 'heap',
      mistakes: [
        'Using a min-heap and expecting ascending order. Max-heap + “max to the back” gives ascending.',
        'Heapifying with the old size n after the swap — the sorted tail gets pulled back in. Use the reduced size.',
        'Saying tree sort is always O(n log n). Sorted input makes a stick → O(n²).',
      ],
    },

    {
      id: 'heap-pq',
      title: 'Priority queue — why heaps exist',
      tagline: '“Give me the best item” in O(1), then fix in O(log n).',
      definition:
        'A <b>priority queue</b> serves the <b>highest-priority</b> item, not the oldest one. A binary heap implements it with O(log n) insert and O(log n) extract-max (peek is O(1)).',
      simple: `<p>An unsorted array inserts in O(1) but finding the max is O(n). A sorted array finds the max in O(1) but inserting is O(n). A heap splits the difference: both operations O(log n).</p>`,
      diagrams: [
        {
          kind: 'heap',
          title: 'OS-style priorities: 3, 9, 4, 7, 1 → max 9 at the root',
          seq: [3, 9, 4, 7, 1],
          caption: 'Scheduler always peeks index 0. After extract, 1 moves to the root and sinks.',
        },
      ],
      example: {
        title: 'where you have already used it',
        html: `
<table class="table"><thead><tr><th>Job</th><th>Heap type</th><th>What you extract</th></tr></thead><tbody>
<tr><td>Dijkstra / Prim</td><td>min-heap</td><td>cheapest pending vertex / edge</td></tr>
<tr><td>OS scheduler</td><td>max-heap</td><td>highest-priority ready process</td></tr>
<tr><td>Huffman coding</td><td>min-heap</td><td>the two lightest trees, every step</td></tr>
<tr><td>Heap sort</td><td>max-heap</td><td>the next largest key, n times</td></tr>
</tbody></table>`,
      },
      complexity: [
        { op: 'Unsorted array PQ', avg: 'insert O(1)', worst: 'extract O(n)', note: 'Scan for the max' },
        { op: 'Sorted array PQ', avg: 'insert O(n)', worst: 'extract O(1)', note: 'Shift to keep order' },
        { op: 'Binary heap PQ', avg: 'O(log n)', worst: 'O(log n)', note: 'Both operations' },
      ],
      lab: 'heap',
      tips: ['Viva line: “A heap is not a search tree. It answers ‘what is the best?’, not ‘where is key k?’.”'],
    },
  ],
}
