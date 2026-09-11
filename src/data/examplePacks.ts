export const BST_PACKS = [
  { id: 'p1', label: 'Ex1 · lecture keys 45,15,79,90,10,55,12,20,50', seq: [45, 15, 79, 90, 10, 55, 12, 20, 50] },
  { id: 'p2', label: 'Ex2 · skewed 10,20,30,40 (the O(n) trap)', seq: [10, 20, 30, 40] },
  { id: 'p3', label: 'Ex3 · balanced 50,30,70,20,40,60,80', seq: [50, 30, 70, 20, 40, 60, 80] },
  { id: 'p4', label: 'Ex4 · classic 8,3,10,1,6,14,4,7,13', seq: [8, 3, 10, 1, 6, 14, 4, 7, 13] },
  { id: 'p5', label: 'Ex5 · delete practice 25,15,50,10,22,35,70', seq: [25, 15, 50, 10, 22, 35, 70] },
  { id: 'p6', label: 'Ex6 · left-heavy 100,50,150,25,75', seq: [100, 50, 150, 25, 75] },
  { id: 'p7', label: 'Ex7 · perfect 40,20,60,10,30,50,70', seq: [40, 20, 60, 10, 30, 50, 70] },
  { id: 'p8', label: 'Ex8 · odd keys 9,5,15,1,7,12,20', seq: [9, 5, 15, 1, 7, 12, 20] },
  { id: 'p9', label: 'Ex9 · reverse-sorted 40,30,20,10 (left stick)', seq: [40, 30, 20, 10] },
  { id: 'p10', label: 'Ex10 · zig-zag 50,10,40,20,30', seq: [50, 10, 40, 20, 30] },
  { id: 'p11', label: 'Ex11 · fifteen keys, height 3', seq: [8, 4, 12, 2, 6, 10, 14, 1, 3, 5, 7, 9, 11, 13, 15] },
  { id: 'p12', label: 'Ex12 · tree sort input 5,3,8,1,4', seq: [5, 3, 8, 1, 4] },
]

export const AVL_PACKS = [
  { id: 'a1', label: 'Ex1 RR · 10,20,30 → left rotation', seq: [10, 20, 30] },
  { id: 'a2', label: 'Ex2 LL · 30,20,10 → right rotation', seq: [30, 20, 10] },
  { id: 'a3', label: 'Ex3 LR · 30,10,20 → double rotation', seq: [30, 10, 20] },
  { id: 'a4', label: 'Ex4 RL · 10,30,20 → double rotation', seq: [10, 30, 20] },
  { id: 'a5', label: 'Ex5 mix · 10,20,30,40,25', seq: [10, 20, 30, 40, 25] },
  { id: 'a6', label: 'Ex6 already bushy · 50,20,70,10,30,60,80', seq: [50, 20, 70, 10, 30, 60, 80] },
  { id: 'a7', label: 'Ex7 LL + RR in one run · 40,20,10,30,50,60', seq: [40, 20, 10, 30, 50, 60] },
  { id: 'a8', label: 'Ex8 sorted input · 1,2,3,4,5,6,7', seq: [1, 2, 3, 4, 5, 6, 7] },
  { id: 'a9', label: 'Ex9 solved Q2 · 10,20,30,40,50,25', seq: [10, 20, 30, 40, 50, 25] },
  { id: 'a10', label: 'Ex10 reverse sorted · 7,6,5,4,3,2,1', seq: [7, 6, 5, 4, 3, 2, 1] },
  { id: 'a11', label: 'Ex11 delete demo base · 20,10,30,25,40,35', seq: [20, 10, 30, 25, 40, 35] },
  { id: 'a12', label: 'Ex12 twelve keys, height 3', seq: [33, 13, 53, 9, 21, 61, 8, 11, 17, 1, 25, 30] },
]

export const BTREE_PACKS = [
  { id: 'b1', label: 'Ex1 · 10,20,5,6,12,30,7,17 (two root splits)', seq: [10, 20, 5, 6, 12, 30, 7, 17] },
  { id: 'b2', label: 'Ex2 · sorted 1..7 (overflow on the right)', seq: [1, 2, 3, 4, 5, 6, 7] },
  { id: 'b3', label: 'Ex3 · 50,25,75,10,30,60,80', seq: [50, 25, 75, 10, 30, 60, 80] },
  { id: 'b4', label: 'Ex4 · reverse 9,8,7,6,5', seq: [9, 8, 7, 6, 5] },
  { id: 'b5', label: 'Ex5 · 20,40,60,10,30,50,70', seq: [20, 40, 60, 10, 30, 50, 70] },
  { id: 'b6', label: 'Ex6 · even spacing 4,8,12,16,20,24', seq: [4, 8, 12, 16, 20, 24] },
  { id: 'b7', label: 'Ex7 · delete dry-run base 10,20,5,6,12,30', seq: [10, 20, 5, 6, 12, 30] },
  { id: 'b8', label: 'Ex8 · ten keys, height 2', seq: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
  { id: 'b9', label: 'Ex9 · alternating 15,5,25,10,20,30,1', seq: [15, 5, 25, 10, 20, 30, 1] },
  { id: 'b10', label: 'Ex10 · CLRS-flavour 1,3,7,10,11,13,14,15,18', seq: [1, 3, 7, 10, 11, 13, 14, 15, 18] },
]

export const HEAP_PACKS = [
  { id: 'h1', label: 'Ex1 · 10,20,5,30 (30 swims to the root)', seq: [10, 20, 5, 30] },
  { id: 'h2', label: 'Ex2 · heap-sort input 4,10,3,5,1', seq: [4, 10, 3, 5, 1] },
  { id: 'h3', label: 'Ex3 · sorted 1..7 — still complete', seq: [1, 2, 3, 4, 5, 6, 7] },
  { id: 'h4', label: 'Ex4 · not a BST: 50,30,40,10,20,35', seq: [50, 30, 40, 10, 20, 35] },
  { id: 'h5', label: 'Ex5 · reverse sorted 7,6,5,4,3,2,1', seq: [7, 6, 5, 4, 3, 2, 1] },
  { id: 'h6', label: 'Ex6 · ten keys, height 3', seq: [15, 12, 9, 30, 7, 25, 40, 3, 18, 22] },
  { id: 'h7', label: 'Ex7 · duplicates allowed 8,8,5,8,3', seq: [8, 8, 5, 8, 3] },
  { id: 'h8', label: 'Ex8 · priority queue demo 5,1,9,3,7', seq: [5, 1, 9, 3, 7] },
]

export const RB_PACKS = [
  { id: 'r1', label: 'Ex1 · 10,20,30 (RR line, recolor + rotate)', seq: [10, 20, 30] },
  { id: 'r2', label: 'Ex2 · 30,20,10 (LL line)', seq: [30, 20, 10] },
  { id: 'r3', label: 'Ex3 · 10,30,20 (triangle → two rotations)', seq: [10, 30, 20] },
  { id: 'r4', label: 'Ex4 · CLRS 7,3,18,10,22,8,11,26', seq: [7, 3, 18, 10, 22, 8, 11, 26] },
  { id: 'r5', label: 'Ex5 · red uncle recolor 50,30,70,20', seq: [50, 30, 70, 20] },
  { id: 'r6', label: 'Ex6 · sorted 1..7 (compare with AVL)', seq: [1, 2, 3, 4, 5, 6, 7] },
  { id: 'r7', label: 'Ex7 · 41,38,31,12,19,8', seq: [41, 38, 31, 12, 19, 8] },
  { id: 'r8', label: 'Ex8 · ten keys, count the black-height', seq: [13, 8, 17, 1, 11, 15, 25, 6, 22, 27] },
]

export const HUFF_PACKS = [
  { id: 'hf1', label: 'Tiny · A:4 B:2 C:1 D:1', text: 'A:4,B:2,C:1,D:1' },
  { id: 'hf2', label: 'CLRS · A:5 B:9 C:12 D:13 E:16 F:45', text: 'A:5,B:9,C:12,D:13,E:16,F:45' },
  { id: 'hf3', label: 'Exam · a:3 b:3 c:2 d:1', text: 'a:3,b:3,c:2,d:1' },
  { id: 'hf4', label: 'Equal weights · a:1 b:1 c:1 d:1', text: 'a:1,b:1,c:1,d:1' },
  { id: 'hf5', label: 'Fibonacci · a:1 b:1 c:2 d:3 e:5 f:8', text: 'a:1,b:1,c:2,d:3,e:5,f:8' },
  { id: 'hf6', label: 'One dominant letter · e:60 t:20 a:10 o:6 i:4', text: 'e:60,t:20,a:10,o:6,i:4' },
  { id: 'hf7', label: 'Word “abracadabra” counts', text: 'a:5,b:2,r:2,c:1,d:1' },
]

export const TRIE_PACKS = [
  { id: 'tr1', label: 'cat, car, cart, dog (END is a flag)', words: ['cat', 'car', 'cart', 'dog'] },
  { id: 'tr2', label: 'to, tea, ted, ten, a, i, in, inn', words: ['to', 'tea', 'ted', 'ten', 'a', 'i', 'in', 'inn'] },
  { id: 'tr3', label: 'she, sells, sea, shells', words: ['she', 'sells', 'sea', 'shells'] },
  { id: 'tr4', label: 'do, dog, doge, dodge', words: ['do', 'dog', 'doge', 'dodge'] },
  { id: 'tr5', label: 'bat, bath, bad, bag, ban', words: ['bat', 'bath', 'bad', 'bag', 'ban'] },
  { id: 'tr6', label: 'tree, trie, try, true', words: ['tree', 'trie', 'try', 'true'] },
]

export const TRAV_PACKS = [
  { id: 't1', label: 'Ex1 · balanced 4,2,6,1,3,5,7', seq: [4, 2, 6, 1, 3, 5, 7] },
  { id: 't2', label: 'Ex2 · right skew 1,2,3,4 (stack = stick)', seq: [1, 2, 3, 4] },
  { id: 't3', label: 'Ex3 · classic 8,3,10,1,6,14,4,7,13', seq: [8, 3, 10, 1, 6, 14, 4, 7, 13] },
  { id: 'ic4', label: 'Ex4 · 50,30,70,20,40', seq: [50, 30, 70, 20, 40] },
  { id: 't5', label: 'Ex5 · 40,20,60,10,30', seq: [40, 20, 60, 10, 30] },
  { id: 't6', label: 'Ex6 · 15,10,20,8,12,17,25', seq: [15, 10, 20, 8, 12, 17, 25] },
  { id: 't7', label: 'Ex7 · left skew 4,3,2,1', seq: [4, 3, 2, 1] },
  { id: 't8', label: 'Ex8 · perfect 15 keys (height 3)', seq: [8, 4, 12, 2, 6, 10, 14, 1, 3, 5, 7, 9, 11, 13, 15] },
  { id: 't9', label: 'Ex9 · single node 42', seq: [42] },
  { id: 't10', label: 'Ex10 · threads demo 20,10,30,5,15,25,35', seq: [20, 10, 30, 5, 15, 25, 35] },
]
