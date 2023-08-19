using System.ComponentModel.DataAnnotations;

namespace webapi.ViewModel.Kategori
{
    public class KategoriCreateVM
    {
        public int Id { get; set; }
        [Required]
        public string KategoriAdi { get; set; }
        [Required]
        public string KategoriAktif { get; set; }
        [Required]
        public string Detay { get; set; }
    }
}
