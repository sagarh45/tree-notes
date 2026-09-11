import { Link } from 'react-router-dom'

export function HomePage() {
  return (
    <div>
      <div className="card home-hero">
        <h2>Trees — the notes that draw every model</h2>
        <p className="muted">
          Not a list of definitions. Every tree model is a <b>law</b> + a <b>trap</b> + a live picture. Core Unit IV
          (binary, BST, AVL, B-Tree) and the advanced models textbooks leave as a paragraph: Heap, Red-Black, Huffman,
          Trie, threads, expression trees, B+.
        </p>
      </div>

      <div className="home-cards home-cards-4">
        <Link to="/theory">
          <h3>📘 Theory</h3>
          <p className="muted">26 sections. Core exam notes + advanced models with dual pictures (tree + array, stack, codes).</p>
        </Link>
        <Link to="/lab">
          <h3>🎬 Visualizer</h3>
          <p className="muted">8 labs: Traversals (call stack), BST, AVL, B-Tree, Heap, Red-Black, Huffman, Trie.</p>
        </Link>
        <Link to="/programs">
          <h3>💻 Programs</h3>
          <p className="muted">C programs: menu / scanf. You type every key. Copy and run on OneCompiler.</p>
        </Link>
        <Link to="/practice">
          <h3>📝 Practice</h3>
          <p className="muted">MCQ, True/False, Fill in the blanks — including heap / RB / Huffman / trie traps.</p>
        </Link>
      </div>

      <div className="card">
        <h3>Learning path</h3>
        <ol>
          <li>
            <b>Core (Theory 1–16):</b> node → traversals → BST delete cases → AVL letters → B-Tree split.
          </li>
          <li>
            <b>Advanced (Theory 17–26):</b> recursion stack, expression, Huffman, heap-as-array, threads, Red-Black,
            trie, B+, reconstruction, master map.
          </li>
          <li>
            Open <b>Visualizer</b>. Core tabs first, then the teal advanced tabs. Play until the Law and the picture are
            the same object.
          </li>
          <li>Copy a <b>Program</b>, then finish <b>Practice</b>.</li>
        </ol>
      </div>

      <div className="card">
        <h3>Eight models, eight jobs</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Model</th>
              <th>Job</th>
              <th>The law</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>BST / AVL / RB</td>
              <td>Where is key k?</td>
              <td>Left &lt; node &lt; right (+ balance / colour)</td>
            </tr>
            <tr>
              <td>Heap</td>
              <td>What is the best?</td>
              <td>Complete array + parent ≥ children</td>
            </tr>
            <tr>
              <td>B-Tree / B+</td>
              <td>Search when a step costs a disk jump</td>
              <td>Fat nodes, leaves on one level (B+ leaves linked)</td>
            </tr>
            <tr>
              <td>Huffman</td>
              <td>Cheap names for frequent letters</td>
              <td>Merge two lightest; prefix-free codes</td>
            </tr>
            <tr>
              <td>Trie</td>
              <td>What continues this prefix?</td>
              <td>One letter per edge; time = word length</td>
            </tr>
            <tr>
              <td>Expression / Threaded</td>
              <td>Evaluate / inorder with no stack</td>
              <td>Operators inside; NULL pointers become successors</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
