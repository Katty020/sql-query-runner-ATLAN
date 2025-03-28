"use client"

import { useState } from "react"
import styles from "./query-selector.module.css"
import type { Product } from "@/types/product"

interface QueryItem {
  id: number
  name: string
  query: string
  filter: (product: Product) => boolean
}

interface QuerySelectorProps {
  queries: QueryItem[]
  onSelect: (query: QueryItem) => void
}

export default function QuerySelector({ queries, onSelect }: QuerySelectorProps) {
  const [activeQuery, setActiveQuery] = useState(1)

  const handleSelect = (query: QueryItem) => {
    setActiveQuery(query.id)
    onSelect(query)
  }

  return (
    <div className={styles.container}>
      <ul className={styles.queryList}>
        {queries.map((query) => (
          <li
            key={query.id}
            className={`${styles.queryItem} ${activeQuery === query.id ? styles.active : ""}`}
            onClick={() => handleSelect(query)}
          >
            {query.name}
          </li>
        ))}
      </ul>
    </div>
  )
}

