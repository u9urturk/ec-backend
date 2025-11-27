# Product Category API - Frontend Integration Brief

Bu doküman, ürün kategori yönetimi için backend API'sinin frontend entegrasyonu hakkında detaylı bilgi içermektedir.

## 📍 Base URL
```
http://localhost:3001/product-categories
```

## 🔗 API Endpoints

### 1. Yeni Kategori Oluşturma
**POST** `/product-categories`

```javascript
// Request
const createCategory = async (categoryData) => {
  const response = await fetch('http://localhost:3001/product-categories', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: "Elektronik", // Zorunlu
      parentId: "uuid-parent-id" // Opsiyonel, alt kategori için
    })
  });
  
  return response.json();
};

// Response (201 Created)
{
  "success": true,
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "Elektronik",
    "parentId": null,
    "productCount": 0,
    "parent": null,
    "children": [],
    "createdAt": "2024-11-26T15:45:22.000Z"
  },
  "message": "Request completed successfully"
}
```

### 2. Tüm Kategorileri Listeleme
**GET** `/product-categories`

```javascript
// Query parametreleri ile filtreleme
const getCategories = async (filters = {}) => {
  const params = new URLSearchParams();
  
  // Filtreleme seçenekleri
  if (filters.search) params.append('search', filters.search);
  if (filters.parentId) params.append('parentId', filters.parentId);
  if (filters.sortBy) params.append('sortBy', filters.sortBy); // 'name', 'createdAt', 'productCount'
  if (filters.sortOrder) params.append('sortOrder', filters.sortOrder); // 'asc', 'desc'
  if (filters.includeProducts) params.append('includeProducts', filters.includeProducts);
  if (filters.rootsOnly) params.append('rootsOnly', filters.rootsOnly);
  
  const response = await fetch(`http://localhost:3001/product-categories?${params}`);
  return response.json();
};

// Kullanım örnekleri
getCategories({ search: "elektronik" });
getCategories({ parentId: "uuid-here", sortBy: "name", sortOrder: "asc" });
getCategories({ rootsOnly: true });
```

### 3. Kök Kategorileri Getirme
**GET** `/product-categories/roots`

```javascript
// Sadece ana kategorileri (parent'ı olmayan) getirir
const getRootCategories = async () => {
  const response = await fetch('http://localhost:3001/product-categories/roots');
  return response.json();
};

// Response - Ana kategoriler ve alt kategorileri ile birlikte
{
  "success": true,
  "data": [
    {
      "id": "root-category-id",
      "name": "Elektronik",
      "parentId": null,
      "children": [
        {
          "id": "sub-category-id",
          "name": "Telefon",
          "parentId": "root-category-id",
          "productCount": 25
        }
      ],
      "productCount": 100
    }
  ]
}
```

### 4. Tekil Kategori Detayı
**GET** `/product-categories/:id`

```javascript
const getCategoryById = async (categoryId) => {
  const response = await fetch(`http://localhost:3001/product-categories/${categoryId}`);
  return response.json();
};

// Response - Kategori detayı
{
  "success": true,
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "Smartphone",
    "parentId": "parent-category-id",
    "productCount": 25,
    "parent": {
      "id": "parent-category-id",
      "name": "Elektronik"
    },
    "children": [
      {
        "id": "child-id",
        "name": "iPhone",
        "productCount": 10
      }
    ],
    "createdAt": "2024-11-26T15:45:22.000Z"
  }
}
```

### 5. Kategori Hiyerarşisi
**GET** `/product-categories/:id/hierarchy`

```javascript
// Belirtilen kategoriden başlayarak tam hiyerarşiyi getirir
const getCategoryHierarchy = async (categoryId) => {
  const response = await fetch(`http://localhost:3001/product-categories/${categoryId}/hierarchy`);
  return response.json();
};

// Response - İç içe kategori yapısı
{
  "success": true,
  "data": {
    "id": "electronics-id",
    "name": "Elektronik",
    "children": [
      {
        "id": "phone-id",
        "name": "Telefon",
        "children": [
          {
            "id": "iphone-id",
            "name": "iPhone",
            "children": [],
            "productCount": 15
          }
        ],
        "productCount": 25
      }
    ],
    "productCount": 100
  }
}
```

### 6. Kategori Güncelleme
**PATCH** `/product-categories/:id`

```javascript
const updateCategory = async (categoryId, updateData) => {
  const response = await fetch(`http://localhost:3001/product-categories/${categoryId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updateData)
  });
  
  return response.json();
};

// Kullanım örnekleri
updateCategory("category-id", { name: "Yeni İsim" });
updateCategory("category-id", { parentId: "new-parent-id" });
updateCategory("category-id", { name: "Güncellenmiş İsim", parentId: null });
```

### 7. Kategori Silme
**DELETE** `/product-categories/:id`

```javascript
const deleteCategory = async (categoryId) => {
  const response = await fetch(`http://localhost:3001/product-categories/${categoryId}`, {
    method: 'DELETE'
  });
  
  // 204 No Content response - başarılı silme
  if (response.status === 204) {
    return { success: true };
  }
  
  // Hata durumunda JSON response
  return response.json();
};
```

## 🎯 Frontend Uygulama Örnekleri

### React Hooks ile Kategori Yönetimi

```javascript
// hooks/useCategories.js
import { useState, useEffect } from 'react';

export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCategories = async (filters = {}) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key]) params.append(key, filters[key]);
      });
      
      const response = await fetch(`http://localhost:3001/product-categories?${params}`);
      const result = await response.json();
      
      if (result.success) {
        setCategories(result.data);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createCategory = async (categoryData) => {
    try {
      const response = await fetch('http://localhost:3001/product-categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoryData)
      });
      
      const result = await response.json();
      if (result.success) {
        setCategories(prev => [...prev, result.data]);
        return result.data;
      } else {
        throw new Error(result.message);
      }
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    loading,
    error,
    fetchCategories,
    createCategory,
    setError
  };
};
```

### Kategori Ağaç Yapısı Komponenti

```javascript
// components/CategoryTree.jsx
import React from 'react';

const CategoryTree = ({ categories, onCategorySelect, onCategoryEdit, onCategoryDelete }) => {
  const renderCategory = (category, level = 0) => (
    <div key={category.id} style={{ marginLeft: `${level * 20}px` }}>
      <div className="category-item">
        <span onClick={() => onCategorySelect(category)}>
          {category.name} ({category.productCount} ürün)
        </span>
        <button onClick={() => onCategoryEdit(category)}>Düzenle</button>
        <button onClick={() => onCategoryDelete(category.id)}>Sil</button>
      </div>
      
      {category.children && category.children.map(child => 
        renderCategory(child, level + 1)
      )}
    </div>
  );

  return (
    <div className="category-tree">
      {categories.map(category => renderCategory(category))}
    </div>
  );
};

export default CategoryTree;
```

### Kategori Formu Komponenti

```javascript
// components/CategoryForm.jsx
import React, { useState } from 'react';

const CategoryForm = ({ onSubmit, initialData = {}, parentCategories = [] }) => {
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    parentId: initialData.parentId || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      parentId: formData.parentId || null
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Kategori Adı:</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          required
        />
      </div>
      
      <div>
        <label>Ana Kategori:</label>
        <select
          value={formData.parentId}
          onChange={(e) => setFormData({...formData, parentId: e.target.value})}
        >
          <option value="">Ana Kategori Olarak Oluştur</option>
          {parentCategories.map(category => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      
      <button type="submit">
        {initialData.id ? 'Güncelle' : 'Oluştur'}
      </button>
    </form>
  );
};

export default CategoryForm;
```

## 🚨 Hata Yönetimi

### Yaygın Hata Kodları

```javascript
// Hata handling örneği
const handleApiError = (error) => {
  switch (error.statusCode) {
    case 400:
      if (error.error === 'VALIDATION_ERROR') {
        // Validasyon hataları
        console.log('Validasyon hataları:', error.details);
      } else {
        // İş mantığı hataları
        console.log('Hata:', error.message);
      }
      break;
      
    case 404:
      console.log('Kategori bulunamadı');
      break;
      
    case 409:
      console.log('Bu isimde kategori zaten mevcut');
      break;
      
    default:
      console.log('Beklenmeyen hata:', error.message);
  }
};
```

### Hata Response Formatı

```json
{
  "statusCode": 400,
  "timestamp": "2024-11-26T15:45:22.000Z",
  "path": "/product-categories",
  "method": "POST",
  "error": "VALIDATION_ERROR",
  "message": "Validation failed",
  "details": {
    "name": ["name should not be empty"]
  }
}
```

## 💡 Frontend İpuçları

### 1. Kategori Dropdown/Select Komponenti
```javascript
const CategorySelector = ({ value, onChange, allowEmpty = true }) => {
  const { categories } = useCategories();
  
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}>
      {allowEmpty && <option value="">Kategori Seçin</option>}
      {categories.map(category => (
        <option key={category.id} value={category.id}>
          {category.name}
        </option>
      ))}
    </select>
  );
};
```

### 2. Arama ve Filtreleme
```javascript
const CategoryList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  
  const { categories, fetchCategories } = useCategories();
  
  useEffect(() => {
    fetchCategories({
      search: searchTerm,
      sortBy,
      sortOrder
    });
  }, [searchTerm, sortBy, sortOrder]);
  
  return (
    <div>
      <input
        type="text"
        placeholder="Kategori ara..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      
      <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
        <option value="name">İsime Göre</option>
        <option value="productCount">Ürün Sayısına Göre</option>
        <option value="createdAt">Oluşturma Tarihine Göre</option>
      </select>
      
      {/* Kategori listesi */}
    </div>
  );
};
```

### 3. Optimistic Updates
```javascript
const useCategoryMutations = () => {
  const { categories, setCategories } = useCategories();
  
  const createCategoryOptimistic = async (categoryData) => {
    // Optimistic update
    const tempId = Date.now().toString();
    const optimisticCategory = {
      id: tempId,
      ...categoryData,
      productCount: 0,
      createdAt: new Date().toISOString()
    };
    
    setCategories(prev => [...prev, optimisticCategory]);
    
    try {
      const result = await createCategory(categoryData);
      // Gerçek veri ile güncelle
      setCategories(prev => 
        prev.map(cat => cat.id === tempId ? result.data : cat)
      );
    } catch (error) {
      // Hata durumunda optimistic update'i geri al
      setCategories(prev => prev.filter(cat => cat.id !== tempId));
      throw error;
    }
  };
  
  return { createCategoryOptimistic };
};
```

## 🔧 Swagger Dokümantasyonu

API'nin detaylı dokümantasyonuna buradan erişebilirsiniz:
```
http://localhost:3001/api/docs
```

Bu dokümanda:
- Tüm endpoint'lerin detaylı açıklamaları
- Request/Response örnekleri
- Interaktif test arayüzü
- DTO şemaları

bulunmaktadır.