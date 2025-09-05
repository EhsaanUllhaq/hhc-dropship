"use client";
import { CustomButton, DashboardSidebar, SectionTitle } from "@/components";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  convertCategoryNameToURLFriendly as convertSlugToURLFriendly,
  formatCategoryName,
} from "../../../../../utils/categoryFormating";
import { nanoid } from "nanoid";

interface DashboardProductDetailsProps {
  params: { id: number };
}

const DashboardProductDetails = ({
  params: { id },
}: DashboardProductDetailsProps) => {
  const [product, setProduct] = useState<Product>();
  const [categories, setCategories] = useState<Category[]>();
  const [otherImages, setOtherImages] = useState<OtherImages[]>([]);
  const router = useRouter();

  // functionality for deleting product
  const deleteProduct = async () => {
    const requestOptions = {
      method: "DELETE",
    };
    fetch(`http://localhost:3001/api/products/${id}`, requestOptions)
      .then((response) => {
        if (response.status !== 204) {
          if (response.status === 400) {
            toast.error(
              "Cannot delete the product because of foreign key constraint"
            );
          } else {
            throw Error("There was an error while deleting product");
          }
        } else {
          toast.success("Product deleted successfully");
          router.push("/admin/products");
        }
      })
      .catch((error) => {
        toast.error("There was an error while deleting product");
      });
  };

  // functionality for updating product
  const updateProduct = async () => {
    if (
      product?.title === "" ||
      product?.slug === "" ||
      product?.price.toString() === "" ||
      product?.manufacturer === "" ||
      product?.description === ""
    ) {
      toast.error("You need to enter values in input fields");
      return;
    }

    const requestOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    };
    fetch(`http://localhost:3001/api/products/${id}`, requestOptions)
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else {
          throw Error("There was an error while updating product");
        }
      })
      .then((data) => toast.success("Product successfully updated"))
      .catch((error) => {
        toast.error("There was an error while updating product");
      });
  };

  // functionality for uploading main image file
  const uploadFile = async (file: any) => {
    const formData = new FormData();
    formData.append("uploadedFile", file);

    try {
      const response = await fetch("http://localhost:3001/api/main-image", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
      } else {
        toast.error("File upload unsuccessful.");
      }
    } catch (error) {
      console.error("There was an error while during request sending:", error);
      toast.error("There was an error during request sending");
    }
  };

  // fetching main product data including other product images
  const fetchProductData = async () => {
    fetch(`http://localhost:3001/api/products/${id}`)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setProduct(data);
      });

    const imagesData = await fetch(`http://localhost:3001/api/images/${id}`, {
      cache: "no-store",
    });
    const images = await imagesData.json();
    setOtherImages((currentImages) => images);
  };

  // fetching all product categories. It will be used for displaying categories in select category input
  const fetchCategories = async () => {
    fetch(`http://localhost:3001/api/categories`)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setCategories(data);
      });
  };

  useEffect(() => {
    fetchCategories();
    fetchProductData();
  }, [id]);

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto flex flex-col xl:flex-row gap-10">
        <DashboardSidebar />

        <div className="bg-white shadow-md rounded-lg p-8 w-full">
          <h1 className="text-3xl font-bold mb-10 text-gray-900">Edit Product</h1>

          {/* Row 1: Name + Manufacturer */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative">
              <input
                type="text"
                id="product-name"
                value={product?.title}
                onChange={(e) => setProduct({ ...product!, title: e.target.value })}
                placeholder=" "
                className="peer w-full border border-gray-300 rounded-md px-4 pt-3 pb-2.5 text-gray-900 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <label htmlFor="product-name" className="absolute text-gray-500 text-sm left-1.5 -top-2 bg-white px-4 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-600">
                Product name
              </label>
            </div>

            <div className="relative">
              <input
                type="text"
                id="manufacturer"
                value={product?.manufacturer}
                onChange={(e) =>
                  setProduct({ ...product!, manufacturer: e.target.value })
                }
                placeholder=" "
                className="peer w-full border border-gray-300 rounded-md px-4 pt-3 pb-2.5 text-gray-900 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <label htmlFor="manufacturer" className="absolute text-gray-500 text-sm left-1.5 -top-2 bg-white px-4 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-600">
                Manufacturer
              </label>
            </div>
          </div>

          {/* Row 2: Price + Category + In Stock */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="relative">
              <input
                type="text"
                id="product-price"
                value={product?.price}
                onChange={(e) =>
                  setProduct({ ...product!, price: Number(e.target.value) })
                }
                placeholder=" "
                className="peer w-full border border-gray-300 rounded-md px-4 pt-3 pb-2.5 text-gray-900 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <label htmlFor="product-price" className="absolute text-gray-500 text-sm left-1.5 -top-2 bg-white px-4 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-600">
                Price
              </label>
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1 absolute left-1.5 -top-2 px-4 bg-white">Category</label>
              <select
                className="w-full border border-gray-300 rounded-md px-4 py-2 pt-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={product?.categoryId}
                onChange={(e) =>
                  setProduct({ ...product!, categoryId: e.target.value })
                }
              >
                {categories?.map((category: Category) => (
                  <option key={category.id} value={category.id}>
                    {formatCategoryName(category.name)}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1 absolute left-1.5 -top-2 px-4 bg-white">In Stock</label>
              <select
                className="w-full border border-gray-300 rounded-md px-4 py-2 pt-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={product?.inStock}
                onChange={(e) =>
                  setProduct({ ...product!, inStock: Number(e.target.value) })
                }
              >
                <option value={1}>Yes</option>
                <option value={0}>No</option>
              </select>
            </div>
          </div>

          {/* Row 3: Slug + File */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="relative">
              <input
                type="text"
                id="slug"
                value={product?.slug && convertSlugToURLFriendly(product?.slug)}
                onChange={(e) =>
                  setProduct({
                    ...product!,
                    slug: convertSlugToURLFriendly(e.target.value),
                  })
                }
                placeholder=" "
                className="peer w-full border border-gray-300 rounded-md px-4 pb-2.5 text-gray-900 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <label htmlFor="slug" className="absolute text-gray-500 text-sm left-1.5 -top-2 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-600">
                Slug
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 hidden">Main Image</label>
              <input
                type="file"
                className="file-input file-input-bordered w-full"
                onChange={(e) => {
                  const selectedFile = e?.target.files?.[0];
                  if (selectedFile) {
                    uploadFile(selectedFile);
                    setProduct({ ...product!, mainImage: selectedFile.name });
                  }
                }}
              />
            </div>
          </div>

          {/* Description */}
          <div className="mt-8">
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Description</label>
            <textarea
              className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-900 h-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={product?.description}
              onChange={(e) =>
                setProduct({ ...product!, description: e.target.value })
              }
            />
          </div>

          {/* Main Image Preview */}
          {product?.mainImage && (
            <div className="mt-6">
              <Image
                src={`/${product.mainImage}`}
                alt="Main image"
                width={120}
                height={120}
                className="rounded border border-gray-200"
              />
            </div>
          )}

          {/* Other Images */}
          {otherImages?.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-4">
              {otherImages.map((image) => (
                <Image
                  key={nanoid()}
                  src={`/${image.image}`}
                  alt="product"
                  width={120}
                  height={120}
                  className="rounded-md border border-gray-300"
                />
              ))}
            </div>
          )}

          {/* Buttons */}
          <div className="mt-10 flex flex-wrap gap-4">
            <button
              onClick={updateProduct}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md text-base font-semibold shadow-sm transition"
            >
              Update Product
            </button>
            <button
              onClick={deleteProduct}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-md text-base font-semibold shadow-sm transition"
            >
              Delete Product
            </button>
          </div>

          {/* Warning */}
          <p className="mt-6 text-red-600 font-medium text-sm max-w-xl">
            ⚠️ To delete the product, you must first remove all related records from the <code>customer_order_product</code> table.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardProductDetails;
