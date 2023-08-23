using Microsoft.AspNetCore.Mvc;
using webapi.Base.Base;
using webapi.Base.Base.Grid;
using webapi.Entity;
using webapi.Helper.Base;
using webapi.ViewModel.General.Grid;
using webapi.ViewModel;
using webapi.ViewModel.Musteri;
using webapi.ViewModel.Kategori;
using webapi.ViewModel.Firma;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace webapi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class KategoriController : BaseWebApiController
    {
        public KategoriController(IHttpContextAccessor httpContextAccessor) : base(httpContextAccessor)
        {
        }

        [HttpPost("CreateOrUpdate")]
        public ApiResult CreateOrUpdate([FromBody] KategoriCreateVM dataVM)
        {
            if (!ModelState.IsValid)
                return new ApiResult { Result = false, Message = "Form'da doldurulmayan alanlar mevcut,lütfen doldurun." };
            Kategori data;
            if (dataVM.Id > 0)
            {
                data = _unitOfWork.Repository<Kategori>().GetById(dataVM.Id);
                data.KategoriAdi = dataVM.KategoriAdi;
                data.KategoriAktif = dataVM.KategoriAktif;
                data.Detay = dataVM.Detay;
            }
            else
            {
                data = new Kategori()
                {
                    KategoriAdi = dataVM.KategoriAdi,
                    KategoriAktif = dataVM.KategoriAktif,
                    Detay = dataVM.Detay,
                };
                if (_unitOfWork.Repository<Kategori>().Any(x => x == data))
                {
                    return new ApiResult { Result = false, Message = "Daha önce eklenmiþ" };
                }
            }

            _unitOfWork.Repository<Kategori>().InsertOrUpdate(data);
            _unitOfWork.SaveChanges();
            return new ApiResult { Result = true };
        }

        [HttpGet("Delete")]
        public ApiResult Delete(int id)
        {
            var data = _unitOfWork.Repository<Kategori>().GetById(id);
            //if (_unitOfWork.Repository<Kullanici>().Any(i => i.RolId == id))
            //{
            //    return new ApiResult { Result = false, Message = "Rol kullanýcý tarafýndan kullanýlmaktadýr." };
            //}

            if (data == null)
            {
                return new ApiResult { Result = false, Message = "Belirtilen kategori bulunamadý." };
            }

            _unitOfWork.Repository<Kategori>().Delete(data.Id);
            _unitOfWork.SaveChanges();
            return new ApiResult { Result = true };
        }

        [HttpPost("GetGrid")]
        public ApiResult<GridResultModel<KategoriGridVM>> GetGrid()
        {
            var query = _unitOfWork.Repository<Kategori>()
            .Select(x => new KategoriGridVM
            {
                Id = x.Id,
                KategoriAdi = x.KategoriAdi,
                KategoriAktif = x.KategoriAktif,
                Detay = x.Detay,
            });
            var rest = query.ToDataListRequest(Request.ToRequestFilter());

            return new ApiResult<GridResultModel<KategoriGridVM>> { Data = rest, Result = true };
        }

        [HttpPost("Get")]
        public ApiResult<KategoriGridVM> Get(int id)
        {
            var kategori = _unitOfWork.Repository<Kategori>().GetById(id);
            KategoriGridVM kategoriVM = new KategoriGridVM
            {
                Id = kategori.Id,
                KategoriAdi = kategori.KategoriAdi, 
                KategoriAktif = kategori.KategoriAktif,
                Detay = kategori.Detay
            };
            return new ApiResult<KategoriGridVM> { Data = kategoriVM, Result = true };
        }

        [HttpPost("getKategoriSelect")]
        public ApiResult<List<KategoriGridVM>> GetKategoriSelect()
        {
            var kategori = _unitOfWork.Repository<Kategori>()
                .Select(x => new KategoriGridVM
                {
                    Id = x.Id,
                    KategoriAdi = x.KategoriAdi

                }).ToList();

            return new ApiResult<List<KategoriGridVM>> { Data = kategori, Result = true };
        }

    }
}
