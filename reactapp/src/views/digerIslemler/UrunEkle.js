import { Button, Container, FormControl, Grid, LinearProgress, TextField, InputLabel } from '@mui/material';
import React from 'react';
import { useState } from 'react';
import validator from 'validator';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import Select from 'react-select';
import './urunEkle.css';

const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

function UrunEkle() {
    const { id } = useParams();
    const { kategoriAktif } = useParams();

    const [fetchingError, setFetchingError] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [isUpdate, setIsUpdate] = useState(0);
    const [urunAdi, setUrunAdi] = useState('');
    const [urunKategorisi, setUrunKategorisi] = useState('');
    const [validationErrors, setValidationErrors] = React.useState({});
    const [urunDetay, setUrunDetay] = React.useState('');
    const [urunFiyat, setUrunFiyat] = React.useState('');
    const [urunKDV, setUrunKDV] = React.useState('');
    const [birim, setBirim] = React.useState('');
    const [validationErr, setValidationErr] = useState({});
    const [kategoriSelect, setKategoriSelect] = useState([]);
    const [birimliFiyat, setBirimliFiyat] = useState('');
    const [urunStok, setUrunStok] = useState('');

    const options = [
        { value: 'tl', label: ' ₺ TL' },
        { value: 'euro', label: '€ Euro' },
        { value: 'dollar', label: '$ US Dollar' }
    ];
    const optionsKDV = [];

    for (let kdv = 5; kdv <= 70; kdv++) {
        optionsKDV.push({ value: '%' + kdv.toString(), label: `${kdv}%` });
    }

    const optionsStok = [];
    for (let less = 5; less <= 1000; less = less + 5) {
        optionsStok.push({ value: less.toString(), label: less });
    }

    const handleChange = (selectedOption) => {
        setBirim(selectedOption.value);
    };
    const handleChangeKDV = (selectedOption) => {
        setUrunKDV(selectedOption.value);
    };
    const handleChangeKategori = (selectedOption) => {
        setUrunKategorisi(selectedOption.value);
    };
    const handleChangeStok = (selectedOption) => {
        setUrunStok(selectedOption.value);
    };

    const selectStylesKDV = {
        control: (base, state) => ({
            width: '395px',
            ...base,
            innerHeight: 200,
            boxSizing: 'border-box',
            padding: '6px 10px',
            textAlign: 'Left',
            position: 'relative',
            margin: 'normal',
            borderRadius: '12px',
            backgroundColor: '#F8FAFC',
            color: '364152',
            fontFamily: 'Roboto, sans-serif',
            bottom: '0'
        }),
        option: (provided) => ({
            ...provided,
            padding: '10px 14px',
            boxSizing: 'border-box',
            position: 'relative',
            zIndex: 9999
        })
    };
    const selectStyles = {
        control: (base, state) => ({
            width: '130px',
            ...base,
            innerHeight: 200,
            boxSizing: 'border-box',
            padding: '6px 10px',
            textAlign: 'Left',
            position: 'relative',
            margin: 'normal',
            borderRadius: '12px',
            backgroundColor: '#F8FAFC',
            color: '364152',
            fontFamily: 'Roboto, sans-serif',
            bottom: '0'
        }),
        option: (provided) => ({
            ...provided,
            padding: '10px 14px',
            boxSizing: 'border-box',
            position: 'relative',
            zIndex: 9999
        })
    };

    const handleUrunFiyatChange = (e) => {
        const value = e.target.value;
        // Test if the input value is an integer
        if (/^\d+$/.test(value)) {
            setUrunFiyat(value);
            setValidationErr((prevErr) => ({ ...prevErr, UrunFiyat: '' }));
        } else {
            setUrunFiyat(value);
            setValidationErr((prevErr) => ({ ...prevErr, UrunFiyat: 'Lütfen geçerli bir fiyat girin.' }));
        }
    };

    useEffect(() => {
        console.log(id);
        kategoriSelectPromise();
        if (typeof id !== 'undefined') {
            setIsUpdate(id);
            setIsFetching(true);
            UrunGetirPRomise();
        } else {
            setUrunAdi('');
            setUrunKategorisi('');
            setUrunDetay('');
            setUrunFiyat('');
            setUrunKDV('');
            setBirim('');
            setUrunStok('');
        }
    }, [id]);

    const urunEkle = async () => {
        if (typeof id !== 'undefined') {
            toast.promise(UrunEklePromise(), {
                pending: 'Ürün güncelleniyor',
                success: urunAdi + ' ' + urunKategorisi + ' başarıyla güncellendi 👌',
                error: urunAdi + ' ' + urunKategorisi + ' güncellenirken hata oluştu 🤯'
            });
        } else {
            toast.promise(UrunEklePromise(), {
                pending: 'Ürün kaydı yapılıyor',
                success: urunAdi + ' ' + urunKategorisi + ' başarıyla eklendi 👌',
                error: urunAdi + ' ' + urunKategorisi + ' eklenirken hata oluştu 🤯'
            });
        }
    };

    // ... (existing JSX and rendering logic)

    const UrunEklePromise = () => {
        return new Promise(async (resolve, reject) => {
            const start = Date.now();
            setValidationErrors({});
            let data = JSON.stringify({
                id: typeof id !== 'undefined' ? id : 0,
                urunAdi: urunAdi,
                urunKategorisi: urunKategorisi,
                urunDetay: urunDetay,
                urunFiyat: urunFiyat,
                urunKDV: urunKDV,
                birim: birim,
                birimliFiyat: urunFiyat + ' ' + birim,
                urunStok: urunStok
            });

            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: 'http://localhost:5273/api/Urun/CreateOrUpdate',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'text/plain'
                },
                data: data
            };

            axios
                .request(config)
                .then(async (response) => {
                    console.log(JSON.stringify(response.data));
                    if (response.data.result) {
                        const millis = Date.now() - start;
                        if (millis < 700) {
                            await sleep(700 - millis);
                        }
                        resolve(response.data); // Başarılı sonuç durumunda Promise'ı çöz
                    } else {
                        reject(new Error('İşlem başarısız')); // Başarısız sonuç durumunda Promise'ı reddet
                    }
                })
                .catch((error) => {
                    console.log(error);
                    setValidationErrors(error.response.data.errors);
                    reject(error); // Hata durumunda Promise'ı reddet
                });
        });
    };

    const UrunGetirPRomise = () => {
        return new Promise(async (resolve, reject) => {
            const start = Date.now();
            setValidationErrors({});
            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: 'http://localhost:5273/api/Urun/Get',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'text/plain'
                },
                params: {
                    id: id
                }
            };

            axios
                .request(config)
                .then(async (response) => {
                    console.log(JSON.stringify(response.data));
                    if (response.data.result) {
                        const millis = Date.now() - start;
                        if (millis < 500) {
                            await sleep(500 - millis);
                        }
                        console.log(response.data);
                        setUrunAdi(response.data.data.urunAdi);
                        setUrunKategorisi(response.data.data.urunKategorisi);
                        setUrunDetay(response.data.data.urunDetay);
                        setUrunFiyat(response.data.data.urunFiyat);
                        setUrunKDV(response.data.data.urunKDV);
                        setBirim(response.data.data.birim);
                        setBirimliFiyat(response.data.data.birimliFiyat);
                        setUrunStok(response.data.data.urunStok);
                        console.log(birimliFiyat);

                        setFetchingError(false);
                        resolve(response.data); // Başarılı sonuç d1urumunda Promise'ı çöz
                    } else {
                        setFetchingError(true);
                        reject(new Error('İşlem başarısız')); // Başarısız sonuç durumunda Promise'ı reddet
                    }
                })
                .catch((error) => {
                    setFetchingError(true);
                    console.log(error);
                    reject(error); // Hata durumunda Promise'ı reddet
                })
                .finally(() => {
                    setIsFetching(false);
                });
        });
    };

    const kategoriSelectPromise = () => {
        return new Promise(async (resolve, reject) => {
            const start = Date.now();
            setValidationErrors({});
            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: 'http://localhost:5273/api/Kategori/getKategoriSelect',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'text/plain'
                },
                params: {
                    id: id,
                    kategoriAktif: kategoriAktif
                }
            };

            axios
                .request(config)
                .then(async (response) => {
                    console.log(JSON.stringify(response.data.data));
                    const filteredCategories = response.data.data.filter((item) => item.kategoriAktif === 'aktif');
                    setKategoriSelect(filteredCategories);
                    setFetchingError(false);
                    resolve(response.data);
                    if (response.data.result) {
                        const millis = Date.now() - start;
                        if (millis < 500) {
                            await sleep(500 - millis);
                        }
                    } else {
                        setFetchingError(true);
                        reject(new Error('İşlem başarısız')); // Başarısız sonuç durumunda Promise'ı reddet
                    }
                })
                .catch((error) => {
                    setFetchingError(true);
                    console.log(error);
                    reject(error); // Hata durumunda Promise'ı reddet
                })
                .finally(() => {
                    setIsFetching(false);
                });
        });
    };

    return (
        <>
            <Container className="d-flex justify-content-center" maxWidth="md">
                <Grid item xs={6}>
                    <FormControl sx={{ m: 0, width: '50ch' }}>
                        {isFetching && <LinearProgress className="mt-3" color="secondary" />}
                        {(isUpdate === 0 || !isFetching) && (
                            <>
                                <TextField
                                    value={urunAdi}
                                    margin="normal"
                                    id="name"
                                    label="Ürün "
                                    variant="outlined"
                                    onChange={(e) => setUrunAdi(e.target.value)}
                                    error={!!validationErrors.UrunAdi}
                                    helperText={validationErrors.UrunAdi}
                                />
                                <TextField
                                    margin="normal"
                                    value={urunDetay}
                                    id="detail"
                                    label="Detay "
                                    variant="outlined"
                                    onChange={(e) => setUrunDetay(e.target.value)}
                                    error={!!validationErrors.UrunDetay}
                                    helperText={validationErrors.UrunDetay}
                                />
                                <div className="price-container">
                                    <TextField
                                        className="price-input"
                                        value={urunFiyat}
                                        id="price"
                                        label="Fiyat "
                                        variant="outlined"
                                        onChange={handleUrunFiyatChange}
                                        error={!!validationErr.UrunFiyat}
                                        helperText={validationErr.UrunFiyat}
                                    />
                                    <Select
                                        className="custom-select"
                                        value={birim !== '' ? { value: birim, label: birim } : null}
                                        styles={selectStyles}
                                        variant="outlined"
                                        id="birim"
                                        onChange={handleChange}
                                        placeholder="$ -  ₺ - €"
                                        options={options}
                                    />
                                </div>
                                <Select
                                    className="custom-select"
                                    value={urunKDV !== '' ? { value: urunKDV, label: urunKDV } : null}
                                    variant="outlined"
                                    styles={selectStylesKDV}
                                    id="KDV"
                                    onChange={handleChangeKDV}
                                    placeholder="KDV Oranı"
                                    options={optionsKDV}
                                />
                                <div style={{ marginTop: '20px' }}>
                                    <Select
                                        className="custom-select"
                                        value={urunKategorisi !== '' ? { value: urunKategorisi, label: urunKategorisi } : null}
                                        styles={selectStylesKDV}
                                        variant="outlined"
                                        id="category"
                                        onChange={handleChangeKategori}
                                        placeholder="Kategori"
                                        options={kategoriSelect.map((kategoriItem) => ({
                                            value: kategoriItem.kategoriAdi,
                                            label: kategoriItem.kategoriAdi
                                        }))}
                                    />
                                    <div style={{ marginTop: '20px' }}>
                                        <Select
                                            className="custom-select"
                                            value={urunStok !== '' ? { value: urunStok, label: urunStok } : null}
                                            styles={selectStylesKDV}
                                            variant="outlined"
                                            id="category"
                                            onChange={handleChangeStok}
                                            placeholder="Stok Adedi"
                                            options={optionsStok}
                                        />
                                    </div>
                                </div>
                                <div style={{ marginTop: '20px' }}>Ürün Resmi (Opsiyonel)</div>
                                <div style={{ marginTop: '20px' }} />
                                <div style={{ marginTop: '20px' }} /> {}
                                <Button onClick={urunEkle} className="mb-2" margin="normal" variant="contained">
                                    Kaydet
                                </Button>
                            </>
                        )}
                    </FormControl>
                </Grid>
            </Container>
        </>
    );
}

export default UrunEkle;
