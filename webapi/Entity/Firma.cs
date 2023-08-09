namespace webapi.Entity
{
    public class Firma : BaseEntity
    {
        public string FirmaAdi { get; set; }
        public string FirmaSektoru { get; set; }
        public string FirmaAdresi { get; set; }
        public string WebAdresi { get; set; }
        public string TelefonNumarasi { get; set; }
        public string Email { get; set; }
    }
}