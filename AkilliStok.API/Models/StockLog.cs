namespace AkilliStok.API.Models
{
    public class StockLog
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public int QuantityChanged { get; set; }
        public DateTime TransactionDate { get; set; } = DateTime.Now;
        public string TransactionType { get; set; } // In, Out
        public Product? Product { get; set; }
    }
}
