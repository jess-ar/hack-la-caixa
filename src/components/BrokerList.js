import React, { useState } from 'react';
import useFetch from '../hooks/useFetch';
import {
    CircularProgress,
    Typography,
    List,
    ListItem,
    ListItemText,
    IconButton,
    Paper,
    Link,
    Box,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';

const BrokerList = () => {
    const [selectedBrokerId, setSelectedBrokerId] = useState(null);

    // Fetch para la lista de brokers
    const { data, loading, error } = useFetch(
        'https://faas-lon1-917a94a7.doserverless.co/api/v1/web/fn-a089d91a-d109-4f83-b366-fa7151812c8d/default/BrokerList'
    );

    // Fetch para los detalles del broker seleccionado
    const { data: brokerDetails, loading: loadingDetails, error: errorDetails } = useFetch(
        selectedBrokerId
            ? `https://faas-lon1-917a94a7.doserverless.co/api/v1/web/fn-a089d91a-d109-4f83-b366-fa7151812c8d/default/BrokerDetails?id=${selectedBrokerId}`
            : null
    );

    // Callback explícito para seleccionar un broker
    const handleSelectBroker = (id) => {
        setSelectedBrokerId(id);
    };

    return (
        <Paper sx={{ p: 2, mb: 2 }}>
            {/* Título de Brokers */}
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <BusinessCenterIcon sx={{ mr: 1, color: '#007eae' }} />
                Brokers
            </Typography>

            {/* Lista de brokers */}
            {loading && (
                <CircularProgress data-testid="loading-spinner" sx={{ display: 'block', margin: 'auto' }} />
            )}
            {error && (
                <Typography variant="body1" color="error" data-testid="error-message">
                    Error: {error}
                </Typography>
            )}
            {!loading && !error && data && Array.isArray(data) ? (
                <List>
                    {data.map((broker) => (
                        <ListItem
                            key={broker.id}
                            button
                            onClick={() => handleSelectBroker(broker.id)}
                            data-testid="broker-item"
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                borderBottom: '1px solid #f0f0f0',
                            }}
                        >
                            <ListItemText
                                primary={broker.nombre}
                                secondary={`Country: ${broker.pais}`}
                            />
                            <IconButton>
                                <VisibilityIcon />
                            </IconButton>
                        </ListItem>
                    ))}
                </List>
            ) : (
                <Typography variant="body1" sx={{ textAlign: 'center', mt: 2 }}>
                    No brokers available.
                </Typography>
            )}

            {/* Detalles del broker debajo */}
            {loadingDetails && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                    <CircularProgress data-testid="loading-details-spinner" />
                </Box>
            )}
            {errorDetails && (
                <Typography variant="body1" color="error" sx={{ mt: 3 }}>
                    Error: {errorDetails}
                </Typography>
            )}
            {brokerDetails && !loadingDetails && (
                <Paper sx={{ p: 2, mt: 3 }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        Broker Details
                    </Typography>
                    <Typography variant="body1"><strong>Name:</strong> {brokerDetails.nombre}</Typography>
                    <Typography variant="body1"><strong>Country:</strong> {brokerDetails.pais}</Typography>
                    <Typography variant="body1"><strong>Email:</strong>
                        <Link href={`mailto:${brokerDetails.email || ''}`}>
                            {brokerDetails.email || 'N/A'}
                        </Link>
                    </Typography>
                    <Typography variant="body1"><strong>Website:</strong>
                        <Link href={brokerDetails.sitio_web || '#'} target="_blank" rel="noopener noreferrer">
                            {brokerDetails.sitio_web || 'N/A'}
                        </Link>
                    </Typography>
                </Paper>
            )}
        </Paper>
    );
};

export default BrokerList;
