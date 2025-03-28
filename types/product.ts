export interface Product {
  productID: string
  productName: string
  supplierID: string
  categoryID: string
  quantityPerUnit: string
  unitPrice: string
  unitsInStock: string
  unitsOnOrder: string
  reorderLevel: string
  discontinued: string
  [key: string]: string // Index signature for dynamic access
}

