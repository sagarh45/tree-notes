import { Link } from 'react-router-dom'

export function HomePage() {
  return (
    <div>
      <div className="card home-hero">
        <h2>Complete Trees Learning Package</h2>
        <p className="muted">
          Everything from Unit IV on a white page: every term with a drawn tree, every C function with full syntax.
          Programs take keys from you with scanf — no hard-coded A→left.
        </p>
      </div>

      <div className="home-cards home-cards-4">
        <Link to="/theory">
          <h3>📘 Theory</h3>
          <p className="muted">Definitions, linked nodes, traversals, BST cases, B-Tree splits, AVL BF and rotations.</p>
        </Link>
        <Link to="/lab">
          <h3>🎬 Visualizer</h3>
          <p className="muted">Traversals · BST · AVL · B-Tree with step playback, code highlight, variables.</p>
        </Link>
        <Link to="/programs">
          <h3>💻 Programs</h3>
          <p className="muted">C programs: menu / scanf. You type every key. Copy and run on OneCompiler.</p>
        </Link>
        <Link to="/practice">
          <h3>📝 Practice</h3>
          <p className="muted">MCQ, True/False, Fill in the blanks with explanations.</p>
        </Link>
      </div>

      <div className="card">
        <h3>Learning path (recommended)</h3>
        <ol>
          <li>
            Read <b>Theory</b> (tree words → binary node → traversals → BST delete cases → AVL letters → B-Tree split).
          </li>
          <li>
            Open <b>Visualizer</b> and run the same steps you just read.
          </li>
          <li>
            Copy a <b>Program</b> and run on OneCompiler.
          </li>
          <li>
            Finish with <b>Practice</b> quiz.
          </li>
        </ol>
      </div>

      <div className="card">
        <h3>This unit covers</h3>
        <ul>
          <li>Definition of a tree, root / leaf / height / degree</li>
          <li>Linked binary trees (LEFT | DATA | RIGHT)</li>
          <li>Traversals: pre-order, in-order, post-order, level-order</li>
          <li>BST: insert, search, delete (leaf / one child / two children)</li>
          <li>Multiway trees and B-Trees of order m</li>
          <li>AVL: balance factor, LL / RR / LR / RL</li>
        </ul>
      </div>
    </div>
  )
}
