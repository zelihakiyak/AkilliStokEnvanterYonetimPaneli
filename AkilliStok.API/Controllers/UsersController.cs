using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
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
        private readonly IConfiguration _config;

        public UsersController(AppDbContext context, IConfiguration config)
        {
            _context = context;
            _config  = config;
        }

        // POST: api/Users/login
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == request.Email && u.Password == request.Password);

            if (user == null)
                return Unauthorized(new { message = "Email veya şifre hatalı!" });

            var token = GenerateJwtToken(user);

            var response = new LoginResponse
            {
                Id       = user.Id,
                FullName = user.FullName,
                Email    = user.Email,
                Role     = user.Role,
                Token    = token
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

            newUser.Role = "Personel";
            _context.Users.Add(newUser);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Kayıt başarılı.", userId = newUser.Id });
        }

        // JWT Token üretici
        private string GenerateJwtToken(User user)
        {
            var key   = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role),
                new Claim(ClaimTypes.Name, user.FullName),
            };

            var token = new JwtSecurityToken(
                issuer:             _config["Jwt:Issuer"],
                audience:           _config["Jwt:Audience"],
                claims:             claims,
                expires:            DateTime.UtcNow.AddHours(8), 
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}