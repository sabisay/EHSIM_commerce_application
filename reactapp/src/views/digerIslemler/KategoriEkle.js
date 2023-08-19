import { Button, Container, FormControl, Grid, LinearProgress, TextField, Switch } from '@mui/material';
import React from 'react';
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';

const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

function KategoriEkle() {
    const { id } = useParams();

    const [fetchingError, setFetchingError] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [isUpdate, setIsUpdate] = useState(0);
    const [detay, setDetay] = React.useState('');
    const [kategoriAdi, setKategoriAdi] = useState('');
    const [kategoriAktif, setKategoriAktif] = useState(false);
    const [validationErrors, setValidationErrors] = React.useState({});

    useEffect(() => {
        console.log(id);
        if (typeof id !== 'undefined') {
            setIsUpdate(id);
            setIsFetching(true);
            kategoriGetirPromise();
        } else {
            setDetay('');
            setKategoriAdi('');
            setKategoriAktif();
        }
    }, [id]);

    const buttonActive = () => {
        setKategoriAktif(!kategoriAktif);
    };

    const kategoriEkle = () => {
        if (typeof id !== 'undefined') {
            toast.promise(kategoriEklePromise, {
                pending: 'Kategori güncelleniyor',
                success: kategoriAdi + ' başarıyla güncellendi 👌',
                error: kategoriAdi + ' güncellenirken hata oluştu 🤯'
            });
        } else {
            toast.promise(kategoriEklePromise, {
                pending: 'Kategori kaydı yapılıyor',
                success: kategoriAdi + ' başarıyla eklendi 👌',
                error: kategoriAdi + ' eklenirken hata oluştu 🤯'
            });
        }
    };

    const kategoriEklePromise = () => {
        return new Promise(async (resolve, reject) => {
            const start = Date.now();
            setValidationErrors({});
            let data = JSON.stringify({
                id: typeof id !== 'undefined' ? id : 0,
                kategoriAdi: kategoriAdi,
                detay: detay,
                kategoriAktif: kategoriAktif ? 'aktif' : 'pasif'
            });

            console.log(data);

            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: 'http://localhost:5273/api/Kategori/CreateOrUpdate',
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

    const kategoriGetirPromise = () => {
        return new Promise(async (resolve, reject) => {
            const start = Date.now();
            setValidationErrors({});
            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: 'http://localhost:5273/api/Kategori/Get',
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
                        setKategoriAdi(response.data.data.kategoriAdi);
                        setKategoriAktif(response.data.data.kategoriAktif);
                        setDetay(response.data.data.detay);
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

    return (
        <>
            <Container className="d-flex justify-content-center" maxWidth="md">
                <Grid item xs={6}>
                    <FormControl sx={{ m: 0, width: '50ch' }}>
                        {isFetching && <LinearProgress className="mt-3" color="secondary" />}
                        {(isUpdate === 0 || !isFetching) && (
                            <>
                                <TextField
                                    value={kategoriAdi}
                                    margin="normal"
                                    id="name"
                                    label="Kategori Adı"
                                    variant="outlined"
                                    onChange={(e) => setKategoriAdi(e.target.value)}
                                    error={!!validationErrors.kategoriAdi}
                                    helperText={validationErrors.kategoriAdi}
                                />
                                <TextField
                                    margin="normal"
                                    value={detay}
                                    id="num"
                                    label="Detaylı Bilgi"
                                    variant="outlined"
                                    onChange={(e) => setDetay(e.target.value)}
                                    error={!!validationErrors.Detay}
                                    helperText={validationErrors.Detay}
                                />
                                <Switch onChange={buttonActive} value={kategoriAktif} color="secondary" />
                                {kategoriAktif ? 'Aktif' : 'Pasif'}
                                <div style={{ marginTop: '20px' }} /> {}
                                <Button onClick={kategoriEkle} className="mb-2" margin="normal" variant="contained">
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

export default KategoriEkle;
