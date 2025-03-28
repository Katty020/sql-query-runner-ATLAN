"use client"

import { useState } from "react"
import styles from "./results-table.module.css"
import type { Product } from "@/types/product"

interface ResultsTableProps {
  data: Product[]
}

export default function ResultsTable({ data }: ResultsTableProps) {
  const [sortField, setSortField] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [page, setPage] = useState(1)
  const rowsPerPage = 10

  const columnNames = data.length > 0 ? Array.from(new Set(data.flatMap((item) => Object.keys(item)))) : []

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
    setPage(1) 
  }

  const sortedData = [...data].sort((a, b) => {
    if (!sortField) return 0
    const aValue = a[sortField] !== undefined ? a[sortField] : ""
    const bValue = b[sortField] !== undefined ? b[sortField] : ""

    const aNum = Number.parseFloat(aValue)
    const bNum = Number.parseFloat(bValue)

    if (!isNaN(aNum) && !isNaN(bNum)) {
      return sortDirection === "asc" ? aNum - bNum : bNum - aNum
    }

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
    return 0
  })

  
  const totalPages = Math.ceil(sortedData.length / rowsPerPage)
  const paginatedData = sortedData.slice((page - 1) * rowsPerPage, page * rowsPerPage)

  if (data.length === 0) {
    return <div className={styles.noResults}>No results found</div>
  }

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columnNames.map((key) => (
              <th key={key} onClick={() => handleSort(key)} className={sortField === key ? styles.sorted : ""}>
                {key}
                {sortField === key && <span className={styles.sortIcon}>{sortDirection === "asc" ? " ↑" : " ↓"}</span>}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((row, rowIndex) => (
            <tr key={rowIndex} className={rowIndex % 2 === 0 ? styles.even : styles.odd}>
              {columnNames.map((key, colIndex) => (
                <td key={colIndex}>{row[key] !== undefined ? row[key] : ""}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className={styles.tableFooter}>
        <div className={styles.resultCount}>
          {data.length} {data.length === 1 ? "result" : "results"} found
        </div>

        {totalPages > 1 && (
          <div className={styles.pagination}>
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className={styles.pageButton}
            >
              Previous
            </button>
            <span className={styles.pageInfo}>
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className={styles.pageButton}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

