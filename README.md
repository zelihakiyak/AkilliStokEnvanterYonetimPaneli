# 🚀 Akıllı Stok Envanter Yönetim Sistemi

Bu proje, işletmelerin stok takibini dijitalleştirmek, barkod tarama teknolojisi ile operasyonel hızı artırmak ve yapay zeka destekli analizlerle gelecek dönem stok ihtiyaçlarını tahmin etmek amacıyla geliştirilmektedir.

---

## 🛠️ Teknoloji Yığınımız

| Alan | Kullanılan Teknolojiler |
| :--- | :--- |
| **Backend** | .NET 8.0 Web API |
| **Veritabanı** | MSSQL Server (Entity Framework Core - Code First) |
| **Mobil** | React Native (TypeScript) |
| **Mimari** | Repository Pattern & Katmanlı Mimari (N-Tier Architecture) |

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
Bu hafta, uygulamaya kimlik doğrulama ve yetkilendirme altyapısı kazandırılmış; güvenli bir oturum yönetim sistemi hayata geçirilmiştir.

* **JWT Entegrasyonu:** JSON Web Token tabanlı kimlik doğrulama sistemi `.NET Core` backend'e entegre edildi; token üretimi, imzalama ve doğrulama mekanizmaları yapılandırıldı.
* **AuthContext:** React Native tarafında `AuthContext` ve `AsyncStorage` kullanılarak token yönetimi merkezi bir yapıya kavuşturuldu; uygulama her açıldığında oturum durumu otomatik olarak kontrol edilmektedir.
* **Bağlantı Sorunlarının Giderilmesi:** Android emülatörü ile `.NET` backend arasındaki CORS, port ve IP adresi yapılandırmaları tamamlandı.
  
---

## 📌 4. Hafta Gelişmeleri
Bu hafta, ürün yönetimine ilişkin tüm CRUD işlemleri hem backend hem de mobil uygulama tarafında tamamlanmış; vize teslimi kapsamındaki geliştirmeler hayata geçirilmiştir.

* **ProductsController Tamamlandı:** Ürün güncelleme (`PUT`) ve silme (`DELETE`) endpoint'leri eklendi. Barkod ile tekil ürün sorgulama endpoint'i geliştirildi.
* **Endpoint Güvenliği:** `[Authorize]` attribute'u ile tüm ürün endpoint'leri token korumasına alındı. Ürün ekleme, güncelleme ve silme işlemleri `[Authorize(Roles = "Admin")]` ile yalnızca Admin rolüyle kısıtlandı.
* **AuthContext Genişletildi:** Kullanıcı bilgisi (`user`) AuthContext'e eklendi; token ile birlikte `AsyncStorage`'a kaydedilerek uygulama genelinde erişilebilir hale getirildi.
* **Yeni Mobil Ekranlar:** `ProductsScreen` (listeleme, silme, kritik stok uyarısı), `AddProductScreen` (ürün ekleme formu) ve `EditProductScreen` (ürün güncelleme formu) ekranları geliştirildi.

---

## 📺 Haftalık İlerleme Videoları

### 🔹 HAFTA 1 - Backend Altyapısı ve Veritabanı Mimarisi
> **Açıklama:** Bu videoda boş bir projeden başlanarak veritabanı tablolarının oluşturulması, EF Core entegrasyonu ve Swagger üzerinden API testleri gösterilmektedir.
> 🔗 [**Hafta 1 İlerleme Videosu**](https://youtu.be/tInPIGB9GYA)

### 🔹 HAFTA 2 - Mobil Navigasyon ve Backend Entegrasyonu
> **Açıklama:** Projenin temel iskeletinin kurulumu, mobil uygulamanın API ile haberleşmesi ve Dashboard ekranına giriş anlatılmaktadır.
> 🔗 [**Hafta 2 İlerleme Videosu**](https://www.youtube.com/watch?v=AEs_-y3yFlc)

### 🔹 HAFTA 3 - JWT Kimlik Doğrulama ve Güvenli Oturum Yönetimi
> **Açıklama:** JWT token entegrasyonu, rol bazlı yetkilendirme, AuthContext yapısı anlatılmaktadır.
> 🔗 [**Hafta 3 İlerleme Videosu**](https://youtu.be/Yu5tpYA9Gg4)

### 🔹 HAFTA 4 - Ürün Yönetimi ve API Entegrasyonu (Vize Teslimi)
> **Açıklama:** Ürün listeleme, ekleme, güncelleme ve silme işlemlerinin backend ve mobil tarafta tamamlanması, rol bazlı yetkilendirme ve AuthContext genişletmesi anlatılmaktadır.
> 🔗 [**Hafta 4 İlerleme Videosu**](https://www.youtube.com/watch?v=dwVNvVvgUQc)
---

## 👤 Geliştirici
**Zeliha Kıyak** Ankara Üniversitesi - Bilgisayar Mühendisliği Son Sınıf Öğrencisi
