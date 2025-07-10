import { DashboardStats, } from "@/action/sale-action";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { RangeStats, SaleCustomers } from "@/interface/actionType";
import { formatDateIndo, formatRupiah } from "@/lib/formatter";
import React from "react";

interface ReportsPageProps {
    range: RangeStats,
    sales: SaleCustomers[],
    stats: DashboardStats,
    trending: {
        changeText: string,
        isUp: boolean,
        value: number
    }
}

export function DailySalesReport_x5_indonesia(props: ReportsPageProps) {
    const totalTransaction = props.sales.reduce((a, b) => a + (b.SaleItems.reduce((d, e) => d + (e.priceAtBuy * e.quantity), 0)), 0);
    return (
        <Card className="p-6 max-w-5xl mx-auto  ">
            <div className="text-center">
                <h1 className="text-3xl font-bold">Laporan Penjualan Harian</h1>
                <p className="text-gray-600">Tanggal: { formatDateIndo(new Date()) }</p>
                <p className="text-gray-600">Periode Laporan: { props.range }</p>
            </div>
            <Separator/>
            <section className=" ">
                <h2 className="text-xl font-semibold mb-2">Ringkasan Eksekutif</h2>
                <p>Kinerja penjualan hari ini menunjukkan penurunan signifikan dibandingkan periode sebelumnya, dengan
                    total
                    penjualan
                    sebesar { formatRupiah(props.stats.totalSales) } dari { props.stats.transactions } transaksi. Bisnis
                    mengalami
                    penurunan pertumbuhan penjualan sebesar { props.stats.avgTransactionGrowth.toFixed(2) }%,
                    menunjukkan kondisi pasar yang menantang atau faktor operasional yang memerlukan perhatian
                    segera.</p>
            </section>

            <section className="  ">
                <h2 className="text-xl font-semibold mb-2">Indikator Kinerja Utama</h2>
                <ul className="list-disc list-inside space-y-1">
                    <li>Total Pendapatan Penjualan: { formatRupiah(props.stats.totalSales) }</li>
                    <li>Pertumbuhan Penjualan: { props.stats.salesGrowth.toFixed(2) }% (tren menurun)</li>
                    <li>Total Transaksi: { props.stats.transactions }</li>
                    <li>Pertumbuhan Transaksi: { props.stats.transactionsGrowth }% (tidak ada perubahan)</li>
                    <li>Rata-rata Nilai Transaksi: { formatRupiah(props.stats.avgTransaction) }</li>
                    <li>Pertumbuhan Rata-rata Transaksi: { props.stats.avgTransactionGrowth.toFixed(2) }%</li>
                </ul>
            </section>

            <section className="   ">
                <h2 className="text-xl font-semibold mb-2">Analisis Tren</h2>
                <p>Pergerakan { props.trending.changeText } saat ini dengan nilai tren sebesar { props.trending.value },
                    menunjukkan tantangan signifikan dalam mempertahankan momentum penjualan.</p>
            </section>

            {/* Analisis Transaksi */ }
            <section className="   ">
                <h2 className="text-xl font-semibold mb-4">Analisis Transaksi</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 border border-primary rounded-lg">
                        <thead className="bg-muted">
                        <tr>
                            <th className="px-2 py-2 text-left text-sm font-medium text-primary">ID # (Waktu)
                            </th>
                            <th className="px-2 py-2 text-left text-sm font-medium text-primary">Pelanggan (Status,
                                Umur)
                            </th>
                            {/*<th className="px-2 py-2 text-left text-sm font-medium text-primary">Item</th>*/ }
                            <th className="px-2 py-2 text-right text-sm font-medium text-primary">Produk</th>
                            <th className="px-2 py-2 text-right text-sm font-medium text-primary">Total Per Unit</th>
                            <th className="px-2 py-2 text-right text-sm font-medium text-primary">Total (Rp)</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-primary">
                        { props.sales.map((sale) => (
                            <tr key={ sale.id }>
                                <td className="px-2 py-2">
                                    <h1>#{ sale.id }</h1>
                                    <p>{ formatDateIndo(sale.date) }</p>
                                </td>
                                <td className="px-2 py-2 capitalize">
                                    <h1>{ sale.customer.name }</h1>
                                    <p>({ sale.customer.status }, Umur: { sale.customer.age })</p>
                                </td>
                                {/*<td className="px-2 py-2">{ sale.items }</td>*/ }
                                <td className="px-2 py-2">
                                    { sale.SaleItems.map(item => (
                                        <span key={ item.id }
                                              className="block text-nowrap text-end">{ item.product.name } ({ item.quantity } unit)</span>
                                    )) }
                                </td>
                                <td className="px-2 py-2">
                                    { sale.SaleItems.map(item => (
                                        <span key={ item.id }
                                              className="block text-nowrap text-end">{ formatRupiah(item.quantity * item.priceAtBuy) }</span>
                                    )) }
                                </td>
                                <td className="px-2 py-2 text-end">{ formatRupiah(sale.total) }</td>

                            </tr>
                        )) }
                        </tbody>
                    </table>
                </div>
                <p className={ 'text-end' }><strong>Total: </strong> { formatRupiah(totalTransaction) }</p>
            </section>

            {
                props.stats.topProduct.product ?
                    <section className="  ">
                        <h2 className="text-xl font-semibold mb-2">Analisis Kinerja Produk</h2>
                        <p><strong>Produk dengan Performa Terbaik:</strong>
                            <u>{ props.stats.topProduct.product.name }</u> (ID
                            Produk: { props.stats.topProduct.product.id })</p>
                        <ul className="list-disc list-inside">
                            <li>Kategori: { props.stats.topProduct.product.category }</li>
                            <li>Unit Terjual: { props.stats.topProduct.unitsSold }</li>
                            <li>Harga: { formatRupiah(props.stats.topProduct.unitsSold) } per unit</li>
                            <li>Tipe: { props.stats.topProduct.product.type }</li>
                            <li>Kadar Nikotin: { props.stats.topProduct.unitsSold }</li>
                            <li>Stok Saat Ini: { props.stats.topProduct.product.stock } unit (Di bawah stok
                                minimum: { props.stats.topProduct.product.minStock } unit)
                            </li>
                        </ul>

                        {/*<h3 className="mt-2 font-semibold">Kinerja Kategori</h3>*/ }
                        {/*<ul className="list-disc list-inside">*/ }
                        {/*    <li>Produk Coil: Mendominasi volume penjualan dengan banyak transaksi bernilai tinggi</li>*/ }
                        {/*    <li>Produk Device: Nilai transaksi lebih rendah tapi permintaan konsisten</li>*/ }
                        {/*</ul>*/ }
                    </section>
                    : null
            }
            {/*<section className=" p-4">*/ }
            {/*    <h2 className="text-xl font-semibold mb-2">Kekhawatiran Manajemen Stok</h2>*/ }
            {/*    <ul className="list-disc list-inside">*/ }
            {/*        <li>Orlando Dillon: 12 unit (minimum: 80) - <span className="text-red-600">Kritis</span></li>*/ }
            {/*        <li>Macy Tillman: 61 unit (minimum: 73) - <span className="text-yellow-600">Di bawah minimum</span></li>*/ }
            {/*    </ul>*/ }
            {/*</section>*/ }

            {/*<section className=" p-4">*/ }
            {/*    <h2 className="text-xl font-semibold mb-2">Analisis Pelanggan</h2>*/ }
            {/*    <ul className="list-disc list-inside">*/ }
            {/*        <li>*/ }
            {/*            <strong>Pelanggan Terverifikasi:</strong> 1 pelanggan (_admin) menyumbang Rp 803.494 (39.9% dari total penjualan)*/ }
            {/*        </li>*/ }
            {/*        <li>*/ }
            {/*            <strong>Pelanggan Tertunda:</strong> 2 pelanggan menyumbang Rp 1.208.803 (60.1% dari total penjualan)*/ }
            {/*        </li>*/ }
            {/*        <li>*/ }
            {/*            <strong>_admin:</strong> Pelanggan dengan nilai pembelian tinggi dan sering melakukan pembelian dengan total Rp 1.303.494*/ }
            {/*        </li>*/ }
            {/*        <li>Akusisi pelanggan baru terbatas (3 pelanggan aktif hari ini)</li>*/ }
            {/*    </ul>*/ }
            {/*</section>*/ }
            <AnalisisPelanggan { ...props }/>

            {/*<section className=" p-4">*/ }
            {/*    <h2 className="text-xl font-semibold mb-2">Distribusi Penjualan per Jam</h2>*/ }
            {/*    <ul className="list-disc list-inside">*/ }
            {/*        <li><strong>Jam Puncak:</strong> 08:00-09:30 (semua transaksi)</li>*/ }
            {/*        <li><strong>Sore/Malam:</strong> Tidak ada penjualan tercatat</li>*/ }
            {/*        <li><strong>Peluang:</strong> Potensi memperpanjang jam operasional penjualan</li>*/ }
            {/*    </ul>*/ }
            {/*</section>*/ }


            {/*use Ai*/ }
            {/*<section className=" p-4">*/ }
            {/*    <h2 className="text-xl font-semibold mb-2">Rekomendasi</h2>*/ }
            {/*    <h3 className="font-semibold">Tindakan Segera</h3>*/ }
            {/*    <ul className="list-disc list-inside">*/ }
            {/*        <li>Isi ulang produk Orlando Dillon dan Macy Tillman</li>*/ }
            {/*        <li>Tindak lanjut dengan pelanggan tertunda Orak Genah dan Alan Jetis</li>*/ }
            {/*        <li>Selidiki penyebab penurunan penjualan sore/malam</li>*/ }
            {/*    </ul>*/ }
            {/*    <h3 className="font-semibold mt-2">Perbaikan Strategis</h3>*/ }
            {/*    <ul className="list-disc list-inside">*/ }
            {/*        <li>Luncurkan program loyalitas untuk pelanggan bernilai tinggi seperti _admin</li>*/ }
            {/*        <li>Analisis kinerja produk coil vs device untuk diversifikasi</li>*/ }
            {/*        <li>Perpanjang jam operasional penjualan</li>*/ }
            {/*        <li>Tinjau data umur pelanggan untuk kepatuhan</li>*/ }
            {/*    </ul>*/ }
            {/*    <h3 className="font-semibold mt-2">Rencana Pemulihan Kinerja</h3>*/ }
            {/*    <ul className="list-disc list-inside">*/ }
            {/*        <li>Pantau tren penjualan harian selama seminggu ke depan</li>*/ }
            {/*        <li>Implementasikan promosi untuk mengatasi tren penurunan</li>*/ }
            {/*        <li>Tingkatkan nilai transaksi rata-rata melalui upselling</li>*/ }
            {/*        <li>Perluas basis pelanggan untuk mengurangi konsentrasi pendapatan</li>*/ }
            {/*    </ul>*/ }
            {/*</section>*/ }

            {/*<section className=" p-4">*/ }
            {/*    <h2 className="text-xl font-semibold mb-2">Kesimpulan</h2>*/ }
            {/*    <p>Laporan penjualan hari ini menunjukkan tren menurun namun menyoroti daya beli yang tinggi. Fokus pada*/ }
            {/*        manajemen stok, keterlibatan pelanggan, dan perpanjangan jam penjualan untuk memaksimalkan potensi*/ }
            {/*        pendapatan. Pelanggan setia menawarkan peluang jika didukung strategi efektif.</p>*/ }
            {/*</section>*/ }
        </Card>
    );
}

type CustomerMap = {
    name: string,
    status: string,
    totalPurchase: number,
    salesCount: number,
};

export function AnalisisPelanggan({ sales }: ReportsPageProps) {
    // Group customers by status and accumulate totals
    const customersMap = new Map<number, CustomerMap>();

    sales.forEach((sale) => {
        const c = sale.customer;
        if (!customersMap.has(c.id)) {
            customersMap.set(c.id, {
                name: c.name,
                status: c.status,
                totalPurchase: 0,
                salesCount: 0,
            });
        }
        const customerData = customersMap.get(c.id);
        if (customerData) {
            customerData.totalPurchase += sale.total;
            customerData.salesCount += 1;
        }
    });

    // Separate customers by status for analysis
    const verifiedCustomers: CustomerMap[] = [];
    const pendingCustomers: CustomerMap[] = [];
    customersMap.forEach((c) => {
        if (c.status === "verified") {
            verifiedCustomers.push(c);
        } else if (c.status === "pending") {
            pendingCustomers.push(c);
        }
    });

    // Calculate totals for verified and pending
    const totalSales = sales.reduce((sum, s) => sum + s.total, 0);
    const totalVerified = verifiedCustomers.reduce((sum, c) => sum + c.totalPurchase, 0);
    const totalPending = pendingCustomers.reduce((sum, c) => sum + c.totalPurchase, 0);

    // Find _admin customer info if exists
    const adminCustomer = [ ...customersMap.values() ].find((c) => c.name === "_admin");

    // Count active customers today (assuming sales date is today)
    const today = new Date().toISOString().slice(0, 10);
    const activeCustomersToday = new Set(
        sales
        .filter((s) => s.date.toDateString().startsWith(today))
        .map((s) => s.customer.id)
    ).size;

    return (
        <section className=" ">
            <h2 className="text-xl font-semibold mb-2">Analisis Pelanggan</h2>
            <ul className="list-disc list-inside">
                <li>
                    <strong>Pelanggan Terverifikasi:</strong> { verifiedCustomers.length } pelanggan (
                    Rp { totalVerified.toLocaleString() } (
                    { totalSales > 0 ? ((totalVerified / totalSales) * 100).toFixed(1) : "0.0" }% dari total penjualan)
                </li>
                <li>
                    <strong>Pelanggan Tertunda:</strong> { pendingCustomers.length } pelanggan (
                    Rp { totalPending.toLocaleString() } (
                    { totalSales > 0 ? ((totalPending / totalSales) * 100).toFixed(1) : "0.0" }% dari total penjualan)
                </li>
                { adminCustomer && (
                    <li>
                        <strong>_admin:</strong> Pelanggan dengan nilai pembelian tinggi dan sering
                        melakukan pembelian dengan total Rp { adminCustomer.totalPurchase.toLocaleString() }
                    </li>
                ) }
                <li>Akusisi pelanggan baru terbatas ({ activeCustomersToday } pelanggan aktif hari ini)</li>
            </ul>
        </section>
    );
}
