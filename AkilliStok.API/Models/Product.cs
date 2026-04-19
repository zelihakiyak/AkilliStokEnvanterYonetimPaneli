namespace AkilliStok.API.Models
{
    using System.Text.Json.Serialization;
    public class Product
    {
        public int Id { get; set; }
        public string Barcode { get; set; } // Scanner 
        public string ProductName { get; set; }= string.Empty;
        public decimal UnitPrice { get; set; }
        public int CurrentStock { get; set; }
        public int CriticalLimit { get; set; } = 10;
        public int CategoryId { get; set; } // Foreign Key
        [JsonIgnore]
        public Category? Category { get; set; } // Navigation Property
    }
}
