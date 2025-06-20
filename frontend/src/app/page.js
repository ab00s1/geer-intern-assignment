"use client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";

import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Button } from "../components/ui/button";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState([0, 10000000]);
  const [selectedTag, setSelectedTag] = useState(null);
  const [allTags, setAllTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    setCurrentPage(1); // Reset page on filter change
  }, [searchTerm, priceRange, selectedTag]);

  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/signin");
        return;
      }

      try {
        const res = await axios.get("http://localhost:5000/api/products/all", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const allProducts = res.data.products;
        setProducts(allProducts);
        setFilteredProducts(allProducts);

        // Extract unique tags from products
        const tagsSet = new Set();
        allProducts.forEach((product) => {
          if (Array.isArray(product.tags)) {
            product.tags.forEach((tag) => tagsSet.add(tag.toLowerCase()));
          }
        });
        setAllTags(Array.from(tagsSet));
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [router]);

  useEffect(() => {
    const filtered = products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesPrice =
        product.price >= priceRange[0] && product.price <= priceRange[1];
      const matchesTag = selectedTag
        ? product.tags?.map((t) => t.toLowerCase()).includes(selectedTag)
        : true;
      return matchesSearch && matchesPrice && matchesTag;
    });
    setFilteredProducts(filtered);
  }, [searchTerm, priceRange, selectedTag, products]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-white px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-600 mb-4">
        <Link href="/" className="hover:text-gray-900">
          Home
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900 font-medium">All Products</span>
      </div>

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        <h1 className="text-2xl font-bold text-gray-900">All Products</h1>
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-gray-300 rounded-md py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
          <Link href="/createProduct">
            <Button className="whitespace-nowrap">+ Create Product</Button>
          </Link>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <div className="lg:w-1/4 space-y-8">
          {/* Price Filter */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Filter by Price
            </h3>
            <div className="space-y-3 text-sm text-gray-700">
              {[
                { label: "Under ₹20,000", range: [0, 20000] },
                { label: "₹20,000 - ₹50,000", range: [20000, 50000] },
                { label: "Above ₹50,000", range: [50000, 10000000] },
                { label: "Clear Filter", range: [0, 10000000] },
              ].map((option, idx) => (
                <label key={idx} className="flex items-center">
                  <input
                    type="radio"
                    name="price"
                    className="mr-2"
                    onChange={() => setPriceRange(option.range)}
                    checked={
                      priceRange[0] === option.range[0] &&
                      priceRange[1] === option.range[1]
                    }
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </div>

          {/* Tag Filter */}
          {allTags.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Filter by Category
              </h3>
              <div className="space-y-2 text-sm text-gray-700">
                {allTags.map((tag, idx) => (
                  <label key={idx} className="flex items-center capitalize">
                    <input
                      type="radio"
                      name="tag"
                      className="mr-2"
                      value={tag}
                      checked={selectedTag === tag}
                      onChange={() => setSelectedTag(tag)}
                    />
                    {tag}
                  </label>
                ))}
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="tag"
                    className="mr-2"
                    value=""
                    checked={selectedTag === null}
                    onChange={() => setSelectedTag(null)}
                  />
                  Clear Tag Filter
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Products Grid */}
        <div className="lg:w-3/4">
          {loading ? (
            <div className="text-center text-gray-500">Loading products...</div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center text-gray-500">No products found.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {paginatedProducts.map((product) => (
                <Link
                  key={product._id}
                  href={`/product/${product._id}`}
                  className="group block border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition"
                >
                  <div className="relative aspect-square bg-gray-100">
                    {/* First Image (default) */}
                    <Image
                      src={product.images?.[0] || "/placeholder.jpg"}
                      alt={product.name || "Product image"}
                      fill
                      className="object-cover transition-opacity duration-300 group-hover:opacity-0"
                    />

                    {/* Second Image (on hover) */}
                    {product.images?.[1] && (
                      <Image
                        src={product.images[1]}
                        alt={`${product.name || "Product"} - alternate view`}
                        fill
                        className="object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                      />
                    )}
                  </div>
                  <div className="p-4 space-y-1">
                    <h2 className="text-lg font-medium text-gray-900 group-hover:text-gray-700">
                      {product.name}
                    </h2>
                    <p className="text-sm text-gray-500">
                      ₹{product.price.toLocaleString()}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  aria-disabled={currentPage === 1}
                />
              </PaginationItem>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => {
                  // Optionally show ellipses if you have many pages
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    return (
                      <PaginationItem key={page}>
                        <PaginationLink
                          isActive={page === currentPage}
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  } else if (
                    (page === currentPage - 2 && page > 2) ||
                    (page === currentPage + 2 && page < totalPages - 1)
                  ) {
                    return (
                      <PaginationItem key={`ellipsis-${page}`}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    );
                  } else {
                    return null;
                  }
                }
              )}

              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  aria-disabled={currentPage === totalPages}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
