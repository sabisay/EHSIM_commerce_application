namespace webapi.Entity
{
    public class Urun : BaseEntity
    {
        public string UrunFiyat { get; set; }
        public string UrunAdi { get; set; }
        public string UrunKategorisi { get; set; }
        public string UrunDetay { get; set; }
        public string UrunKDV { get; set; }
        public string Birim { get; set; }
        public string BirimliFiyat { get; set; }
        public string UrunStok { get; set; }
    }
}