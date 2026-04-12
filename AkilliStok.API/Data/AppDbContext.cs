using AkilliStok.API.Models;      
using Microsoft.EntityFrameworkCore; 

namespace AkilliStok.API.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Product> Products { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<StockLog> StockLogs { get; set; }
<<<<<<< HEAD
        public DbSet<User> Users { get; set; }
=======
>>>>>>> f131fd86c0357011cae217058587984a959a2eba
    }
}