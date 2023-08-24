import { useMemo, useState } from 'react';
import MaterialReactTable from 'material-react-table';
import { Box, IconButton, Tooltip, Modal, Typography, Button } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { IconInfoCircle } from '@tabler/icons';
import React from 'react';
import { height } from '@mui/system';

const Example = () => {
    const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));
    const navigate = useNavigate();

    const [columnFilters, setColumnFilters] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const [sorting, setSorting] = useState([]);
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10
    });

    const BlocknoteModal = ({ open, onClose, urunAdi, urunDetay, fiyatGecmisi }) => {
        return (
            <Modal open={open} onClose={onClose}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        bgcolor: 'white',
                        boxShadow: 24,
                        p: 4,
                        height: '200px',
                        width: '400px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    <Typography variant="h1" gutterBottom>
                        {urunAdi}
                    </Typography>
                    <Typography variant="body1">{urunDetay + '\n' + 'Ürün Geçmiş Fiyatları: ' + '\n' + fiyatGecmisi}</Typography>
                    <Button onClick={onClose}>Kapat</Button>
                </Box>
            </Modal>
        );
    };

    const handleOpenModal = () => {
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    const { data, isError, isFetching, isLoading, refetch } = useQuery({
        queryKey: ['table-data'],
        queryFn: async () => {
            var responseData;
            const FormData = require('form-data');
            let data = new FormData();
            data.append('pageSize', 0);
            data.append('pageIndex', 0);

            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: 'http://localhost:5273/api/Urun/GetGrid',
                data: data
            };

            await axios
                .request(config)
                .then((response) => {
                    responseData = response.data.data;
                    console.log(responseData);
                })
                .catch((error) => {
                    console.log(error);
                });
            return responseData;
        },
        keepPreviousData: true
    });

    const columns = useMemo(
        () => [
            {
                accessorKey: 'urunAdi',
                header: 'Ürün'
            },
            {
                accessorKey: 'urunKategorisi',
                header: 'Kategori'
            },
            {
                accessorKey: 'urunStok',
                header: 'Stok Adedi'
            },
            {
                accessorKey: 'birimliFiyat',
                header: 'Fiyat '
            },
            {
                accessorKey: 'urunKDV',
                header: 'KDV Oranı'
            }
        ],
        []
    );

    const deleteById = (id) => {
        toast.promise(deletePromise(id), {
            pending: 'Ürün siliniyor.',
            success: 'Ürün başarıyla silindi 👌',
            error: 'Ürün silinirken hata oluştu 🤯'
        });
    };

    const deletePromise = (id) => {
        return new Promise(async (resolve, reject) => {
            const start = Date.now();

            let config = {
                method: 'get',
                maxBodyLength: Infinity,
                url: 'http://localhost:5273/api/Urun/Delete',
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
                        if (millis < 1000) {
                            await sleep(1000 - millis);
                        }
                        refetch();
                        resolve(response.data); // Başarılı sonuç durumunda Promise'ı çöz
                    } else {
                        reject(new Error('İşlem başarısız')); // Başarısız sonuç durumunda Promise'ı reddet
                    }
                })
                .catch((error) => {
                    console.log(error);
                    reject(error); // Hata durumunda Promise'ı reddet
                });
        });
    };

    return (
        <>
            <MaterialReactTable
                enableRowActions
                displayColumnDefOptions={{
                    'mrt-row-actions': {
                        header: 'Detaylı Bilgi',
                        header: 'İşlemler'
                    }
                }}
                renderRowActions={({ row }) => (
                    <div>
                        <BlocknoteModal
                            open={modalOpen}
                            onClose={handleCloseModal}
                            urunAdi={row.original.urunAdi}
                            urunDetay={row.original.urunDetay}
                            fiyatGecmisi={row.original.fiyatGecmisi}
                        />
                        <Box
                            sx={{
                                display: 'flex',
                                flexWrap: 'nowrap',
                                gap: '8px',
                                justifyContent: 'flex-start',
                                alignItems: 'center'
                            }}
                        >
                            <IconButton color="secondary" onClick={() => handleOpenModal(row.original.id)}>
                                <IconInfoCircle />
                            </IconButton>
                            <IconButton
                                color="secondary"
                                onClick={() => {
                                    navigate(`/digerIslemler/urun-duzenle/${row.original.id}`);
                                }}
                            >
                                <EditIcon />
                            </IconButton>
                            <IconButton
                                color="error"
                                onClick={() => {
                                    console.log(row.original);
                                    deleteById(row.original.id);
                                }}
                            >
                                <DeleteIcon />
                            </IconButton>
                        </Box>
                    </div>
                )}
                positionActionsColumn="last"
                columns={columns}
                data={data !== undefined ? data.list : []}
                muiToolbarAlertBannerProps={
                    isError
                        ? {
                              color: 'error',
                              children: 'Error loading data'
                          }
                        : undefined
                }
                onColumnFiltersChange={setColumnFilters}
                onGlobalFilterChange={setGlobalFilter}
                onPaginationChange={setPagination}
                onSortingChange={setSorting}
                renderTopToolbarCustomActions={() => (
                    <Tooltip arrow title="Refresh Data">
                        <IconButton onClick={() => refetch()}>
                            <RefreshIcon />
                        </IconButton>
                    </Tooltip>
                )}
                rowCount={data?.dataCount ?? 0}
                state={{
                    columnFilters,
                    globalFilter,
                    isLoading,
                    pagination,
                    showAlertBanner: isError,
                    showProgressBars: isFetching,
                    sorting
                }}
            />
        </>
    );
};

const queryClient = new QueryClient();

const ExampleWithReactQueryProvider = () => (
    <QueryClientProvider client={queryClient}>
        <Example />
    </QueryClientProvider>
);

export default ExampleWithReactQueryProvider;
