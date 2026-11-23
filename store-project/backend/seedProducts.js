import dotenv from "dotenv"
import mongoose from "mongoose"
import connectDB from "./config/db.js"
import Product from "./models/Product.js"
import User from "./models/User.js"

dotenv.config()

const products = [
  {
    name: "Classic Black Hoodie",
    nameAr: "هودي أسود كلاسيكي",
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800",
    description: "Comfortable black hoodie for everyday wear.",
    descriptionAr: "هودي أسود مريح مناسب للارتداء اليومي.",
    brand: "Urban Style",
    category: "Men",
    price: 35,
    countInStock: 25,
  },
  {
    name: "Men's Casual White T-Shirt",
    nameAr: "تيشيرت رجالي أبيض كاجوال",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800",
    description: "Classic white cotton t-shirt.",
    descriptionAr: "تيشيرت قطني أبيض بتصميم كلاسيكي يناسب الإطلالات اليومية.",
    brand: "Basic Wear",
    category: "Men",
    price: 18,
    countInStock: 40,
  },
  {
    name: "Men's Denim Jacket",
    nameAr: "جاكيت جينز رجالي",
    image: "https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=800",
    description: "Stylish denim jacket for casual outfits.",
    descriptionAr: "جاكيت جينز أنيق مناسب للإطلالات الكاجوال.",
    brand: "Denim House",
    category: "Men",
    price: 55,
    countInStock: 15,
  },
  {
    name: "Men's Slim Fit Jeans",
    nameAr: "بنطلون جينز رجالي slim fit",
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800",
    description: "Modern slim fit denim jeans.",
    descriptionAr: "بنطلون جينز رجالي بقصة عصرية ومقاس slim fit.",
    brand: "Denim House",
    category: "Men",
    price: 42,
    countInStock: 30,
  },
  {
    name: "Men's Summer Shirt",
    nameAr: "قميص رجالي صيفي",
    image: "https://images.unsplash.com/photo-1603252109303-2751441dd157?w=800",
    description: "Lightweight shirt for summer days.",
    descriptionAr: "قميص خفيف ومريح مناسب لأيام الصيف.",
    brand: "Urban Style",
    category: "Men",
    price: 29,
    countInStock: 20,
  },
  {
    name: "Men's Sportswear Set",
    nameAr: "طقم ملابس رياضية رجالي",
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800",
    description: "Comfortable sportswear for daily activities.",
    descriptionAr: "طقم ملابس رياضية مريح مناسب للتمارين والأنشطة اليومية.",
    brand: "Active Wear",
    category: "Men",
    price: 48,
    countInStock: 18,
  },
  {
    name: "Women's Beige Coat",
    nameAr: "بالطو نسائي بيج",
    image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800",
    description: "Elegant beige coat for a stylish look.",
    descriptionAr: "بالطو نسائي باللون البيج لإطلالة أنيقة ومميزة.",
    brand: "Elegance",
    category: "Women",
    price: 75,
    countInStock: 12,
  },
  {
    name: "Women's Casual Dress",
    nameAr: "فستان نسائي كاجوال",
    image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800",
    description: "Beautiful casual dress for everyday occasions.",
    descriptionAr: "فستان نسائي أنيق مناسب للخروجات والمناسبات اليومية.",
    brand: "Elegance",
    category: "Women",
    price: 45,
    countInStock: 20,
  },
  {
    name: "Women's White Blouse",
    nameAr: "بلوزة نسائية بيضاء",
    image: "https://images.unsplash.com/photo-1551163943-3f6a855d1153?w=800",
    description: "Classic white blouse with a modern design.",
    descriptionAr: "بلوزة بيضاء بتصميم عصري وأنيق.",
    brand: "Modern Lady",
    category: "Women",
    price: 32,
    countInStock: 25,
  },
  {
    name: "Women's Blue Jeans",
    nameAr: "بنطلون جينز نسائي أزرق",
    image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800",
    description: "Comfortable blue jeans for everyday outfits.",
    descriptionAr: "بنطلون جينز أزرق مريح مناسب للإطلالات اليومية.",
    brand: "Denim House",
    category: "Women",
    price: 40,
    countInStock: 30,
  },
  {
    name: "Women's Summer Top",
    nameAr: "توب نسائي صيفي",
    image: "https://images.unsplash.com/photo-1566206091558-7f218b696731?w=800",
    description: "Light summer top with a casual style.",
    descriptionAr: "توب صيفي خفيف بتصميم كاجوال مريح.",
    brand: "Modern Lady",
    category: "Women",
    price: 22,
    countInStock: 35,
  },
  {
    name: "Women's Knit Sweater",
    nameAr: "بلوفر نسائي صوف",
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800",
    description: "Soft knit sweater for cooler weather.",
    descriptionAr: "بلوفر ناعم ومريح مناسب للأجواء الباردة.",
    brand: "Winter Collection",
    category: "Women",
    price: 39,
    countInStock: 16,
  },
  {
    name: "Kids Colorful Hoodie",
    nameAr: "هودي أطفال ملون",
    image: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800",
    description: "Comfortable hoodie for kids.",
    descriptionAr: "هودي مريح للأطفال بتصميم ملون وجذاب.",
    brand: "Little Style",
    category: "Kids",
    price: 25,
    countInStock: 20,
  },
  {
    name: "Kids Casual T-Shirt",
    nameAr: "تيشيرت أطفال كاجوال",
    image: "https://images.unsplash.com/photo-1503919005314-30d93d07d823?w=800",
    description: "Soft everyday t-shirt for children.",
    descriptionAr: "تيشيرت ناعم ومريح للأطفال مناسب للاستخدام اليومي.",
    brand: "Little Style",
    category: "Kids",
    price: 14,
    countInStock: 35,
  },
  {
    name: "Kids Denim Outfit",
    nameAr: "طقم جينز أطفال",
    image: "https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?w=800",
    description: "Casual denim outfit for kids.",
    descriptionAr: "طقم جينز كاجوال للأطفال بإطلالة عصرية.",
    brand: "Mini Fashion",
    category: "Kids",
    price: 30,
    countInStock: 15,
  },
  {
    name: "Kids Winter Jacket",
    nameAr: "جاكيت شتوي للأطفال",
    image: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800",
    description: "Warm jacket for children during winter.",
    descriptionAr: "جاكيت دافئ للأطفال مناسب لفصل الشتاء.",
    brand: "Mini Fashion",
    category: "Kids",
    price: 38,
    countInStock: 12,
  },
  {
    name: "Unisex Grey Sweatshirt",
    nameAr: "سويت شيرت رمادي للجنسين",
    image: "https://images.unsplash.com/photo-1578681994506-b8f463449011?w=800",
    description: "Relaxed fit grey sweatshirt.",
    descriptionAr: "سويت شيرت رمادي بقصة مريحة ومناسب للجنسين.",
    brand: "Urban Style",
    category: "Unisex",
    price: 33,
    countInStock: 22,
  },
  {
    name: "Unisex Baseball Cap",
    nameAr: "كاب بيسبول للجنسين",
    image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800",
    description: "Classic adjustable baseball cap.",
    descriptionAr: "كاب بيسبول بتصميم كلاسيكي وحجم قابل للتعديل.",
    brand: "Street Wear",
    category: "Accessories",
    price: 16,
    countInStock: 40,
  },
  {
    name: "Women's Sports Leggings",
    nameAr: "ليجنز رياضي نسائي",
    image: "https://images.unsplash.com/photo-1506629905607-d9e297d7c7e5?w=800",
    description: "Stretchy leggings for sports and everyday wear.",
    descriptionAr: "ليجنز رياضي مرن ومريح للتمارين والاستخدام اليومي.",
    brand: "Active Wear",
    category: "Women",
    price: 28,
    countInStock: 24,
  },
  {
    name: "Men's Winter Puffer Jacket",
    nameAr: "جاكيت رجالي مبطن للشتاء",
    image: "https://images.unsplash.com/photo-1544923246-77307dd654cb?w=800",
    description: "Warm puffer jacket for cold weather.",
    descriptionAr: "جاكيت رجالي مبطن ودافئ مناسب للأجواء شديدة البرودة.",
    brand: "Winter Collection",
    category: "Men",
    price: 85,
    countInStock: 10,
  },
]

const seedProducts = async () => {
  try {
    await connectDB()

    const user =
      (await User.findOne({ isAdmin: true })) ||
      (await User.findOne())

    if (!user) {
      throw new Error("No user found. Please create an account first.")
    }

    let addedCount = 0
    let updatedCount = 0

    for (const item of products) {
      const existingProduct = await Product.findOne({
        name: item.name,
      })

      if (existingProduct) {
        existingProduct.nameAr = item.nameAr
        existingProduct.descriptionAr = item.descriptionAr

        await existingProduct.save()
        updatedCount++
        continue
      }

      await Product.create({
        ...item,
        user: user._id,
        rating: 0,
        numReviews: 0,
        reviews: [],
      })

      addedCount++
    }

    console.log("Product seeding completed!")
    console.log(`Added: ${addedCount}`)
    console.log(`Updated: ${updatedCount}`)
    console.log(`Total processed: ${addedCount + updatedCount}`)
    console.log(`Linked user: ${user.name}`)
  } catch (error) {
    console.error("Product seeding failed:", error.message)
    process.exitCode = 1
  } finally {
    await mongoose.disconnect()
  }
}

seedProducts()