namespace AkilliStok.API.Models
{
    using System.Text.Json.Serialization;
    public class Category
    {
        public int Id { get; set; }
        public string CategoryName { get; set; } = string.Empty;
        [JsonIgnore] 
        public ICollection<Product>? Products { get; set; } = new List<Product>(); //Navigation Property (bir kategoriye ait ürünler)
    }
}
