import { useState, useEffect, useContext } from "react"
import axios from "../api/axios"
import ProductCard from "../components/ProductCard"
import { Search, SlidersHorizontal, X } from "lucide-react"
import { useNotification } from "../context/NotificationContext"
import { LanguageContext } from "../context/LanguageContext"

function ProductsPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [keyword, setKeyword] = useState("")
  const [category, setCategory] = useState("")
  const [brand, setBrand] = useState("")
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)

  const { addNotification } = useNotification()
  const { language } = useContext(LanguageContext)
  const isArabic = language === "ar"

  const categories = [
    "Men",
    "Women",
    "Kids",
    "Unisex",
    "Accessories",
  ]

  const categoryTranslations = {
    Men: "رجالي",
    Women: "حريمي",
    Kids: "أطفال",
    Unisex: "للجميع",
    Accessories: "إكسسوارات",
  }

  useEffect(() => {
    let cancelled = false

    const fetchProducts = async () => {
      try {
        setLoading(true)
        setError("")

        const params = new URLSearchParams({
          pageNumber: page,
        })

        if (keyword.trim()) params.set("keyword", keyword.trim())
        if (category) params.set("category", category)
        if (brand.trim()) params.set("brand", brand.trim())

        const { data } = await axios.get(
          `/api/products?${params.toString()}`
        )

        if (!cancelled) {
          setProducts(data.products || [])
          setPage(data.page || 1)
          setPages(data.pages || 1)
        }
      } catch (err) {
        if (!cancelled) {
          const message =
            err.response?.data?.message ||
            err.message ||
            "Unable to load products."

          setError(message)
          setProducts([])
          addNotification(message, "error")
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    fetchProducts()

    return () => {
      cancelled = true
    }
  }, [keyword, category, brand, page, addNotification])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    setPage(1)
  }

  const handleClearFilters = () => {
    setKeyword("")
    setCategory("")
    setBrand("")
    setPage(1)
    setError("")
  }

  const handleCategoryChange = (value) => {
    setCategory(value)
    setPage(1)
  }

  const handleBrandChange = (value) => {
    setBrand(value)
    setPage(1)
  }

  const pageText = {
    eyebrow: isArabic ? "اكتشف مجموعتنا" : "Discover Our Collection",
    title: isArabic ? "منتجاتنا" : "Our Products",
    description: isArabic
      ? "اكتشف أحدث مجموعات الأزياء واختر القطع التي تناسب أسلوبك."
      : "Explore our latest fashion collection and find pieces that match your personal style.",
    findStyle: isArabic ? "ابحث عن أسلوبك" : "Find Your Style",
    clearFilters: isArabic ? "مسح الفلاتر" : "Clear Filters",
    searchPlaceholder: isArabic ? "ابحث عن المنتجات..." : "Search for products...",
    search: isArabic ? "بحث" : "Search",
    category: isArabic ? "التصنيف" : "Category",
    allCategories: isArabic ? "كل التصنيفات" : "All Categories",
    brand: isArabic ? "الماركة" : "Brand",
    brandPlaceholder: isArabic ? "اكتب اسم الماركة..." : "Enter brand name...",
    allCollection: isArabic ? "كل المنتجات" : "All Collection",
    products: isArabic ? "منتج" : "products",
    loadingError: isArabic
      ? "تعذر تحميل المنتجات. حاول مرة أخرى."
      : "Unable to load products. Please try again.",
    noProducts: isArabic ? "لا توجد منتجات" : "No Products Found",
    noProductsDescription: isArabic
      ? "حاول تغيير كلمات البحث أو الفلاتر."
      : "Try changing your search or filters.",
  }

  return (
    <main
      dir={isArabic ? "rtl" : "ltr"}
      className="min-h-screen bg-[#f7f6f2] px-4 py-10 sm:px-6 lg:px-10"
    >
      <div className="mx-auto max-w-[1440px]">
        <div className="mb-10 text-center">
          <span className="mb-3 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[3px] text-[#a58a5c]">
            <SlidersHorizontal size={14} />
            {pageText.eyebrow}
          </span>

          <h1 className="font-serif text-4xl font-medium text-[#24231f] sm:text-5xl">
            {pageText.title}
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[#77746d]">
            {pageText.description}
          </p>
        </div>

        <section className="mb-10 border border-[#e5e2da] bg-white p-5 shadow-sm sm:p-7">
          <div className="mb-5 flex items-center justify-between gap-3">
            <h2 className="font-serif text-xl text-[#24231f]">
              {pageText.findStyle}
            </h2>

            <button
              type="button"
              onClick={handleClearFilters}
              className="inline-flex items-center gap-2 text-xs font-medium text-[#77746d] transition hover:text-[#a58a5c]"
            >
              <X size={14} />
              {pageText.clearFilters}
            </button>
          </div>

          <form
            onSubmit={handleSearchSubmit}
            className="mb-6 flex flex-col gap-3 sm:flex-row"
          >
            <div className="relative flex-1">
              <Search
                size={18}
                className={`absolute top-1/2 -translate-y-1/2 text-[#99958b] ${
                  isArabic ? "right-4" : "left-4"
                }`}
              />

              <input
                type="text"
                placeholder={pageText.searchPlaceholder}
                value={keyword}
                onChange={(e) => {
                  setKeyword(e.target.value)
                  setPage(1)
                }}
                className={`w-full border border-[#e5e2da] bg-[#faf9f6] py-3 text-sm text-[#24231f] outline-none transition placeholder:text-[#aaa69b] focus:border-[#a58a5c] ${
                  isArabic ? "pr-12 pl-4 text-right" : "pl-12 pr-4 text-left"
                }`}
              />
            </div>

            <button
              type="submit"
              className="flex items-center justify-center gap-2 bg-[#292823] px-8 py-3 text-xs font-semibold tracking-wide text-white transition hover:bg-[#a58a5c]"
            >
              <Search size={15} />
              {pageText.search}
            </button>
          </form>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="category-filter"
                className="mb-2 block text-xs font-semibold text-[#55534d]"
              >
                {pageText.category}
              </label>

              <select
                id="category-filter"
                value={category}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full border border-[#e5e2da] bg-[#faf9f6] px-4 py-3 text-sm text-[#55534d] outline-none focus:border-[#a58a5c]"
              >
                <option value="">{pageText.allCategories}</option>

                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {isArabic ? categoryTranslations[cat] : cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="brand-filter"
                className="mb-2 block text-xs font-semibold text-[#55534d]"
              >
                {pageText.brand}
              </label>

              <input
                id="brand-filter"
                type="text"
                value={brand}
                onChange={(e) => handleBrandChange(e.target.value)}
                placeholder={pageText.brandPlaceholder}
                className={`w-full border border-[#e5e2da] bg-[#faf9f6] px-4 py-3 text-sm text-[#55534d] outline-none placeholder:text-[#aaa69b] focus:border-[#a58a5c] ${
                  isArabic ? "text-right" : "text-left"
                }`}
              />
            </div>
          </div>
        </section>

        <section>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-serif text-2xl text-[#24231f]">
              {category
                ? isArabic
                  ? categoryTranslations[category] || category
                  : category
                : pageText.allCollection}
            </h2>

            {!loading && (
              <span className="text-xs text-[#89857c]">
                {products.length} {pageText.products}
              </span>
            )}
          </div>

          {loading ? (
            <div className="flex min-h-[300px] items-center justify-center">
              <div className="h-12 w-12 animate-spin rounded-full border-2 border-[#e5e2da] border-t-[#a58a5c]" />
            </div>
          ) : error && products.length === 0 ? (
            <div className="border border-[#e5e2da] bg-white px-5 py-16 text-center">
              <p className="text-sm text-[#77746d]">
                {pageText.loadingError}
              </p>
            </div>
          ) : products.length === 0 ? (
            <div className="border border-[#e5e2da] bg-white px-5 py-16 text-center">
              <Search
                size={30}
                className="mx-auto mb-4 text-[#a58a5c]"
              />

              <h3 className="font-serif text-xl text-[#24231f]">
                {pageText.noProducts}
              </h3>

              <p className="mt-2 text-sm text-[#77746d]">
                {pageText.noProductsDescription}
              </p>

              <button
                type="button"
                onClick={handleClearFilters}
                className="mt-5 bg-[#292823] px-6 py-3 text-xs font-semibold text-white transition hover:bg-[#a58a5c]"
              >
                {pageText.clearFilters}
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-3 xl:grid-cols-4">
                {products.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                  />
                ))}
              </div>

              {pages > 1 && (
                <div className="mt-12 flex flex-wrap justify-center gap-2">
                  {Array.from(
                    { length: pages },
                    (_, index) => index + 1
                  ).map((pageNumber) => (
                    <button
                      key={pageNumber}
                      type="button"
                      onClick={() => setPage(pageNumber)}
                      className={`min-w-10 border px-4 py-2 text-sm transition ${
                        pageNumber === page
                          ? "border-[#292823] bg-[#292823] text-white"
                          : "border-[#e5e2da] bg-white text-[#55534d] hover:border-[#a58a5c] hover:text-[#a58a5c]"
                      }`}
                    >
                      {pageNumber}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </main>
  )
}

export default ProductsPage