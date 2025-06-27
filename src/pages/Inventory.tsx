import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, Plus, Filter } from 'lucide-react'

const inventoryItems = [
  { id: 1, name: 'Laptop Pro', sku: 'LP001', stock: 52, minStock: 10, category: 'Electronics', status: 'In Stock' },
  { id: 2, name: 'Wireless Mouse', sku: 'WM002', stock: 100, minStock: 20, category: 'Accessories', status: 'In Stock' },
  { id: 3, name: 'USB Cable', sku: 'UC003', stock: 5, minStock: 15, category: 'Accessories', status: 'Low Stock' },
  { id: 4, name: 'Monitor 24"', sku: 'M24004', stock: 25, minStock: 5, category: 'Electronics', status: 'In Stock' },
  { id: 5, name: 'Keyboard', sku: 'KB005', stock: 0, minStock: 10, category: 'Accessories', status: 'Out of Stock' },
]

export function Inventory() {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredItems = inventoryItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Stock': return 'bg-green-100 text-green-800'
      case 'Low Stock': return 'bg-yellow-100 text-yellow-800'
      case 'Out of Stock': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventory</h1>
          <p className="text-muted-foreground">
            Manage your inventory items and stock levels
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Item
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Inventory Items</CardTitle>
          <CardDescription>
            View and manage all your inventory items
          </CardDescription>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{item.name}</h3>
                    <Badge variant="outline">{item.sku}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Category: {item.category}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-medium">{item.stock} units</p>
                    <p className="text-sm text-muted-foreground">
                      Min: {item.minStock}
                    </p>
                  </div>
                  <Badge className={getStatusColor(item.status)}>
                    {item.status}
                  </Badge>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}