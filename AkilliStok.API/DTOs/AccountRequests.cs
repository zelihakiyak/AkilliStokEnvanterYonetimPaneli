namespace AkilliStok.API.DTOs
{
    // Profil bilgilerini güncellemek için kullanılır (Ad Soyad / E-posta)
    public class UpdateProfileRequest
    {
        public string FullName { get; set; } = string.Empty;
        public string Email    { get; set; } = string.Empty;
    }

    public class UpdateProfileResponse
    {
        public int    Id       { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Email    { get; set; } = string.Empty;
        public string Role     { get; set; } = string.Empty;
    }

    // Şifre değiştirmek için kullanılır
    public class ChangePasswordRequest
    {
        public string CurrentPassword { get; set; } = string.Empty;
        public string NewPassword     { get; set; } = string.Empty;
    }
}
