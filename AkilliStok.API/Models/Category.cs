namespace AkilliStok.API.Models
{
    using System.Text.Json.Serialization;
    public class Category
    {
        public int Id { get; set; }
<<<<<<< HEAD
        public string CategoryName { get; set; } = string.Empty;
        [JsonIgnore] 
        public ICollection<Product>? Products { get; set; } = new List<Product>(); //Navigation Property (bir kategoriye ait ürünler)
=======
        public string CategoryName { get; set; }
        [JsonIgnore] 
        public ICollection<Product>? Products { get; set; } //Navigation Property (bir kategoriye ait ürünler)
>>>>>>> f131fd86c0357011cae217058587984a959a2eba
    }
}
