using AkilliStok.API.Data;
using AkilliStok.API.Models;
using Microsoft.AspNetCore.Mvc;

[Route("api/[controller]")]
[ApiController]
public class StockLogsController : ControllerBase
{
    private readonly AppDbContext _context;

    public StockLogsController(AppDbContext context)
    {
        _context = context;
    }

    // Stok Hareketi 
    [HttpPost]
    public async Task<IActionResult> PostStockLog(StockLog log)
    {
        // 1. Log Kaydını Ekle
        _context.StockLogs.Add(log);

        // 2. Ürünün Mevcut Stoğunu Güncelle
        var product = await _context.Products.FindAsync(log.ProductId);
        if (product != null)
        {
            product.CurrentStock += log.QuantityChanged; 
        }

        await _context.SaveChangesAsync();
        return Ok(new { message = "Stok güncellendi.", newStock = product?.CurrentStock });
    }
}