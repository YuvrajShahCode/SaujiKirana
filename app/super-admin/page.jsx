export default function SuperAdminDashboard() {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-4">Super Admin</h1>
            <p className="text-muted-foreground">Manage all shops, users and platform settings.</p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
                <div className="p-6 border rounded-lg bg-card shadow-sm">
                    <h3 className="font-bold text-lg mb-2">Total Shops</h3>
                    <p className="text-3xl font-bold text-primary">12</p>
                </div>
                <div className="p-6 border rounded-lg bg-card shadow-sm">
                    <h3 className="font-bold text-lg mb-2">Pending Approvals</h3>
                    <p className="text-3xl font-bold text-orange-500">3</p>
                </div>
            </div>
        </div>
    );
}
