// assets
import { IconUsers, IconBuildingEstate, IconCategory2 } from '@tabler/icons';

// constant
const icons = { IconUsers, IconBuildingEstate, IconCategory2 };

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
        }
    ]
};

export default digerIslemler;
