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
    // Not: .Include(l => l.Product) kaldırıldı — projeksiyon (Select) zaten yalnızca
    // ProductName alanına ihtiyaç duyduğundan, EF Core bunu tek bir SQL JOIN'e çevirir
    // ve tam Product nesnelerini belleğe yükleyip izlemek zorunda kalmaz.
    // AsNoTracking: salt-okunur liste — değişiklik izleme yükü gereksiz.
    [HttpGet]
    public async Task<IActionResult> GetStockLogs()
    {
        var logs = await _context.StockLogs
            .AsNoTracking()
            .OrderByDescending(l => l.TransactionDate)
            .Select(l => new
            {
                l.Id,
                ProductName     = l.Product != null ? l.Product.ProductName : "Bilinmiyor",
                l.TransactionType,
                Quantity        = l.QuantityChanged,
                l.OldStock,
                l.NewStock,
                l.TransactionDate
            })
            .ToListAsync();

        return Ok(logs);
    }

    // POST: api/StockLogs — yeni stok hareketi ekle
    [HttpPost]
    public async Task<IActionResult> PostStockLog(StockLog log)
    {
        var product = await _context.Products.FindAsync(log.ProductId);
        if (product == null)
            return NotFound(new { message = "Ürün bulunamadı." });

        // İşlem öncesi ve sonrası stok değerlerini kaydet
        log.OldStock = product.CurrentStock;
        product.CurrentStock += log.QuantityChanged;
        log.NewStock = product.CurrentStock;

        _context.StockLogs.Add(log);
        await _context.SaveChangesAsync();

        return Ok(new
        {
            message  = "Stok güncellendi.",
            oldStock = log.OldStock,
            newStock = log.NewStock
        });
    }
}
