using AkilliStok.API.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class ForecastController : ControllerBase
{
    private readonly AppDbContext _context;

    public ForecastController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/Forecast
    // Tüm ürünler için tahmini stok bitiş süresi hesaplar
    // Algoritma: Günlük Tüketim = Son 30 gün çıkış miktarı / 30
    //            Tahmini Bitiş  = Mevcut Stok / Günlük Tüketim
    [HttpGet]
    public async Task<IActionResult> GetForecast()
    {
        var thirtyDaysAgo = DateTime.Now.AddDays(-30);

        var products = await _context.Products
            .ToListAsync();

        var logs = await _context.StockLogs
            .Where(l => l.TransactionDate >= thirtyDaysAgo
                     && l.TransactionType == "Out")
            .ToListAsync();

        var result = products.Select(p =>
        {
            // Son 30 günde bu ürünün toplam çıkış miktarı
            int totalOut = logs
                .Where(l => l.ProductId == p.Id)
                .Sum(l => Math.Abs(l.QuantityChanged));

            // Günlük ortalama tüketim
            double dailyUsage = totalOut / 30.0;

            // Tahmini bitiş süresi (gün)
            double? estimatedDaysLeft = dailyUsage > 0
                ? Math.Round(p.CurrentStock / dailyUsage, 1)
                : (double?)null; // Hiç çıkış yoksa hesaplanamaz

            // Tahmini bitiş tarihi
            DateTime? estimatedEndDate = estimatedDaysLeft.HasValue
                ? DateTime.Now.AddDays(estimatedDaysLeft.Value)
                : (DateTime?)null;

            // Risk seviyesi
            string riskLevel = estimatedDaysLeft switch
            {
                null        => "Veri Yok",
                <= 7        => "Kritik",
                <= 14       => "Düşük",
                <= 30       => "Orta",
                _           => "Yeterli"
            };

            return new
            {
                p.Id,
                p.ProductName,
                p.Barcode,
                p.CurrentStock,
                p.CriticalLimit,
                TotalOutLast30Days  = totalOut,
                DailyUsage          = Math.Round(dailyUsage, 2),
                EstimatedDaysLeft   = estimatedDaysLeft,
                EstimatedEndDate    = estimatedEndDate?.ToString("yyyy-MM-dd"),
                RiskLevel           = riskLevel
            };
        })
        .OrderBy(x => x.EstimatedDaysLeft ?? double.MaxValue)
        .ToList();

        return Ok(result);
    }

    // GET: api/Forecast/{id}
    // Tek bir ürün için tahmini stok bitiş süresi
    [HttpGet("{id}")]
    public async Task<IActionResult> GetProductForecast(int id)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null)
            return NotFound(new { message = "Ürün bulunamadı." });

        var thirtyDaysAgo = DateTime.Now.AddDays(-30);

        int totalOut = await _context.StockLogs
            .Where(l => l.ProductId == id
                     && l.TransactionType == "Out"
                     && l.TransactionDate >= thirtyDaysAgo)
            .SumAsync(l => (int?)Math.Abs(l.QuantityChanged)) ?? 0;

        double dailyUsage      = totalOut / 30.0;
        double? estimatedDays  = dailyUsage > 0
            ? Math.Round(product.CurrentStock / dailyUsage, 1)
            : (double?)null;

        string riskLevel = estimatedDays switch
        {
            null  => "Veri Yok",
            <= 7  => "Kritik",
            <= 14 => "Düşük",
            <= 30 => "Orta",
            _     => "Yeterli"
        };

        return Ok(new
        {
            product.Id,
            product.ProductName,
            product.CurrentStock,
            product.CriticalLimit,
            TotalOutLast30Days = totalOut,
            DailyUsage         = Math.Round(dailyUsage, 2),
            EstimatedDaysLeft  = estimatedDays,
            EstimatedEndDate   = estimatedDays.HasValue
                ? DateTime.Now.AddDays(estimatedDays.Value).ToString("yyyy-MM-dd")
                : null,
            RiskLevel          = riskLevel
        });
    }
}
