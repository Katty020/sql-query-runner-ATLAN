"use client"

import { useEffect, useState } from "react"
import QueryEditor from "@/components/query-editor"
import ResultsTable from "@/components/results-table"
import QuerySelector from "@/components/query-selector"
import styles from "./page.module.css"
import { fetchProductsData } from "@/lib/data"
import type { Product } from "@/types/product"

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [currentQuery, setCurrentQuery] = useState("")
  const [queryResults, setQueryResults] = useState<Product[]>([])
  const [isExecuting, setIsExecuting] = useState(false)

  const predefinedQueries = [
    {
      id: 1,
      name: "All Products",
      query: "SELECT * FROM products",
      filter: (product: Product) => true,
    },
    {
      id: 2,
      name: "Products with Stock < 10",
      query: "SELECT * FROM products WHERE unitsInStock < 10",
      filter: (product: Product) => Number.parseInt(product.unitsInStock) < 10,
    },
    {
      id: 3,
      name: "Expensive Products (Price > 50)",
      query: "SELECT * FROM products WHERE unitPrice > 50",
      filter: (product: Product) => Number.parseFloat(product.unitPrice) > 50,
    },
    {
      id: 4,
      name: "Products on Order",
      query: "SELECT * FROM products WHERE unitsOnOrder > 0",
      filter: (product: Product) => Number.parseInt(product.unitsOnOrder) > 0,
    },
    {
      id: 5,
      name: "Discontinued Products",
      query: "SELECT * FROM products WHERE discontinued = '1'",
      filter: (product: Product) => product.discontinued === "1",
    },
    {
      id: 6,
      name: "Products with Low Stock",
      query: "SELECT * FROM products WHERE unitsInStock <= reorderLevel",
      filter: (product: Product) => Number.parseInt(product.unitsInStock) <= Number.parseInt(product.reorderLevel),
    },
    {
      id: 7,
      name: "Products by Category 1",
      query: "SELECT * FROM products WHERE categoryID = '1'",
      filter: (product: Product) => product.categoryID === "1",
    },
    {
      id: 8,
      name: "Products by Category 2",
      query: "SELECT * FROM products WHERE categoryID = '2'",
      filter: (product: Product) => product.categoryID === "2",
    },
    {
      id: 9,
      name: "Products with High Inventory",
      query: "SELECT * FROM products WHERE unitsInStock > 100",
      filter: (product: Product) => Number.parseInt(product.unitsInStock) > 100,
    },
    {
      id: 10,
      name: "Products with Price Between 20-50",
      query: "SELECT * FROM products WHERE unitPrice BETWEEN 20 AND 50",
      filter: (product: Product) => {
        const price = Number.parseFloat(product.unitPrice)
        return price >= 20 && price <= 50
      },
    },
    {
      id: 11,
      name: "Products by Supplier 1",
      query: "SELECT * FROM products WHERE supplierID = '1'",
      filter: (product: Product) => product.supplierID === "1",
    },
    {
      id: 12,
      name: "Products with 'Chef' in name",
      query: "SELECT * FROM products WHERE productName LIKE '%Chef%'",
      filter: (product: Product) => product.productName.includes("Chef"),
    },
    {
      id: 13,
      name: "Products with No Orders",
      query: "SELECT * FROM products WHERE unitsOnOrder = '0' AND discontinued = '0'",
      filter: (product: Product) => product.unitsOnOrder === "0" && product.discontinued === "0",
    },
    {
      id: 14,
      name: "Critical Stock (Stock < 5)",
      query: "SELECT * FROM products WHERE unitsInStock < 5 AND discontinued = '0'",
      filter: (product: Product) => Number.parseInt(product.unitsInStock) < 5 && product.discontinued === "0",
    },
    {
      id: 15,
      name: "High Value Inventory",
      query: "SELECT * FROM products WHERE (unitPrice * unitsInStock) > 1000",
      filter: (product: Product) => Number.parseFloat(product.unitPrice) * Number.parseInt(product.unitsInStock) > 1000,
    },
    {
      id: 16,
      name: "Products by Category 3",
      query: "SELECT * FROM products WHERE categoryID = '3'",
      filter: (product: Product) => product.categoryID === "3",
    },
    {
      id: 17,
      name: "Products by Category 4",
      query: "SELECT * FROM products WHERE categoryID = '4'",
      filter: (product: Product) => product.categoryID === "4",
    },
    {
      id: 18,
      name: "Expensive Discontinued",
      query: "SELECT * FROM products WHERE unitPrice > 40 AND discontinued = '1'",
      filter: (product: Product) => Number.parseFloat(product.unitPrice) > 40 && product.discontinued === "1",
    },
    {
      id: 19,
      name: "Products in Boxes",
      query: "SELECT * FROM products WHERE quantityPerUnit LIKE '%box%'",
      filter: (product: Product) => product.quantityPerUnit.toLowerCase().includes("box"),
    },
    {
      id: 20,
      name: "Products in Packages",
      query: "SELECT * FROM products WHERE quantityPerUnit LIKE '%pkg%'",
      filter: (product: Product) => product.quantityPerUnit.toLowerCase().includes("pkg"),
    },
  ]

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchProductsData()
        setProducts(data)
        // Initialize with first query
        handleQuerySelect(predefinedQueries[0])
        setLoading(false)
      } catch (error) {
        console.error("Failed to load products data:", error)
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const handleQuerySelect = (queryItem: (typeof predefinedQueries)[0]) => {
    setCurrentQuery(queryItem.query)
    // Simulate query execution with the filter
    setQueryResults(products.filter(queryItem.filter))
  }

  // Update the executeQuery function to handle more query types
  const executeQuery = () => {
    setIsExecuting(true)

    // Simple SQL parser for basic queries
    setTimeout(() => {
      try {
        const query = currentQuery.toLowerCase().trim()
        let results: Product[] = []

        // Check if it's a SELECT query
        if (query.startsWith("select")) {
          // Find if there's a WHERE clause
          const whereIndex = query.indexOf("where")

          if (whereIndex === -1) {
            // No WHERE clause, return all products
            results = [...products]
          } else {
            // Parse the WHERE conditions
            const whereClause = query.substring(whereIndex + 5).trim()

            // Handle different conditions
            if (whereClause.includes("unitprice >")) {
              const priceStr = whereClause.split(">")[1].trim()
              const price = Number.parseFloat(priceStr.replace(";", ""))
              results = products.filter((p) => Number.parseFloat(p.unitPrice) > price)
            } else if (whereClause.includes("unitprice <")) {
              const priceStr = whereClause.split("<")[1].trim()
              const price = Number.parseFloat(priceStr.replace(";", ""))
              results = products.filter((p) => Number.parseFloat(p.unitPrice) < price)
            } else if (whereClause.includes("unitsinstock <")) {
              const stockStr = whereClause.split("<")[1].trim()
              const stock = Number.parseInt(stockStr.replace(";", ""))
              results = products.filter((p) => Number.parseInt(p.unitsInStock) < stock)
            } else if (whereClause.includes("unitsinstock >")) {
              const stockStr = whereClause.split(">")[1].trim()
              const stock = Number.parseInt(stockStr.replace(";", ""))
              results = products.filter((p) => Number.parseInt(p.unitsInStock) > stock)
            } else if (whereClause.includes("categoryid =")) {
              const categoryStr = whereClause.split("=")[1].trim().replace(/'/g, "").replace(/"/g, "").replace(";", "")
              results = products.filter((p) => p.categoryID === categoryStr)
            } else if (whereClause.includes("supplierid =")) {
              const supplierStr = whereClause.split("=")[1].trim().replace(/'/g, "").replace(/"/g, "").replace(";", "")
              results = products.filter((p) => p.supplierID === supplierStr)
            } else if (whereClause.includes("discontinued =")) {
              const discontinuedStr = whereClause
                .split("=")[1]
                .trim()
                .replace(/'/g, "")
                .replace(/"/g, "")
                .replace(";", "")
              results = products.filter((p) => p.discontinued === discontinuedStr)
            } else if (whereClause.includes("between")) {
              // Handle BETWEEN operator for price ranges
              const matches = whereClause.match(/unitprice between (\d+) and (\d+)/i)
              if (matches && matches.length === 3) {
                const min = Number.parseFloat(matches[1])
                const max = Number.parseFloat(matches[2])
                results = products.filter((p) => {
                  const price = Number.parseFloat(p.unitPrice)
                  return price >= min && price <= max
                })
              }
            } else if (whereClause.includes("like")) {
              // Handle LIKE operator for text search
              if (whereClause.includes("productname like")) {
                const searchTermMatch = whereClause.match(/productname like ['"]%(.+?)%['"]/i)
                if (searchTermMatch && searchTermMatch.length > 1) {
                  const searchTerm = searchTermMatch[1].toLowerCase()
                  results = products.filter((p) => p.productName.toLowerCase().includes(searchTerm))
                }
              } else if (whereClause.includes("quantityperunit like")) {
                const searchTermMatch = whereClause.match(/quantityperunit like ['"]%(.+?)%['"]/i)
                if (searchTermMatch && searchTermMatch.length > 1) {
                  const searchTerm = searchTermMatch[1].toLowerCase()
                  results = products.filter((p) => p.quantityPerUnit.toLowerCase().includes(searchTerm))
                }
              }
            } else if (whereClause.includes("and")) {
              // Handle simple AND conditions
              if (whereClause.includes("unitsinstock < 5") && whereClause.includes("discontinued = '0'")) {
                results = products.filter((p) => Number.parseInt(p.unitsInStock) < 5 && p.discontinued === "0")
              } else if (whereClause.includes("unitsonorder = '0'") && whereClause.includes("discontinued = '0'")) {
                results = products.filter((p) => p.unitsOnOrder === "0" && p.discontinued === "0")
              } else if (whereClause.includes("unitprice > 40") && whereClause.includes("discontinued = '1'")) {
                results = products.filter((p) => Number.parseFloat(p.unitPrice) > 40 && p.discontinued === "1")
              }
            } else {
              // Default to showing all products if we can't parse the query
              results = [...products]
            }
          }
        } else {
          // Not a SELECT query, return empty results
          results = []
        }

        setQueryResults(results)
      } catch (error) {
        console.error("Error executing query:", error)
        setQueryResults([])
      }

      setIsExecuting(false)
    }, 800)
  }

  if (loading) {
    return <div className={styles.loadingContainer}>Loading data...</div>
  }

  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <h1>SQL Query Runner</h1>
        <p>Run SQL queries and view results instantly</p>
      </div>

      <div className={styles.queryContainer}>
        <div className={styles.selectorContainer}>
          <h2>Predefined Queries</h2>
          <QuerySelector queries={predefinedQueries} onSelect={handleQuerySelect} />
        </div>

        <QueryEditor
          query={currentQuery}
          onChange={setCurrentQuery}
          onExecute={executeQuery}
          isExecuting={isExecuting}
        />
      </div>

      <div className={styles.resultsContainer}>
        <h2>Query Results</h2>
        <ResultsTable data={queryResults} />
      </div>
    </main>
  )
}

