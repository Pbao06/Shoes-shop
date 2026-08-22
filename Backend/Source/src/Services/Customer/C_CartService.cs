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

    public async Task<CartDto> GetCartAsync(int userId)
    {
        // Kiểm tra user đã có Cart chưa
        var cart = await _context.Carts
            .AsNoTracking()
            .FirstOrDefaultAsync(c => c.UserId == userId);

        // Chưa có giỏ hàng -> trả về giỏ rỗng
        if (cart == null)
        {
            return new CartDto
            {
                Id = 0,
                TotalItems = 0,
                TotalPrice = 0,
                Items = new List<CartItemDto>()
            };
        }

        return await BuildCartDtoAsync(cart.Id);
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

        // Kiểm tra tồn kho
        if (dto.Quantity > variant.StockQuantity)
            throw new ValidationError("Số lượng vượt quá tồn kho hiện có");

        // 1. GetOrCreateCart: Kiểm tra user đã có Cart chưa, nếu chưa thì tạo mới
        var cart = await GetOrCreateCartAsync(userId);

        // 2. Kiểm tra trong giỏ đã có ProductVariantId này chưa
        var existingItem = await _context.CartItems
            .FirstOrDefaultAsync(ci => ci.CartId == cart.Id && ci.ProductVariantId == dto.ProductVariantId);

        if (existingItem != null)
        {
            // Đã có rồi: Cộng dồn Quantity (kiểm tra tồn kho)
            var newQuantity = existingItem.Quantity + dto.Quantity;
            if (newQuantity > variant.StockQuantity)
                throw new ValidationError("Số lượng vượt quá tồn kho hiện có");

            existingItem.Quantity = newQuantity;
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

    public async Task<CartDto> UpdateItemAsync(int userId, int cartItemId, int quantity)
    {
        // Validate dữ liệu đầu vào 

        // Kiểm tra user có Cart không
        var cart = await _context.Carts
            .FirstOrDefaultAsync(c => c.UserId == userId);

        if (cart == null)
            throw new NotFoundError("Không tìm thấy giỏ hàng");

        // Tìm CartItem thuộc giỏ của user
        var cartItem = await _context.CartItems
            .Include(ci => ci.ProductVariant)
            .FirstOrDefaultAsync(ci => ci.Id == cartItemId && ci.CartId == cart.Id);

        if (cartItem == null)
            throw new NotFoundError("Không tìm thấy sản phẩm trong giỏ hàng");
        if (quantity <= 0)
        {
            // xóa nếu quantity <= 0 khi user - xuôgs
            _context.CartItems.Remove(cartItem); 
        }

        // Kiểm tra tồn kho
        if (cartItem.ProductVariant != null && quantity > cartItem.ProductVariant.StockQuantity)
            throw new ValidationError("Số lượng vượt quá tồn kho hiện có");

        // Cập nhật số lượng
        cartItem.Quantity = quantity;
        _context.CartItems.Update(cartItem);

        // Cập nhật thời gian giỏ hàng
        cart.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return await BuildCartDtoAsync(cart.Id);
    }

    public async Task RemoveItemAsync(int userId, int cartItemId)
    {
        // Kiểm tra user có Cart không
        var cart = await _context.Carts
            .FirstOrDefaultAsync(c => c.UserId == userId);

        if (cart == null)
            throw new NotFoundError("Không tìm thấy giỏ hàng");

        // Tìm CartItem thuộc giỏ của user
        var cartItem = await _context.CartItems
            .FirstOrDefaultAsync(ci => ci.Id == cartItemId && ci.CartId == cart.Id);

        if (cartItem == null)
            throw new NotFoundError("Không tìm thấy sản phẩm trong giỏ hàng");

        // Xóa CartItem
        _context.CartItems.Remove(cartItem);

        // Cập nhật thời gian giỏ hàng
        cart.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
    }

    public async Task ClearCartAsync(int userId)
    {
        // Kiểm tra user có Cart không
        var cart = await _context.Carts
            .FirstOrDefaultAsync(c => c.UserId == userId);

        if (cart == null)
            return;

        // Lấy tất cả CartItem của giỏ
        var cartItems = await _context.CartItems
            .Where(ci => ci.CartId == cart.Id)
            .ToListAsync();

        if (cartItems.Count > 0)
        {
            _context.CartItems.RemoveRange(cartItems);
        }

        // Cập nhật thời gian giỏ hàng
        cart.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
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
            await _context.SaveChangesAsync();
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
                .ThenInclude(v => v.Product!)
                    .ThenInclude(p => p.Brand)
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
            Brand = ci.ProductVariant?.Product?.Brand?.Name ?? string.Empty,
            Color = ci.ProductVariant?.Product?.Color,
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