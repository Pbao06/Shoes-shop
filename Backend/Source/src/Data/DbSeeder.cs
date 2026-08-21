using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using src.Models;

namespace src.Data;

/// <summary>
/// Tự động thêm dữ liệu mẫu (Brand, Category, Size, Product, Variant, Image)
/// khi ứng dụng khởi chạy. Bỏ qua hoàn toàn nếu database đã có sản phẩm.
/// </summary>
public static class DbSeeder
{
    public static async Task SeedAsync(ApplicationDbContext context)
    {
        // Nếu đã có sản phẩm thì thôi, tránh tạo trùng lặp mỗi lần chạy app.
        if (await context.Products.AnyAsync())
            return;

        // 1. Đảm bảo có các Size cần thiết
        var sizeNames = new[] { "38", "39", "40", "41", "42", "OS" };
        foreach (var name in sizeNames)
        {
            if (!await context.Sizes.AnyAsync(s => s.Name == name))
                context.Sizes.Add(new Size { Name = name });
        }
        await context.SaveChangesAsync();

        // 2. Brand & Category (tạo mới nếu chưa tồn tại, theo tên)
        var atelier = await GetOrCreateBrand(context, "Atelier");
        var nova = await GetOrCreateBrand(context, "Nova");
        var shoes = await GetOrCreateCategory(context, "Shoes", "shoes");
        var bags = await GetOrCreateCategory(context, "Bags", "bags");
        var accessories = await GetOrCreateCategory(context, "Accessories", "accessories");

        var sizes = await context.Sizes.ToListAsync();
        Size GetSize(string name)
        {
            var size = sizes.Find(s => s.Name == name)
                ?? throw new InvalidOperationException(
                    $"Size '{name}' chưa được seed. Hãy thêm vào danh sách 'sizeNames'.");
            return size;
        }

        // 3. Ảnh mẫu tham chiếu từ assets frontend (đặt tại Frontend/public/images)
        const string imgBase = "http://localhost:3000/images";
        var imgWomen = $"{imgBase}/women-collection.png";
        var imgMen = $"{imgBase}/men-collection.png";
        var imgHero = $"{imgBase}/hero-campaign.jpg";
        var imgAuth = $"{imgBase}/auth-editorial.jpg";

        // 4. 4 sản phẩm mẫu thuộc các thương hiệu/danh mục khác nhau
        var products = new List<Product>
        {
            new()
            {
                Name = "Classic Leather Loafer",
                Slug = "classic-leather-loafer",
                Description = "A considered loafer defined by a clean silhouette, supple leather, and a quietly polished finish.",
                Price = 420,
                SalePrice = 380,
                Color = "Black",
                IsActive = true,
                Brand = atelier,
                Category = shoes,
                CreatedAt = DateTime.UtcNow,
                Images = new List<ProductImage>
                {
                    new() { ImageUrl = imgWomen, AltText = "Classic Leather Loafer", IsPrimary = true }
                },
                Variants = new List<ProductVariant>
                {
                    MakeVariant(GetSize("39"), 10, 420, 380, "LOAFER-39"),
                    MakeVariant(GetSize("40"), 15, 420, 380, "LOAFER-40"),
                    MakeVariant(GetSize("41"), 8, 420, 380, "LOAFER-41"),
                }
            },
            new()
            {
                Name = "Minimal Leather Sneaker",
                Slug = "minimal-leather-sneaker",
                Description = "A timeless sneaker with a pared-back profile, premium leather, and effortless everyday versatility.",
                Price = 360,
                SalePrice = null,
                Color = "Ivory",
                IsActive = true,
                Brand = atelier,
                Category = shoes,
                CreatedAt = DateTime.UtcNow,
                Images = new List<ProductImage>
                {
                    new() { ImageUrl = imgHero, AltText = "Minimal Leather Sneaker", IsPrimary = true }
                },
                Variants = new List<ProductVariant>
                {
                    MakeVariant(GetSize("40"), 20, 360, null, "SNEAKER-40"),
                    MakeVariant(GetSize("41"), 12, 360, null, "SNEAKER-41"),
                    MakeVariant(GetSize("42"), 6, 360, null, "SNEAKER-42"),
                }
            },
            new()
            {
                Name = "Structured Chelsea Boot",
                Slug = "structured-chelsea-boot",
                Description = "A refined Chelsea boot with a structured silhouette and hand-finished details for long-term wear.",
                Price = 590,
                SalePrice = 540,
                Color = "Brown",
                IsActive = true,
                Brand = nova,
                Category = shoes,
                CreatedAt = DateTime.UtcNow,
                Images = new List<ProductImage>
                {
                    new() { ImageUrl = imgMen, AltText = "Structured Chelsea Boot", IsPrimary = true }
                },
                Variants = new List<ProductVariant>
                {
                    MakeVariant(GetSize("41"), 9, 590, 540, "BOOT-41"),
                    MakeVariant(GetSize("42"), 5, 590, 540, "BOOT-42"),
                }
            },
            new()
            {
                Name = "Signature Leather Bag",
                Slug = "signature-leather-bag",
                Description = "A structured leather bag crafted with meticulous attention to proportion and finish.",
                Price = 680,
                SalePrice = null,
                Color = "Black",
                IsActive = true,
                Brand = atelier,
                Category = bags,
                CreatedAt = DateTime.UtcNow,
                Images = new List<ProductImage>
                {
                    new() { ImageUrl = imgAuth, AltText = "Signature Leather Bag", IsPrimary = true }
                },
                Variants = new List<ProductVariant>
                {
                    MakeVariant(GetSize("OS"), 25, 680, null, "BAG-OS"),
                }
            },
        };

        context.Products.AddRange(products);
        await context.SaveChangesAsync();
    }

    private static ProductVariant MakeVariant(Size size, int stock, decimal price, decimal? sale, string sku) =>
        new()
        {
            Size = size,
            StockQuantity = stock,
            Price = price,
            SalePrice = sale,
            SKU = sku,
        };

    private static async Task<Brand> GetOrCreateBrand(ApplicationDbContext context, string name)
    {
        var brand = await context.Brands.FirstOrDefaultAsync(b => b.Name == name);
        if (brand != null) return brand;
        brand = new Brand { Name = name };
        context.Brands.Add(brand);
        await context.SaveChangesAsync();
        return brand;
    }

    private static async Task<Category> GetOrCreateCategory(ApplicationDbContext context, string name, string slug)
    {
        var category = await context.Categories.FirstOrDefaultAsync(c => c.Name == name);
        if (category != null) return category;
        category = new Category { Name = name, Slug = slug };
        context.Categories.Add(category);
        await context.SaveChangesAsync();
        return category;
    }
}
