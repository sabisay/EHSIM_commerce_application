using Microsoft.AspNetCore.Mvc;
using webapi.Base.Base;
using webapi.Base.Base.Grid;
using webapi.Entity;
using webapi.Helper.Base;
using webapi.ViewModel.General.Grid;
using webapi.ViewModel;
using webapi.ViewModel.Urun;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace webapi.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class UrunController : BaseWebApiController
	{
		public UrunController(IHttpContextAccessor httpContextAccessor) : base(httpContextAccessor)
		{
		}

		[HttpPost("CreateOrUpdate")]
		public ApiResult CreateOrUpdate([FromBody] UrunCreateVM dataVM)
		{
			if (!ModelState.IsValid)
				return new ApiResult { Result = false, Message = "Form'da doldurulmayan alanlar mevcut,lütfen doldurun." };
			Urun data;
			if (dataVM.Id > 0)
			{
				data = _unitOfWork.Repository<Urun>().GetById(dataVM.Id);
				data.UrunAdi = dataVM.UrunAdi;
                data.UrunFiyat = dataVM.UrunFiyat;
                data.UrunKategorisi = dataVM.UrunKategorisi;
				data.UrunDetay = dataVM.UrunDetay;
				data.UrunKDV = dataVM.UrunKDV;
				data.Birim = dataVM.Birim;
				data.BirimliFiyat = dataVM.BirimliFiyat;
				data.UrunStok = dataVM.UrunStok;
			}
			else
			{
				data = new Urun()
				{
					UrunAdi = dataVM.UrunAdi,
					UrunFiyat = dataVM.UrunFiyat,
					UrunKategorisi = dataVM.UrunKategorisi,
					UrunDetay = dataVM.UrunDetay,
					UrunKDV = dataVM.UrunKDV,
					Birim= dataVM.Birim,
					BirimliFiyat = dataVM.BirimliFiyat,
					UrunStok = dataVM.UrunStok,
					UrunResmi = dataVM.UrunResmi
				};
				if (_unitOfWork.Repository<Urun>().Any(x => x == data))
				{
					return new ApiResult { Result = false, Message = "Daha önce eklenmiþ" };
				}
			}

            _unitOfWork.Repository<Urun>().InsertOrUpdate(data);
			_unitOfWork.SaveChanges();
			return new ApiResult { Result = true };
		}

		[HttpGet("Delete")]
		public ApiResult Delete(int id)
		{
			var data = _unitOfWork.Repository<Urun>().GetById(id);
			//if (_unitOfWork.Repository<Kullanici>().Any(i => i.RolId == id))
			//{
			//    return new ApiResult { Result = false, Message = "Rol kullanýcý tarafýndan kullanýlmaktadýr." };
			//}

			if (data == null)
			{
				return new ApiResult { Result = false, Message = "Belirtilen ürün bulunamadý." };
			}

			_unitOfWork.Repository<Urun>().Delete(data.Id);
			_unitOfWork.SaveChanges();
			return new ApiResult { Result = true };
		}

		[HttpPost("GetGrid")]
		public ApiResult<GridResultModel<UrunGridVM>> GetGrid()
		{
			var query = _unitOfWork.Repository<Urun>()
			.Select(x => new UrunGridVM
			{
				Id = x.Id,
				UrunFiyat = x.UrunFiyat,
				UrunAdi = x.UrunAdi,
				UrunKategorisi = x.UrunKategorisi,
				UrunDetay = x.UrunDetay,
				UrunKDV = x.UrunKDV,
				Birim = x.Birim,
				BirimliFiyat = x.BirimliFiyat,
				UrunStok = x.UrunStok,
				UrunResmi = x.UrunResmi,
			});
			var rest = query.ToDataListRequest(Request.ToRequestFilter());

			return new ApiResult<GridResultModel<UrunGridVM>> { Data = rest, Result = true };
		}

		[HttpPost("Get")]
		public ApiResult<UrunGridVM> Get(int id)
		{
			var urun = _unitOfWork.Repository<Urun>().GetById(id);
			UrunGridVM urunVM = new UrunGridVM
			{
				Id = urun.Id,
				UrunAdi = urun.UrunAdi,
				UrunFiyat = urun.UrunFiyat,
				UrunKategorisi = urun.UrunKategorisi,
				UrunDetay = urun.UrunDetay,
				UrunKDV =urun.UrunKDV,
				Birim = urun.Birim,
				BirimliFiyat = urun.BirimliFiyat,
				UrunStok= urun.UrunStok,
				UrunResmi= urun.UrunResmi,
			};
			return new ApiResult<UrunGridVM> { Data = urunVM, Result = true };
		}



    }
}
