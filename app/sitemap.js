import api from "@/lib/api";

export default async function sitemap() {
    // Static Routes
    const routes = ['', '/login', '/register'].map((route) => ({
        url: `https://saujikirana.com${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
    }));

    // Dynamic Shop Routes (Fetch top 50 active shops)
    // Note: Handling API error slightly differently for build time
    let shops = [];
    try {
        // In a real scenario, you might fetch this directly from DB or a public API endpoint
        // For now, we stub it or assume the API is build-time accessible if configured
        // const res = await fetch('http://localhost:8000/api/shops/');
        // shops = await res.json();
    } catch (e) {
        console.error("Sitemap fetch error", e);
    }

    const shopRoutes = shops.map((shop) => ({
        url: `https://saujikirana.com/shop/${shop.id}`,
        lastModified: new Date(),
        changeFrequency: 'always',
        priority: 0.8,
    }));

    return [...routes, ...shopRoutes];
}
