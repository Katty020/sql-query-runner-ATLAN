"use client"

import type React from "react"

import { useState, useEffect } from "react"
import styles from "./query-editor.module.css"

interface QueryEditorProps {
  query: string
  onChange: (query: string) => void
  onExecute: () => void
  isExecuting: boolean
}

export default function QueryEditor({ query, onChange, onExecute, isExecuting }: QueryEditorProps) {
  const [isFocused, setIsFocused] = useState(false)
  const [highlightedQuery, setHighlightedQuery] = useState("")

  useEffect(() => {
    
    const highlighted = query
      .replace(
        /\b(SELECT|FROM|WHERE|AND|OR|BETWEEN|LIKE|IN|IS|NULL|NOT|ORDER BY|GROUP BY|HAVING|LIMIT|OFFSET|JOIN|INNER JOIN|LEFT JOIN|RIGHT JOIN|FULL JOIN|ON|AS|ASC|DESC)\b/gi,
        (match) => `<span class="${styles.keyword}">${match}</span>`,
      )
      .replace(/\b(COUNT|SUM|AVG|MIN|MAX|DISTINCT)\b/gi, (match) => `<span class="${styles.function}">${match}</span>`)
      .replace(/('[^']*'|"[^"]*")/g, (match) => `<span class="${styles.string}">${match}</span>`)
      .replace(/\b(\d+)\b/g, (match) => `<span class="${styles.number}">${match}</span>`)
      .replace(
        /\b(productID|productName|supplierID|categoryID|quantityPerUnit|unitPrice|unitsInStock|unitsOnOrder|reorderLevel|discontinued)\b/gi,
        (match) => `<span class="${styles.column}">${match}</span>`,
      )

    setHighlightedQuery(highlighted)
  }, [query])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault()
      onExecute()
    }
  }

  return (
    <div className={styles.editorContainer}>
      <h2>SQL Query Editor</h2>
      <div className={styles.editorHeader}>
        <span className={styles.editorTip}>Tip: Press Ctrl+Enter to execute query</span>
      </div>
      <div className={`${styles.editor} ${isFocused ? styles.focused : ""}`}>
        <textarea
          value={query}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter your SQL query here..."
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          className={styles.textarea}
          spellCheck={false}
        />
        <div className={styles.highlightLayer} dangerouslySetInnerHTML={{ __html: highlightedQuery }} />
      </div>
      <div className={styles.buttonContainer}>
        <button
          className={`${styles.executeButton} ${isExecuting ? styles.executing : ""}`}
          onClick={onExecute}
          disabled={isExecuting}
        >
          {isExecuting ? "Executing..." : "Execute Query"}
        </button>
      </div>
    </div>
  )
}

