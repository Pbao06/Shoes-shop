using Microsoft.EntityFrameworkCore;
using src.Data;
using src.DTOs;
using src.Middleware;
using src.Models;
using src.Services.Interface;

namespace src.Services.Customer;

/// <summary>
/// Dịch vụ xử lý các nghiệp vụ đơn hàng phía khách hàng.
/// </summary>
public class C_OrderService : IC_OrderService
{
    private readonly ApplicationDbContext _context;

    // Phí giao hàng cố định hiện tại
    private const decimal ShippingFee = 30000;

    public C_OrderService(ApplicationDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Tạo đơn hàng mới từ giỏ hàng của người dùng.
    /// Sử dụng EF Core Transaction để đảm bảo toàn vẹn dữ liệu.
    /// </summary>
    public async Task<OrderDto> CreateOrderAsync(int userId, CheckoutDto dto)
    {
        // ====== 1. Mở transaction ======
        // Mọi thao tác (kiểm tra giỏ, trừ kho, lưu đơn, xóa giỏ) đều nằm trong 1 transaction.
        // Nếu bất kỳ bước nào lỗi, toàn bộ sẽ được rollback.
        await using var transaction = await _context.Database.BeginTransactionAsync();

        try
        {
            // ====== 2. Lấy giỏ hàng của user kèm các CartItem ======
            var cart = await _context.Carts
                .Include(c => c.CartItems)
                    .ThenInclude(ci => ci.ProductVariant)
                .FirstOrDefaultAsync(c => c.UserId == userId);

            // Giỏ hàng không tồn tại hoặc không có sản phẩm => báo lỗi
            if (cart == null || cart.CartItems.Count == 0)
                throw new ValidationError("Giỏ hàng của bạn đang trống");

            // ====== 3. Xử lý địa chỉ giao hàng ======
            // Nếu người dùng chọn AddressId có sẵn, kiểm tra địa chỉ đó có thuộc về user hay không.
            // Ngược lại, tạo mới Address từ dữ liệu trong dto.
            Address? address;

            if (dto.AddressId.HasValue)
            {
                // Lấy địa chỉ có sẵn và kiểm tra quyền sở hữu
                address = await _context.Addresses
                    .FirstOrDefaultAsync(a => a.Id == dto.AddressId.Value && a.UserId == userId);

                if (address == null)
                    throw new NotFoundError("Không tìm thấy địa chỉ giao hàng");
            }
            else
            {
                // Chuẩn hóa dữ liệu từ Frontend:
                // - Gộp firstName + lastName thành RecipientName (nếu không gửi sẵn).
                // - Map trường Address (đơn giản) sang Street.
                // - Tự động sinh PhoneNumber mặc định nếu Frontend chưa thu thập.
                var recipientName = dto.RecipientName
                    ?? $"{dto.FirstName} {dto.LastName}".Trim();
                var street = dto.Street ?? dto.Address ?? string.Empty;
                var phoneNumber = string.IsNullOrWhiteSpace(dto.PhoneNumber)
                    ? "0000000000"
                    : dto.PhoneNumber;

                ValidateShippingAddress(recipientName, street, dto.City, dto.Country);

                address = new Address
                {
                    UserId = userId,
                    RecipientName = recipientName,
                    PhoneNumber = phoneNumber,
                    Street = street,
                    City = dto.City ?? string.Empty,
                    State = dto.State ?? string.Empty,
                    PostalCode = dto.PostalCode ?? string.Empty,
                    Country = dto.Country ?? string.Empty,
                    IsDefault = false,
                    CreatedAt = DateTime.UtcNow
                };

                _context.Addresses.Add(address);
                // Lưu để lấy ra AddressId (trước khi tạo Order cần AddressId)
                await _context.SaveChangesAsync();
            }

            // ====== 4. Tạo Order (Header) ======
            var order = new Order
            {
                UserId = userId,
                AddressId = address.Id,
                OrderNumber = GenerateOrderNumber(),
                Subtotal = 0,
                ShippingFee = ShippingFee,
                TotalAmount = 0,
                Status = "Pending",
                PaymentStatus = "Unpaid",
                CreatedAt = DateTime.UtcNow
            };

            _context.Orders.Add(order);

            // ====== 5. Tạo OrderItem từ CartItem (snapshot giá) ======
            var orderItems = new List<OrderItem>();
            decimal subtotal = 0;

            foreach (var cartItem in cart.CartItems)
            {
                // Kiểm tra variant có tồn tại (tránh dữ liệu rác)
                var variant = cartItem.ProductVariant;
                if (variant == null)
                    throw new ValidationError("Một sản phẩm trong giỏ hàng không tồn tại");

                // Kiểm tra tồn kho đủ không (tránh overselling)
                if (cartItem.Quantity > variant.StockQuantity)
                    throw new ValidationError(
                        $"Sản phẩm \"{variant.Product?.Name}\" không đủ hàng. Còn {variant.StockQuantity} trong kho.");

                // Snapshot giá tại thời điểm đặt hàng (không bị ảnh hưởng bởi đổi giá sau này)
                var unitPrice = variant.SalePrice ?? variant.Price;
                var totalPrice = unitPrice * cartItem.Quantity;

                // Tạo OrderItem: lấy ProductId từ variant để map đúng bảng Product
                orderItems.Add(new OrderItem
                {
                    OrderId = order.Id,
                    ProductId = variant.ProductId, // ← Lấy ProductId từ biến thể
                    ProductVariantId = variant.Id,
                    Quantity = cartItem.Quantity,
                    UnitPrice = unitPrice,          // ← Snapshot giá bán tại thời điểm đặt
                    TotalPrice = totalPrice
                });

                // Cộng dồn subtotal
                subtotal += totalPrice;

                // ====== 6. Trừ tồn kho ======
                variant.StockQuantity -= cartItem.Quantity;
                _context.ProductVariants.Update(variant);
            }

            // Gán giá trị cho order
            order.Subtotal = subtotal;
            order.TotalAmount = subtotal + ShippingFee;

            // Thêm tất cả OrderItem vào DbContext
            _context.OrderItems.AddRange(orderItems);

            // ====== 7. Tạo bản ghi Payment ======
            // Chuẩn hóa PaymentMethod: ưu tiên trường Payment từ Frontend ('card', 'paypal', ...),
            // nếu không có thì dùng PaymentMethod (mặc định "COD").
            var paymentMethod = !string.IsNullOrWhiteSpace(dto.Payment)
                ? dto.Payment
                : (dto.PaymentMethod ?? "COD");

            var payment = new Payment
            {
                OrderId = order.Id,
                PaymentMethod = paymentMethod,
                Status = paymentMethod.Equals("COD", StringComparison.OrdinalIgnoreCase) ? "Pending" : "Paid",
                Amount = order.TotalAmount,
                TransactionId = null,
                CreatedAt = DateTime.UtcNow
            };
            _context.Payments.Add(payment);

            // ====== 8. Xóa toàn bộ CartItem sau khi đặt hàng thành công ======
            _context.CartItems.RemoveRange(cart.CartItems);
            cart.UpdatedAt = DateTime.UtcNow;

            // ====== 9. Lưu một lần duy nhất và commit transaction ======
            await _context.SaveChangesAsync();
            await transaction.CommitAsync();

            // Trả về DTO cho client
            return await GetOrderByIdAsync(order.Id, userId);
        }
        catch
        {
            // Bất kỳ lỗi nào cũng rollback lại toàn bộ để không thay đổi dữ liệu
            await transaction.RollbackAsync();
            throw;
        }
    }

    /// <summary>
    /// Lấy chi tiết một đơn hàng theo ID, chỉ trả về nếu đơn hàng thuộc về user đó.
    /// </summary>
    public async Task<OrderDto> GetOrderByIdAsync(int orderId, int userId)
    {
        var order = await _context.Orders
            .AsNoTracking()
            .Include(o => o.Address)
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Product)
                        .ThenInclude(p => p.Images)
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.ProductVariant)
                        .ThenInclude(v => v!.Size)
                .FirstOrDefaultAsync(o => o.Id == orderId && o.UserId == userId);

        if (order == null)
            throw new NotFoundError("Không tìm thấy đơn hàng");

        return MapToOrderDto(order);
    }

    /// <summary>
    /// Lấy danh sách tất cả đơn hàng của một người dùng.
    /// </summary>
    public async Task<List<OrderDto>> GetOrdersByUserAsync(int userId)
    {
        var orders = await _context.Orders
            .AsNoTracking()
            .Where(o => o.UserId == userId)
            .Include(o => o.Address)
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Product)
                        .ThenInclude(p => p.Images)
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.ProductVariant)
                        .ThenInclude(v => v!.Size)
                .OrderByDescending(o => o.CreatedAt)
            .ToListAsync();

        return orders.Select(MapToOrderDto).ToList();
    }

    /// <summary>
    /// Hủy đơn hàng nếu đơn hàng chưa được giao (Status == "Pending" hoặc "Processing").
    /// Khi hủy, tồn kho của từng ProductVariant được hoàn lại.
    /// </summary>
    public async Task<OrderDto> CancelOrderAsync(int orderId, int userId)
    {
        await using var transaction = await _context.Database.BeginTransactionAsync();

        try
        {
            // Lấy đơn hàng kèm OrderItems để biết cần hoàn lại tồn kho những gì
            var order = await _context.Orders
                .Include(o => o.OrderItems)
                .FirstOrDefaultAsync(o => o.Id == orderId && o.UserId == userId);

            if (order == null)
                throw new NotFoundError("Không tìm thấy đơn hàng");

            // Chỉ cho hủy khi đơn hàng chưa giao
            if (order.Status == "Shipped" || order.Status == "Completed" || order.Status == "Cancelled")
                throw new ValidationError("Đơn hàng này không thể hủy do đã giao hoặc đã kết thúc");

            // ====== Hoàn lại tồn kho cho từng sản phẩm ======
            foreach (var item in order.OrderItems)
            {
                var variant = await _context.ProductVariants
                    .FirstOrDefaultAsync(v => v.Id == item.ProductVariantId);

                if (variant != null)
                {
                    variant.StockQuantity += item.Quantity;
                    _context.ProductVariants.Update(variant);
                }
            }

            // Cập nhật trạng thái đơn hàng
            order.Status = "Cancelled";
            _context.Orders.Update(order);

            // Cập nhật trạng thái thanh toán (nếu đã thanh toán thì sẽ được hoàn tiền sau - ghi chú)
            if (order.PaymentStatus == "Paid")
            {
                order.PaymentStatus = "Refunded";
            }

            await _context.SaveChangesAsync();
            await transaction.CommitAsync();

            return await GetOrderByIdAsync(order.Id, userId);
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }

    // ===================== PRIVATE HELPERS =====================

    /// <summary>
    /// Kiểm tra tính hợp lệ của địa chỉ giao hàng mới nhập từ form.
    /// </summary>
    private void ValidateShippingAddress(string recipientName, string street, string? city, string? country)
    {
        if (string.IsNullOrWhiteSpace(recipientName))
            throw new ValidationError("Vui lòng nhập tên người nhận");
        if (string.IsNullOrWhiteSpace(street))
            throw new ValidationError("Vui lòng nhập địa chỉ cụ thể");
        if (string.IsNullOrWhiteSpace(city))
            throw new ValidationError("Vui lòng nhập thành phố");
        if (string.IsNullOrWhiteSpace(country))
            throw new ValidationError("Vui lòng nhập quốc gia");
    }

    /// <summary>
    /// Tạo mã đơn hàng duy nhất theo định dạng: ORD-yyyyMMddHHmmss-xxx
    /// </summary>
    private string GenerateOrderNumber()
    {
        // Lấy ngẫu nhiên 3 chữ số để tránh trùng lặp trong cùng 1 giây
        var randomSuffix = Random.Shared.Next(100, 999);
        return $"ORD-{DateTime.UtcNow:yyyyMMddHHmmss}-{randomSuffix}";
    }

    /// <summary>
    /// Map entity Order sang OrderDto để trả về client.
    /// </summary>
    private static OrderDto MapToOrderDto(Order order)
    {
        return new OrderDto
        {
            Id = order.Id,
            OrderNumber = order.OrderNumber,
            Status = order.Status,
            PaymentStatus = order.PaymentStatus,
            Subtotal = order.Subtotal,
            ShippingFee = order.ShippingFee,
            TotalAmount = order.TotalAmount,
            CreatedAt = order.CreatedAt,
            Address = order.Address == null ? null : new AddressDto
            {
                RecipientName = order.Address.RecipientName,
                PhoneNumber = order.Address.PhoneNumber,
                Street = order.Address.Street,
                City = order.Address.City,
                State = order.Address.State,
                PostalCode = order.Address.PostalCode,
                Country = order.Address.Country
            },
            Items = order.OrderItems.Select(oi => new OrderItemDto
            {
                ProductId = oi.ProductId,
                ProductVariantId = oi.ProductVariantId,
                ProductName = oi.Product?.Name ?? string.Empty,
                SizeName = oi.ProductVariant?.Size?.Name ?? string.Empty,
                Color = oi.Product?.Color,
                ImageUrl = oi.Product?.Images
                    .OrderByDescending(i => i.IsPrimary)
                    .Select(i => i.ImageUrl)
                    .FirstOrDefault(),
                Quantity = oi.Quantity,
                UnitPrice = oi.UnitPrice,
                TotalPrice = oi.TotalPrice
            }).ToList()
        };
    }
}
