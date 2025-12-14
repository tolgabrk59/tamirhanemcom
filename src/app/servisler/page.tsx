import { redirect } from 'next/navigation';

export default function ServislerPage() {
  // Yeni servis sonuçları sayfasına yönlendir
  redirect('/servisler/sonuclar');
}
