import type { Product } from "@/types/product"

export async function fetchProductsData(): Promise<Product[]> {
  try {
    const response = await fetch(
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/products-0cCjNFmnzmZ110nUIoOzwxmQ0MIhdp.csv",
    )
    const csvText = await response.text()

    // Parse CSV
    const lines = csvText.split("\n")
    const headers = lines[0].split(",")

    const products: Product[] = []

    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue

      const values = parseCSVLine(lines[i])
      if (values.length !== headers.length) continue

      const product: any = {}

      headers.forEach((header, index) => {
        product[header.trim()] = values[index].trim()
      })

      products.push(product as Product)
    }

    return products
  } catch (error) {
    console.error("Error fetching products data:", error)
    return []
  }
}

// Helper function to parse CSV lines correctly (handling commas in quotes)
function parseCSVLine(line: string): string[] {
  const result: string[] = []
  let current = ""
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]

    if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === "," && !inQuotes) {
      result.push(current)
      current = ""
    } else {
      current += char
    }
  }

  result.push(current)
  return result
}

