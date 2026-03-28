using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AkilliStok.API.Data;
using AkilliStok.API.Models;
using AkilliStok.API.DTOs;

namespace AkilliStok.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UsersController(AppDbContext context)
        {
            _context = context;
        }

        // POST: api/Users/login
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request )
        {
            // Email ve Şifre eşleşmesi kontrolü
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == request.Email && u.Password == request.Password);

            if (user == null)
            {
                return Unauthorized(new { message = "Email veya şifre hatalı!" });
            }

            var response = new LoginResponse
            {
                Id       = user.Id,
                FullName = user.FullName,
                Email    = user.Email,
                Role     = user.Role
            };

            return Ok(response);
        }

        // POST: api/Users/register
        [HttpPost("register")]
        public async Task<ActionResult<User>> Register([FromBody] User newUser)
        {
            bool emailExists = await _context.Users
                .AnyAsync(u => u.Email == newUser.Email);

            if (emailExists)
                return BadRequest(new { message = "Bu email zaten kayıtlı." });

            newUser.Role = "Personel"; // Yeni kayıtlar varsayılan rol
            _context.Users.Add(newUser);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Kayıt başarılı.", userId = newUser.Id });
        }
    }
}