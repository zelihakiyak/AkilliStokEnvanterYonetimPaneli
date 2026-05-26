namespace AkilliStok.API.Models
{
    public class StockLog
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public int QuantityChanged { get; set; }
        public DateTime TransactionDate { get; set; } = DateTime.Now;
        public string TransactionType { get; set; } = string.Empty; // In veya Out
        public string Note { get; set; } = string.Empty;
        public Product? Product { get; set; }
    }
}
