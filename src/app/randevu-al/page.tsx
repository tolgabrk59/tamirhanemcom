'use client';

import { useState, useEffect } from 'react';
import { vehicleYears } from '@/data/vehicles';
import { turkeyLocations, cityList } from '@/data/turkey-locations';

const fuelTypes = ['Benzin', 'Dizel', 'LPG', 'Hibrit', 'Elektrik', 'Benzin + LPG'];
// 30 dakikalik saat araliklari
const timeSlots = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00'];

interface Category { id: number; name: string; }
interface Brand { brand: string; }
interface Model { model: string; }
interface Service { id: number; name: string; location: string; phone?: string; rating?: number; }

type Step = 'form' | 'otp';

export default function RandevuAlPage() {
    const [step, setStep] = useState<Step>('form');
    const [city, setCity] = useState('');
    const [district, setDistrict] = useState('');
    const [vehicleType, setVehicleType] = useState<'otomobil' | 'motorsiklet'>('otomobil');
    const [brand, setBrand] = useState('');
    const [model, setModel] = useState('');
    const [year, setYear] = useState('');
    const [fuelType, setFuelType] = useState('');
    const [category, setCategory] = useState('');
    const [phone, setPhone] = useState('');
    const [name, setName] = useState('');
    const [notes, setNotes] = useState('');
    const [plate, setPlate] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [otpCode, setOtpCode] = useState('');
    const [otpCountdown, setOtpCountdown] = useState(0);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [submitMessage, setSubmitMessage] = useState('');
    const [categories, setCategories] = useState<Category[]>([]);
    const [brands, setBrands] = useState<Brand[]>([]);
    const [models, setModels] = useState<Model[]>([]);
    const [loading, setLoading] = useState(false);
    const [categoriesLoading, setCategoriesLoading] = useState(true);
    const [brandsLoading, setBrandsLoading] = useState(true);
    const [modelsLoading, setModelsLoading] = useState(false);
    const [services, setServices] = useState<Service[]>([]);
    const [selectedService, setSelectedService] = useState('');
    const [servicesLoading, setServicesLoading] = useState(false);
    const [appointmentDate, setAppointmentDate] = useState('');
    const [appointmentTime, setAppointmentTime] = useState('');

    useEffect(() => {
        if (otpCountdown > 0) {
            const timer = setTimeout(() => setOtpCountdown(otpCountdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [otpCountdown]);

    useEffect(() => {
        fetch('/api/categories').then(res => res.json()).then(data => {
            if (data.success) { setCategories(data.data); const defCat = data.data.find((c: Category) => c.name.includes('Temizlik') && c.name.includes('Detayland')); if (defCat) setCategory(defCat.name); }
            setCategoriesLoading(false);
        }).catch(() => setCategoriesLoading(false));
    }, []);

    useEffect(() => {
        setBrandsLoading(true);
        setBrand('');
        setModel('');
        setModels([]);
        fetch('/api/brands?vehicleType=' + vehicleType).then(res => res.json()).then(data => {
            if (data.success) setBrands(data.data);
        }).finally(() => setBrandsLoading(false));
    }, [vehicleType]);

    useEffect(() => {
        if (brand) {
            setModelsLoading(true);
            setModel('');
            fetch('/api/models?brand=' + encodeURIComponent(brand) + '&vehicleType=' + vehicleType)
                .then(res => res.json()).then(data => {
                    if (data.success) setModels(data.data);
                    else setModels([]);
                }).catch(() => setModels([]))
                .finally(() => setModelsLoading(false));
        } else {
            setModels([]);
            setModel('');
        }
    }, [brand, vehicleType]);

    useEffect(() => {
        if (category && city) {
            setServicesLoading(true);
            setSelectedService('');
            const params = new URLSearchParams();
            params.set('category', category);
            params.set('city', city);
            if (district) params.set('district', district);
            if (brand) params.set('brand', brand);
            if (model) params.set('model', model);
            fetch('/api/services/search?' + params.toString())
                .then(res => res.json()).then(data => {
                    if (data.success) setServices(data.data);
                    else setServices([]);
                }).catch(() => setServices([]))
                .finally(() => setServicesLoading(false));
        } else {
            setServices([]);
            setSelectedService('');
        }
    }, [category, city, district, brand, model]);

    const districts = city ? turkeyLocations[city] || [] : [];
    const isFormValid = phone && city && brand && model && category;

    const handleSendOTP = async () => {
        setLoading(true);
        setSubmitStatus('idle');
        try {
            const cleanPhone = phone.replace(/[\s-]/g, '');
            const response = await fetch('/api/otp/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone: cleanPhone })
            });
            const result = await response.json();
            if (result.success) {
                setOtpCountdown(60);
                setStep('otp');
                setSubmitStatus('success');
                setSubmitMessage(result.message);
            } else {
                setSubmitStatus('error');
                setSubmitMessage(result.error);
            }
        } catch {
            setSubmitStatus('error');
            setSubmitMessage('SMS gönderilemedi. Lütfen tekrar deneyin.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async () => {
        setLoading(true);
        setSubmitStatus('idle');
        try {
            const cleanPhone = phone.replace(/[\s-]/g, '');
            // Strapi ile OTP dogrula ve kullanici olustur
            const response = await fetch('/api/otp/verify-and-register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone: cleanPhone, code: otpCode, name: name || undefined })
            });
            const result = await response.json();
            if (result.success) {
                // Kullanici kaydedildi, simdi randevu olustur
                await submitAppointment(true, result.user?.username, result.jwt, result.user?.id);
            } else {
                setSubmitStatus('error');
                const remaining = result.remainingAttempts !== undefined ? ' (' + result.remainingAttempts + ' deneme kaldı)' : '';
                setSubmitMessage(result.error + remaining);
            }
        } catch {
            setSubmitStatus('error');
            setSubmitMessage('Doğrulama başarısız.');
        } finally {
            setLoading(false);
        }
    };



    const submitAppointment = async (isRegistered: boolean, autoUsername?: string, jwt?: string, userId?: number) => {
        try {
            const response = await fetch('/api/randevu-talebi', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    phone,
                    name: name || undefined,
                    city,
                    district: district || undefined,
                    brand,
                    model,
                    year: year || undefined,
                    fuelType: fuelType || undefined,
                    category,
                    notes: notes || undefined,
                    service_id: selectedService || undefined,
                    appointment_date: appointmentDate || undefined,
                    appointment_time: appointmentTime || undefined,
                    jwt: jwt || undefined,
                    userId: userId || undefined
                })
            });
            const result = await response.json();
            if (result.success) {
                // Her randevuda Telegram bildirimi gönder
                fetch('/api/notifications/whatsapp', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name,
                        phone,
                        city,
                        district,
                        brand,
                        model,
                        year,
                        category,
                        notes,
                        service: services.find(s => String(s.id) === selectedService)?.name,
                        isRegistered,
                        username: autoUsername || username || undefined,
                        email: isRegistered ? email : undefined,
                        plate: isRegistered ? plate : undefined,
                        appointmentDate,
                        appointmentTime
                    })
                }).catch(() => {});
                setSubmitStatus('success');
                const msg = 'Randevu talebiniz alındı! Hesap bilgileriniz SMS ile gönderildi. En kısa sürede sizinle iletişime geçeceğiz.';
                setSubmitMessage(msg);
                resetForm();
            } else {
                setSubmitStatus('error');
                setSubmitMessage(result.error || 'Bir hata oluştu.');
            }
        } catch {
            setSubmitStatus('error');
            setSubmitMessage('Bağlantı hatası. Lütfen tekrar deneyin.');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setStep('form'); setPhone(''); setName(''); setCity(''); setDistrict('');
        setBrand(''); setModel(''); setYear(''); setFuelType(''); setCategory('');
        setNotes(''); setPlate(''); setUsername(''); setEmail(''); setPassword('');
        setConfirmPassword(''); setOtpCode('');
    };

    const renderOTPStep = () => (
        <div className="space-y-4">
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">SMS Doğrulama</h2>
                <p className="text-primary-100">{phone} numarasına gönderilen 6 haneli kodu giriniz</p>
            </div>
            <input type="text" inputMode="numeric" maxLength={6} value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                placeholder="000000" className="w-full px-4 py-4 border-0 rounded-xl bg-white/90 text-secondary-900 text-center text-2xl tracking-widest font-mono focus:ring-2 focus:ring-white" />
            {otpCountdown > 0 && <p className="text-primary-100 text-center text-sm">Yeni kod göndermek için {otpCountdown} saniye bekleyin</p>}
            {submitStatus !== 'idle' && <div className={"p-4 rounded-xl " + (submitStatus === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800')}>{submitMessage}</div>}
            <button type="button" onClick={handleVerifyOTP} disabled={otpCode.length !== 6 || loading}
                className="w-full bg-secondary-900 text-white py-4 rounded-xl font-semibold text-lg hover:bg-secondary-800 transition-colors disabled:bg-secondary-400 disabled:cursor-not-allowed">
                {loading ? 'Doğrulanıyor...' : 'Doğrula'}
            </button>
            <div className="flex gap-2">
                <button type="button" onClick={() => setStep('form')} className="flex-1 bg-white/20 text-white py-3 rounded-xl font-medium hover:bg-white/30 transition-colors">Geri Dön</button>
                <button type="button" onClick={handleSendOTP} disabled={otpCountdown > 0 || loading}
                    className="flex-1 bg-white/20 text-white py-3 rounded-xl font-medium hover:bg-white/30 transition-colors disabled:opacity-50">Tekrar Gönder</button>
            </div>
        </div>
    );


    const renderFormStep = () => (
        <form onSubmit={(e) => { e.preventDefault(); handleSendOTP(); }} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <select value={city} onChange={(e) => { setCity(e.target.value); setDistrict(''); }}
                    className="w-full px-3 py-2 border-0 rounded-lg text-sm bg-white/90 text-secondary-900 focus:ring-2 focus:ring-white">
                    <option value="">Şehir</option>
                    {cityList.map((c) => (<option key={c} value={c}>{c}</option>))}
                </select>
                <select value={district} onChange={(e) => setDistrict(e.target.value)} disabled={!city}
                    className="w-full px-3 py-2 border-0 rounded-lg text-sm bg-white/90 text-secondary-900 focus:ring-2 focus:ring-white disabled:bg-white/50">
                    <option value="">İlçe</option>
                    {districts.map((d) => (<option key={d} value={d}>{d}</option>))}
                </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <input type="date" value={appointmentDate} onChange={(e) => setAppointmentDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    max={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border-0 rounded-lg text-sm bg-white/90 text-secondary-900 focus:ring-2 focus:ring-white" />
                <select value={appointmentTime} onChange={(e) => setAppointmentTime(e.target.value)}
                    className="w-full px-3 py-2 border-0 rounded-lg text-sm bg-white/90 text-secondary-900 focus:ring-2 focus:ring-white">
                    <option value="">Saat Seçiniz</option>
                    {timeSlots.map((t) => (<option key={t} value={t}>{t}</option>))}
                </select>
            </div>
            <select value={vehicleType} onChange={(e) => setVehicleType(e.target.value as 'otomobil' | 'motorsiklet')}
                className="w-full px-3 py-2 border-0 rounded-lg text-sm bg-white/90 text-secondary-900 focus:ring-2 focus:ring-white">
                <option value="otomobil">Otomobil</option>
                <option value="motorsiklet">Motorsiklet</option>
            </select>
            <div className="grid grid-cols-2 gap-4">
                <select value={brand} onChange={(e) => setBrand(e.target.value)}
                    className="w-full px-3 py-2 border-0 rounded-lg text-sm bg-white/90 text-secondary-900 focus:ring-2 focus:ring-white">
                    <option value="">Marka</option>
                    {brandsLoading ? (<option disabled>Yükleniyor...</option>) : brands.map((b) => (<option key={b.brand} value={b.brand}>{b.brand}</option>))}
                </select>
                <select value={model} onChange={(e) => setModel(e.target.value)} disabled={!brand}
                    className="w-full px-3 py-2 border-0 rounded-lg text-sm bg-white/90 text-secondary-900 focus:ring-2 focus:ring-white disabled:bg-white/50">
                    <option value="">Model</option>
                    {modelsLoading ? (<option disabled>Yükleniyor...</option>) : models.map((m) => (<option key={m.model} value={m.model}>{m.model}</option>))}
                </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <select value={year} onChange={(e) => setYear(e.target.value)}
                    className="w-full px-3 py-2 border-0 rounded-lg text-sm bg-white/90 text-secondary-900 focus:ring-2 focus:ring-white">
                    <option value="">Model Yılı</option>
                    {vehicleYears.map((y) => (<option key={y} value={y}>{y}</option>))}
                </select>
                <select value={fuelType} onChange={(e) => setFuelType(e.target.value)}
                    className="w-full px-3 py-2 border-0 rounded-lg text-sm bg-white/90 text-secondary-900 focus:ring-2 focus:ring-white">
                    <option value="">Yakıt Tipi</option>
                    {fuelTypes.map((f) => (<option key={f} value={f}>{f}</option>))}
                </select>
            </div>
            <select value={category} onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border-0 rounded-lg text-sm bg-white/90 text-secondary-900 focus:ring-2 focus:ring-white">
                <option value="">Hizmet Kategorisi</option>
                {categoriesLoading ? (<option disabled>Yükleniyor...</option>) : categories.map((cat) => (<option key={cat.id} value={cat.name}>{cat.name}</option>))}
            </select>
            {services.length > 0 && (
                <select value={selectedService} onChange={(e) => setSelectedService(e.target.value)}
                    className="w-full px-3 py-2 border-0 rounded-lg text-sm bg-white/90 text-secondary-900 focus:ring-2 focus:ring-white">
                    <option value="">Servis Seçiniz</option>
                    {servicesLoading ? (<option disabled>Yükleniyor...</option>) : services.map((srv) => (
                        <option key={srv.id} value={srv.id}>{srv.name} - {srv.location}{srv.rating ? ' (' + srv.rating.toFixed(1) + ')' : ''}</option>
                    ))}
                </select>
            )}
            <input type="tel" inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                placeholder="Telefon Numarası * (5XX XXX XX XX)" required
                className="w-full px-3 py-2 border-0 rounded-lg text-sm bg-white/90 text-secondary-900 focus:ring-2 focus:ring-white placeholder-secondary-500" />
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ad Soyad (Opsiyonel)"
                className="w-full px-3 py-2 border-0 rounded-lg text-sm bg-white/90 text-secondary-900 focus:ring-2 focus:ring-white placeholder-secondary-500" />
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Ek notlar (Opsiyonel)" rows={2}
                className="w-full px-3 py-2 border-0 rounded-lg text-sm bg-white/90 text-secondary-900 focus:ring-2 focus:ring-white placeholder-secondary-500 resize-none" />
            {submitStatus !== 'idle' && <div className={"p-4 rounded-xl " + (submitStatus === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800')}>{submitMessage}</div>}
            <button type="submit" disabled={!isFormValid || loading}
                className="w-full bg-secondary-900 text-white py-4 rounded-xl font-semibold text-lg hover:bg-secondary-800 transition-colors disabled:bg-secondary-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2">
                {loading ? 'SMS Gönderiliyor...' : 'Randevu Talebi Gönder'}
            </button>
        </form>
    );

    return (
        <div className="min-h-screen">
            <section className="min-h-[calc(100vh-64px)] bg-white relative overflow-hidden flex items-center">
                <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-5" style={{ backgroundImage: 'url(/hero-bg.png)' }} />
                <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="text-center lg:text-left">
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-secondary-900 mb-6 leading-tight">
                                Servis Randevusu<br /><span className="text-primary-600">Hemen Al</span>
                            </h1>
                            <p className="text-xl text-secondary-600 mb-8 max-w-xl">
                                Aracınız için en uygun servisi bulun ve hemen randevu alın. Şeffaf fiyatlandırma, kaliteli hizmet garantisi.
                            </p>
                            <div className="flex flex-wrap justify-center lg:justify-start gap-6 mb-8">
                                <div className="flex items-center gap-2 text-secondary-700"><span className="text-primary-600">✓</span><span>Şeffaf Fiyatlandırma</span></div>
                                <div className="flex items-center gap-2 text-secondary-700"><span className="text-primary-600">✓</span><span>Onaylı Servisler</span></div>
                                <div className="flex items-center gap-2 text-secondary-700"><span className="text-primary-600">✓</span><span>Garanti Güvencesi</span></div>
                            </div>
                            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0">
                                <div className="text-center lg:text-left"><p className="text-2xl md:text-3xl font-bold text-primary-600">500+</p><p className="text-secondary-500 text-sm">Servis</p></div>
                                <div className="text-center lg:text-left"><p className="text-2xl md:text-3xl font-bold text-primary-600">50K+</p><p className="text-secondary-500 text-sm">Müşteri</p></div>
                                <div className="text-center lg:text-left"><p className="text-2xl md:text-3xl font-bold text-primary-600">4.8</p><p className="text-secondary-500 text-sm">Puan</p></div>
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 rounded-3xl shadow-2xl p-8 md:p-10">
                            <div className="text-center mb-6">
                                <h2 className="text-2xl font-bold text-white mb-2">
                                    {step === 'form' && 'Araç Bilgilerinizi Girin'}
                                    {step === 'otp' && 'SMS Doğrulama'}
                                    
                                </h2>
                                <p className="text-primary-100">
                                    {step === 'form' && 'Size en yakın servisleri bulalım'}
                                    {step === 'otp' && 'Telefonunuza gelen kodu girin'}
                                    
                                </p>
                            </div>
                            {step === 'form' && renderFormStep()}
                            {step === 'otp' && renderOTPStep()}
                            
                        </div>
                    </div>
                </div>
            </section>
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-2xl font-bold text-secondary-900 text-center mb-12">Neden TamirHanem?</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center p-6"><div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4"><span className="text-3xl">💰</span></div><h3 className="text-lg font-semibold text-secondary-900 mb-2">Şeffaf Fiyatlandırma</h3><p className="text-secondary-600">Tüm fiyatları önceden görün.</p></div>
                        <div className="text-center p-6"><div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4"><span className="text-3xl">🛡️</span></div><h3 className="text-lg font-semibold text-secondary-900 mb-2">Onaylı Servisler</h3><p className="text-secondary-600">Tüm servislerimiz onaylı.</p></div>
                        <div className="text-center p-6"><div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4"><span className="text-3xl">⏱️</span></div><h3 className="text-lg font-semibold text-secondary-900 mb-2">Hızlı Randevu</h3><p className="text-secondary-600">Dakikalar içinde randevu alın.</p></div>
                    </div>
                </div>
            </section>
            <section className="py-16 bg-secondary-900 text-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold mb-4">Hemen Başlayın</h2>
                    <p className="text-secondary-300 text-lg mb-8">Aracınız için en uygun servisi bulun.</p>
                    <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        className="inline-flex items-center gap-2 bg-primary-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-primary-700 transition-colors">
                        ↑ Yukarıdan Başla
                    </button>
                </div>
            </section>
        </div>
    );
}
