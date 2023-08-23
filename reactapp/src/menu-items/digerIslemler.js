// assets
import { IconUsers, IconBuildingEstate, IconCategory2, IconFolder } from '@tabler/icons';

// constant
const icons = { IconUsers, IconBuildingEstate, IconCategory2, IconFolder };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const digerIslemler = {
    id: 'digerIslemler',
    title: 'Diğer İşlemler',
    type: 'group',
    children: [
        {
            id: 'musteriler',
            title: 'Müşteriler',
            type: 'collapse',
            icon: icons.IconUsers,

            children: [
                {
                    id: 'musteriler',
                    title: 'Müşteri Listesi',
                    type: 'item',
                    url: '/digerIslemler/musteriler'
                },
                {
                    id: 'musteri-ekle',
                    title: 'Müşteri Ekle',
                    type: 'item',
                    url: '/digerIslemler/musteri-ekle'
                }
            ]
        },
        {
            id: 'firmalar',
            title: 'Firmalar',
            type: 'collapse',
            icon: icons.IconBuildingEstate,

            children: [
                {
                    id: 'firmalar',
                    title: 'Firma Listesi',
                    type: 'item',
                    url: '/digerIslemler/firmalar'
                },
                {
                    id: 'firma-ekle',
                    title: 'Firma Ekle',
                    type: 'item',
                    url: '/digerIslemler/firma-ekle'
                }
            ]
        },
        {
            id: 'kategoriler',
            title: 'Kategoriler',
            type: 'collapse',
            icon: icons.IconCategory2,

            children: [
                {
                    id: 'kategoriler',
                    title: 'Kategori Listesi',
                    type: 'item',
                    url: '/digerIslemler/kategoriler'
                },
                {
                    id: 'kategori-ekle',
                    title: 'Kategori Ekle',
                    type: 'item',
                    url: '/digerIslemler/kategori-ekle'
                }
            ]
        },
        {
            id: 'urunler',
            title: 'Ürünler',
            type: 'collapse',
            icon: icons.IconFolder,

            children: [
                {
                    id: 'urunler',
                    title: 'Ürün Listesi',
                    type: 'item',
                    url: '/digerIslemler/urunler'
                },
                {
                    id: 'urun-ekle',
                    title: 'Ürün Ekle',
                    type: 'item',
                    url: '/digerIslemler/urun-ekle'
                }
            ]
        }
    ]
};

export default digerIslemler;
