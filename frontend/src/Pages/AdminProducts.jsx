import { useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Package,
  Search,
  Loader2,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

function AdminProducts() {
  // =========================
  // Products State
  // =========================
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // Modal State
  // =========================
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // =========================
  // Form State
  // =========================
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    category: "",
    stock: "",
    attributes: [],
  });

  // =========================
  // UI State
  // =========================
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // =========================
  // Backend URL
  // =========================
  const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  const PRODUCTS_API_URL = `${API_URL}/products`;

  // =========================
  // Get Admin Token
  // =========================
  const getToken = () => {
    return localStorage.getItem("adminToken");
  };

  // =========================
  // Fetch Products
  // =========================
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(PRODUCTS_API_URL);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Products load nahi ho sake."
        );
      }

      setProducts(data.products || []);
    } catch (error) {
      console.error("Products fetch error:", error);

      setError(
        error.message ||
          "Products load nahi ho sake. Backend check karein."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // Fetch on Page Load
  // =========================
  useEffect(() => {
    fetchProducts();
  }, []);

  // =========================
  // Handle Form Change
  // =========================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // Add New Option
  // =========================
  const addOption = () => {
    setFormData((prev) => ({
      ...prev,
      attributes: [
        ...prev.attributes,
        {
          name: "",
          values: [""],
        },
      ],
    }));
  };

  // =========================
  // Remove Option
  // =========================
  const removeOption = (optionIndex) => {
    setFormData((prev) => ({
      ...prev,
      attributes: prev.attributes.filter(
        (_, index) => index !== optionIndex
      ),
    }));
  };

  // =========================
  // Change Option Name
  // =========================
  const handleOptionNameChange = (optionIndex, value) => {
    setFormData((prev) => ({
      ...prev,
      attributes: prev.attributes.map((option, index) =>
        index === optionIndex
          ? {
              ...option,
              name: value,
            }
          : option
      ),
    }));
  };

  // =========================
  // Add Value
  // =========================
  const addValue = (optionIndex) => {
    setFormData((prev) => ({
      ...prev,
      attributes: prev.attributes.map((option, index) =>
        index === optionIndex
          ? {
              ...option,
              values: [...option.values, ""],
            }
          : option
      ),
    }));
  };

  // =========================
  // Remove Value
  // =========================
  const removeValue = (optionIndex, valueIndex) => {
    setFormData((prev) => ({
      ...prev,
      attributes: prev.attributes.map((option, index) => {
        if (index !== optionIndex) return option;

        return {
          ...option,
          values: option.values.filter(
            (_, index) => index !== valueIndex
          ),
        };
      }),
    }));
  };

  // =========================
  // Change Value
  // =========================
  const handleValueChange = (
    optionIndex,
    valueIndex,
    value
  ) => {
    setFormData((prev) => ({
      ...prev,
      attributes: prev.attributes.map((option, index) => {
        if (index !== optionIndex) return option;

        return {
          ...option,
          values: option.values.map(
            (currentValue, currentIndex) =>
              currentIndex === valueIndex
                ? value
                : currentValue
          ),
        };
      }),
    }));
  };

  // =========================
  // Open Add Modal
  // =========================
  const handleAddProduct = () => {
    setEditingProduct(null);

    setFormData({
      name: "",
      description: "",
      price: "",
      image: "",
      category: "",
      stock: "",
      attributes: [],
    });

    setError("");
    setSuccess("");
    setShowModal(true);
  };

  // =========================
  // Open Edit Modal
  // =========================
  const handleEditProduct = (product) => {
    setEditingProduct(product);

    const existingAttributes = Array.isArray(
      product.attributes
    )
      ? product.attributes.map((attribute) => ({
          name: attribute.name || "",
          values: Array.isArray(attribute.values)
            ? attribute.values
            : [],
        }))
      : [];

    setFormData({
      name: product.name || "",
      description: product.description || "",
      price: product.price ?? "",
      image: product.image || "",
      category: product.category || "",
      stock: product.stock ?? "",
      attributes: existingAttributes,
    });

    setError("");
    setSuccess("");
    setShowModal(true);
  };

  // =========================
  // Close Modal
  // =========================
  const closeModal = () => {
    if (submitting) return;

    setShowModal(false);
    setEditingProduct(null);

    setFormData({
      name: "",
      description: "",
      price: "",
      image: "",
      category: "",
      stock: "",
      attributes: [],
    });

    setError("");
  };

  // =========================
  // Submit Add / Edit
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // =========================
    // Basic Validation
    // =========================
    if (
      !formData.name.trim() ||
      !formData.description.trim() ||
      !formData.price ||
      !formData.image.trim() ||
      !formData.category.trim() ||
      formData.stock === ""
    ) {
      setError("Please fill all fields.");
      return;
    }

    if (Number(formData.price) < 0) {
      setError("Price negative nahi ho sakti.");
      return;
    }

    if (Number(formData.stock) < 0) {
      setError("Stock negative nahi ho sakta.");
      return;
    }

    // =========================
    // Clean + Validate Attributes
    // =========================
    const cleanedAttributes = formData.attributes
      .map((attribute) => ({
        name: attribute.name.trim(),
        values: attribute.values
          .map((value) => value.trim())
          .filter(Boolean),
      }))
      .filter(
        (attribute) =>
          attribute.name && attribute.values.length > 0
      );

    // If admin added an option but left it incomplete
    const hasInvalidAttribute = formData.attributes.some(
      (attribute) => {
        const optionName = attribute.name.trim();

        const hasEmptyValue = attribute.values.some(
          (value) => !value.trim()
        );

        return !optionName || hasEmptyValue;
      }
    );

    if (hasInvalidAttribute) {
      setError(
        "Please complete all attribute option names and values, or remove the empty option/value."
      );
      return;
    }

    try {
      setSubmitting(true);

      const token = getToken();

      const productData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: Number(formData.price),
        image: formData.image.trim(),
        category: formData.category.trim(),
        stock: Number(formData.stock),
        attributes: cleanedAttributes,
      };

      // =========================
      // EDIT PRODUCT
      // =========================
      if (editingProduct) {
        const response = await fetch(
          `${PRODUCTS_API_URL}/${editingProduct._id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              ...(token
                ? {
                    Authorization: `Bearer ${token}`,
                  }
                : {}),
            },
            body: JSON.stringify(productData),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Product update nahi ho saka."
          );
        }

        setSuccess("Product successfully updated.");

        setShowModal(false);
        setEditingProduct(null);

        await fetchProducts();
      }

      // =========================
      // ADD PRODUCT
      // =========================
      else {
        const response = await fetch(PRODUCTS_API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token
              ? {
                  Authorization: `Bearer ${token}`,
                }
              : {}),
          },
          body: JSON.stringify(productData),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Product add nahi ho saka."
          );
        }

        setSuccess("Product successfully added.");

        setShowModal(false);

        setFormData({
          name: "",
          description: "",
          price: "",
          image: "",
          category: "",
          stock: "",
          attributes: [],
        });

        await fetchProducts();
      }
    } catch (error) {
      console.error("Product submit error:", error);

      setError(
        error.message || "Something went wrong."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // =========================
  // Delete Product
  // =========================
  const handleDeleteProduct = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) return;

    try {
      setDeletingId(id);
      setError("");
      setSuccess("");

      const token = getToken();

      const response = await fetch(
        `${PRODUCTS_API_URL}/${id}`,
        {
          method: "DELETE",
          headers: {
            ...(token
              ? {
                  Authorization: `Bearer ${token}`,
                }
              : {}),
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Product delete nahi ho saka."
        );
      }

      setSuccess("Product successfully deleted.");

      await fetchProducts();
    } catch (error) {
      console.error("Delete product error:", error);

      setError(
        error.message || "Product delete nahi ho saka."
      );
    } finally {
      setDeletingId(null);
    }
  };

  // =========================
  // Search Products
  // =========================
  const filteredProducts = products.filter((product) => {
    const search = searchTerm.toLowerCase();

    return (
      product.name
        ?.toLowerCase()
        .includes(search) ||
      product.category
        ?.toLowerCase()
        .includes(search) ||
      product.description
        ?.toLowerCase()
        .includes(search)
    );
  });

  // =========================
  // UI
  // =========================
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">

      {/* =========================
          Header
      ========================= */}
      <div className="mb-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <p className="mb-1 text-sm font-medium text-gray-500">
              Admin Panel
            </p>

            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Products
            </h1>

            <p className="mt-2 text-gray-500">
              Manage your store products
            </p>
          </div>

          <button
            type="button"
            onClick={handleAddProduct}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-600"
          >
            <Plus size={19} />
            Add Product
          </button>

        </div>
      </div>

      {/* =========================
          Success Message
      ========================= */}
      {success && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-green-700">
          <CheckCircle size={20} />

          <p className="text-sm font-medium">
            {success}
          </p>

          <button
            type="button"
            onClick={() => setSuccess("")}
            className="ml-auto"
          >
            <X size={18} />
          </button>
        </div>
      )}

      {/* =========================
          Error Message
      ========================= */}
      {error && !showModal && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          <AlertCircle size={20} />

          <p className="text-sm font-medium">
            {error}
          </p>

          <button
            type="button"
            onClick={() => setError("")}
            className="ml-auto"
          >
            <X size={18} />
          </button>
        </div>
      )}

      {/* =========================
          Search + Stats
      ========================= */}
      <div className="mb-6 grid gap-4 md:grid-cols-[1fr_auto]">

        {/* Search */}
        <div className="relative">
          <Search
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(e.target.value)
            }
            className="w-full rounded-xl border border-gray-200 bg-white py-3.5 pl-11 pr-4 text-sm outline-none transition focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
          />
        </div>

        {/* Product Count */}
        <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-5 py-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
            <Package
              size={20}
              className="text-gray-700"
            />
          </div>

          <div>
            <p className="text-xs text-gray-500">
              Total Products
            </p>

            <p className="text-lg font-bold text-gray-900">
              {products.length}
            </p>
          </div>
        </div>

      </div>

      {/* =========================
          Products Table
      ========================= */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

        <div className="overflow-x-auto">

          <table className="min-w-[850px] w-full">

            <thead className="border-b border-gray-100 bg-gray-50">
              <tr>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Product
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Price
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Category
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Stock
                </th>

                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Actions
                </th>

              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">

              {/* Loading */}
              {loading ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-16 text-center"
                  >
                    <div className="flex flex-col items-center justify-center">

                      <Loader2
                        size={32}
                        className="animate-spin text-gray-400"
                      />

                      <p className="mt-3 text-sm text-gray-500">
                        Loading products...
                      </p>

                    </div>
                  </td>
                </tr>
              ) : filteredProducts.length > 0 ? (

                filteredProducts.map((product) => (
                  <tr
                    key={product._id}
                    className="transition hover:bg-gray-50"
                  >

                    {/* Product */}
                    <td className="px-6 py-5">

                      <div className="flex items-center gap-4">

                        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-gray-100">

                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display =
                                  "none";
                              }}
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              <Package
                                size={22}
                                className="text-gray-400"
                              />
                            </div>
                          )}

                        </div>

                        <div className="min-w-0">

                          <p className="truncate font-semibold text-gray-900">
                            {product.name}
                          </p>

                          <p className="mt-1 max-w-xs truncate text-sm text-gray-500">
                            {product.description}
                          </p>

                        </div>

                      </div>

                    </td>

                    {/* Price */}
                    <td className="px-6 py-5">
                      <span className="font-semibold text-gray-900">
                        Rs.{" "}
                        {Number(
                          product.price
                        ).toLocaleString()}
                      </span>
                    </td>

                    {/* Category */}
                    <td className="px-6 py-5">
                      <span className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                        {product.category}
                      </span>
                    </td>

                    {/* Stock */}
                    <td className="px-6 py-5">

                      {Number(product.stock) > 0 ? (
                        <span className="inline-flex rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                          {product.stock} in stock
                        </span>
                      ) : (
                        <span className="inline-flex rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">
                          Out of stock
                        </span>
                      )}

                    </td>

                    {/* Actions */}
                    <td className="px-6 py-5">

                      <div className="flex items-center justify-end gap-2">

                        <button
                          type="button"
                          onClick={() =>
                            handleEditProduct(product)
                          }
                          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                        >
                          <Pencil size={16} />
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleDeleteProduct(
                              product._id
                            )
                          }
                          disabled={
                            deletingId === product._id
                          }
                          className="inline-flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {deletingId === product._id ? (
                            <Loader2
                              size={16}
                              className="animate-spin"
                            />
                          ) : (
                            <Trash2 size={16} />
                          )}

                          Delete
                        </button>

                      </div>

                    </td>

                  </tr>
                ))

              ) : (

                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-16 text-center"
                  >
                    <div className="flex flex-col items-center">

                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
                        <Package
                          size={25}
                          className="text-gray-400"
                        />
                      </div>

                      <h3 className="mt-4 font-semibold text-gray-900">
                        No products found
                      </h3>

                      <p className="mt-1 text-sm text-gray-500">
                        {searchTerm
                          ? "Try another search."
                          : "Start by adding your first product."}
                      </p>

                      {!searchTerm && (
                        <button
                          type="button"
                          onClick={handleAddProduct}
                          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-600"
                        >
                          <Plus size={17} />
                          Add Product
                        </button>
                      )}

                    </div>
                  </td>
                </tr>

              )}

            </tbody>

          </table>

        </div>
      </div>

      {/* =========================
          Add / Edit Modal
      ========================= */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">

          <div className="max-h-[95vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

            {/* Modal Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-6 py-5">

              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {editingProduct
                    ? "Edit Product"
                    : "Add New Product"}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {editingProduct
                    ? "Update product information"
                    : "Add a new product to your store"}
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={submitting}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 disabled:opacity-50"
              >
                <X size={20} />
              </button>

            </div>

            {/* Modal Body */}
            <form
              onSubmit={handleSubmit}
              className="space-y-5 p-6"
            >

              {/* Error inside Modal */}
              {error && (
                <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">

                  <AlertCircle size={19} />

                  <p className="text-sm font-medium">
                    {error}
                  </p>

                </div>
              )}

              {/* Product Name */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Product Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Premium Black T-Shirt"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
                />
              </div>

              {/* Description */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Description
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Enter product description..."
                  className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
                />
              </div>

              {/* Price + Stock */}
              <div className="grid gap-5 sm:grid-cols-2">

                {/* Price */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Price
                  </label>

                  <div className="relative">

                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-400">
                      Rs.
                    </span>

                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      min="0"
                      placeholder="2500"
                      className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
                    />

                  </div>
                </div>

                {/* Stock */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Stock
                  </label>

                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    min="0"
                    placeholder="50"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
                  />
                </div>

              </div>

              {/* Category */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Category
                </label>

                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="e.g. Perfume, Jackets, Clothes"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
                />
              </div>

              {/* Image URL */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Image URL
                </label>

                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="https://example.com/product-image.jpg"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
                />

                {/* Image Preview */}
                {formData.image && (
                  <div className="mt-3 overflow-hidden rounded-xl border border-gray-200 bg-gray-50">

                    <img
                      src={formData.image}
                      alt="Product preview"
                      className="h-40 w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display =
                          "none";
                      }}
                    />

                  </div>
                )}
              </div>

              {/* =========================
                  Dynamic Attributes
              ========================= */}
              <div className="border-t border-gray-100 pt-5">

                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                  <div>
                    <h3 className="text-base font-bold text-gray-900">
                      Product Options
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      Add any options like Size, Color, Volume,
                      Fragrance, Material, etc.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={addOption}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-gray-300 hover:bg-gray-50"
                  >
                    <Plus size={17} />
                    Add Option
                  </button>

                </div>

                {/* Empty State */}
                {formData.attributes.length === 0 && (
                  <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-6 text-center">

                    <p className="text-sm font-medium text-gray-600">
                      No product options added.
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      Click "Add Option" if this product has
                      different sizes, colors, volumes, etc.
                    </p>

                  </div>
                )}

                {/* Options */}
                <div className="space-y-4">

                  {formData.attributes.map(
                    (attribute, optionIndex) => (
                      <div
                        key={optionIndex}
                        className="rounded-xl border border-gray-200 bg-gray-50 p-4"
                      >

                        {/* Option Header */}
                        <div className="mb-4 flex items-center justify-between gap-3">

                          <div className="flex-1">

                            <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                              Option Name
                            </label>

                            <input
                              type="text"
                              value={attribute.name}
                              onChange={(e) =>
                                handleOptionNameChange(
                                  optionIndex,
                                  e.target.value
                                )
                              }
                              placeholder="e.g. Volume, Size, Color"
                              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
                            />

                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              removeOption(optionIndex)
                            }
                            className="mt-6 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-500 transition hover:bg-red-50 hover:text-red-600"
                            title="Remove option"
                          >
                            <Trash2 size={17} />
                          </button>

                        </div>

                        {/* Values */}
                        <div>

                          <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Values
                          </label>

                          <div className="space-y-2">

                            {attribute.values.map(
                              (value, valueIndex) => (
                                <div
                                  key={valueIndex}
                                  className="flex items-center gap-2"
                                >

                                  <input
                                    type="text"
                                    value={value}
                                    onChange={(e) =>
                                      handleValueChange(
                                        optionIndex,
                                        valueIndex,
                                        e.target.value
                                      )
                                    }
                                    placeholder="e.g. 30ml"
                                    className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
                                  />

                                  <button
                                    type="button"
                                    onClick={() =>
                                      removeValue(
                                        optionIndex,
                                        valueIndex
                                      )
                                    }
                                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-400 transition hover:bg-red-50 hover:text-red-600"
                                    title="Remove value"
                                  >
                                    <X size={18} />
                                  </button>

                                </div>
                              )
                            )}

                          </div>

                          {/* Add Value */}
                          <button
                            type="button"
                            onClick={() =>
                              addValue(optionIndex)
                            }
                            className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-gray-700 transition hover:text-blue-600"
                          >
                            <Plus size={16} />
                            Add Value
                          </button>

                        </div>

                      </div>
                    )
                  )}

                </div>

              </div>

              {/* Buttons */}
              <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">

                <button
                  type="button"
                  onClick={closeModal}
                  disabled={submitting}
                  className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
                >

                  {submitting && (
                    <Loader2
                      size={18}
                      className="animate-spin"
                    />
                  )}

                  {submitting
                    ? editingProduct
                      ? "Updating..."
                      : "Adding..."
                    : editingProduct
                    ? "Update Product"
                    : "Add Product"}

                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
}

export default AdminProducts;