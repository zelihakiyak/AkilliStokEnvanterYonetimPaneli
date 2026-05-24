using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using AkilliStok.API.Data;
using AkilliStok.API.Models;

namespace AkilliStok.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]                          // Tüm endpoint'ler token gerektiriyor
    public class ProductsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ProductsController(AppDbContext context)
        {
            _context = context;
        }

        // 1. Tüm Ürünleri Listele (Admin + Personel)
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Product>>> GetProducts()
        {
            return await _context.Products.Include(p => p.Category).ToListAsync();
        }

        // 2. Barkod ile Sorgula (Admin + Personel)
        [HttpGet("barcode/{code}")]
        public async Task<ActionResult<Product>> GetProductByBarcode(string code)
        {
            var product = await _context.Products
                .Include(p => p.Category)
                .FirstOrDefaultAsync(p => p.Barcode == code);

            if (product == null) return NotFound(new { message = "Ürün bulunamadı." });
            return Ok(product);
        }

        // 3. ID ile Getir (Admin + Personel)
        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> GetProduct(int id)
        {
            var product = await _context.Products.Include(p => p.Category).FirstOrDefaultAsync(p => p.Id == id);
            if (product == null) return NotFound(new { message = "Ürün bulunamadı." });
            return Ok(product);
        }

        // 4. Yeni Ürün Ekle — sadece Admin
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<Product>> PostProduct(Product product)
        {
            bool barcodeExists = await _context.Products.AnyAsync(p => p.Barcode == product.Barcode);
            if (barcodeExists)
                return BadRequest(new { message = "Bu barkod zaten kayıtlı." });

            _context.Products.Add(product);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetProductByBarcode), new { code = product.Barcode }, product);
        }

        // 5. Ürün Güncelle — sadece Admin
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> PutProduct(int id, Product updatedProduct)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null) return NotFound(new { message = "Ürün bulunamadı." });

            product.ProductName   = updatedProduct.ProductName;
            product.Barcode       = updatedProduct.Barcode;
            product.UnitPrice     = updatedProduct.UnitPrice;
            product.CurrentStock  = updatedProduct.CurrentStock;
            product.CriticalLimit = updatedProduct.CriticalLimit;
            product.CategoryId    = updatedProduct.CategoryId;

            await _context.SaveChangesAsync();
            return Ok(new { message = "Ürün güncellendi.", product });
        }

        // 6. Ürün Sil — sadece Admin
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null) return NotFound(new { message = "Ürün bulunamadı." });

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Ürün silindi." });
        }
    }
}