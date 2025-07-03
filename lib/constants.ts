export const lowStockProduct = 4

export const STATUS_TRANSACTION = {
    PENDING: 'Pending',
    SUCCESS: 'Success'
}

export const ERROR = {
    DATABASE: 'DATABASE',
    VALIDATION: 'VALIDATION',
    NOT_FOUND: 'NOT_FOUND',
    SYSTEM: 'SYSTEM',
};


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
    { label: "20A - 3000mAh", value: "ARUS_20A_3000" },
    { label: "20A - 2000mAh", value: "ARUS_20A_2000" },
    { label: "30A - 2000mAh", value: "ARUS_30A_2000" },
    { label: "30A - 3000mAh", value: "ARUS_30A_3000" },
    { label: "40A - 2000mAh", value: "ARUS_40A_2000" },
    { label: "40A - 3000mAh", value: "ARUS_40A_3000" },
];

export const cottonSizeOption=[
    { label: "-", value: '-' },
    { label: "24 AWG (0.51 mm)", value: "AWG_24_0.51" },
    { label: "26 AWG (0.40 mm)", value: "AWG_26_0.40" },
    { label: "28 AWG (0.32 mm)", value: "AWG_28_0.32" },
    { label: "30 AWG (0.25 mm)", value: "AWG_30_0.25" },
]

export const  coilSizeOption= [
    { label: "-", value: '-' },
    { label: "24 AWG (0.51 mm)", value: "AWG_24_0.51" },
    { label: "26 AWG (0.40 mm)", value: "AWG_26_0.40" },
    { label: "28 AWG (0.32 mm)", value: "AWG_28_0.32" },
    { label: "30 AWG (0.25 mm)", value: "AWG_30_0.25" },
]
export const resistanceSizeOption= [
    { label: "-", value: '-' },
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

export const pageSizeOptions = [10, 15, 50, 100];