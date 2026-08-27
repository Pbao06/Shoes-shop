using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Http;
using src.Data;
using src.DTOs;
using src.Middleware;
using src.Models;
using src.Services.AdminInterface;

namespace src.Services.Admin;

public class ProductService : IProductService
{
    private readonly ApplicationDbContext _context;

    public ProductService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<ProductDto>> GetAllAsync()
    {
        return await _context.Products
            .AsNoTracking()
            .Select(p => new ProductDto
            {
                Id = p.Id,
                Name = p.Name,
                Slug = p.Slug,
                Description = p.Description,
                Price = p.Price,
                SalePrice = p.SalePrice,
                Color = p.Color,
                IsActive = p.IsActive,
                BrandId = p.BrandId,
                CategoryId = p.CategoryId,
                CreatedAt = p.CreatedAt,
                PrimaryImageUrl = p.Images
                    .Where(img => img.IsPrimary)
                    .Select(img => img.ImageUrl)
                    .FirstOrDefault()
            })
            .ToListAsync();
    }

    public async Task<ProductDto?> GetByIdAsync(int id)
    {
        var product = await _context.Products
            .AsNoTracking()
            .FirstOrDefaultAsync(p => p.Id == id);

        if (product is null) return null;

        return new ProductDto
        {
            Id = product.Id,
            Name = product.Name,
            Slug = product.Slug,
            Description = product.Description,
            Price = product.Price,
            SalePrice = product.SalePrice,
            Color = product.Color,
            IsActive = product.IsActive,
            BrandId = product.BrandId,
            CategoryId = product.CategoryId,
            CreatedAt = product.CreatedAt,
            PrimaryImageUrl = product.Images
                .Where(img => img.IsPrimary)
                .Select(img => img.ImageUrl)
                .FirstOrDefault()
        };
    }

    public async Task<ProductDto> CreateAsync(CreateProductDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Name))
            throw new ValidationError("Tên sản phẩm là bắt buộc.");

        if (dto.Price < 0)
            throw new ValidationError("Giá sản phẩm không hợp lệ.");

        var product = new Product
        {
            Name = dto.Name,
            Slug = string.IsNullOrWhiteSpace(dto.Slug) ? dto.Name.ToLower().Replace(" ", "-") : dto.Slug,
            Description = dto.Description,
            Price = dto.Price,
            SalePrice = dto.SalePrice,
            Color = dto.Color,
            BrandId = dto.BrandId,
            CategoryId = dto.CategoryId,

        };

        _context.Products.Add(product);
        await _context.SaveChangesAsync();
        var dtoo= new ProductDto
        {
            Id=product.Id,
            Name=product.Name,
            Description=product.Description,
            Price=product.Price,
            SalePrice=product.SalePrice,
            Color=product.Color,
            BrandId=product.BrandId,
            CategoryId=product.CategoryId,
            IsActive= product.IsActive,
            CreatedAt=product.CreatedAt

        };
        return dtoo;
    }

    public async Task<ProductDto?> UpdateAsync(int id, ProductDto dto)
    {
        var product = await _context.Products.FirstOrDefaultAsync(p => p.Id == id);
        if (product is null) return null;

        if (string.IsNullOrWhiteSpace(dto.Name))
            throw new ValidationError("Tên sản phẩm là bắt buộc.");

        if (dto.Price < 0)
            throw new ValidationError("Giá sản phẩm không hợp lệ.");

        product.Name = dto.Name;
        product.Slug = string.IsNullOrWhiteSpace(dto.Slug) ? dto.Name.ToLower().Replace(" ", "-") : dto.Slug;
        product.Description = dto.Description;
        product.Price = dto.Price;
        product.SalePrice = dto.SalePrice;
        product.Color = dto.Color;
        product.IsActive = dto.IsActive;
        product.BrandId = dto.BrandId;
        product.CategoryId = dto.CategoryId;

        await _context.SaveChangesAsync();

        dto.Id = product.Id;
        return dto;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var product = await _context.Products.FirstOrDefaultAsync(p => p.Id == id);
        if (product is null) return false;

        _context.Products.Remove(product);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<List<ProductVariantDto>> GetVariantsAsync(int productId)
    {
        return await _context.ProductVariants
            .AsNoTracking()
            .Where(v => v.ProductId == productId)
            .Select(v => new ProductVariantDto
            {
                Id = v.Id,
                ProductId = v.ProductId,
                SizeId = v.SizeId,
                SizeName = v.Size != null ? v.Size.Name : string.Empty,
                SKU = v.SKU,
                StockQuantity = v.StockQuantity,
                Price = v.Price,
                SalePrice = v.SalePrice
            })
            .ToListAsync();
    }

    public async Task<ProductVariantDto?> GetVariantByIdAsync(int variantId)
    {
        var variant = await _context.ProductVariants
            .AsNoTracking()
            .FirstOrDefaultAsync(v => v.Id == variantId);

        if (variant is null) return null;

        return new ProductVariantDto
        {
            Id = variant.Id,
            ProductId = variant.ProductId,
            SizeId = variant.SizeId,
            SizeName = variant.Size != null ? variant.Size.Name : string.Empty,
            SKU = variant.SKU,
            StockQuantity = variant.StockQuantity,
            Price = variant.Price,
            SalePrice = variant.SalePrice
        };
    }

    public async Task<ProductVariantDto> CreateVariantAsync(int productId, CreateProductVariantDto dto)
    {
        var product = await _context.Products.FirstOrDefaultAsync(p => p.Id == productId);
        if (product is null)
            throw new NotFoundError("Không tìm thấy sản phẩm.");

        var variant = new ProductVariant
        {
            ProductId = productId,
            SizeId = dto.SizeId,
            SKU = dto.SKU,
            StockQuantity = dto.StockQuantity,
            Price = dto.Price,
            SalePrice = dto.SalePrice
        };

        _context.ProductVariants.Add(variant);
        await _context.SaveChangesAsync();

        return new ProductVariantDto
        {
            Id = variant.Id,
            ProductId = variant.ProductId,
            SizeId = variant.SizeId,
            SizeName = variant.Size != null ? variant.Size.Name : string.Empty,
            SKU = variant.SKU,
            StockQuantity = variant.StockQuantity,
            Price = variant.Price,
            SalePrice = variant.SalePrice
        };
    }

    public async Task<ProductVariantDto?> UpdateVariantAsync(int variantId, UpdateProductVariantDto dto)
    {
        var variant = await _context.ProductVariants.FirstOrDefaultAsync(v => v.Id == variantId);
        if (variant is null) return null;

        variant.SizeId = dto.SizeId;
        variant.SKU = dto.SKU;
        variant.StockQuantity = dto.StockQuantity;
        variant.Price = dto.Price;
        variant.SalePrice = dto.SalePrice;

        await _context.SaveChangesAsync();

        return new ProductVariantDto
        {
            Id = variant.Id,
            ProductId = variant.ProductId,
            SizeId = variant.SizeId,
            SizeName = variant.Size != null ? variant.Size.Name : string.Empty,
            SKU = variant.SKU,
            StockQuantity = variant.StockQuantity,
            Price = variant.Price,
            SalePrice = variant.SalePrice
        };
    }

    public async Task<bool> DeleteVariantAsync(int variantId)
    {
        var variant = await _context.ProductVariants.FirstOrDefaultAsync(v => v.Id == variantId);
        if (variant is null) return false;

        _context.ProductVariants.Remove(variant);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<List<Size>> GetAllSizesAsync()
    {
        return await _context.Sizes
            .AsNoTracking()
            .OrderBy(s => s.Name)
            .ToListAsync();
    }

    public async Task<List<ProductImageDto>> GetImagesAsync(int productId)
    {
        var product = await _context.Products.FirstOrDefaultAsync(p => p.Id == productId);
        if (product is null)
            throw new NotFoundError("Không tìm thấy sản phẩm.");

        return await _context.ProductImages
            .AsNoTracking()
            .Where(img => img.ProductId == productId)
            .OrderByDescending(img => img.IsPrimary)
            .ThenByDescending(img => img.CreatedAt)
            .Select(img => new ProductImageDto
            {
                Id = img.Id,
                ImageUrl = img.ImageUrl,
                AltText = img.AltText,
                IsPrimary = img.IsPrimary,
                CreatedAt = img.CreatedAt
            })
            .ToListAsync();
    }

    public async Task<ProductImageDto> UploadImageAsync(int productId, IFormFile file, string? altText)
    {
        var product = await _context.Products.FirstOrDefaultAsync(p => p.Id == productId);
        if (product is null)
            throw new NotFoundError("Không tìm thấy sản phẩm.");

        if (file == null || file.Length == 0)
            throw new ValidationError("File ảnh không hợp lệ.");

        var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".webp" };
        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (!allowedExtensions.Contains(extension))
            throw new ValidationError("Định dạng ảnh không hợp lệ. Chỉ cho phép JPG, JPEG, PNG, WEBP.");

        if (file.Length > 5 * 1024 * 1024)
            throw new ValidationError("Kích thước ảnh không được vượt quá 5MB.");

        var uploadsFolder = Path.Combine("wwwroot", "images", "products");
        if (!Directory.Exists(uploadsFolder))
            Directory.CreateDirectory(uploadsFolder);

        var fileName = $"{Guid.NewGuid()}{extension}";
        var filePath = Path.Combine(uploadsFolder, fileName);

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        var imageUrl = $"/images/products/{fileName}";

        var productImage = new ProductImage
        {
            ProductId = productId,
            ImageUrl = imageUrl,
            AltText = altText,
            IsPrimary = false,
            CreatedAt = DateTime.UtcNow
        };

        _context.ProductImages.Add(productImage);
        await _context.SaveChangesAsync();

        return new ProductImageDto
        {
            Id = productImage.Id,
            ImageUrl = productImage.ImageUrl,
            AltText = productImage.AltText,
            IsPrimary = productImage.IsPrimary,
            CreatedAt = productImage.CreatedAt
        };
    }

    public async Task<bool> DeleteImageAsync(int imageId)
    {
        var image = await _context.ProductImages.FirstOrDefaultAsync(img => img.Id == imageId);
        if (image is null) return false;

        var filePath = Path.Combine("wwwroot", image.ImageUrl.TrimStart('/').Replace("/", Path.DirectorySeparatorChar.ToString()));
        if (File.Exists(filePath))
        {
            File.Delete(filePath);
        }

        _context.ProductImages.Remove(image);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<ProductImageDto?> SetPrimaryImageAsync(int imageId)
    {
        var image = await _context.ProductImages.FirstOrDefaultAsync(img => img.Id == imageId);
        if (image is null) return null;

        var productImages = await _context.ProductImages
            .Where(img => img.ProductId == image.ProductId)
            .ToListAsync();

        foreach (var img in productImages)
        {
            img.IsPrimary = img.Id == imageId;
        }

        await _context.SaveChangesAsync();

        return new ProductImageDto
        {
            Id = image.Id,
            ImageUrl = image.ImageUrl,
            AltText = image.AltText,
            IsPrimary = true,
            CreatedAt = image.CreatedAt
        };
    }
}
