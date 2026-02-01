export const SHOPS = [
    {
        id: 1,
        name: "Gupta Kirana Store",
        type: "Grocery & Staples",
        rating: 4.8,
        distance: 1.2,
        limit: 6,
        time: "15-20",
        isOpen: true,
        image: null,
    },
    {
        id: 2,
        name: "Sharma General Store",
        type: "Daily Needs",
        rating: 4.5,
        distance: 2.5,
        limit: 6,
        time: "25-30",
        isOpen: true,
        image: null,
    },
    {
        id: 3,
        name: "Fresh Veggie Mart",
        type: "Fruits & Vegetables",
        rating: 4.9,
        distance: 3.1,
        limit: 6,
        time: "30-35",
        isOpen: true,
        image: null,
    },
    {
        id: 4,
        name: "City Supermarket (Too Far)",
        type: "Supermarket",
        rating: 4.2,
        distance: 7.5,
        limit: 6,
        time: "60+",
        isOpen: false,
        image: null,
    },
    {
        id: 5,
        name: "Raju Da's Tea & Snacks",
        type: "Snacks",
        rating: 4.6,
        distance: 0.5,
        limit: 6,
        time: "10-15",
        isOpen: true,
        image: null,
    },
    {
        id: 6,
        name: "Laxmi General Store",
        type: "Grocery",
        rating: 4.3,
        distance: 4.2,
        limit: 6,
        time: "40-45",
        isOpen: true,
        image: null,
    }
];

export const PRODUCTS = [
    {
        id: 101,
        shopId: 1,
        name: "Aashirvaad Atta (5kg)",
        price: 320,
        image: null,
        category: "Grocery"
    },
    {
        id: 102,
        shopId: 1,
        name: "Tata Salt (1kg)",
        price: 28,
        image: null,
        category: "Grocery"
    },
    {
        id: 103,
        shopId: 1,
        name: "Fortune Oil (1L)",
        price: 150,
        image: null,
        category: "Grocery"
    },
    {
        id: 201,
        shopId: 3,
        name: "Fresh Potato (1kg)",
        price: 50,
        image: null,
        category: "Vegetables"
    },
    {
        id: 202,
        shopId: 3,
        name: "Onion (1kg)",
        price: 80,
        image: null,
        category: "Vegetables"
    },
    {
        id: 301,
        shopId: 5,
        name: "Samosa (1pc)",
        price: 25,
        image: null,
        category: "Snacks"
    },
    {
        id: 302,
        shopId: 5,
        name: "Masala Tea",
        price: 20,
        image: null,
        category: "Beverages"
    }
];
