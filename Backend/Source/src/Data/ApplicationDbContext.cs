using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using src.Models;

namespace src.Data;

public class ApplicationDbContext : IdentityDbContext<User, IdentityRole<int>, int>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<Brand> Brands => Set<Brand>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Product> Products => Set<Product>();
    public DbSet<ProductVariant> ProductVariants => Set<ProductVariant>();
    public DbSet<Size> Sizes => Set<Size>();
    public DbSet<ProductImage> ProductImages => Set<ProductImage>();
    public DbSet<Cart> Carts => Set<Cart>();
    public DbSet<CartItem> CartItems => Set<CartItem>();
    public DbSet<Address> Addresses => Set<Address>();
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<OrderItem> OrderItems => Set<OrderItem>();
    public DbSet<Payment> Payments => Set<Payment>();
    public DbSet<Review> Reviews => Set<Review>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<User>(entity =>
        {
            entity.HasIndex(e => e.NormalizedUserName).IsUnique();
            entity.HasIndex(e => e.NormalizedEmail).IsUnique();
        });

        builder.Entity<Brand>(entity =>
        {
            entity.Property(e => e.Name).HasMaxLength(200).IsRequired();
            entity.Property(e => e.Description).HasMaxLength(1000);
        });

        builder.Entity<Category>(entity =>
        {
            entity.Property(e => e.Name).HasMaxLength(200).IsRequired();
            entity.Property(e => e.Slug).HasMaxLength(200).IsRequired();
        });

        builder.Entity<Product>(entity =>
        {
            entity.Property(e => e.Name).HasMaxLength(300).IsRequired();
            entity.Property(e => e.Slug).HasMaxLength(300).IsRequired();
            entity.Property(e => e.Price).HasColumnType("decimal(18,2)");
            entity.Property(e => e.SalePrice).HasColumnType("decimal(18,2)");
            entity.HasOne(e => e.Brand)
                .WithMany(e => e.Products)
                .HasForeignKey(e => e.BrandId)
                .OnDelete(DeleteBehavior.Restrict);
            entity.HasOne(e => e.Category)
                .WithMany(e => e.Products)
                .HasForeignKey(e => e.CategoryId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        builder.Entity<ProductVariant>(entity =>
        {
            entity.Property(e => e.SKU).HasMaxLength(100).IsRequired();
            entity.Property(e => e.Price).HasColumnType("decimal(18,2)");
            entity.Property(e => e.SalePrice).HasColumnType("decimal(18,2)");
            entity.HasOne(e => e.Product)
                .WithMany(e => e.Variants)
                .HasForeignKey(e => e.ProductId)
                .OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(e => e.Size)
                .WithMany(e => e.ProductVariants)
                .HasForeignKey(e => e.SizeId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        builder.Entity<Size>(entity =>
        {
            entity.Property(e => e.Name).HasMaxLength(100).IsRequired();
        });

        builder.Entity<ProductImage>(entity =>
        {
            entity.Property(e => e.ImageUrl).HasMaxLength(500).IsRequired();
            entity.HasOne(e => e.Product)
                .WithMany(e => e.Images)
                .HasForeignKey(e => e.ProductId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        builder.Entity<Cart>(entity =>
        {
            entity.HasOne(e => e.User)
                .WithOne(e => e.Cart)
                .HasForeignKey<Cart>(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        builder.Entity<CartItem>(entity =>
        {
            entity.HasOne(e => e.Cart)
                .WithMany(e => e.CartItems)
                .HasForeignKey(e => e.CartId)
                .OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(e => e.ProductVariant)
                .WithMany(e => e.CartItems)
                .HasForeignKey(e => e.ProductVariantId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        builder.Entity<Address>(entity =>
        {
            entity.Property(e => e.Street).HasMaxLength(300).IsRequired();
            entity.Property(e => e.City).HasMaxLength(150).IsRequired();
            entity.Property(e => e.State).HasMaxLength(150).IsRequired();
            entity.Property(e => e.PostalCode).HasMaxLength(50).IsRequired();
            entity.Property(e => e.Country).HasMaxLength(100).IsRequired();
            entity.HasOne(e => e.User)
                .WithMany(e => e.Addresses)
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        builder.Entity<Order>(entity =>
        {
            entity.Property(e => e.OrderNumber).HasMaxLength(100).IsRequired();
            entity.Property(e => e.Subtotal).HasColumnType("decimal(18,2)");
            entity.Property(e => e.ShippingFee).HasColumnType("decimal(18,2)");
            entity.Property(e => e.TotalAmount).HasColumnType("decimal(18,2)");
            entity.HasOne(e => e.User)
                .WithMany(e => e.Orders)
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(e => e.Address)
                .WithMany(e => e.Orders)
                .HasForeignKey(e => e.AddressId)
                .OnDelete(DeleteBehavior.SetNull);
        });

        builder.Entity<OrderItem>(entity =>
        {
            entity.Property(e => e.UnitPrice).HasColumnType("decimal(18,2)");
            entity.Property(e => e.TotalPrice).HasColumnType("decimal(18,2)");
            entity.HasOne(e => e.Order)
                .WithMany(e => e.OrderItems)
                .HasForeignKey(e => e.OrderId)
                .OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(e => e.Product)
                .WithMany(e => e.OrderItems)
                .HasForeignKey(e => e.ProductId)
                .OnDelete(DeleteBehavior.Restrict);
            entity.HasOne(e => e.ProductVariant)
                .WithMany(e => e.OrderItems)
                .HasForeignKey(e => e.ProductVariantId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        builder.Entity<Payment>(entity =>
        {
            entity.Property(e => e.PaymentMethod).HasMaxLength(100).IsRequired();
            entity.Property(e => e.TransactionId).HasMaxLength(200);
            entity.Property(e => e.Amount).HasColumnType("decimal(18,2)");
            entity.HasOne(e => e.Order)
                .WithMany(e => e.Payments)
                .HasForeignKey(e => e.OrderId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        builder.Entity<Review>(entity =>
        {
            entity.Property(e => e.Comment).HasMaxLength(2000);
            entity.HasOne(e => e.Product)
                .WithMany(e => e.Reviews)
                .HasForeignKey(e => e.ProductId)
                .OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(e => e.User)
                .WithMany(e => e.Reviews)
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }
}
