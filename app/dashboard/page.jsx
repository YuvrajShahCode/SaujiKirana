export default function Dashboard() {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-4">Shopkeeper Dashboard</h1>
            <p className="text-muted-foreground">Protected route. Pending implementation of authentication and orders management.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="p-6 border rounded-lg bg-card shadow-sm">
                    <h3 className="font-bold text-lg mb-2">Active Orders</h3>
                    <p className="text-3xl font-bold text-primary">5</p>
                </div>
                <div className="p-6 border rounded-lg bg-card shadow-sm">
                    <h3 className="font-bold text-lg mb-2">Today&apos;s Revenue</h3>
                    <p className="text-3xl font-bold text-primary">₹2,450</p>
                </div>
                <div className="p-6 border rounded-lg bg-card shadow-sm">
                    <h3 className="font-bold text-lg mb-2">Total Products</h3>
                    <p className="text-3xl font-bold text-primary">124</p>
                </div>
            </div>
        </div>
    );
}
