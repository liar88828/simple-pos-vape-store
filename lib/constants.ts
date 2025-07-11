export const _lowStockProduct = 4

export const STATUS_TRANSACTION = {
    PENDING: 'Pending',
    SUCCESS: 'Success'
}

export const STATUS_PREORDER = {
    PENDING: 'Pending',
    SUCCESS: 'Success'
}
export const statusPreordersOptions = [
    { label: "Pilih", value: "-" },
    { label: "Pending", value: "pending" },
    { label: "Success", value: "success" },
    { label: "Empty", value: "empty" },
    { label: "Expired", value: "expired" },
]

export const ERROR = {
    DATABASE: 'DATABASE',
    VALIDATION: 'VALIDATION',
    NOT_FOUND: 'NOT_FOUND',
    SYSTEM: 'SYSTEM',
};

export const fluidLevelsOptions = [
    { label: "-", value: "-" }, // Bisa juga diganti label jadi "Tidak ditentukan" atau "Semua"
    { label: "0ml", value: "0ml" },
    { label: "100ml", value: "100ml" },
    { label: "60mg", value: "60mg" },
    { label: "30mg", value: "30mg" },
];

export const nicotineLevelsOptions = [
    { label: "-", value: "-" }, // Bisa juga diganti label jadi "Tidak ditentukan" atau "Semua"
    { label: "0mg", value: "0mg" },
    { label: "3mg", value: "3mg" },
    { label: "6mg", value: "6mg" },
    { label: "12mg", value: "12mg" },
    { label: "25mg (Salt Nic)", value: "25mg" },
    { label: "50mg (Salt Nic)", value: "50mg" },
];

export const batterySizeOptions = [
    { label: "-", value: "-" }, // Bisa diganti "Tidak Ditentukan" jika perlu
    { label: "0A - 0mAh", value: "ARUS_0A_0" },
    { label: "20A - 2000mAh", value: "ARUS_20A_2000" },
    { label: "20A - 3000mAh", value: "ARUS_20A_3000" },
    { label: "30A - 2000mAh", value: "ARUS_30A_2000" },
    { label: "30A - 3000mAh", value: "ARUS_30A_3000" },
    { label: "40A - 2000mAh", value: "ARUS_40A_2000" },
    { label: "40A - 3000mAh", value: "ARUS_40A_3000" },
];

export const cottonSizeOption=[
    { label: "-", value: '-' },
    { label: "2.5mm", value: "2.5mm" },
    { label: "3.0mm", value: "3.0mm" },
]

export const  coilSizeOption= [
    { label: "-", value: '-' },
    { label: "0 AWG (0 mm)", value: "AWG_0.0" },
    { label: "24 AWG (0.51 mm)", value: "AWG_24_0.51" },
    { label: "26 AWG (0.40 mm)", value: "AWG_26_0.40" },
    { label: "28 AWG (0.32 mm)", value: "AWG_28_0.32" },
    { label: "30 AWG (0.25 mm)", value: "AWG_30_0.25" },
]
export const resistanceSizeOption= [
    { label: "-", value: '-' },
    { label: "0 Ohm ", value: "0_OHM_low" },
    { label: "0.15 Ohm low", value: "0.15_OHM_low" },
    { label: "0.2 Ohm low", value: "0.2_OHM_low" },
    { label: "0.3 Ohm low", value: "0.3_OHM_low" },

    { label: "0.8 Ohm med", value: "0.8_OHM_med" },
    { label: "1.2 Ohm med", value: "1.2_OHM_med" },

    { label: "2.0 Ohm hig", value: "2.0_OHM_hig" },
    { label: "2.5 Ohm hig", value: "2.5_OHM_hig" },

    { label: "0.6 Ohm cat", value: "0.6_OHM_cat" },
    { label: "0.8 Ohm cat", value: "0.8_OHM_cat" },
]

export const typeDeviceOption=[
    { label: "-", value: "-" },
    { label: "Vape Pod", value: "Pod" },
    { label: "Vape Mod", value: "Mod" },
    { label: "Vape Disposable", value: "Disposable" },
]

export const categoryOption=[
    { label: "-", value: "-" },
    { label: "Aksesoris", value: "aksesoris" },
    { label: "Battery", value: "battery" },
    { label: "Atomizer", value: "atomizer" },
    { label: "Cartridge", value: "cartridge" },
    { label: "Tank", value: "tank" },
    { label: "Coil", value: "coil" },
    { label: "Cotton", value: "cotton" },
    { label: "Device", value: "device" },
    { label: "Drip Tip", value: "drip-tip" },
    { label: "Liquid", value: "liquid" },

]

export const stockStatusOptions = [
    { label: "-", value: "-" },
    { label: "Tersedia", value: "available" },
    { label: "Stok Rendah", value: "low" },
    { label: "Habis", value: "out" },
];

export const pageSizeOptions = [ 5, 10, 15, 50, 100 ];

export const _exampleMemberTierData = () => {
    const total = 0
    const bronze = []
    const silver = []
    const gold = []

    return [
        {
            name: "Member Bronze",
            range: "Pembelian < Rp 1.000.000",
            count: bronze.length,
            // progress: Math.round((bronze.length / total) * 100),
            progress: bronze.length / total,
        },
        {
            name: "Member Silver",
            range: "Pembelian Rp 1.000.000 - 5.000.000",
            count: silver.length,
            progress: silver.length / total,
        },
        {
            name: "Member Gold",
            range: "Pembelian > Rp 5.000.000",
            count: gold.length,
            progress: gold.length / total,
        },
    ];
}