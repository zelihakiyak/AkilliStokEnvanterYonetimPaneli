using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AkilliStok.API.Data;
using AkilliStok.API.Models;

namespace AkilliStok.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] // ← Tüm endpoint'ler token gerektiriyor
    public class ProductsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ProductsController(AppDbContext context)
        {
            _context = context;
        }

        // 1. Tüm Ürünleri Listele — Admin ve Personel görebilir
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Product>>> GetProducts()
        {
            return await _context.Products.Include(p => p.Category).ToListAsync();
        }

        // 2. ID ile Tek Ürün Getir
        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> GetProduct(int id)
        {
            var product = await _context.Products
                .Include(p => p.Category)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (product == null) return NotFound("Ürün bulunamadı.");
            return Ok(product);
        }

        // 3. Barkod ile Sorgulama
        [HttpGet("barcode/{code}")]
        public async Task<ActionResult<Product>> GetProductByBarcode(string code)
        {
            var product = await _context.Products
                .Include(p => p.Category)
                .FirstOrDefaultAsync(p => p.Barcode == code);

            if (product == null) return NotFound("Ürün bulunamadı.");
            return Ok(product);
        }

        // 4. Yeni Ürün Ekle — Sadece Admin
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<Product>> PostProduct(Product product)
        {
            _context.Products.Add(product);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, product);
        }

        // 5. Ürün Güncelle — Sadece Admin
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> PutProduct(int id, Product product)
        {
            if (id != product.Id)
                return BadRequest("ID eşleşmiyor.");

            _context.Entry(product).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await _context.Products.AnyAsync(p => p.Id == id))
                    return NotFound("Güncellenecek ürün bulunamadı.");
                throw;
            }

            return NoContent();
        }

        // 6. Ürün Sil — Sadece Admin
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);

            if (product == null)
                return NotFound("Silinecek ürün bulunamadı.");

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}