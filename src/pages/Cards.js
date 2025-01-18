import React, { useState } from 'react';
import { Container, Grid, Typography, Box, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { useStore } from '@nanostores/react';
import { accountsStore } from '../contexts/GlobalState';
import CardList from '../components/CardList';
import AddCardForm from '../components/AddCardForm';
import caixabankIcon from '../assets/caixabank-icon-blue.png';

const Cards = () => {
    const { cards } = useStore(accountsStore);
    const [open, setOpen] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selectedCardId, setSelectedCardId] = useState(null);

    // Abre el modal de confirmación
    const handleDeleteCard = (cardId) => {
        setSelectedCardId(cardId);
        setConfirmOpen(true);
    };

    // Confirmar la eliminación de la tarjeta
    const confirmDelete = () => {
        const updatedCards = cards.filter((card) => card.id !== selectedCardId);
        accountsStore.setKey('cards', updatedCards);
        setConfirmOpen(false);
        setSelectedCardId(null);
    };

    const cancelDelete = () => {
        setConfirmOpen(false);
        setSelectedCardId(null);
    };


    return (
        <Container sx={{ mt: 10, mb: 4 }}>
            <Box display="flex" alignItems="center" sx={{ mb: 4 }}>
                <img src={caixabankIcon} alt="CaixaBank" style={{ height: '40px', marginRight: '10px' }} data-testid="caixabank-icon" />
                <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h4" component="div" data-testid="cards-title">
                        Cards
                    </Typography>
                    <Typography variant="subtitle1" color="textSecondary" data-testid="cards-subtitle">
                        Manage your cards, including adding and deleting cards.
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setOpen(true)}
                    data-testid="add-card-button"
                >
                    Add Card
                </Button>
            </Box>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <CardList cards={cards} onDeleteCard={handleDeleteCard} />
                </Grid>
            </Grid>
            <AddCardForm open={open} setOpen={setOpen} />
            {/* Diálogo de confirmación */}
            <Dialog
                open={confirmOpen}
                onClose={cancelDelete}
                data-testid="confirm-delete-dialog"
            >
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this card? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={cancelDelete} color="secondary" data-testid="cancel-delete-button">
                        Cancel
                    </Button>
                    <Button onClick={confirmDelete} color="primary" variant="contained" data-testid="confirm-delete-button">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default Cards;