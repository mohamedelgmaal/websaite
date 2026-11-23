import { useContext, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import {
  ArrowRight,
  ArrowUpRight,
  ShieldCheck,
  Truck,
  Sparkles,
  ChevronRight,
} from "lucide-react"

import axios from "../api/axios"
import ProductCard from "../components/ProductCard"
import { LanguageContext } from "../context/LanguageContext"

const translations = {
  en: {
    announcement: "NEW SEASON · NEW STYLE · NEW YOU",
    eyebrow: "THE FASHION COLLECTION",
    title: "Wear your style.\nMake every moment count.",
    intro:
      "Discover modern clothing, timeless essentials and everyday styles carefully selected for you.",
    shop: "Shop Collection",
    explore: "Explore Products",
    scroll: "SCROLL TO DISCOVER",
    benefits: [
      "Carefully Selected Styles",
      "Secure Checkout",
      "Reliable Delivery",
    ],
    categoriesEyebrow: "FIND YOUR STYLE",
    categoriesTitle: "Fashion for everyone.",
    categoriesText:
      "Explore collections designed for every personality, age and occasion.",
    categoryLink: "Explore Collection",
    featuredEyebrow: "THE LATEST COLLECTION",
    featuredTitle: "Your next favorite\nlook starts here.",
    featuredText:
      "Discover our latest clothing picks and find the perfect addition to your wardrobe.",
    viewAll: "View All Products",
    loading: "Discovering your next favorite...",
    empty: "No products available right now. Explore our full collection.",
    emptyButton: "Browse Products",
    closingEyebrow: "YOUR STYLE, YOUR STORY",
    closingTitle: "Dress the way you feel.",
    closingText:
      "Find your favorite pieces and create a look that feels completely yours.",
    discover: "Discover More",
    categories: [
      {
        title: "Men",
        subtitle: "Modern style for every day",
        image:
          "https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=1000&q=85",
      },
      {
        title: "Women",
        subtitle: "Elegance in every detail",
        image:
          "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1000&q=85",
      },
      {
        title: "Kids",
        subtitle: "Comfort meets fun",
        image:
          "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=1000&q=85",
      },
    ],
  },

  ar: {
    announcement: "موسم جديد · إطلالة جديدة · أسلوبك الخاص",
    eyebrow: "مجموعة الأزياء الجديدة",
    title: "عبّر عن أسلوبك.\nواجعل كل إطلالة مميزة.",
    intro:
      "اكتشف ملابس عصرية وقطعًا أساسية أنيقة واختيارات يومية منتقاة بعناية لتناسب أسلوبك.",
    shop: "تسوق المجموعة",
    explore: "اكتشف المنتجات",
    scroll: "اكتشف المزيد",
    benefits: [
      "اختيارات بعناية",
      "دفع آمن",
      "توصيل موثوق",
    ],
    categoriesEyebrow: "اكتشف أسلوبك",
    categoriesTitle: "أناقة تناسب الجميع.",
    categoriesText:
      "اكتشف مجموعات متنوعة تناسب كل الأذواق والأعمار والمناسبات.",
    categoryLink: "اكتشف المجموعة",
    featuredEyebrow: "أحدث المجموعات",
    featuredTitle: "إطلالتك المفضلة\nتبدأ من هنا.",
    featuredText:
      "اكتشف أحدث اختيارات الملابس وأضف لمسة مميزة إلى خزانة ملابسك.",
    viewAll: "عرض جميع المنتجات",
    loading: "نجهز لك منتجاتنا المميزة...",
    empty: "لا توجد منتجات متاحة حاليًا. تصفح مجموعتنا الكاملة.",
    emptyButton: "تصفح المنتجات",
    closingEyebrow: "أسلوبك يحكي قصتك",
    closingTitle: "ارتدِ ما يعبر عنك.",
    closingText:
      "اختر قطعك المفضلة ونسّق إطلالة تعبر عن شخصيتك وذوقك.",
    discover: "اكتشف المزيد",
    categories: [
      {
        title: "رجالي",
        subtitle: "أناقة عصرية لكل يوم",
        image:
          "https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=1000&q=85",
      },
      {
        title: "حريمي",
        subtitle: "أناقة في كل التفاصيل",
        image:
          "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1000&q=85",
      },
      {
        title: "أطفال",
        subtitle: "راحة وأناقة للصغار",
        image:
          "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=1000&q=85",
      },
    ],
  },
}

function HomePage() {
  const { language } = useContext(LanguageContext)

  const isArabic = language === "ar"
  const t = translations[isArabic ? "ar" : "en"]

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    const fetchProducts = async () => {
      try {
        const { data } = await axios.get("/api/products?pageNumber=1")

        if (active) {
          setProducts(data.products || [])
        }
      } catch (error) {
        if (active) {
          setProducts([])
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    fetchProducts()

    return () => {
      active = false
    }
  }, [])

  const featuredProducts = products.slice(0, 4)

  const heroImage =
    "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=2000&q=90"

  return (
    <div className="premium-home" dir={isArabic ? "rtl" : "ltr"}>
      <section
        className="premium-hero"
        style={{
          backgroundImage: `
            linear-gradient(
              90deg,
              rgba(18,18,16,.78),
              rgba(18,18,16,.32)
            ),
            url("${heroImage}")
          `,
        }}
      >
        <div className="premium-hero-content">
          <span className="eyebrow">
            <Sparkles size={15} />
            {t.eyebrow}
          </span>

          <h1>
            {t.title.split("\n").map((line, index) => (
              <span key={index}>{line}</span>
            ))}
          </h1>

          <p>{t.intro}</p>

          <div className="hero-actions">
            <Link to="/products" className="btn-light">
              {t.shop}
              <ArrowUpRight size={18} />
            </Link>

            <Link to="/products" className="text-link-light">
              {t.explore}
            </Link>
          </div>
        </div>

        <div className="hero-index">
          <span>01</span>
          <i />
          <span>03</span>
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 32,
            left: isArabic ? "auto" : "8%",
            right: isArabic ? "8%" : "auto",
            fontSize: 9,
            letterSpacing: 2,
            color: "#ffffffb5",
          }}
        >
          {t.scroll}
        </div>
      </section>

      <section className="promise-strip" aria-label="Store benefits">
        <div>
          <Sparkles size={19} />
          <span>{t.benefits[0]}</span>
        </div>

        <div>
          <ShieldCheck size={19} />
          <span>{t.benefits[1]}</span>
        </div>

        <div>
          <Truck size={19} />
          <span>{t.benefits[2]}</span>
        </div>
      </section>

      <section className="editorial-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow dark-eyebrow">
              {t.categoriesEyebrow}
            </span>

            <h2>{t.categoriesTitle}</h2>

            <p>{t.categoriesText}</p>
          </div>

          <Link to="/products" className="underlined-link">
            {t.viewAll}
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="category-grid">
          {t.categories.map((category, index) => (
            <Link
              to="/products"
              className={`category-tile category-${index + 1}`}
              key={category.title}
            >
              <img
                src={category.image}
                alt={category.title}
                loading="lazy"
              />

              <div className="category-overlay">
                <span>{category.subtitle}</span>

                <h3>{category.title}</h3>

                <b>
                  <ArrowUpRight size={19} />
                </b>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="featured-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow dark-eyebrow">
              {t.featuredEyebrow}
            </span>

            <h2>
              {t.featuredTitle.split("\n").map((line, index) => (
                <span key={index}>
                  {line}
                  <br />
                </span>
              ))}
            </h2>

            <p>{t.featuredText}</p>
          </div>

          <Link to="/products" className="underlined-link">
            {t.viewAll}
            <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div className="products-loading">{t.loading}</div>
        ) : featuredProducts.length > 0 ? (
          <div className="premium-product-grid">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="products-empty">
            <Sparkles size={28} />
            <p>{t.empty}</p>

            <Link to="/products" className="underlined-link">
              {t.emptyButton}
              <ChevronRight size={16} />
            </Link>
          </div>
        )}
      </section>

      <section className="closing-banner">
        <div>
          <span className="eyebrow">{t.closingEyebrow}</span>

          <h2>{t.closingTitle}</h2>

          <p
            style={{
              color: "#c5c1b7",
              fontSize: 12,
              lineHeight: 1.8,
              maxWidth: 480,
              marginTop: 12,
            }}
          >
            {t.closingText}
          </p>
        </div>

        <Link to="/products" className="btn-light">
          {t.discover}
          <ArrowUpRight size={18} />
        </Link>
      </section>
    </div>
  )
}

export default HomePage