# 🚀 Akıllı Stok Envanter Yönetim Sistemi

Bu proje, işletmelerin stok takibini dijitalleştirmek, barkod tarama teknolojisi ile operasyonel hızı artırmak ve yapay zeka destekli analizlerle gelecek dönem stok ihtiyaçlarını tahmin etmek amacıyla geliştirilmektedir.

---

## 🛠️ Teknoloji Yığınımız

| Alan | Kullanılan Teknolojiler |
| :--- | :--- |
| **Backend** | .NET 8.0 Web API |
| **Veritabanı** | MSSQL Server (Entity Framework Core - Code First) |
| **Kimlik Doğrulama** | JWT Bearer Authentication, Rol Bazlı Yetkilendirme (Admin / Personel) |
| **Mobil** | React Native + Expo SDK 54 (TypeScript) |
| **Durum Yönetimi** | React Context API, AsyncStorage |
| **HTTP İstemcisi** | Axios (merkezi apiClient mimarisi) |
| **Mimari** | Repository Pattern & Katmanlı Mimari (N-Tier Architecture) |

---

## ⚙️ Kurulum ve Çalıştırma

### Backend (`AkilliStok.API`)
1. `AkilliStok.API` klasöründe bağımlılıkları yükleyin: `dotnet restore`
2. `appsettings.json` içindeki `ConnectionStrings:DefaultConnection` değerini kendi MSSQL Server adresinize göre düzenleyin (varsayılan: `Server=localhost\SQLEXPRESS;Database=AkilliStokDB`).
3. EF Core migration'larını uygulayarak veritabanını oluşturun: `dotnet ef database update`
4. API'yi başlatın: `dotnet run` — Swagger arayüzüne `https://localhost:<port>/swagger` adresinden erişilebilir.

### Mobil Uygulama (`AkilliStokExpo`)
1. `AkilliStokExpo` klasöründe bağımlılıkları yükleyin: `npm install`
2. `src/api/apiClient.ts` içindeki `baseURL` değerini, API'nizin erişilebilir adresiyle (yerel ağ IP'si veya bir ngrok tüneli) güncelleyin.
3. Uygulamayı başlatın: `npx expo start` ve Expo Go uygulaması veya bir emülatör üzerinden QR kodu okutarak çalıştırın.

> **Not:** Mobil cihazın, API'ye erişebilmesi için API ile aynı ağda olması ya da `apiClient`'ta tanımlı genel erişimli bir adres (örn. ngrok) kullanması gerekmektedir.

---

## 📺 Haftalık İlerleme Videoları

### 🔹 HAFTA 1 - Backend Altyapısı ve Veritabanı Mimarisi
> **Açıklama:** Bu videoda boş bir projeden başlanarak veritabanı tablolarının oluşturulması, EF Core entegrasyonu ve Swagger üzerinden API testleri gösterilmektedir.
> 🔗 [**Hafta 1 İlerleme Videosu**](https://youtu.be/tInPIGB9GYA?si=1ORs8yQxzfHPRoZ0)

### 🔹 HAFTA 2 - Mobil Navigasyon ve Backend Entegrasyonu
> **Açıklama:** Projenin temel iskeletinin kurulumu, mobil uygulamanın API ile haberleşmesi ve Dashboard ekranına giriş anlatılmaktadır.
> 🔗 [**Hafta 2 İlerleme Videosu**](https://youtu.be/AEs_-y3yFlc?si=aB1nAXWf7My5HHGR)

### 🔹 HAFTA 3 - Mobil Ekran Tasarımları ve UI Geliştirme
> **Açıklama:** Tüm uygulama ekranlarının (Login, Dashboard, Ürün Listesi, Ürün Detay, Stok Hareket, Barkod Tara) mockup'a uygun şekilde tasarlanması ve navigasyon akışının tamamlanması anlatılmaktadır.
> 🔗 [**Hafta 3 İlerleme Videosu**](https://youtu.be/Yu5tpYA9Gg4?si=yBv-xytkQdQorvFx)

### 🔹 HAFTA 4 - JWT Kimlik Doğrulama ve Rol Bazlı Yetkilendirme
> **Açıklama:** Backend'de JWT token üretimi, `[Authorize(Roles)]` attribute'ları ve mobil tarafta AuthContext + AsyncStorage ile güvenli oturum yönetiminin hayata geçirilmesi anlatılmaktadır.
> 🔗 [**Hafta 4 İlerleme Videosu**](https://youtu.be/dwVNvVvgUQc?si=9lCvJhpxnn5BGfbI)

### 🔹 HAFTA 5-6 - Hata Giderme, Expo Migrasyonu ve Stabilizasyon
> **Açıklama:** Expo SDK uyumsuzluğunun giderilmesi, TypeScript derleme hatalarının çözümü, eksik StockLogs endpoint'inin eklenmesi ve SQL NULL hatasının düzeltilmesi anlatılmaktadır.
> 🔗 [**Hafta 5-6 İlerleme Videosu**](https://youtu.be/3Em_-unGBLk?si=YQ3uQsWEA-necTuv)

### 🔹 HAFTA 7 - Kamera Entegrasyonu, Stok Loglama ve Tahminleme Algoritması
> **Açıklama:** `expo-camera` ile gerçek kamera ve barkod okuma entegrasyonu, `OldStock`/`NewStock` ile gelişmiş stok loglama ve `ForecastController` ile akıllı tahminleme algoritmasının (günlük tüketim analizi, tahmini bitiş süresi, risk seviyesi) geliştirilmesi anlatılmaktadır.
> 🔗 [**Hafta 7 İlerleme Videosu**](https://youtu.be/wSngDmpQosA?si=tTHgU0vysVtr1ehv)

### 🔹 HAFTA 8 - Raporlar Modülü ve Veri Analiz Ekranları
> **Açıklama:** `RaporlarScreen` içinde sekmeli bir rapor merkezinin kurulması; Kritik Stok, Tahmin, Stok Hareketleri ve Özet raporlarının geliştirilmesi, risk seviyelerinin renklendirilmesi ve `useMemo`/`reduce` gibi performans odaklı veri dönüştürme tekniklerinin kullanılması anlatılmaktadır.
> 🔗 [**Hafta 8 İlerleme Videosu**](https://youtu.be/0_hUlw18ZAM?si=DhgSYQAle_vi4GLr)

### 🔹 HAFTA 9 - Dinamik Bildirimler ve Kritik Uyarılar
> **Açıklama:** Tahminleme algoritmasından gelen "3 gün içinde bitecek ürünler" verisinin, uygulama açılışında tek seferlik `Alert` penceresi ve Dashboard'da kalıcı bir uyarı banner'ı (Badge) olarak kullanıcıya sunulması anlatılmaktadır.
> 🔗 [**Hafta 9 İlerleme Videosu**](https://youtu.be/_B-MyTYgmns?si=9hT092iuKE7mdTZm)

### 🔹 HAFTA 10 - Ayarlar Modülünün Tamamlanması, Performans ve API Optimizasyonları
> **Açıklama:** Ayarlar menüsünün sadeleştirilmesi, "Profili Düzenle" ve "Şifre Değiştir" özelliklerinin uçtan uca (backend uç noktaları + yeni ekranlar + AuthContext genişletmesi) hayata geçirilmesi, `UrunListesiScreen`'deki `FlatList`'in `React.memo`/`useCallback` ve performans props'larıyla optimize edilmesi ve API controller'larındaki gereksiz veri yüklerinin (`AsNoTracking`, gereksiz `Include` kaldırımı, hafif projeksiyonlar) temizlenmesi anlatılmaktadır.
> 🔗 [**Hafta 10 İlerleme Videosu**](https://www.youtube.com/watch?v=5NP4-QUKkbQ)

---

## 📌 1. Hafta Gelişmeleri
Projenin ilk haftasında sistemin veritabanı mimarisi ve API uçları kurgulanmıştır:

* **Veritabanı Tasarımı:** `Products`, `Categories` ve `StockLogs` tabloları arasındaki **One-to-Many** ilişkiler Code-First yaklaşımıyla modellendi.
* **API Geliştirme:** CRUD işlemleri ve mobil tarayıcı (scanner) için kritik olan `barcode/{code}` endpoint'i başarıyla oluşturuldu.
* **Veri Tutarlılığı:** Stok hareketleri üzerinden otomatik envanter güncelleme mekanizması kuruldu.
* **Dökümantasyon:** Swagger entegrasyonu tamamlanarak tüm uç noktalar test edildi.

---

## 📌 2. Hafta Gelişmeleri
Bu hafta, projenin temel iskeleti kurulmuş ve istemci (Mobil) ile sunucu (API) arasındaki iletişim başarıyla sağlanmıştır.

* **Backend Geliştirme:** .NET Core Web API projesi oluşturuldu, `AppDbContext` ile MSSQL bağlantısı yapıldı ve `Users` controller'ı eklendi.
* **CORS & Güvenlik:** Mobil cihazların API'ye erişebilmesi için CORS politikaları yapılandırıldı ve Android `Cleartext Traffic` izinleri ayarlandı.
* **Mobil Navigasyon:** `React Navigation` (Stack & Tab Navigation) kullanılarak **Giriş Yap -> Dashboard** akışı kurgulandı.
* **API Bağlantısı:** `Axios` kütüphanesi ve merkezi bir `apiClient` mimarisi ile mobil uygulamanın veritabanından veri çekmesi sağlandı.

---

## 📌 3. Hafta Gelişmeleri
Bu hafta, mobil uygulamanın tüm ekranları tasarım mockup'larına uygun şekilde geliştirilmiş ve kullanıcı arayüzü tamamlanmıştır.

* **Ekran Tasarımları:** `LoginScreen`, `DashboardScreen`, `UrunListesiScreen`, `UrunDetayScreen`, `BarkodTaraScreen` ve `StokHareketScreen` ekranları modern bir UI anlayışıyla yeniden tasarlandı.
* **Dashboard:** `useMemo` ile performans optimizasyonu sağlandı; toplam ürün, düşük stok sayısı, toplam envanter değeri ve kategori sayısı istatistikleri hesaplanarak gösterildi. Stok durumunu görselleştiren özel bir mini bar grafik (kütüphane kullanılmadan) geliştirildi.
* **Ürün Listesi:** `FlatList` ile performanslı liste rendering, gerçek zamanlı arama (ürün adı ve barkod üzerinden) ve chip tabanlı filtre (`Tümü` / `Düşük Stok`) sistemi kuruldu.
* **Ürün Detay:** Kritik stok uyarı banner'ı, toplam envanter değeri hesabı ve stok hareketi yönlendirme butonu eklendi.
* **Stok Hareket Formu:** Barkod ile ürün sorgulama, `In`/`Out` toggle, miktar artırma/azaltma ve client-side yetersiz stok validasyonu tamamlandı.
* **Ürün Ekleme & Düzenleme:** `AddProductScreen` ve `EditProductScreen` ekranları oluşturularak Admin kullanıcıların ürün yönetimi yapabilmesi sağlandı.
* **Navigasyon:** `App.tsx` içinde tüm ekranlar `RootStackParamList` ile tip güvenli şekilde tanımlandı.

---

## 📌 4. Hafta Gelişmeleri
Bu hafta, sisteme kimlik doğrulama ve rol bazlı yetkilendirme altyapısı kazandırılmıştır.

* **JWT Authentication (Backend):** `UsersController` içinde `GenerateToken()` metodu yazıldı. Token içine `sub`, `email`, `fullName`, `role` ve `jti` claim'leri gömüldü; token süresi 8 saat olarak ayarlandı.
* **Yetkilendirme Katmanı:** `ProductsController`'a sınıf seviyesinde `[Authorize]`, silme ve güncelleme işlemlerine `[Authorize(Roles = "Admin")]` attribute'ları eklendi. Böylece Personel rolü salt-okunur, Admin rolü tam yetkili hale getirildi.
* **AuthContext (Mobil):** `React Context API` ile uygulama genelinde kullanıcı oturumu yönetimi sağlandı. Token ve kullanıcı bilgileri `AsyncStorage`'a kaydedilerek uygulama yeniden açıldığında oturum korundu.
* **Axios Entegrasyonu:** Başarılı girişin ardından `apiClient.defaults.headers.common['Authorization']` otomatik set edilerek sonraki tüm istekler token ile gönderilir hale getirildi. 401 hatası alındığında header otomatik temizlendi.
* **Rol Bazlı UI:** `isAdmin` boolean değerine göre Dashboard'da "Ürün Ekle" butonu, UrunDetay'da Edit ve Sil butonları yalnızca Admin kullanıcılara gösterildi.
* **Auth-gated Routing:** `App.tsx`'te `user` state'i null ise `LoginScreen`, dolu ise uygulama stack'i gösterecek şekilde otomatik yönlendirme kuruldu.

---

## 📌 5-6. Hafta Gelişmeleri
Bu haftalarda proje kararlı hale getirilmiş, kritik hatalar giderilmiş ve Expo ortamına geçiş tamamlanmıştır.

* **Expo SDK Migrasyonu:** Expo Go uyumsuzluğu nedeniyle proje `create-expo-app` ile sıfırdan oluşturulan `AkilliStokExpo` projesine taşındı. Expo SDK 54 (`expo ~54.0.33`, `react-native 0.81.5`) ile uyumlu bağımlılıklar `npx expo install` komutuyla kuruldu.
* **Metro Bundler Yapılandırması:** `metro.config.js` dosyası `@react-native/metro-config` yerine `expo/metro-config` kullanacak şekilde güncellendi.
* **TypeScript Derleme Hataları:** `RootStackParamList` tip tanımları, `AuthContext` dönüş tipleri ve ekran prop'larındaki tüm TypeScript hataları giderildi; `npx tsc --noEmit` sıfır hata ile tamamlanır hale getirildi.
* **StockLogs GET Endpoint'i:** `StockLogsController`'a eksik olan `GET /api/StockLogs` endpoint'i eklendi; loglar `ProductName` ile birlikte tarihe göre azalan sırada döndürülür hale getirildi.
* **SQL NULL Hatası Giderme:** `StockLog` modeline `Note` ve `TransactionType` alanlarına `string.Empty` varsayılan değerleri eklenerek veritabanına NULL insert hatasının önüne geçildi.
* **Hata Yönetimi İyileştirmesi:** `StokHareketScreen`'deki catch bloğu, API'den dönen özel hata mesajını (`err?.response?.data?.message`) kullanıcıya gösterecek şekilde geliştirildi.
* **AsyncStorage API Güncellemesi:** Yeni `@react-native-async-storage` sürümüyle uyumsuz olan `multiRemove` çağrısı, `Promise.all([removeItem(...), removeItem(...)])` yapısıyla değiştirildi.

---

## 📌 7. Hafta Gelişmeleri
Bu hafta projeye akıllı tahminleme motoru, gerçek kamera entegrasyonu ve gelişmiş stok loglama sistemi kazandırılmıştır.

* **Kamera Entegrasyonu:** `expo-camera` kütüphanesi ile telefon kamerası uygulamaya entegre edildi. `Camera.requestCameraPermissionsAsync()` ile kamera izni alındı, `CameraView` bileşeniyle EAN-13, EAN-8, QR Code, Code128 ve Code39 formatlarındaki barkodlar otomatik okunur hale getirildi.
* **Akıllı Barkod Akışı:** Okutulan barkoda ait ürün veritabanında bulunamazsa kullanıcıya üç seçenek sunuluyor: İptal, Stok Hareketi veya Yeni Ürün Ekle. "Yeni Ürün Ekle" seçildiğinde `AddProductScreen` açılıyor ve barkod alanı otomatik dolu ve kilitli geliyor.
* **OldStock & NewStock Loglama:** `StockLog` modeline `OldStock` (işlem öncesi stok) ve `NewStock` (işlem sonrası stok) alanları eklendi. `POST /api/StockLogs` endpoint'i her işlemde bu iki değeri otomatik hesaplayıp kaydediyor.
* **Tahminleme Algoritması:** `ForecastController` oluşturuldu. Algoritma: son 30 günlük çıkış hareketlerinden günlük ortalama tüketim (`DailyUsage = totalOut / 30`) hesaplanıyor, ardından `EstimatedDaysLeft = CurrentStock / DailyUsage` formülüyle ürünün tahmini bitiş süresi belirleniyor. Her ürün için `Kritik` (≤7 gün), `Düşük` (≤14 gün), `Orta` (≤30 gün) ve `Yeterli` risk seviyeleri atanıyor. Sonuçlar en kritik üründen başlayarak sıralı döndürülüyor.
* **Swagger Entegrasyonu:** Tüm yeni endpoint'ler (`GET /api/Forecast`, `GET /api/Forecast/{id}`) Swagger üzerinden test edildi ve doğrulandı.

---

## 📌 8. Hafta Gelişmeleri
Bu hafta uygulamaya, tahminleme algoritmasından gelen verileri kullanıcıya analiz edilebilir şekilde sunan kapsamlı bir **Raporlar** modülü kazandırılmıştır.

* **Raporlar Ekranı Mimarisi:** `RaporlarScreen` içinde `createMaterialTopTabNavigator` kullanılarak, alt sekmeli (bottom tab bar) bir rapor merkezi kuruldu. Her rapor türü kendi bağımsız bileşeninde (`KritikRaporu`, `TahminRaporu`, `HareketlerRaporu`, `OzetRaporu`) izole edildi.
* **Kritik Stok Raporu:** `currentStock <= criticalLimit` koşuluna göre filtrelenen ürünler listelendi; her kart üzerinde `currentStock / criticalLimit` oranına göre dolan bir ilerleme çubuğu (progress bar) ile stok durumu görselleştirildi.
* **Tahmin Raporu:** `GET /api/Forecast` endpoint'inden dönen risk seviyeleri (`Kritik`, `Düşük`, `Orta`, `Yeterli`, `Veri Yok`), `RISK_COLORS` adlı bir lookup table ile renklendirilerek hem özet sayaç kartlarında hem de ürün bazlı kartlarda gösterildi.
* **Stok Hareketleri Raporu:** Tüm giriş/çıkış hareketleri arama ve filtre çipleriyle birlikte listelendi; `useMemo` kullanılarak filtrelenmiş veri her API isteği yapılmadan, bellekte yeniden hesaplandı.
* **Özet Raporu:** `reduce` tabanlı tek geçişli bir hesaplama ile toplam ürün sayısı, toplam stok değeri ve kritik ürün sayısı gibi genel istatistikler özetlendi; her ürün kartında birim fiyat ve toplam değer Türkçe para birimi formatında (`toLocaleString('tr-TR')`) gösterildi.
* **Ortak Veri Akışı:** Tüm rapor ekranlarında `useFocusEffect` ile ekrana her odaklanıldığında veya aşağı çekilip yenilendiğinde (`pull-to-refresh`) verinin otomatik tazelenmesi sağlandı.

---

## 📌 9. Hafta Gelişmeleri
Bu hafta uygulamaya, tahminleme algoritmasından gelen verilere dayalı **dinamik bildirim ve kritik uyarı sistemi** kazandırılmıştır.

* **Açılışta Tek Seferlik Uyarı (Alert):** Uygulama açıldığında veya Dashboard ekranı yüklendiğinde, `GET /api/Forecast` endpoint'inden dönen veriler taranarak `estimatedDaysLeft <= 3` koşulunu sağlayan ürünler tespit ediliyor. Bu ürünler varsa, kullanıcıya isim ve tahmini gün sayısıyla birlikte bir `Alert.alert` penceresi gösteriliyor. `useRef(false)` ile oluşturulan `alertShown` bayrağı sayesinde bu uyarı oturum başına yalnızca bir kez tetikleniyor, gereksiz tekrarların önüne geçiliyor.
* **Kalıcı Uyarı Banner'ı (Badge):** Dashboard'da istatistik kartlarının hemen altına, kritik ürün sayısı kadar kırmızı çerçeveli bir "🚨 Acil Stok Uyarısı" banner'ı yerleştirildi. Banner, "X ürün 3 gün içinde tükenecek" mesajını gösteriyor ve üzerine dokunulduğunda doğrudan Raporlar ekranına yönlendiriyor.
* **Gerçek Zamanlı Güncelleme:** `forecast` state'i her `fetchData` çağrısında (ekran açılışında ve pull-to-refresh ile) yeniden çekiliyor, böylece banner ve uyarılar güncel stok durumunu birebir yansıtıyor.

---

## 📌 10. Hafta Gelişmeleri
Bu hafta, **Ayarlar** modülü işlevsel hale getirilmiş; mobil uygulamada liste performansı iyileştirilmiş ve backend tarafında gereksiz veri yükleri temizlenmiştir.

* **Ayarlar Menüsü Sadeleştirme:** `AyarlarScreen` içindeki henüz işlevsel olmayan **"Görünüm"** satırı menüden kaldırıldı; yalnızca tam işlevsel olan **Hesap** ve **Bildirimler** bölümleri kullanıcıya sunulur hale getirildi.
* **"Profili Düzenle" Özelliği (Uçtan Uca):** `HesapScreen`'deki yer tutucu (`handleNotImplemented`) kaldırılarak gerçek bir profil düzenleme akışı eklendi. Backend'de `[Authorize]` korumalı `PUT /api/Users/profile` uç noktası (JWT claim'inden kullanıcı kimliği doğrulama, e-posta benzersizlik kontrolü, alan doğrulama) ve yeni `ProfilDuzenleScreen` ekranı (Ad Soyad/E-posta formu, e-posta regex doğrulaması, "değişiklik var mı" kontrolüyle kaydet butonunun aktif/pasif yönetimi) oluşturuldu.
* **"Şifre Değiştir" Özelliği (Uçtan Uca):** Aynı şekilde `[Authorize]` korumalı `PUT /api/Users/change-password` uç noktası (mevcut şifre doğrulama, en az 6 karakter kuralı, yeni şifrenin eskisinden farklı olması kontrolü) ve yeni `SifreDegistirScreen` ekranı (Mevcut/Yeni/Yeni Şifre Tekrar alanları, eşleşme ve uzunluk doğrulamaları) eklendi.
* **AuthContext Genişletmesi:** `AuthContext`'e, profil güncellemesinin ardından oturum açan kullanıcının bilgilerini hem React state'inde hem `AsyncStorage`'da yeniden giriş yapmaya gerek kalmadan tazeleyen `updateUser` metodu kazandırıldı.
* **Navigasyon:** Yeni `ProfilDuzenle` ve `SifreDegistir` ekranları `RootStackParamList`'e ve `App.tsx` Stack Navigator'üne tip güvenli şekilde eklendi.
* **FlatList Performans Optimizasyonu:** Uygulamadaki tek `FlatList` kullanım noktası olan `UrunListesiScreen`'de, `ProductCard` bileşeni özel karşılaştırma fonksiyonuyla `React.memo`'ya alındı; `keyExtractor` ve `renderItem` referansları `useCallback` ile sabitlenerek gereksiz yeniden render'ların önüne geçildi. Ayrıca `removeClippedSubviews`, `initialNumToRender`, `maxToRenderPerBatch`, `updateCellsBatchingPeriod` ve `windowSize` props'ları eklenerek liste kaydırma performansı ve bellek kullanımı iyileştirildi.
* **API'de Gereksiz Yüklerin Temizlenmesi:** `ProductsController` ve `CategoriesController`'daki salt-okunur `GET` uç noktalarına `.AsNoTracking()` eklenerek Entity Framework Core'un gereksiz değişiklik izleme (change tracking) yükü kaldırıldı. `StockLogsController`'daki `GET /api/StockLogs` uç noktasında, projeksiyon zaten yalnızca `ProductName` alanını kullandığından gereksiz hale gelen `.Include(l => l.Product)` çağrısı kaldırılarak EF Core'un tek bir SQL JOIN üretmesi sağlandı. `ForecastController`'da ise tüm ürünleri ve stok hareketlerini tam varlık olarak yükleyen sorgular, yalnızca hesaplama için gerekli alanları seçen hafif projeksiyonlara dönüştürüldü; tüm bu sorgulara `.AsNoTracking()` eklendi.

---

## 👤 Geliştirici
**Zeliha Kıyak** Ankara Üniversitesi - Bilgisayar Mühendisliği Son Sınıf Öğrencisi
