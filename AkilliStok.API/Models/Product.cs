namespace AkilliStok.API.Models
{
    using System.Text.Json.Serialization;
    public class Product
    {
        public int Id { get; set; }
        public string Barcode { get; set; } // Scanner 
<<<<<<< HEAD
        public string ProductName { get; set; }= string.Empty;
=======
        public string ProductName { get; set; }
>>>>>>> f131fd86c0357011cae217058587984a959a2eba
        public decimal UnitPrice { get; set; }
        public int CurrentStock { get; set; }
        public int CriticalLimit { get; set; } = 10;
        public int CategoryId { get; set; } // Foreign Key
        [JsonIgnore]
        public Category? Category { get; set; } // Navigation Property
    }
}
