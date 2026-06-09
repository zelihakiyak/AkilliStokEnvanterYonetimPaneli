using Microsoft.AspNetCore.Authorization;
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
        private readonly AppDbContext  _context;
        private readonly IConfiguration _config;

        public UsersController(AppDbContext context, IConfiguration config)
        {
            _context = context;
            _config  = config;
        }

        // ── JWT Token Üret ────────────────────────────────────────────────
        private string GenerateToken(User user)
        {
            var key     = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
            var creds   = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var expires = DateTime.UtcNow.AddHours(double.Parse(_config["Jwt:ExpireHours"]!));

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub,   user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim("fullName",                    user.FullName),
                new Claim(ClaimTypes.Role,               user.Role),
                new Claim(JwtRegisteredClaimNames.Jti,   Guid.NewGuid().ToString()),
            };

            var token = new JwtSecurityToken(
                issuer:             _config["Jwt:Issuer"],
                audience:           _config["Jwt:Audience"],
                claims:             claims,
                expires:            expires,
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        // POST: api/Users/login
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == request.Email && u.Password == request.Password);

            if (user == null)
                return Unauthorized(new { message = "Email veya şifre hatalı!" });

            var token     = GenerateToken(user);
            var expiresAt = DateTime.UtcNow.AddHours(double.Parse(_config["Jwt:ExpireHours"]!));

            return Ok(new LoginResponse
            {
                Id        = user.Id,
                FullName  = user.FullName,
                Email     = user.Email,
                Role      = user.Role,
                Token     = token,
                ExpiresAt = expiresAt,
            });
        }

        // PUT: api/Users/profile
        // Oturum açmış kullanıcının Ad Soyad / E-posta bilgilerini günceller
        [Authorize]
        [HttpPut("profile")]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileRequest request)
        {
            var userIdClaim = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value
                              ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (userIdClaim == null || !int.TryParse(userIdClaim, out int userId))
                return Unauthorized(new { message = "Kullanıcı doğrulanamadı." });

            var user = await _context.Users.FindAsync(userId);
            if (user == null)
                return NotFound(new { message = "Kullanıcı bulunamadı." });

            if (string.IsNullOrWhiteSpace(request.FullName) || string.IsNullOrWhiteSpace(request.Email))
                return BadRequest(new { message = "Ad Soyad ve E-posta alanları boş bırakılamaz." });

            // Email başka bir kullanıcı tarafından kullanılıyor mu?
            bool emailTaken = await _context.Users
                .AnyAsync(u => u.Email == request.Email && u.Id != userId);
            if (emailTaken)
                return BadRequest(new { message = "Bu e-posta adresi başka bir hesap tarafından kullanılıyor." });

            user.FullName = request.FullName.Trim();
            user.Email    = request.Email.Trim();
            await _context.SaveChangesAsync();

            return Ok(new UpdateProfileResponse
            {
                Id       = user.Id,
                FullName = user.FullName,
                Email    = user.Email,
                Role     = user.Role,
            });
        }

        // PUT: api/Users/change-password
        // Oturum açmış kullanıcının şifresini değiştirir (mevcut şifre doğrulanarak)
        [Authorize]
        [HttpPut("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest request)
        {
            var userIdClaim = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value
                              ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (userIdClaim == null || !int.TryParse(userIdClaim, out int userId))
                return Unauthorized(new { message = "Kullanıcı doğrulanamadı." });

            var user = await _context.Users.FindAsync(userId);
            if (user == null)
                return NotFound(new { message = "Kullanıcı bulunamadı." });

            if (string.IsNullOrWhiteSpace(request.CurrentPassword) || string.IsNullOrWhiteSpace(request.NewPassword))
                return BadRequest(new { message = "Mevcut şifre ve yeni şifre alanları boş bırakılamaz." });

            if (user.Password != request.CurrentPassword)
                return BadRequest(new { message = "Mevcut şifre hatalı." });

            if (request.NewPassword.Length < 6)
                return BadRequest(new { message = "Yeni şifre en az 6 karakter olmalıdır." });

            if (request.NewPassword == request.CurrentPassword)
                return BadRequest(new { message = "Yeni şifre, mevcut şifre ile aynı olamaz." });

            user.Password = request.NewPassword;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Şifreniz başarıyla güncellendi." });
        }

        // POST: api/Users/register
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] User newUser)
        {
            bool emailExists = await _context.Users.AnyAsync(u => u.Email == newUser.Email);
            if (emailExists)
                return BadRequest(new { message = "Bu email zaten kayıtlı." });

            newUser.Role = "Personel";
            _context.Users.Add(newUser);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Kayıt başarılı.", userId = newUser.Id });
        }
    }
}