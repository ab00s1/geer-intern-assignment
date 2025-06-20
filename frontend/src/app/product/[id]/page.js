"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { Trash2, Loader2 } from "lucide-react";

const ProductDetail = () => {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const token = localStorage.getItem("token");

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState(0);
  const [emblaApi, setEmblaApi] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/product/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProduct(res.data.product);
      } catch (err) {
        setError("Failed to fetch product.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      router.push("/");
    } catch (err) {
      setError("Failed to delete product.");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        <Loader2 className="animate-spin h-6 w-6 mr-2" /> Loading product...
      </div>
    );

  if (error)
    return <div className="text-center mt-10 text-red-600">{error}</div>;
  if (!product)
    return (
      <div className="text-center mt-10 text-gray-600">No product found.</div>
    );

  return (
    <div className="max-w-7xl mx-auto p-6 sm:p-8 bg-white min-h-screen">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-4">
        <span
          className="hover:underline cursor-pointer"
          onClick={() => router.push("/")}
        >
          Home
        </span>{" "}
        / <span className="capitalize">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="p-4">
          <Carousel setApi={setEmblaApi}>
            <CarouselContent>
              {product.images?.map((img, idx) => (
                <CarouselItem key={idx}>
                  <div className="relative aspect-square w-full">
                  <Image
                    src={img}
                    alt={`Product image ${idx + 1}`}
                    fill
                    className="object-cover"
                  />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>

          {/* Thumbnail Gallery */}
          {product.images?.length > 1 && (
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedImage(idx);
                    emblaApi?.scrollTo(idx);
                  }}
                  className={`border-2 rounded overflow-hidden ${
                    idx === selectedImage
                      ? "border-black"
                      : "border-transparent"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    width={100}
                    height={100}
                    className="object-cover w-full h-full"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4 space-y-6">
          <div>
            <h1 className="text-3xl font-serif font-semibold text-gray-900">
              {product.name}
            </h1>
            <p className="mt-2 text-gray-600">{product.description}</p>
          </div>

          <div className="text-2xl font-bold text-gray-900">
            ₹{Number(product.price).toLocaleString()}
          </div>

          {product.brand && (
            <p className="text-sm text-gray-500">
              Brand:{" "}
              <span className="text-gray-700 font-medium">{product.brand}</span>
            </p>
          )}

          {product.tags && (
            <div className="text-sm text-gray-600">
              Tags:{" "}
              {Array.isArray(product.tags)
                ? product.tags.join(", ")
                : product.tags}
            </div>
          )}

          <div className="pt-6 border-t">
            <button
              onClick={handleDelete}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Product
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
