export interface Product {
  id: number
  name: string
  category: string
  price: number
  stock: number
  minStock: number
  image: string
  description: string
  nicotineLevel: string | null
  flavor: string | null
  type: string
}

export interface SalesData {
  date: string
  total: number
  items: number
  customer: string
}

export interface PreOrder {
  id: number
  customer: string
  product: string
  quantity: number
  estimatedDate: string
  status: string
}

export interface Customer {
    id: string
    name: string
    age: number
    totalPurchase: number
    status: CustomerStatus
    lastPurchase: string // YYYY-MM-DD format
}

export interface MemberTier {
    name: string
    range: string
    progress: number
    count: number
}

export type SalesDataModal = {
    date: string;
    total: number;
    items: number;
    customer: string;
    products: {
        name: string;
        category: string;
        price: number;
        quantity: number;
    }[]

}
export const products: Product[] = [
  {
    id: 1,
    name: "SMOK Nord 4",
    category: "Device",
    price: 450000,
    stock: 15,
    minStock: 5,
    image: "/placeholder.svg?height=100&width=100",
    description: "Pod system dengan kapasitas 2000mAh",
    nicotineLevel: null,
    flavor: null,
    type: "Pod System",
  },
  {
    id: 2,
    name: "Freebase Liquid - Strawberry",
    category: "Liquid",
    price: 85000,
    stock: 3,
    minStock: 10,
    image: 'https://signature.emkay.id/wp-content/uploads/2023/02/41.-Cara-Merawat-Vape-Agar-Bisa-Digunakan-Dalam-Jangka-Panjang.jpeg',
    description: "Liquid freebase rasa strawberry 60ml",
    nicotineLevel: "3mg",
    flavor: "Strawberry",
    type: "Freebase",
  },
  {
    id: 3,
    name: "Salt Nic - Mango Ice",
    category: "Liquid",
    price: 95000,
    stock: 25,
    minStock: 8,
    image: "/placeholder.svg?height=100&width=100",
    description: "Salt nicotine mango ice 30ml",
    nicotineLevel: "25mg",
    flavor: "Mango Ice",
    type: "Salt Nic",
  },
  {
    id: 4,
    name: "Mesh Coil 0.4ohm",
    category: "Coil",
    price: 45000,
    stock: 2,
    minStock: 15,
    image: "/placeholder.svg?height=100&width=100",
    description: "Mesh coil replacement 0.4ohm",
    nicotineLevel: null,
    flavor: null,
    type: "Mesh",
  },
  {
    id: 5,
    name: "Vape Case Premium",
    category: "Aksesoris",
    price: 125000,
    stock: 8,
    minStock: 3,
    image: "/placeholder.svg?height=100&width=100",
    description: "Case premium untuk vape device",
    nicotineLevel: null,
    flavor: null,
    type: "Case",
  },
    {
        id: 6,
        name: "Pod Silicone Cover",
        category: "Aksesoris",
        price: 35000,
        stock: 15,
        minStock: 5,
        image: "/placeholder.svg?height=100&width=100",
        description: "Pelindung silikon untuk pod agar tidak mudah rusak",
        nicotineLevel: null,
        flavor: null,
        type: "Case",
    },
    {
        id: 7,
        name: "Lanyard Vape Stylish",
        category: "Aksesoris",
        price: 45000,
        stock: 20,
        minStock: 7,
        image: "/placeholder.svg?height=100&width=100",
        description: "Tali leher stylish untuk menggantung vape",
        nicotineLevel: null,
        flavor: null,
        type: "Lanyard",
    },
    {
        id: 8,
        name: "Coil Jig Tool Kit",
        category: "Aksesoris",
        price: 95000,
        stock: 12,
        minStock: 4,
        image: "/placeholder.svg?height=100&width=100",
        description: "Toolkit lengkap untuk membentuk coil vape",
        nicotineLevel: null,
        flavor: null,
        type: "Toolkit",
    },
    {
        id: 9,
        name: "Baterai Vape 18650",
        category: "Aksesoris",
        price: 110000,
        stock: 9,
        minStock: 3,
        image: "/placeholder.svg?height=100&width=100",
        description: "Baterai isi ulang 18650 untuk device vape",
        nicotineLevel: null,
        flavor: null,
        type: "Battery",
    },
    {
        id: 10,
        name: "Car Charger Vape",
        category: "Aksesoris",
        price: 78000,
        stock: 6,
        minStock: 2,
        image: "/placeholder.svg?height=100&width=100",
        description: "Charger mobil untuk mengisi ulang device vape saat bepergian",
        nicotineLevel: null,
        flavor: null,
        type: "Charger",
    }
]

export const salesData: SalesData[] = [
  { date: "2024-01-15", total: 2450000, items: 18, customer: "Ahmad S." },
  { date: "2024-01-14", total: 1890000, items: 12, customer: "Budi P." },
  { date: "2024-01-13", total: 3200000, items: 24, customer: "Citra M." },
  { date: "2024-01-12", total: 1650000, items: 9, customer: "Deni R." },
]

export const preOrders: PreOrder[] = [
    {
        id: 1,
        customer: "Eko W.",
        product: "SMOK RPM 5",
        quantity: 2,
        estimatedDate: "2024-01-20",
        status: "Pending"
    },
  {
    id: 2,
    customer: "Fitri N.",
    product: "Premium Liquid Bundle",
    quantity: 1,
    estimatedDate: "2024-01-18",
    status: "Confirmed",
  },
]


export type CustomerStatus = "verified" | "pending" | "rejected"

export const exampleCustomerData: Customer[] = [
    {
        id: "1",
        name: "Ahmad Santoso",
        age: 25,
        totalPurchase: 2450000,
        status: "verified",
        lastPurchase: "2024-01-15",
    },
    {
        id: "2",
        name: "Budi Pratama",
        age: 22,
        totalPurchase: 890000,
        status: "verified",
        lastPurchase: "2024-01-14",
    },
    {
        id: "3",
        name: "Citra Melati",
        age: 19,
        totalPurchase: 1200000,
        status: "pending",
        lastPurchase: "2024-01-13",
    },
    {
        id: "4",
        name: "Dina Rahmawati",
        age: 30,
        totalPurchase: 3300000,
        status: "verified",
        lastPurchase: "2024-01-10",
    },
    {
        id: "5",
        name: "Eka Hidayat",
        age: 28,
        totalPurchase: 500000,
        status: "rejected",
        lastPurchase: "2023-12-20",
    },
]


export const salesDataModal: SalesDataModal = {
    date: "2024-01-15",
    total: 2450000,
    items: 18,
    customer: "Ahmad S.",
    products: [
        {
            name: "SMOK Nord 4",
            category: "Device",
            price: 450000,
            quantity: 2,
        },
        {
            name: "Liquid Menthol 60ml",
            category: "Liquid",
            price: 55000,
            quantity: 5,
        },
    ],
}

