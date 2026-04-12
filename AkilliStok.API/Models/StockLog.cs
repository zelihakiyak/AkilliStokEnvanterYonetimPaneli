namespace AkilliStok.API.Models
{
    public class StockLog
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public int QuantityChanged { get; set; }
        public DateTime TransactionDate { get; set; } = DateTime.Now;
        public string TransactionType { get; set; } // In, Out
<<<<<<< HEAD
        public Product? Product { get; set; }
=======
        public string Note { get; set; }
>>>>>>> f131fd86c0357011cae217058587984a959a2eba
    }
}
