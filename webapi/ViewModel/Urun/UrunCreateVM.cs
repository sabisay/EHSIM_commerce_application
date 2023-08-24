using System.ComponentModel.DataAnnotations;

namespace webapi.ViewModel.Urun
{
    public class UrunCreateVM
    {
        public int Id { get; set; }
        [Required]
        public string UrunFiyat { get; set; }
        [Required]
        public string UrunAdi { get; set; }
        [Required]
        public string UrunKategorisi { get; set; }
        [Required]
        public string UrunDetay { get; set; }
        [Required]
        public string UrunKDV { get; set; }
        [Required]
        public string Birim { get; set; }
        [Required]
        public string BirimliFiyat { get; set;}
        [Required]
        public string UrunStok { get; set; }

    }
}