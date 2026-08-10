using Microsoft.EntityFrameworkCore;
using src.Data;
using src.DTOs;
using src.Middleware;
using src.Models;
using src.Services.Interface;

namespace src.Services.Customer;

public class C_CartService : IC_CartService
{
    private readonly ApplicationDbContext _context;

    public C_CartService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<CartDto> AddToCartAsync(int userId, AddToCartDto dto)
    {
        // Validate dữ liệu đầu vào
        if (dto.Quantity <= 0)
            throw new ValidationError("Số lượng phải lớn hơn 0");

        // Kiểm tra ProductVariant có tồn tại không
        var variant = await _context.ProductVariants
            .AsNoTracking()
            .Include(v => v.Size)
            .Include(v => v.Product)
                .ThenInclude(p => p!.Images)
            .FirstOrDefaultAsync(v => v.Id == dto.ProductVariantId);

        if (variant == null)
            throw new NotFoundError("Không tìm thấy biến thể sản phẩm");

        // 1. GetOrCreateCart: Kiểm tra user đã có Cart chưa, nếu chưa thì tạo mới
        var cart = await GetOrCreateCartAsync(userId);

        // 2. Kiểm tra trong giỏ đã có ProductVariantId này chưa
        var existingItem = await _context.CartItems
            .FirstOrDefaultAsync(ci => ci.CartId == cart.Id && ci.ProductVariantId == dto.ProductVariantId);

        if (existingItem != null)
        {
            // Đã có rồi: Cộng dồn Quantity
            existingItem.Quantity += dto.Quantity;
            _context.CartItems.Update(existingItem);
        }
        else
        {
            // Chưa có: Tạo mới CartItem (lưu cả giá UnitPrice tại thời điểm thêm)
            var unitPrice = variant.SalePrice ?? variant.Price;
            var cartItem = new CartItem
            {
                CartId = cart.Id,
                ProductVariantId = variant.Id,
                Quantity = dto.Quantity,
                UnitPrice = unitPrice
            };
            _context.CartItems.Add(cartItem);
        }

        // Cập nhật thời gian giỏ hàng
        cart.UpdatedAt = DateTime.UtcNow;

        // 3. Lưu thay đổi vào DB
        await _context.SaveChangesAsync();

        // Trả về CartDto sau khi thêm
        return await BuildCartDtoAsync(cart.Id);
    }

    private async Task<Cart> GetOrCreateCartAsync(int userId)
    {
        var cart = await _context.Carts
            .FirstOrDefaultAsync(c => c.UserId == userId);

        if (cart == null)
        {
            cart = new Cart
            {
                UserId = userId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
            _context.Carts.Add(cart);
        }

        return cart;
    }

    private async Task<CartDto> BuildCartDtoAsync(int cartId)
    {
        var items = await _context.CartItems
            .AsNoTracking()
            .Where(ci => ci.CartId == cartId)
            .Include(ci => ci.ProductVariant!)
                .ThenInclude(v => v.Product!)
                    .ThenInclude(p => p.Images)
            .Include(ci => ci.ProductVariant!)
                .ThenInclude(v => v.Size)
            .ToListAsync();

        var itemDtos = items.Select(ci => new CartItemDto
        {
            Id = ci.Id,
            ProductVariantId = ci.ProductVariantId,
            ProductName = ci.ProductVariant?.Product?.Name ?? string.Empty,
            ProductImage = ci.ProductVariant?.Product?.Images
                .OrderByDescending(i => i.IsPrimary)
                .Select(i => i.ImageUrl)
                .FirstOrDefault(),
            SizeName = ci.ProductVariant?.Size?.Name ?? string.Empty,
            UnitPrice = ci.UnitPrice,
            Quantity = ci.Quantity,
        }).ToList();

        return new CartDto
        {
            Id = cartId,
            TotalItems = itemDtos.Sum(i => i.Quantity),
            TotalPrice = itemDtos.Sum(i => i.TotalPrice),
            Items = itemDtos
        };
    }
}