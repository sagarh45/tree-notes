import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { THEORY_FIGURES, type Fig } from '../data/figures'
import { PROGRAMS, type Program } from '../data/programs'
import { BinaryTreeSvg } from '../components/viz/BinaryTreeSvg'
import { BTreeSvg } from '../components/viz/BTreeSvg'
import { HeapDualViz } from '../components/viz/HeapDualViz'
import { TrieSvg } from '../components/viz/TrieSvg'
import { HuffmanPanel } from '../components/viz/HuffmanPanel'
import { withBalanceFactors } from '../lib/binaryTree'

type TeachingProgram = Pick<Program, 'id' | 'title' | 'source' | 'blurb' | 'code'>

type Topic = {
  id: string
  no: number
  title: string
  syllabusLine: string
  goal: string
  theory: ReactNode
  algorithm: ReactNode
  figureKeys: string[]
  maxFigures?: number
  programIds?: string[]
  programs?: TeachingProgram[]
  quickCheck: ReactNode
  live?: boolean
}

const NODE_PROGRAM: TeachingProgram = {
  id: 'node-basics',
  title: 'Linked node structure and createNode()',
  source: 'Foundation program',
  blurb: 'The minimum C code needed to represent one binary-tree node using links.',
  code: `#include <stdio.h>
#include <stdlib.h>

struct Node {
    int data;
    struct Node *left;
    struct Node *right;
};

struct Node *createNode(int value) {
    struct Node *n = (struct Node *)malloc(sizeof(struct Node));
    n->data = value;
    n->left = NULL;
    n->right = NULL;
    return n;
}

int main(void) {
    struct Node *root = createNode(50);
    printf("Root = %d\\n", root->data);
    free(root);
    return 0;
}`,
}

const LINKED_PROGRAM: TeachingProgram = {
  id: 'linked-representation',
  title: 'Linked representation of a binary tree',
  source: 'Node + pointers',
  blurb: 'Shows how DATA, LEFT and RIGHT fields are stored and connected through pointers.',
  code: `#include <stdio.h>
#include <stdlib.h>

struct Node {
    int data;
    struct Node *left;
    struct Node *right;
};

struct Node *newNode(int value) {
    struct Node *p = (struct Node *)malloc(sizeof(struct Node));
    p->data = value;
    p->left = NULL;
    p->right = NULL;
    return p;
}

int main(void) {
    struct Node *root = newNode(10);
    root->left = newNode(20);
    root->right = newNode(30);

    printf("Root: %d\\n", root->data);
    printf("Left child: %d\\n", root->left->data);
    printf("Right child: %d\\n", root->right->data);
    return 0;
}`,
}

const BINARY_OPS_PROGRAM: TeachingProgram = {
  id: 'binary-tree-operations',
  title: 'General Binary Tree: insert, search and delete',
  source: 'Level-order insertion + deepest-node deletion',
  blurb: 'A normal binary tree has no sorted rule. This version inserts in the first empty position, searches every branch and deletes by replacing the target with the deepest node.',
  code: `#include <stdio.h>
#include <stdlib.h>

struct Node {
    int data;
    struct Node *left, *right;
};

struct Node *newNode(int x) {
    struct Node *n = (struct Node *)malloc(sizeof(struct Node));
    n->data = x;
    n->left = n->right = NULL;
    return n;
}

struct Node *insertLevelOrder(struct Node *root, int x) {
    struct Node *q[100];
    int f = 0, r = 0;
    if (root == NULL) return newNode(x);
    q[r++] = root;
    while (f < r) {
        struct Node *cur = q[f++];
        if (cur->left == NULL) {
            cur->left = newNode(x);
            return root;
        }
        q[r++] = cur->left;
        if (cur->right == NULL) {
            cur->right = newNode(x);
            return root;
        }
        q[r++] = cur->right;
    }
    return root;
}

struct Node *searchBT(struct Node *root, int key) {
    if (root == NULL) return NULL;
    if (root->data == key) return root;
    struct Node *p = searchBT(root->left, key);
    if (p != NULL) return p;
    return searchBT(root->right, key);
}

struct Node *deleteBT(struct Node *root, int key) {
    struct Node *q[100], *parent[100];
    int f = 0, r = 0;
    struct Node *target = NULL, *cur = NULL, *par = NULL;
    if (root == NULL) return NULL;

    q[r] = root;
    parent[r] = NULL;
    r++;

    while (f < r) {
        cur = q[f];
        par = parent[f];
        f++;
        if (cur->data == key) target = cur;
        if (cur->left) {
            q[r] = cur->left;
            parent[r] = cur;
            r++;
        }
        if (cur->right) {
            q[r] = cur->right;
            parent[r] = cur;
            r++;
        }
    }

    if (target == NULL) return root;
    target->data = cur->data;

    if (par == NULL) {
        free(root);
        return NULL;
    }
    if (par->left == cur) par->left = NULL;
    else par->right = NULL;
    free(cur);
    return root;
}

void preorder(struct Node *root) {
    if (!root) return;
    printf("%d ", root->data);
    preorder(root->left);
    preorder(root->right);
}

int main(void) {
    struct Node *root = NULL;
    root = insertLevelOrder(root, 10);
    root = insertLevelOrder(root, 20);
    root = insertLevelOrder(root, 30);
    root = insertLevelOrder(root, 40);

    printf(searchBT(root, 30) ? "30 found\\n" : "30 not found\\n");
    root = deleteBT(root, 20);
    printf("After delete: ");
    preorder(root);
    return 0;
}`,
}

const MULTIWAY_PROGRAM: TeachingProgram = {
  id: 'multiway-node',
  title: 'Multiway node representation',
  source: 'More than two child pointers',
  blurb: 'A general multiway tree does not have one universal insertion rule. This code shows the node representation. B-Tree gives the ordered insertion rule in the next point.',
  code: `#include <stdio.h>
#define M 4

struct MNode {
    int keyCount;
    int keys[M - 1];
    struct MNode *child[M];
};

int main(void) {
    struct MNode root = {0};
    root.keyCount = 2;
    root.keys[0] = 20;
    root.keys[1] = 40;

    printf("Keys in root: %d %d\\n", root.keys[0], root.keys[1]);
    printf("Maximum child pointers for order %d = %d\\n", M, M);
    return 0;
}`,
}

const ROTATION_PROGRAM: TeachingProgram = {
  id: 'avl-rotations-only',
  title: 'AVL single and double rotation functions',
  source: 'LL / RR / LR / RL',
  blurb: 'The four cases reduce to two primitive rotations: rotateRight and rotateLeft. LR and RL simply combine them.',
  code: `struct Node *rotateRight(struct Node *z) {
    struct Node *y = z->left;
    struct Node *T3 = y->right;
    y->right = z;
    z->left = T3;
    updateHeight(z);
    updateHeight(y);
    return y;
}

struct Node *rotateLeft(struct Node *z) {
    struct Node *y = z->right;
    struct Node *T2 = y->left;
    y->left = z;
    z->right = T2;
    updateHeight(z);
    updateHeight(y);
    return y;
}

/* LL */
root = rotateRight(root);

/* RR */
root = rotateLeft(root);

/* LR */
root->left = rotateLeft(root->left);
root = rotateRight(root);

/* RL */
root->right = rotateRight(root->right);
root = rotateLeft(root);`,
}

const TOPICS: Topic[] = [
  {
    id: 'definition',
    no: 1,
    title: 'Tree Definition and Binary Tree Basics',
    syllabusLine: 'Definition',
    goal: 'Build the vocabulary first so every later algorithm has a clear meaning.',
    theory: (
      <>
        <p><b>Tree:</b> A tree is a non-linear hierarchical data structure made of nodes connected by edges. One node is the <b>root</b>. Every non-root node has exactly one parent and there is no cycle.</p>
        <div className="law"><b>Core law:</b> A tree with <b>n</b> nodes has exactly <b>n - 1</b> edges.</div>
        <p><b>Important terminology:</b> root, parent, child, sibling, leaf, internal node, ancestor, descendant, path, level, depth, height, degree and subtree.</p>
        <p><b>Binary Tree:</b> Every node can have at most two children, called <b>left child</b> and <b>right child</b>. A missing child is represented by NULL.</p>
        <ul>
          <li><b>Full binary tree:</b> every node has either 0 or 2 children.</li>
          <li><b>Complete binary tree:</b> all levels are filled except possibly the last, and the last level is filled left to right.</li>
          <li><b>Perfect binary tree:</b> all internal nodes have two children and all leaves are at the same level.</li>
          <li><b>Skewed tree:</b> each node has only one child, so the tree behaves like a linked list.</li>
        </ul>
        <div className="ex"><b>Example:</b> If a tree has 7 nodes, it has 6 edges. A perfect binary tree of height 2 has 1 + 2 + 4 = 7 nodes.</div>
      </>
    ),
    algorithm: (
      <>
        <p>This first point is conceptual, so there is no search or update algorithm yet. Teach it in this order:</p>
        <ol>
          <li>Draw one root node.</li>
          <li>Add children and identify parent-child relationships.</li>
          <li>Mark leaves and internal nodes.</li>
          <li>Count levels and find tree height.</li>
          <li>Convert the same example into a binary tree with LEFT and RIGHT links.</li>
        </ol>
      </>
    ),
    figureKeys: ['intro', 'sample', 'binary', 'shapes'],
    maxFigures: 10,
    programs: [NODE_PROGRAM],
    quickCheck: <><b>Before Point 2:</b> Students should be able to label root, leaf, parent, child, level and height on any small tree without help.</>,
  },
  {
    id: 'traversal',
    no: 2,
    title: 'Tree Traversal',
    syllabusLine: 'Traversal',
    goal: 'Understand exactly in which order nodes are visited and why each traversal produces a different output.',
    theory: (
      <>
        <p><b>Traversal</b> means visiting every node exactly once in a systematic order.</p>
        <table>
          <thead><tr><th>Traversal</th><th>Rule</th><th>Best memory line</th></tr></thead>
          <tbody>
            <tr><td>Preorder</td><td>Root - Left - Right</td><td>Process the root before its subtrees.</td></tr>
            <tr><td>Inorder</td><td>Left - Root - Right</td><td>For a BST, output is sorted.</td></tr>
            <tr><td>Postorder</td><td>Left - Right - Root</td><td>Process children before parent.</td></tr>
            <tr><td>Level order</td><td>Level by level</td><td>Use a queue.</td></tr>
          </tbody>
        </table>
        <div className="ex"><b>Trace example:</b> For root 4 with left subtree 2(1,3) and right subtree 6(5,7): Pre = 4 2 1 3 6 5 7, In = 1 2 3 4 5 6 7, Post = 1 3 2 5 7 6 4, Level = 4 2 6 1 3 5 7.</div>
        <p><b>Complexity:</b> Every traversal visits all n nodes, therefore time complexity is <b>O(n)</b>. Recursive DFS uses O(h) call-stack space where h is tree height.</p>
      </>
    ),
    algorithm: (
      <>
        <h4>Recursive algorithms</h4>
        <ol>
          <li><b>Preorder:</b> visit node, traverse left, traverse right.</li>
          <li><b>Inorder:</b> traverse left, visit node, traverse right.</li>
          <li><b>Postorder:</b> traverse left, traverse right, visit node.</li>
          <li><b>Level order:</b> put root in a queue; repeatedly remove one node, visit it and enqueue its children.</li>
        </ol>
        <div className="law"><b>Teaching trick:</b> Point to one node and say the three words out loud: ROOT-LEFT-RIGHT, LEFT-ROOT-RIGHT, LEFT-RIGHT-ROOT.</div>
      </>
    ),
    figureKeys: ['trav', 'nonrec'],
    maxFigures: 10,
    programIds: ['trav-user'],
    quickCheck: <><b>Before Point 3:</b> Give one 7-node tree. Students should write all four traversal outputs and explain each first three steps.</>,
    live: true,
  },
  {
    id: 'linked-implementation',
    no: 3,
    title: 'Linked Implementation of Binary Tree',
    syllabusLine: 'Linked implementation',
    goal: 'Connect the drawing on paper with the actual memory representation used in C.',
    theory: (
      <>
        <p>In linked representation, every node is a structure containing three logical fields: <b>LEFT pointer, DATA and RIGHT pointer</b>.</p>
        <pre className="tree-pic">[ LEFT | DATA | RIGHT ]</pre>
        <ul>
          <li>LEFT stores the address of the left child.</li>
          <li>DATA stores the value.</li>
          <li>RIGHT stores the address of the right child.</li>
          <li>If a child does not exist, its pointer is NULL.</li>
        </ul>
        <p><b>Why linked representation?</b> Memory is allocated only when a node is created. It works well for irregular and skewed trees where array representation would waste many positions.</p>
        <div className="ex"><b>Memory trace:</b> root stores the address of node 10. node 10.left points to node 20. node 10.right points to node 30. Leaf nodes have both links NULL.</div>
      </>
    ),
    algorithm: (
      <ol>
        <li>Allocate memory using <code>malloc(sizeof(struct Node))</code>.</li>
        <li>Store the given value in DATA.</li>
        <li>Initialize LEFT and RIGHT as NULL.</li>
        <li>Connect the returned pointer from its parent when inserting the node.</li>
      </ol>
    ),
    figureKeys: ['repr'],
    maxFigures: 8,
    programs: [LINKED_PROGRAM],
    quickCheck: <><b>Before Point 4:</b> Students should be able to draw the three-field node and explain what each pointer contains for root, internal node and leaf.</>,
  },
  {
    id: 'binary-tree-operations',
    no: 4,
    title: 'Operations on Binary Tree: Insert, Search and Delete',
    syllabusLine: 'Operations on Binary Trees: insert, delete, search operations',
    goal: 'Separate a general Binary Tree from a BST. A normal Binary Tree has no left-smaller/right-greater rule.',
    theory: (
      <>
        <p>A <b>general Binary Tree</b> only restricts each node to at most two children. It does not automatically define where a new key should go.</p>
        <p>For a common complete-style implementation, insertion is done at the <b>first empty position in level order</b>.</p>
        <ul>
          <li><b>Search:</b> compare the current node, then search left and right because values are not ordered.</li>
          <li><b>Insert:</b> use a queue and attach the new node at the first missing LEFT or RIGHT position.</li>
          <li><b>Delete:</b> find the target and the deepest-rightmost node, copy the deepest value to the target, then remove the deepest node.</li>
        </ul>
        <div className="law"><b>Important:</b> The three BST deletion cases are not the rule for an unordered Binary Tree. They belong to Point 5.</div>
        <p><b>Complexity:</b> Search, level-order insertion and deletion can require visiting all nodes, so worst-case time is <b>O(n)</b>.</p>
      </>
    ),
    algorithm: (
      <>
        <h4>Search</h4>
        <ol><li>If root is NULL, stop.</li><li>If root.data equals key, found.</li><li>Search left subtree.</li><li>If not found, search right subtree.</li></ol>
        <h4>Insert by level order</h4>
        <ol><li>Put root in queue.</li><li>Remove front node.</li><li>If LEFT is NULL, insert there; otherwise enqueue LEFT.</li><li>If RIGHT is NULL, insert there; otherwise enqueue RIGHT.</li><li>Repeat.</li></ol>
        <h4>Delete</h4>
        <ol><li>Find target node.</li><li>Find deepest-rightmost node.</li><li>Copy deepest value into target.</li><li>Detach and free deepest node.</li></ol>
      </>
    ),
    figureKeys: ['ops'],
    maxFigures: 8,
    programs: [BINARY_OPS_PROGRAM],
    quickCheck: <><b>Before Point 5:</b> Ask: “Why can we not decide left or right from the key value in a normal Binary Tree?” The answer should be: because there is no ordering property.</>,
    live: true,
  },
  {
    id: 'bst',
    no: 5,
    title: 'Binary Search Tree and its Operations',
    syllabusLine: 'Binary Search Trees: insert, delete, search operations',
    goal: 'Use the BST ordering rule to make search, insertion and deletion systematic.',
    theory: (
      <>
        <p><b>BST property:</b> For every node, all keys in the left subtree are smaller and all keys in the right subtree are greater.</p>
        <div className="law"><b>Most useful test:</b> Inorder traversal of a valid BST gives keys in sorted order.</div>
        <p><b>Search:</b> If key is smaller, move left. If larger, move right. One comparison removes an entire subtree from consideration.</p>
        <p><b>Insert:</b> Follow the same search path until a NULL link is reached and create the new leaf there.</p>
        <p><b>Delete has exactly three cases:</b></p>
        <ol>
          <li><b>Leaf:</b> remove the node.</li>
          <li><b>One child:</b> connect the parent directly to the child.</li>
          <li><b>Two children:</b> replace the node with inorder successor (minimum in right subtree) or predecessor, then delete that replacement key from its old position.</li>
        </ol>
        <p><b>Complexity:</b> O(h), where h is height. Balanced BST is about O(log n); skewed BST becomes O(n).</p>
      </>
    ),
    algorithm: (
      <>
        <h4>Search / Insert decision</h4>
        <ol><li>Compare key with current node.</li><li>Equal means found.</li><li>Smaller means go left.</li><li>Larger means go right.</li><li>For insertion, create node when NULL is reached.</li></ol>
        <h4>Delete decision</h4>
        <ol><li>First search for the key using BST comparisons.</li><li>Identify leaf, one-child or two-child case.</li><li>For two children, find minimum of right subtree.</li><li>Copy successor value and recursively delete the successor.</li></ol>
        <div className="ex"><b>Trace:</b> In 50,30,70,20,40,60,80, search 60 follows 50 → 70 → 60. Delete 50 uses successor 60.</div>
      </>
    ),
    figureKeys: ['bst', 'bst-ops'],
    maxFigures: 11,
    programIds: ['bst-menu'],
    quickCheck: <><b>Before Point 6:</b> Students should solve all three delete cases on paper and verify the final tree using inorder traversal.</>,
    live: true,
  },
  {
    id: 'multiway',
    no: 6,
    title: 'Multiway Trees',
    syllabusLine: 'Multiway Trees',
    goal: 'Move from two child pointers to many child pointers before learning the B-Tree rules.',
    theory: (
      <>
        <p>A <b>multiway tree</b> allows a node to have more than two children. One node can therefore hold or separate several ranges of data.</p>
        <p>If a multiway search node stores sorted keys <b>K1, K2, ..., Kq</b>, its child pointers represent value ranges such as less than K1, between K1 and K2, and greater than Kq.</p>
        <ul>
          <li><b>Order m:</b> maximum number of child pointers is m.</li>
          <li>Maximum number of keys is usually m - 1.</li>
          <li>Keys inside a node are kept sorted when the tree is used for searching.</li>
          <li>Fewer levels can be required because one node can branch in many directions.</li>
        </ul>
        <div className="ex"><b>Idea:</b> A binary node makes at most 2 choices. An order-4 multiway node can make up to 4 choices. This reduces height, which is important for disk-based indexing.</div>
      </>
    ),
    algorithm: (
      <ol>
        <li>Scan the sorted keys inside the current node.</li>
        <li>If the key is present, stop.</li>
        <li>Otherwise choose the child pointer whose range can contain the key.</li>
        <li>Repeat until found or a leaf is reached.</li>
      </ol>
    ),
    figureKeys: ['multi'],
    maxFigures: 8,
    programs: [MULTIWAY_PROGRAM],
    quickCheck: <><b>Before Point 7:</b> Students should explain why one multiway node can represent several search ranges and why this can reduce tree height.</>,
  },
  {
    id: 'btree',
    no: 7,
    title: 'B-Tree',
    syllabusLine: 'B trees',
    goal: 'Understand a balanced multiway search tree, especially insertion by splitting and promotion.',
    theory: (
      <>
        <p>A <b>B-Tree</b> is a height-balanced multiway search tree. Each node can store multiple sorted keys and multiple child pointers.</p>
        <p><b>Properties for order m:</b></p>
        <ul>
          <li>At most m children and at most m - 1 keys.</li>
          <li>Except the root, every internal node is at least about half full.</li>
          <li>All leaves occur at the same level.</li>
          <li>Keys inside every node remain sorted.</li>
          <li>Child subtrees represent non-overlapping key ranges.</li>
        </ul>
        <p><b>Search:</b> Search inside one node, then descend through exactly one child.</p>
        <p><b>Insertion:</b> Insert in the proper leaf. If a node overflows, split it and promote the middle key to the parent. Splitting may continue upward. If the root splits, tree height increases by one.</p>
        <p><b>Deletion:</b> If removal causes underflow, first try borrowing from a sibling. If borrowing is not possible, merge with a sibling and pull a separator key down from the parent.</p>
        <p><b>Complexity:</b> Search, insert and delete are O(log n) in height, with a very small height because each node has many children.</p>
      </>
    ),
    algorithm: (
      <>
        <h4>Insertion trace</h4>
        <ol><li>Locate correct leaf.</li><li>Insert key in sorted position.</li><li>If node is within capacity, stop.</li><li>If overflow occurs, split around median.</li><li>Promote median to parent.</li><li>Repeat upward if parent overflows.</li></ol>
        <h4>Deletion trace</h4>
        <ol><li>Find the key.</li><li>Delete directly from leaf when safe.</li><li>If node becomes too small, borrow from adjacent sibling if possible.</li><li>Otherwise merge nodes and move parent separator downward.</li><li>Continue repair upward if required.</li></ol>
      </>
    ),
    figureKeys: ['bsplit', 'bsearch', 'bdel'],
    maxFigures: 12,
    programIds: ['btree-user', 'bsearch-user'],
    quickCheck: <><b>Before Point 8:</b> Students should be able to explain the words overflow, split, median promotion, underflow, borrow and merge using one drawn example.</>,
    live: true,
  },
  {
    id: 'avl',
    no: 8,
    title: 'AVL Tree',
    syllabusLine: 'AVL Tree',
    goal: 'See how automatic balancing prevents a BST from becoming a long chain.',
    theory: (
      <>
        <p>An <b>AVL Tree</b> is a self-balancing Binary Search Tree. It keeps the normal BST ordering rule and additionally controls height.</p>
        <p><b>Balance Factor:</b> BF(node) = height(left subtree) - height(right subtree).</p>
        <div className="law"><b>AVL condition:</b> Every node must have BF equal to -1, 0 or +1. If BF becomes +2 or -2 after an update, a rotation is required.</div>
        <p>Insertion starts exactly like BST insertion. While returning toward the root, update node heights, compute balance factors and fix the first unbalanced ancestor.</p>
        <p>Deletion also begins as BST deletion, but several ancestors may become unbalanced, so rebalancing may continue upward.</p>
        <p><b>Complexity:</b> AVL height remains O(log n), therefore search, insertion and deletion are O(log n).</p>
      </>
    ),
    algorithm: (
      <ol>
        <li>Insert the key using normal BST rule.</li>
        <li>Update height of each ancestor.</li>
        <li>Compute BF = height(left) - height(right).</li>
        <li>If |BF| ≤ 1, no repair is needed.</li>
        <li>If BF is outside the range, identify LL, RR, LR or RL.</li>
        <li>Apply the required rotation and continue upward if necessary.</li>
      </ol>
    ),
    figureKeys: ['avl', 'avl-ops', 'avl-del'],
    maxFigures: 12,
    programIds: ['avl-user'],
    quickCheck: <><b>Before Point 9:</b> Given any node, students should calculate its balance factor and say whether it is left-heavy, balanced or right-heavy.</>,
    live: true,
  },
  {
    id: 'rotations',
    no: 9,
    title: 'Single and Double Rotations of AVL Tree',
    syllabusLine: 'Single and Double rotation of AVL Trees',
    goal: 'Finish the unit by mastering all four imbalance patterns and their exact correction.',
    theory: (
      <>
        <table>
          <thead><tr><th>Case</th><th>Where new key lies</th><th>Repair</th><th>Type</th></tr></thead>
          <tbody>
            <tr><td>LL</td><td>Left of left child</td><td>Right rotation</td><td>Single</td></tr>
            <tr><td>RR</td><td>Right of right child</td><td>Left rotation</td><td>Single</td></tr>
            <tr><td>LR</td><td>Right of left child</td><td>Left rotate child, then right rotate root</td><td>Double</td></tr>
            <tr><td>RL</td><td>Left of right child</td><td>Right rotate child, then left rotate root</td><td>Double</td></tr>
          </tbody>
        </table>
        <div className="ex"><b>Four shortest traces:</b> 30,20,10 → LL. 10,20,30 → RR. 30,10,20 → LR. 10,30,20 → RL.</div>
        <p><b>What a rotation must preserve:</b> BST inorder order must remain unchanged. Only local links and heights are rearranged.</p>
        <p><b>Single rotation:</b> one primitive left or right rotation. <b>Double rotation:</b> two primitive rotations because the heavy path bends in opposite directions.</p>
      </>
    ),
    algorithm: (
      <>
        <ol>
          <li>Find the first ancestor z with |BF(z)| &gt; 1.</li>
          <li>Look at the heavy child y.</li>
          <li>Look at the direction from y toward the inserted/deleted key.</li>
          <li>Same direction gives LL or RR, so use one rotation.</li>
          <li>Opposite direction gives LR or RL, so use two rotations.</li>
          <li>Reconnect the rotated subtree to its old parent.</li>
          <li>Update heights from bottom to top.</li>
        </ol>
        <div className="law"><b>Fast memory rule:</b> LL → Right, RR → Left, LR → Left then Right, RL → Right then Left.</div>
      </>
    ),
    figureKeys: ['rot'],
    maxFigures: 12,
    programs: [ROTATION_PROGRAM],
    quickCheck: <><b>Unit complete:</b> Students should identify all four cases only from insertion order and draw the tree before and after the rotation.</>,
    live: true,
  },
]

function FigureView({ fig }: { fig: Fig }) {
  if (fig.heap) return <HeapDualViz arr={fig.heap} compact />
  if (fig.trie) return <TrieSvg root={fig.trie} compact />
  if (fig.forest?.length) return <HuffmanPanel forest={fig.forest} codes={fig.codes} compact />
  if (fig.btree) return <BTreeSvg root={fig.btree} compact />
  return (
    <BinaryTreeSvg
      root={fig.showBf ? withBalanceFactors(fig.root ?? null) : (fig.root ?? null)}
      marks={fig.marks}
      tags={fig.tags}
      showBf={fig.showBf}
      showColor={fig.showColor}
      showIndex={fig.showIndex}
      showNulls={fig.showNulls}
      edgeLabels={fig.edgeLabels}
      threads={fig.threads}
      compact
    />
  )
}

function ProgramPanel({ program }: { program: TeachingProgram }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    await navigator.clipboard.writeText(program.code)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1000)
  }

  return (
    <details className="fn" open>
      <summary style={{ cursor: 'pointer', fontWeight: 800 }}>{program.title}</summary>
      <p className="muted" style={{ marginBottom: 8 }}>{program.source}</p>
      <p>{program.blurb}</p>
      <div className="row" style={{ marginBottom: 10 }}>
        <button type="button" className="btn gray" onClick={copy}>{copied ? 'Copied!' : 'Copy code'}</button>
        <button type="button" className="btn play" onClick={() => window.open('https://onecompiler.com/c', '_blank', 'noopener,noreferrer')}>Run C online</button>
      </div>
      <div className="code-panel">
        <div className="head"><span>{program.id}.c</span><span>C program</span></div>
        <pre>{program.code}</pre>
      </div>
    </details>
  )
}

function useActiveTopic() {
  const [active, setActive] = useState(TOPICS[0].id)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]
        if (hit) setActive(hit.target.id)
      },
      { rootMargin: '-18% 0px -68% 0px', threshold: 0 },
    )
    TOPICS.forEach((t) => {
      const el = document.getElementById(t.id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])
  return active
}

export function SyllabusPage() {
  const active = useActiveTopic()
  const programMap = useMemo(() => new Map(PROGRAMS.map((p) => [p.id, p])), [])

  return (
    <div className="theory-shell">
      <aside className="theory-rail" aria-label="Official syllabus points">
        <div className="rail-box">
          <div className="rail-head">
            <span className="rail-count">9</span>
            <div>
              <b>Official Syllabus Flow</b>
              <div className="muted rail-sub">7 hours · one point at a time</div>
            </div>
          </div>
          <nav className="rail-list">
            {TOPICS.map((t) => (
              <a key={t.id} href={`#${t.id}`} className={active === t.id ? 'on' : undefined}>
                <span className="rail-num">{t.no}</span>
                {t.title}
              </a>
            ))}
          </nav>
        </div>
      </aside>

      <div className="theory-main">
        <section className="card hero-band" id="top">
          <div className="hero-kicker">UNIT IV · TREES · 7 HOURS</div>
          <h2>Teach the syllabus in one continuous page</h2>
          <p className="muted">Every official syllabus point follows the same classroom order: <b>Theory → Algorithm / Steps → Visual Trace → C Program → Quick Check</b>. Finish one point completely, then move to the next.</p>
          <div className="law"><b>Official syllabus:</b> Definition, traversal, linked implementation, operations on Binary Trees and Binary Search Trees: insert, delete, search operations, Multiway Trees, B trees, AVL Tree: Single and Double rotation of AVL Trees.</div>
          <div className="stat-strip">
            <div className="stat"><b>9</b><span>syllabus points</span></div>
            <div className="stat"><b>1</b><span>teaching page</span></div>
            <div className="stat"><b>4</b><span>AVL rotation cases</span></div>
            <div className="stat"><b>3</b><span>BST delete cases</span></div>
          </div>
          <div className="row hero-actions">
            <Link className="btn play" to="/lab">Open Live Visualizer</Link>
            <Link className="btn enq" to="/programs">Open Program Library</Link>
            <Link className="btn gray" to="/practice">Practice Questions</Link>
          </div>
        </section>

        {TOPICS.map((topic) => {
          const figs = topic.figureKeys.flatMap((k) => THEORY_FIGURES[k] ?? []).slice(0, topic.maxFigures ?? 8)
          const savedPrograms = (topic.programIds ?? []).map((id) => programMap.get(id)).filter((p): p is Program => Boolean(p))
          const programs: TeachingProgram[] = [...savedPrograms, ...(topic.programs ?? [])]

          return (
            <article className="card theory-article" id={topic.id} key={topic.id}>
              <header className="art-head">
                <span className="art-badge g-core">SYLLABUS POINT {topic.no}</span>
                <h2><span className="art-num">{topic.no}</span>{topic.title}</h2>
                <p className="muted" style={{ marginBottom: 0 }}><b>Official wording:</b> {topic.syllabusLine}</p>
              </header>

              <div className="law"><b>Teaching goal:</b> {topic.goal}</div>

              <section className="theory-body">
                <div className="fig-head">1. Theory</div>
                {topic.theory}
              </section>

              <section className="theory-body">
                <div className="fig-head">2. Algorithm / Steps</div>
                {topic.algorithm}
              </section>

              {figs.length > 0 ? (
                <section>
                  <div className="fig-head">3. Visual Trace <span className="fig-pill">{figs.length} examples</span></div>
                  <div className="ex-row">
                    {figs.map((fig, index) => (
                      <figure className="ex-viz" key={`${topic.id}-${index}-${fig.title}`}>
                        <figcaption className="fig-title">Example {index + 1}: {fig.title}</figcaption>
                        <FigureView fig={fig} />
                        <p className="muted">{fig.caption}</p>
                      </figure>
                    ))}
                  </div>
                  {topic.live ? (
                    <div className="row" style={{ marginTop: 12 }}>
                      <Link className="btn play" to="/lab">Try this in the Live Visualizer</Link>
                    </div>
                  ) : null}
                </section>
              ) : null}

              {programs.length > 0 ? (
                <section className="theory-body">
                  <div className="fig-head">4. C Program</div>
                  {programs.map((program) => <ProgramPanel program={program} key={program.id} />)}
                </section>
              ) : null}

              <div className="tip-card" style={{ marginTop: 18 }}>{topic.quickCheck}</div>

              <div className="row" style={{ justifyContent: 'space-between', marginTop: 14 }}>
                <a className="to-top" href="#top">↑ syllabus index</a>
                {topic.no < TOPICS.length ? <a className="btn gray" href={`#${TOPICS[topic.no].id}`}>Next: {TOPICS[topic.no].title} →</a> : <Link className="btn play" to="/practice">Unit complete - Practice →</Link>}
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}
