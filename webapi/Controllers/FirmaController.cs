using Microsoft.AspNetCore.Mvc;
using webapi.Base.Base;
using webapi.Base.Base.Grid;
using webapi.Entity;
using webapi.Helper.Base;
using webapi.ViewModel.General.Grid;
using webapi.ViewModel;
using webapi.ViewModel.Firma;
using SQLitePCL;

namespace webapi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]

    public class FirmaController : BaseWebApiController
    {
        public FirmaController(IHttpContextAccessor httpContextAccessor) : base(httpContextAccessor)
        {
        }
        

        [HttpPost("CreateOrUpdate")]
        public ApiResult CreateOrUpdate([FromBody] FirmaCreateVM dataVM) 
        {
            if (!ModelState.IsValid)
                return new ApiResult { Result = false, Message = "Form'da doldurulmayan alanlar mevcut,lütfen doldurun." };
            Firma data;
            if (dataVM.FirmaId > 0)
            {
                data = _unitOfWork.Repository<Firma>().GetById(dataVM.FirmaId);
                data.FirmaAdi = dataVM.FirmaAdi;
                data.FirmaSektoru = dataVM.FirmaSektoru;
                data.FirmaAdresi= dataVM.FirmaAdresi;
                data.WebAdresi= dataVM.WebAdresi;
                data.TelefonNumarasi = dataVM.TelefonNumarasi;
                data.Email = dataVM.Email;
            }
            else
            {
                data = new Firma()
                {
                    FirmaAdi = dataVM.FirmaAdi,
                    FirmaSektoru = dataVM.FirmaSektoru,
                    FirmaAdresi = dataVM.FirmaAdresi,
                    WebAdresi = dataVM.WebAdresi,
                    TelefonNumarasi = dataVM.TelefonNumarasi,
                    Email = dataVM.Email,
          
                };
                if (_unitOfWork.Repository<Firma>().Any(x => x == data))
                {
                    return new ApiResult { Result = false, Message = "Daha önce eklenmiþ" };
                }
            }

            _unitOfWork.Repository<Firma>().InsertOrUpdate(data);
            _unitOfWork.SaveChanges();
            return new ApiResult { Result = true };
        }


        [HttpGet("Delete")]
        public ApiResult Delete(int id)
        {
            var data = _unitOfWork.Repository<Firma>().GetById(id);
            //if (_unitOfWork.Repository<Kullanici>().Any(i => i.RolId == id))
            //{
            //    return new ApiResult { Result = false, Message = "Rol kullanýcý tarafýndan kullanýlmaktadýr." };
            //}

            if (data == null)
            {
                return new ApiResult { Result = false, Message = "Belirtilen firma bulunamadý." };
            }

            _unitOfWork.Repository<Firma>().Delete(data.Id);
            _unitOfWork.SaveChanges();
            return new ApiResult { Result = true };
        }


        [HttpPost("GetGrid")]
        public ApiResult<GridResultModel<FirmaGridVM>> GetGrid()
        {
            var query = _unitOfWork.Repository<Firma>()
            .Select(x => new FirmaGridVM
            {
                FirmaId = x.Id,
                FirmaAdi = x.FirmaAdi,
                FirmaSektoru = x.FirmaSektoru,
                FirmaAdresi= x.FirmaAdresi,
                WebAdresi= x.WebAdresi,
                TelefonNumarasi = x.TelefonNumarasi,
                Email = x.Email,
            });
            var rest = query.ToDataListRequest(Request.ToRequestFilter());

            return new ApiResult<GridResultModel<FirmaGridVM>> { Data = rest, Result = true };
        }


        [HttpPost("Get")]
        public ApiResult<FirmaGridVM> Get(int id)
        {
            var firma = _unitOfWork.Repository<Firma>().GetById(id);
            FirmaGridVM firmaVM = new FirmaGridVM
            {
                FirmaId = firma.Id,
                FirmaAdi = firma.FirmaAdi,
                FirmaSektoru = firma.FirmaSektoru,
                FirmaAdresi = firma.FirmaAdresi,
                WebAdresi = firma.WebAdresi,
                TelefonNumarasi = firma.TelefonNumarasi,
                Email = firma.Email,
            };
            return new ApiResult<FirmaGridVM> { Data = firmaVM, Result = true };
        }


        [HttpPost("getFirmaSelect")]
        public ApiResult<List<FirmaGridVM>> GetFirmaSelect()
        {
            var firma = _unitOfWork.Repository<Firma>()
                .Select(x => new FirmaGridVM
                {
                FirmaId = x.Id,
                FirmaAdi = x.FirmaAdi

            }). ToList();
           
            return new ApiResult<List<FirmaGridVM>> { Data = firma, Result = true };
        }
    }
}

