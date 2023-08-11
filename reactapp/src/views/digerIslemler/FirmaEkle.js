import { Button, Container, FormControl, Grid, LinearProgress, TextField } from '@mui/material';
import React from 'react';
import { MuiTelInput, matchIsValidTel } from 'mui-tel-input';
import { useState } from 'react';
import validator from 'validator';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';

const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

function FirmaEkle() {
    const { id } = useParams();

    const [fetchingError, setFetchingError] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [isUpdate, setIsUpdate] = useState(0);
    const [phone, setPhone] = React.useState('');
    const [phoneError, setPhoneError] = React.useState(false);
    const [firmaAdi, setFirmaAdi] = useState('');
    const [firmaSektoru, setFirmaSektoru] = useState('');
    const [firmaAdresi, setFirmaAdresi] = useState('');
    const [webAdresi, setWebAdresi] = useState('');
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState(false);
    const [validationErrors, setValidationErrors] = React.useState({});

    useEffect(() => {
        console.log(id);
        if (typeof id !== 'undefined') {
            setIsUpdate(id);
            setIsFetching(true);
            firmaGetirPromise();
        } else {
            setEmail('');
            setPhone('');
            setFirmaAdi('');
            setFirmaSektoru('');
            setFirmaAdresi('');
            setWebAdresi('');
            setIsFetching(false);
        }
    }, [id]);

    const handleNumber = (value, info) => {
        setPhone(info.numberValue);
        if (matchIsValidTel(value) || info.nationalNumber === '') {
            setPhoneError(false);
        } else {
            setPhoneError(true);
        }
    };

    const handleEmail = (email) => {
        setEmail(email.target.value);
        if (validator.isEmail(email.target.value) || email.target.value === '') {
            setEmailError(false);
        } else {
            setEmailError(true);
        }
    };

    const firmaEkle = () => {
        if (typeof id !== 'undefined') {
            toast.promise(firmaEklePromise, {
                pending: 'Firma güncelleniyor',
                success: firmaAdi + ' ' + firmaSektoru + ' başarıyla güncellendi 👌',
                error: firmaAdi + ' ' + firmaSektoru + ' güncellenirken hata oluştu 🤯'
            });
        } else {
            toast.promise(firmaEklePromise, {
                pending: 'Firma kaydı yapılıyor',
                success: firmaAdi + ' ' + firmaSektoru + ' başarıyla eklendi 👌',
                error: firmaAdi + ' ' + firmaSektoru + ' eklenirken hata oluştu 🤯'
            });
        }
    };

    const firmaEklePromise = () => {
        return new Promise(async (resolve, reject) => {
            const start = Date.now();
            setValidationErrors({});
            let data = JSON.stringify({
                id: typeof id !== 'undefined' ? id : 0,
                firmaAdi: firmaAdi,
                firmaSektoru: firmaSektoru,
                firmaAdresi: firmaAdresi,
                webAdresi: webAdresi,
                telefonNumarasi: phone,
                email: email
            });

            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: 'http://localhost:5273/api/Firma/CreateOrUpdate',
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

    const firmaGetirPromise = () => {
        return new Promise(async (resolve, reject) => {
            const start = Date.now();
            setValidationErrors({});
            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: 'http://localhost:5273/api/Firma/Get',
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
                        setFirmaAdi(response.data.data.firmaAdi);
                        setFirmaSektoru(response.data.data.firmaSektoru);
                        setFirmaAdresi(response.data.data.firmaAdresi);
                        setWebAdresi(response.data.data.webAdresi);
                        setEmail(response.data.data.email);
                        setPhone(response.data.data.telefonNumarasi);
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
                                    value={firmaAdi}
                                    margin="normal"
                                    id="name"
                                    label="Firma Adı"
                                    variant="outlined"
                                    onChange={(e) => setFirmaAdi(e.target.value)}
                                    error={!!validationErrors.FirmaAdi} // Hatanın varlığına göre error özelliğini ayarla
                                    helperText={validationErrors.FirmaAdi} // Hata mesajını helperText olarak göster
                                />
                                <TextField
                                    margin="normal"
                                    value={firmaSektoru}
                                    id="sector"
                                    label="Firma Sektörü"
                                    variant="outlined"
                                    onChange={(e) => setFirmaSektoru(e.target.value)}
                                    error={!!validationErrors.FirmaSektoru}
                                    helperText={validationErrors.FirmaSektoru}
                                />
                                <TextField
                                    margin="normal"
                                    value={firmaAdresi}
                                    id="address"
                                    label="Firma Adresi"
                                    variant="outlined"
                                    onChange={(e) => setFirmaAdresi(e.target.value)}
                                    error={!!validationErrors.FirmaAdresi}
                                    helperText={validationErrors.FirmaAdresi}
                                />
                                <TextField
                                    margin="normal"
                                    id="webAdress"
                                    value={webAdresi}
                                    label="Web Sitesi"
                                    variant="outlined"
                                    onChange={(e) => setWebAdresi(e.target.value)}
                                />
                                <TextField
                                    error={emailError || !!validationErrors.Email}
                                    helperText={emailError ? 'Email adresini kontrol edin' : validationErrors.Email} // emailError true ise kendi mesajını göster, aksi halde validationErrors'tan gelen mesajı göster
                                    type="email"
                                    margin="normal"
                                    id="e-mail"
                                    label="Email"
                                    variant="outlined"
                                    value={email}
                                    onChange={(e) => handleEmail(e)}
                                />
                                <MuiTelInput
                                    error={phoneError || !!validationErrors.TelefonNumarasi}
                                    helperText={phoneError ? 'Telefon numarasını kontrol edin' : validationErrors.TelefonNumarasi}
                                    defaultCountry="TR"
                                    preferredCountries={['TR']}
                                    variant="outlined"
                                    margin="normal"
                                    label="Telefon Numarası"
                                    value={phone}
                                    onChange={(value, info) => handleNumber(value, info)}
                                    id="phone-number"
                                    focusOnSelectCountry
                                    forceCallingCode
                                />
                                <Button onClick={firmaEkle} className="mb-2" margin="normal" variant="contained">
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

export default FirmaEkle;
