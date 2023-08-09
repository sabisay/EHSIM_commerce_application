using System.ComponentModel.DataAnnotations;
namespace webapi.ViewModel.Firma
{
    public class FirmaCreateVM
    {
        public int FirmaId { get; set; }
        [Required]
        public string FirmaAdi { get; set; }
        [Required]
        public string FirmaSektoru { get; set; }
        [Required]
        public string FirmaAdresi { get; set; }
        [Required]
        public string WebAdresi { get; set; }
        [Required]
        public string TelefonNumarasi { get; set; }
        [Required]
        public string Email { get; set; }
    }
}