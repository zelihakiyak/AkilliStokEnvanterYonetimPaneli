using AkilliStok.API.Data;
using AkilliStok.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class StockLogsController : ControllerBase
{
    private readonly AppDbContext _context;

    public StockLogsController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/StockLogs — tüm hareketleri tarihe göre azalan sırada döndür
    [HttpGet]
    public async Task<IActionResult> GetStockLogs()
    {
        var logs = await _context.StockLogs
            .Include(l => l.Product)
            .OrderByDescending(l => l.TransactionDate)
            .Select(l => new
            {
                l.Id,
                ProductName     = l.Product != null ? l.Product.ProductName : "Bilinmiyor",
                l.TransactionType,
                Quantity        = l.QuantityChanged,
                l.TransactionDate
            })
            .ToListAsync();

        return Ok(logs);
    }

    // POST: api/StockLogs — yeni stok hareketi ekle
    [HttpPost]
    public async Task<IActionResult> PostStockLog(StockLog log)
    {
        _context.StockLogs.Add(log);

        var product = await _context.Products.FindAsync(log.ProductId);
        if (product != null)
        {
            product.CurrentStock += log.QuantityChanged;
        }

        await _context.SaveChangesAsync();
        return Ok(new { message = "Stok güncellendi.", newStock = product?.CurrentStock });
    }
}
