'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Badge } from '@/components/ui/badge';
import { Search, MapPin, Star, ExternalLink, Filter } from 'lucide-react';

// Dummy data
const products = [
  {
    id: 1,
    name: '맥북 에어 M3 13인치',
    category: '노트북',
    lowestPrice: 1290000,
    stores: [
      { name: '쿠팡', price: 1290000, rating: 4.5, distance: '2.3km', url: '#' },
      { name: '네이버쇼핑', price: 1320000, rating: 4.3, distance: '온라인', url: '#' },
      { name: '11번가', price: 1350000, rating: 4.2, distance: '온라인', url: '#' },
    ],
    image: '/api/placeholder/200/200',
  },
  {
    id: 2,
    name: '아이폰 15 Pro 128GB',
    category: '스마트폰',
    lowestPrice: 1350000,
    stores: [
      { name: 'Apple Store', price: 1550000, rating: 4.8, distance: '5.2km', url: '#' },
      { name: '하이마트', price: 1420000, rating: 4.4, distance: '1.8km', url: '#' },
      { name: '전자랜드', price: 1350000, rating: 4.3, distance: '3.1km', url: '#' },
    ],
    image: '/api/placeholder/200/200',
  },
  {
    id: 3,
    name: '삼성 갤럭시 버즈 3',
    category: '이어폰',
    lowestPrice: 180000,
    stores: [
      { name: '삼성스토어', price: 199000, rating: 4.6, distance: '4.5km', url: '#' },
      { name: '쿠팡', price: 180000, rating: 4.4, distance: '2.3km', url: '#' },
      { name: 'G마켓', price: 185000, rating: 4.2, distance: '온라인', url: '#' },
    ],
    image: '/api/placeholder/200/200',
  },
];

const categories = ['전체', '노트북', '스마트폰', '이어폰', '태블릿', '카메라', '가전제품'];

export default function MapPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [filteredProducts, setFilteredProducts] = useState(products);

  const handleSearch = () => {
    let filtered = products;
    
    if (searchQuery) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (selectedCategory !== '전체') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }
    
    setFilteredProducts(filtered);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    let filtered = products;
    
    if (category !== '전체') {
      filtered = filtered.filter(product => product.category === category);
    }
    
    if (searchQuery) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setFilteredProducts(filtered);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div>
          <h1 className="text-h2 font-bold text-gray-900 mb-2">최저가 맵</h1>
          <p className="text-gray-600">전국 매장의 실시간 가격을 비교해보세요</p>
        </div>

        {/* Search Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Search className="w-6 h-6 mr-2 text-primary" />
              상품 검색
            </CardTitle>
            <CardDescription>
              찾고 있는 상품을 검색하고 최저가를 확인하세요
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="상품명을 입력하세요"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="flex-1"
              />
              <Button onClick={handleSearch}>
                <Search className="w-4 h-4 mr-2" />
                검색
              </Button>
            </div>
            
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Badge
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  className="cursor-pointer hover:bg-primary hover:text-white"
                  onClick={() => handleCategoryChange(category)}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Results Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              검색 결과 ({filteredProducts.length}개)
            </h2>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              필터
            </Button>
          </div>

          {filteredProducts.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">검색 결과가 없습니다</h3>
                <p className="text-gray-600">다른 검색어를 시도해보세요</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {filteredProducts.map((product) => (
                <Card key={product.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex space-x-4">
                        <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                          <img 
                            src={product.image} 
                            alt={product.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{product.name}</CardTitle>
                          <CardDescription className="mb-2">{product.category}</CardDescription>
                          <div className="flex items-center space-x-2">
                            <span className="text-2xl font-bold text-primary">
                              {product.lowestPrice.toLocaleString()}원
                            </span>
                            <Badge variant="secondary">최저가</Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <h4 className="font-semibold mb-3">판매 매장</h4>
                      {product.stores.map((store, index) => (
                        <div 
                          key={index}
                          className={`p-3 rounded-lg border ${
                            index === 0 ? 'border-primary bg-primary/5' : 'border-gray-200'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div>
                                <div className="flex items-center space-x-2 mb-1">
                                  <span className="font-medium">{store.name}</span>
                                  {index === 0 && (
                                    <Badge variant="secondary" className="text-xs">
                                      최저가
                                    </Badge>
                                  )}
                                </div>
                                <div className="flex items-center text-sm text-gray-600 space-x-3">
                                  <div className="flex items-center">
                                    <Star className="w-4 h-4 text-yellow-400 mr-1" />
                                    {store.rating}
                                  </div>
                                  <div className="flex items-center">
                                    <MapPin className="w-4 h-4 mr-1" />
                                    {store.distance}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <span className="text-lg font-bold">
                                {store.price.toLocaleString()}원
                              </span>
                              <Button size="sm" variant="outline">
                                <ExternalLink className="w-4 h-4 mr-1" />
                                구매
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}