# Docker Services Kurulumu

Bu proje PostgreSQL, Redis, Kafka ve yönetim panelleri için Docker Compose kullanır.

## Servisler ve Portlar

### Veritabanı
- **PostgreSQL**: `localhost:5432`
  - Database: `ecommerce_db`
  - Username: `admin`
  - Password: `admin123`
- **pgAdmin**: `http://localhost:8080`
  - Email: `admin@admin.com`
  - Password: `admin123`

### Cache
- **Redis**: `localhost:6379`
  - Password: `redis123`
- **Redis Commander**: `http://localhost:8082`

### Message Queue
- **Kafka**: `localhost:9092`
- **Zookeeper**: `localhost:2181`
- **Kafka UI**: `http://localhost:8081`

## Kullanım

### Servisleri Başlatma
```bash
# Tüm servisleri arka planda başlat
docker-compose up -d

# Logları takip et
docker-compose logs -f

# Belirli bir servisi başlat
docker-compose up -d postgres
```

### Servisleri Durdurma
```bash
# Tüm servisleri durdur
docker-compose down

# Verileri de sil
docker-compose down -v
```

### Servis Durumunu Kontrol Etme
```bash
# Çalışan servisleri listele
docker-compose ps

# Servis loglarını görüntüle
docker-compose logs postgres
docker-compose logs kafka
docker-compose logs redis
```

## Prisma Kurulumu

Docker servislerini başlattıktan sonra Prisma'yı kurmak için:

```bash
# Prisma client'ı yükle
npm install @prisma/client

# Prisma migration'larını çalıştır
npx prisma migrate dev --name init

# Prisma client'ı generate et
npx prisma generate

# Prisma Studio'yu başlat (isteğe bağlı)
npx prisma studio
```

## Yönetim Panelleri

### pgAdmin (PostgreSQL)
1. `http://localhost:8080` adresine git
2. Email: `admin@admin.com`, Password: `admin123` ile giriş yap
3. Yeni server ekle:
   - Host: `postgres`
   - Port: `5432`
   - Username: `admin`
   - Password: `admin123`
   - Database: `ecommerce_db`

### Kafka UI
1. `http://localhost:8081` adresine git
2. Kafka cluster'ını görüntüle ve topic'leri yönet

### Redis Commander
1. `http://localhost:8082` adresine git
2. Redis verilerini görüntüle ve yönet

## Troubleshooting

### Port Çakışması
Eğer portlar çakışıyorsa, `docker-compose.yml` dosyasında port mapping'lerini değiştirin.

### Veri Silme
```bash
# Tüm Docker volume'larını sil
docker-compose down -v
docker volume prune
```

### Container'ları Yeniden Build Etme
```bash
docker-compose down
docker-compose up -d --build
```