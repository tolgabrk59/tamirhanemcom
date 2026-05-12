'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
    Car,
    Plus,
    Pencil,
    Trash2,
    Loader2,
    X,
    CheckCircle,
    AlertTriangle,
    Fuel,
    Gauge,
} from 'lucide-react';

interface Vehicle {
    id: number;
    brand: string;
    model: string;
    plate: string;
    year?: number;
    fuelType?: string;
    color?: string;
    km?: number;
    createdAt: string;
}

interface VehicleForm {
    brand: string;
    model: string;
    plate: string;
    year: string;
    fuelType: string;
    color: string;
    km: string;
}

const EMPTY_FORM: VehicleForm = {
    brand: '',
    model: '',
    plate: '',
    year: '',
    fuelType: '',
    color: '',
    km: '',
};

const FUEL_TYPES = ['Benzin', 'Dizel', 'Elektrik', 'Hibrit', 'LPG'];
const YEARS = Array.from({ length: 37 }, (_, i) => String(2026 - i));

function SkeletonCard() {
    return (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 animate-pulse">
            <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-gray-800 rounded-xl" />
                <div className="flex gap-2">
                    <div className="w-8 h-8 bg-gray-800 rounded-lg" />
                    <div className="w-8 h-8 bg-gray-800 rounded-lg" />
                </div>
            </div>
            <div className="space-y-2 mb-3">
                <div className="h-4 w-32 bg-gray-800 rounded" />
                <div className="h-3 w-20 bg-gray-800 rounded" />
            </div>
            <div className="h-7 w-28 bg-gray-800 rounded" />
        </div>
    );
}

export default function AraclarimPage() {
    const router = useRouter();
    const [jwt, setJwt] = useState<string | null>(null);
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [loading, setLoading] = useState(true);
    const [pageError, setPageError] = useState('');
    const [success, setSuccess] = useState('');

    const [showFormModal, setShowFormModal] = useState(false);
    const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
    const [form, setForm] = useState<VehicleForm>(EMPTY_FORM);
    const [brands, setBrands] = useState<string[]>([]);
    const [models, setModels] = useState<string[]>([]);
    const [loadingBrands, setLoadingBrands] = useState(false);
    const [loadingModels, setLoadingModels] = useState(false);
    const [formSubmitting, setFormSubmitting] = useState(false);
    const [formError, setFormError] = useState('');

    const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
    const [deleteSubmitting, setDeleteSubmitting] = useState(false);

    const fetchVehicles = useCallback(async (token: string) => {
        setLoading(true);
        setPageError('');
        try {
            const res = await fetch('/api/vehicles?populate=*', {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (data?.data) {
                setVehicles(data.data);
            } else {
                setPageError('Araçlar yüklenemedi.');
            }
        } catch {
            setPageError('Araçlar yüklenirken hata oluştu.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('tamirhanem_jwt');
        if (!token) {
            router.push('/giris');
            return;
        }
        setJwt(token);
        fetchVehicles(token);
    }, [router, fetchVehicles]);

    useEffect(() => {
        if (!showFormModal || brands.length > 0) return;
        setLoadingBrands(true);
        fetch('/api/arac-dataveri/brands')
            .then(r => r.json())
            .then(data => {
                const list: string[] = data?.data?.map((b: { brand: string }) => b.brand) ?? [];
                setBrands(list);
            })
            .catch(() => {})
            .finally(() => setLoadingBrands(false));
    }, [showFormModal, brands.length]);

    useEffect(() => {
        if (!form.brand) {
            setModels([]);
            return;
        }
        setLoadingModels(true);
        setModels([]);
        fetch(`/api/arac-dataveri/models/${encodeURIComponent(form.brand)}`)
            .then(r => r.json())
            .then(data => {
                const list: string[] = data?.data?.map((m: { model: string }) => m.model) ?? [];
                setModels(list);
            })
            .catch(() => {})
            .finally(() => setLoadingModels(false));
    }, [form.brand]);

    const openAddModal = () => {
        setEditingVehicle(null);
        setForm(EMPTY_FORM);
        setFormError('');
        setShowFormModal(true);
    };

    const openEditModal = (vehicle: Vehicle) => {
        setEditingVehicle(vehicle);
        setForm({
            brand: vehicle.brand ?? '',
            model: vehicle.model ?? '',
            plate: vehicle.plate ?? '',
            year: vehicle.year ? String(vehicle.year) : '',
            fuelType: vehicle.fuelType ?? '',
            color: vehicle.color ?? '',
            km: vehicle.km ? String(vehicle.km) : '',
        });
        setFormError('');
        setShowFormModal(true);
    };

    const closeFormModal = () => {
        setShowFormModal(false);
        setEditingVehicle(null);
        setForm(EMPTY_FORM);
        setFormError('');
    };

    const handleFormSubmit = async () => {
        if (!jwt) return;
        const cleanPlate = form.plate.trim().toUpperCase().replace(/\s/g, '');
        if (!cleanPlate) {
            setFormError('Plaka zorunludur.');
            return;
        }
        setFormSubmitting(true);
        setFormError('');
        try {
            if (editingVehicle) {
                const res = await fetch(`/api/vehicles/${editingVehicle.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${jwt}`,
                    },
                    body: JSON.stringify({
                        brand: form.brand || undefined,
                        model: form.model || undefined,
                        plate: cleanPlate,
                        year: form.year ? Number(form.year) : undefined,
                        fuelType: form.fuelType || undefined,
                        color: form.color.trim() || undefined,
                        km: form.km ? Number(form.km) : undefined,
                    }),
                });
                if (!res.ok) {
                    const err = await res.json().catch(() => ({}));
                    throw new Error(err?.error?.message || 'Araç güncellenemedi.');
                }
                setSuccess('Araç başarıyla güncellendi.');
            } else {
                const res = await fetch('/api/vehicles', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${jwt}`,
                    },
                    body: JSON.stringify({
                        data: {
                            brand: form.brand || undefined,
                            model: form.model || undefined,
                            plate: cleanPlate,
                            year: form.year ? Number(form.year) : undefined,
                            fuelType: form.fuelType || undefined,
                            color: form.color.trim() || undefined,
                            km: form.km ? Number(form.km) : undefined,
                            publishedAt: new Date(),
                        },
                    }),
                });
                if (!res.ok) {
                    const err = await res.json().catch(() => ({}));
                    throw new Error(err?.error?.message || 'Araç eklenemedi.');
                }
                setSuccess('Araç başarıyla eklendi.');
            }
            closeFormModal();
            await fetchVehicles(jwt);
            setTimeout(() => setSuccess(''), 3000);
        } catch (e: unknown) {
            setFormError(e instanceof Error ? e.message : 'İşlem başarısız. Tekrar deneyin.');
        } finally {
            setFormSubmitting(false);
        }
    };

    const confirmDelete = async () => {
        if (!jwt || deleteTargetId === null) return;
        setDeleteSubmitting(true);
        try {
            const res = await fetch(`/api/vehicles/${deleteTargetId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${jwt}` },
            });
            if (!res.ok && res.status !== 204) {
                throw new Error('Araç silinemedi.');
            }
            setVehicles(prev => prev.filter(v => v.id !== deleteTargetId));
            setSuccess('Araç silindi.');
            setTimeout(() => setSuccess(''), 3000);
        } catch {
            setPageError('Araç silinemedi. Tekrar deneyin.');
            setTimeout(() => setPageError(''), 3000);
        } finally {
            setDeleteSubmitting(false);
            setDeleteTargetId(null);
        }
    };

    const formatKm = (km: number) =>
        km.toLocaleString('tr-TR') + ' km';

    if (!jwt) return null;

    return (
        <div className="min-h-screen bg-gray-950 text-white">
            <div className="bg-gray-900 border-b border-gray-800 sticky top-0 z-10">
                <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
                    <h1 className="text-xl font-bold text-white flex items-center gap-2">
                        <Car className="w-5 h-5 text-orange-500" />
                        Araçlarım
                    </h1>
                    <button
                        onClick={openAddModal}
                        className="flex items-center gap-1.5 text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 px-4 py-2.5 rounded-xl transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        Araç Ekle
                    </button>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 py-6">
                {success && (
                    <div className="mb-4 bg-green-500/20 border border-green-500/30 text-green-400 text-sm px-4 py-3 rounded-xl flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 flex-shrink-0" />
                        {success}
                    </div>
                )}
                {pageError && (
                    <div className="mb-4 bg-red-500/20 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                        {pageError}
                    </div>
                )}

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <SkeletonCard />
                        <SkeletonCard />
                        <SkeletonCard />
                    </div>
                ) : vehicles.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <Car className="w-16 h-16 text-gray-700 mb-4" />
                        <p className="text-gray-300 font-semibold text-lg mb-1">Henüz araç eklemediniz</p>
                        <p className="text-gray-500 text-sm mb-6">
                            Araçlarınızı ekleyerek randevu alırken kolayca seçin.
                        </p>
                        <button
                            onClick={openAddModal}
                            className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Araç Ekle
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {vehicles.map(vehicle => (
                            <div
                                key={vehicle.id}
                                className="bg-gray-900 border border-gray-800 rounded-2xl p-4 flex flex-col"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <Car className="w-6 h-6 text-orange-500" />
                                    </div>
                                    <div className="flex gap-1.5">
                                        <button
                                            onClick={() => openEditModal(vehicle)}
                                            className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
                                            title="Düzenle"
                                        >
                                            <Pencil className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                            onClick={() => setDeleteTargetId(vehicle.id)}
                                            className="p-2 rounded-lg bg-gray-800 hover:bg-red-900/40 text-gray-400 hover:text-red-400 transition-colors"
                                            title="Sil"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>

                                <p className="font-bold text-white text-base leading-tight mb-1">
                                    {[vehicle.brand, vehicle.model, vehicle.year ? `(${vehicle.year})` : ''].filter(Boolean).join(' ')}
                                </p>

                                <div className="flex flex-wrap gap-2 mb-3">
                                    {vehicle.fuelType && (
                                        <span className="flex items-center gap-1 text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded-lg">
                                            <Fuel className="w-3 h-3 text-orange-500/70" />
                                            {vehicle.fuelType}
                                        </span>
                                    )}
                                    {vehicle.km != null && (
                                        <span className="flex items-center gap-1 text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded-lg">
                                            <Gauge className="w-3 h-3 text-orange-500/70" />
                                            {formatKm(vehicle.km)}
                                        </span>
                                    )}
                                </div>

                                <div className="mt-auto">
                                    <span className="inline-block bg-yellow-400 text-gray-900 font-mono font-bold text-lg px-3 py-1 rounded">
                                        {vehicle.plate}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {showFormModal && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-900 rounded-2xl p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-lg font-bold text-white">
                                {editingVehicle ? 'Aracı Düzenle' : 'Yeni Araç Ekle'}
                            </h2>
                            <button
                                onClick={closeFormModal}
                                className="text-gray-500 hover:text-gray-300 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                                <select
                                    value={form.brand}
                                    onChange={e => setForm(prev => ({ ...prev, brand: e.target.value, model: '' }))}
                                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:border-orange-500 focus:outline-none"
                                >
                                    <option value="">
                                        {loadingBrands ? 'Yükleniyor...' : 'Marka'}
                                    </option>
                                    {brands.map(b => (
                                        <option key={b} value={b}>{b}</option>
                                    ))}
                                </select>
                                <select
                                    value={form.model}
                                    onChange={e => setForm(prev => ({ ...prev, model: e.target.value }))}
                                    disabled={!form.brand || loadingModels}
                                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:border-orange-500 focus:outline-none disabled:opacity-50"
                                >
                                    <option value="">
                                        {loadingModels ? 'Yükleniyor...' : 'Model'}
                                    </option>
                                    {models.map(m => (
                                        <option key={m} value={m}>{m}</option>
                                    ))}
                                </select>
                            </div>

                            <input
                                type="text"
                                value={form.plate}
                                onChange={e => setForm(prev => ({ ...prev, plate: e.target.value.toUpperCase().replace(/\s/g, '') }))}
                                placeholder="Plaka *"
                                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:border-orange-500 focus:outline-none placeholder-gray-500 font-mono"
                            />

                            <div className="grid grid-cols-2 gap-3">
                                <select
                                    value={form.year}
                                    onChange={e => setForm(prev => ({ ...prev, year: e.target.value }))}
                                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:border-orange-500 focus:outline-none"
                                >
                                    <option value="">Yıl</option>
                                    {YEARS.map(y => (
                                        <option key={y} value={y}>{y}</option>
                                    ))}
                                </select>
                                <select
                                    value={form.fuelType}
                                    onChange={e => setForm(prev => ({ ...prev, fuelType: e.target.value }))}
                                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:border-orange-500 focus:outline-none"
                                >
                                    <option value="">Yakıt Tipi</option>
                                    {FUEL_TYPES.map(f => (
                                        <option key={f} value={f}>{f}</option>
                                    ))}
                                </select>
                            </div>

                            <input
                                type="text"
                                value={form.color}
                                onChange={e => setForm(prev => ({ ...prev, color: e.target.value }))}
                                placeholder="Renk (opsiyonel)"
                                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:border-orange-500 focus:outline-none placeholder-gray-500"
                            />

                            <input
                                type="number"
                                value={form.km}
                                onChange={e => setForm(prev => ({ ...prev, km: e.target.value }))}
                                placeholder="Kilometre (opsiyonel)"
                                min={0}
                                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:border-orange-500 focus:outline-none placeholder-gray-500"
                            />

                            {formError && (
                                <p className="text-red-400 text-sm flex items-center gap-1.5">
                                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                                    {formError}
                                </p>
                            )}

                            <div className="flex gap-3 pt-1">
                                <button
                                    onClick={closeFormModal}
                                    className="flex-1 py-2.5 text-sm font-medium text-gray-400 bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors"
                                >
                                    Vazgeç
                                </button>
                                <button
                                    onClick={handleFormSubmit}
                                    disabled={formSubmitting}
                                    className="flex-1 py-2.5 text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {formSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                                    {editingVehicle ? 'Kaydet' : 'Araç Ekle'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {deleteTargetId !== null && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-900 rounded-2xl p-6 w-full max-w-sm mx-4">
                        <div className="flex flex-col items-center text-center mb-6">
                            <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mb-3">
                                <Trash2 className="w-6 h-6 text-red-400" />
                            </div>
                            <h2 className="text-lg font-bold text-white mb-1">Aracı Sil</h2>
                            <p className="text-gray-400 text-sm">
                                Bu aracı silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setDeleteTargetId(null)}
                                disabled={deleteSubmitting}
                                className="flex-1 py-2.5 text-sm font-medium text-gray-400 bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors disabled:opacity-50"
                            >
                                Vazgeç
                            </button>
                            <button
                                onClick={confirmDelete}
                                disabled={deleteSubmitting}
                                className="flex-1 py-2.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {deleteSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                                Sil
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
