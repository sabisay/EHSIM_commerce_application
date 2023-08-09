using System.ComponentModel.DataAnnotations;

namespace webapi.ViewModel.Firma
{
    public class FirmaGridVM
    {
        public int FirmaId { get; set; }
        public string FirmaAdi { get; set; }
        public string FirmaSektoru { get; set; }
        public string FirmaAdresi { get; set; }
        public string WebAdresi { get; set; }
        public string TelefonNumarasi { get; set; }
        public string Email { get; set; }
    }
}