using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AkilliStok.API.Data;
using AkilliStok.API.Models;

namespace AkilliStok.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ProductsController(AppDbContext context)
        {
            _context = context;
        }

        // 1. Tüm Ürünleri Listele
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Product>>> GetProducts()
        {
            return await _context.Products.Include(p => p.Category).ToListAsync();
        }

        // 2. BARKOD İLE SORGULAMA 
        [HttpGet("barcode/{code}")]
        public async Task<ActionResult<Product>> GetProductByBarcode(string code)
        {
            var product = await _context.Products
                .Include(p => p.Category)
                .FirstOrDefaultAsync(p => p.Barcode == code);

            if (product == null) return NotFound("Ürün bulunamadı.");
            return Ok(product);
        }

        // 3. Yeni Ürün Ekle
        [HttpPost]
        public async Task<ActionResult<Product>> PostProduct(Product product)
        {
            _context.Products.Add(product);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetProductByBarcode), new { code = product.Barcode }, product);
        }
    }
}