import { memo, useMemo, useState } from 'react'
import { BookOpen, Lightbulb, Network, Image, Calculator, ListOrdered, Braces, Pencil, FileCode2, Timer, Target, TriangleAlert, Play, Copy, Check, Download, type LucideIcon } from 'lucide-react'
import { PROGRAM_LINKS } from '../../data/syllabus/coverage'
import { PROGRAM_CATALOG } from '../../data/programCatalog'
import { topicCases } from '../../data/lessonCases'
import { LessonPlayer } from './LessonPlayer'
import { Link } from 'react-router-dom'
import type { Topic } from '../../data/syllabus/types'
import { TERM_CARDS } from '../../data/terms'
import { BinaryTreeSvg } from '../viz/BinaryTreeSvg'
import { Diagram } from './Diagram'

function Block({
  icon: Icon,
  label,
  tone,
  children,
}: {
  icon: LucideIcon
  label: string
  tone?: 'def' | 'simple' | 'algo' | 'code' | 'ex' | 'tip' | 'warn' | 'cx' | 'formula' | 'fig'
  children: React.ReactNode
}) {
  return (
    <section className={`tb tb-${tone ?? 'def'}`}>
      <div className="tb-head">
        <Icon className="tb-ico" size={17} aria-hidden="true" />
        <span>{label}</span>
      </div>
      <div className="tb-body">{children}</div>
    </section>
  )
}

function Code({ code, title, note }: { code: string; title?: string; note?: string }) {
  const [status, setStatus] = useState<'idle' | 'copied' | 'error'>('idle')
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setStatus('copied')
    } catch {
      setStatus('error')
    }
  }
  const download = () => {
    const url = URL.createObjectURL(new Blob([code], { type: 'text/x-c;charset=utf-8' }))
    const a = document.createElement('a')
    a.href = url
    a.download = title?.endsWith('.c') ? title : 'tree-example.c'
    a.click()
    window.setTimeout(() => URL.revokeObjectURL(url), 1000)
  }
  return (
    <div className="code-panel tb-code">
      <div className="head">
        <span>{title ?? 'C'}</span>
        <div className="row"><button type="button" className="icon-button" title="Download C file" aria-label="Download C file" onClick={download}><Download size={17} /></button><button type="button" className="icon-button" title={status === 'copied' ? 'Copied' : 'Copy code'} aria-label="Copy code" onClick={copy}>
          {status === 'copied' ? <Check size={17} /> : <Copy size={17} />}
        </button></div>
      </div>
      <pre>
        <code>{code}</code>
      </pre>
      <span className="copy-status" role="status">{status === 'copied' ? 'Code copied.' : status === 'error' ? 'Clipboard unavailable. Select the code to copy it.' : ''}</span>
      {note ? <div className="tb-code-note">{note}</div> : null}
    </div>
  )
}

function TermCards() {
  return (
    <div className="term-grid">
      {TERM_CARDS.map((t) => (
        <div className="term-mini" key={t.id} id={`term-${t.id}`}>
          <div className="term-name">{t.title}</div>
          <p className="term-mean">{t.meaning}</p>
          {t.root ? (
            <BinaryTreeSvg root={t.root} marks={t.marks} tags={t.tags} visitOrder={t.visitOrder} dimUnmarked compact />
          ) : null}
          {t.roots?.length ? (
            <div className="ex-row">
              {t.roots.map((r) => (
                <div key={r.title}>
                  <div className="pack-title">{r.title}</div>
                  <BinaryTreeSvg root={r.root} marks={r.marks} tags={r.tags} dimUnmarked compact />
                </div>
              ))}
            </div>
          ) : null}
          <p className="muted term-cap">{t.caption}</p>
          <div className="ex">
            <b>On this drawing:</b> {t.example}
          </div>
          <p className="term-exam">
            <b>Exam line:</b> {t.exam}
          </p>
        </div>
      ))}
    </div>
  )
}

const LAB_LABEL: Record<string, string> = {
  traversal: 'Traversals',
  bst: 'BST',
  avl: 'AVL',
  btree: 'B-Tree',
  heap: 'Heap',
  rbtree: 'Red-Black',
  huffman: 'Huffman',
  trie: 'Trie',
}

export const TopicCard = memo(function TopicCard({ topic, number, lesson = false }: { topic: Topic; number: string; lesson?: boolean }) {
  const programId = topic.program ? topic.id : PROGRAM_LINKS[topic.id]
  const program = topic.program ?? (lesson ? PROGRAM_CATALOG.find(p => p.id === programId) : undefined)
  const cases = useMemo(() => lesson ? topicCases(topic.id) : [], [lesson, topic.id])
  const [showReferences, setShowReferences] = useState(false)

  return (
    <article className="topic" id={topic.id}>
      <header className="topic-head">
        <span className="topic-num">{number}</span>
        <div>
          <h2>{topic.title}</h2>
          {topic.tagline ? <p className="muted topic-tag">{topic.tagline}</p> : null}
        </div>
        {topic.lab && !lesson ? (
          <Link className="btn play topic-lab" to={`/lab?tab=${topic.lab}`}>
            <Play size={16} aria-hidden="true" /> Visualize {LAB_LABEL[topic.lab] ?? topic.lab}
          </Link>
        ) : null}
      </header>

      <Block icon={BookOpen} label="Definition (write this in the exam)" tone="def">
        <p className="tb-def" dangerouslySetInnerHTML={{ __html: topic.definition }} />
      </Block>

      <Block icon={Lightbulb} label="In simple words" tone="simple">
        <div dangerouslySetInnerHTML={{ __html: topic.simple }} />
        {topic.points?.length ? (
          <ul className="tb-points">
            {topic.points.map((p, i) => (
              <li key={i} dangerouslySetInnerHTML={{ __html: p }} />
            ))}
          </ul>
        ) : null}
      </Block>

      {topic.termCards ? (
        <Block icon={Network} label="Every term, drawn on the same tree" tone="fig">
          <TermCards />
        </Block>
      ) : null}

      {cases.length ? <Block icon={Play} label="Step-by-step cases" tone="fig"><LessonPlayer cases={cases} /></Block> : null}
      {topic.diagrams?.length && (!cases.length || showReferences) ? (
        <Block icon={Image} label={cases.length ? 'Reference diagrams' : `Diagram${topic.diagrams.length > 1 ? 's' : ''}`} tone="fig">
          <div className="ex-row">
            {topic.diagrams.map((d, i) => (
              <Diagram d={d} key={i} />
            ))}
          </div>
        </Block>
      ) : null}
      {cases.length && topic.diagrams?.length ? <label className="reference-toggle"><input type="checkbox" checked={showReferences} onChange={e => setShowReferences(e.target.checked)} /> Reference diagrams</label> : null}

      {topic.formulas?.length ? (
        <Block icon={Calculator} label="Formulas" tone="formula">
          <ul className="tb-formulas">
            {topic.formulas.map((f, i) => (
              <li key={i} dangerouslySetInnerHTML={{ __html: f }} />
            ))}
          </ul>
        </Block>
      ) : null}

      {topic.algorithm?.map((a) => (
        <Block icon={ListOrdered} label={`Algorithm — ${a.title}`} tone="algo" key={a.title}>
          <ol className="tb-algo">
            {a.steps.map((s, i) => (
              <li key={i} dangerouslySetInnerHTML={{ __html: s }} />
            ))}
          </ol>
        </Block>
      ))}

      {topic.syntax?.length ? (
        <Block icon={Braces} label="Syntax (C)" tone="code">
          <div className="tb-syntax">
            {topic.syntax.map((s) => (
              <Code key={s.title} title={s.title} code={s.code} note={s.note} />
            ))}
          </div>
        </Block>
      ) : null}

      {topic.example ? (
        <Block icon={Pencil} label={`Worked example — ${topic.example.title}`} tone="ex">
          <div className="tb-example" dangerouslySetInnerHTML={{ __html: topic.example.html }} />
        </Block>
      ) : null}

      {program ? (
        <Block icon={FileCode2} label={`Example program — ${program.title}`} tone="code">
          <details className="program-disclosure" open={lesson ? true : undefined}>
            <summary>Full C program</summary>
              <Code title={`${programId ?? topic.id}.c`} code={program.code} />
              {program.input ? (
                <div className="tb-output">
                  <b>Input</b>
                  <pre>{program.input}</pre>
                </div>
              ) : null}
              {program.output ? (
                <div className="tb-output">
                  <b>Output</b>
                  <pre>{program.output}</pre>
                </div>
              ) : null}
          </details>
        </Block>
      ) : null}
      {programId && !lesson ? <Link className="topic-program-link" to={`/programs?program=${programId}`}><FileCode2 size={18} aria-hidden="true" /> Open complete C program</Link> : null}

      {topic.complexity?.length ? (
        <Block icon={Timer} label="Time complexity" tone="cx">
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Operation</th>
                  <th>Average</th>
                  <th>Worst</th>
                  <th>Why</th>
                </tr>
              </thead>
              <tbody>
                {topic.complexity.map((r) => (
                  <tr key={r.op}>
                    <td>{r.op}</td>
                    <td>{r.avg}</td>
                    <td>{r.worst}</td>
                    <td>{r.note ?? ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Block>
      ) : null}

      {topic.tips?.length ? (
        <Block icon={Target} label="Exam tips" tone="tip">
          <ul className="tb-points">
            {topic.tips.map((t, i) => (
              <li key={i} dangerouslySetInnerHTML={{ __html: t }} />
            ))}
          </ul>
        </Block>
      ) : null}

      {topic.mistakes?.length ? (
        <Block icon={TriangleAlert} label="Common mistakes" tone="warn">
          <ul className="tb-points">
            {topic.mistakes.map((t, i) => (
              <li key={i} dangerouslySetInnerHTML={{ __html: t }} />
            ))}
          </ul>
        </Block>
      ) : null}
    </article>
  )
})
