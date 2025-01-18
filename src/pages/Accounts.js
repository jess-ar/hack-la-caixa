import React, { useState } from 'react';
import { Container, Grid, Box, Button, Typography } from '@mui/material';
import caixabankIcon from '../assets/caixabank-icon-blue.png';
import AccountCard from '../components/AccountCard';
import AddAccountDialog from '../components/AddAccountDialog';
import DeleteAccountDialog from '../components/DeleteAccountDialog';
import AccountMenu from '../components/AccountMenu';
import SnackbarNotification from '../components/SnackbarNotification';
import { useStore } from '@nanostores/react';
import { useSnackbar } from '../hooks/useSnackbar';
import { validateAccountForm } from '../utils/validators';
import { accountsStore, addAccount, deleteAccount } from '../contexts/GlobalState';
import '../styles/Buttons.css';

const Accounts = () => {
    const store = useStore(accountsStore);
    const accounts = store.accounts || [];
    const [anchorEl, setAnchorEl] = useState(null);
    console.log("Initial anchorEl:", anchorEl);
    const [open, setOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedAccountId, setSelectedAccountId] = useState(null);
    const {
        snackbarOpen,
        snackbarMessage,
        snackbarSeverity,
        showSnackbar,
        closeSnackbar,
    } = useSnackbar();

    const handleMenuOpen = (event, accountId) => {
        console.log("Event currentTarget:", event.currentTarget);
        setAnchorEl(event.currentTarget);
        setSelectedAccountId(accountId);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };
    const handleDialogOpen = () => setOpen(true);

    const handleAddAccount = (newAccount) => {
        const formattedAccount = {
            id: `${Date.now()}`,
            name: newAccount.accountName.trim(), // Mapea "accountName" a "name"
            balance: newAccount.accountBalance, // Mapea "accountBalance" a "balance"
            type: newAccount.type.trim(),
            currency: newAccount.currency.trim(),
        };
    
        console.log('Formatted Account:', formattedAccount); // Depuración
    
        if (validateAccountForm(formattedAccount)) {
            addAccount(formattedAccount);
            showSnackbar('Account added successfully!', 'success');
            setOpen(false);
        } else {
            showSnackbar('Please fill in all required fields.', 'error');
        }
    };    

    const handleDeleteAccount = () => {
        setAnchorEl(null);
        deleteAccount(selectedAccountId);
        showSnackbar('Account deleted successfully!', 'success');
        setDeleteDialogOpen(false);
    };

    return (
        <Container sx={{ mt: 10, mb: 4 }}>
            <Box display="flex" alignItems="center" sx={{ mb: 4 }}>
                <img src={caixabankIcon} alt="CaixaBank" style={{ height: '40px', marginRight: '10px' }} />
                <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h4" component="div">
                        Accounts
                    </Typography>
                    <Typography variant="subtitle1" color="textSecondary">
                        Manage your bank accounts, including adding and deleting accounts.
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    color="primary"
                    className="button-custom"
                    onClick={handleDialogOpen}
                    data-testid="add-account-button"
                >
                    Add Account
                </Button>
            </Box>
            <Grid container spacing={2}>
                {accounts.map(account => (
                    <Grid item xs={12} sm={6} md={4} key={account.id}>
                        <AccountCard account={account} onMenuOpen={handleMenuOpen} />
                    </Grid>
                ))}
            </Grid>
            <AccountMenu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                onDeleteOpen={() => setDeleteDialogOpen(true)}
            />
            <AddAccountDialog
                open={open}
                setOpen={setOpen}
                onAddAccount={handleAddAccount}
            />
            <DeleteAccountDialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
                onDelete={handleDeleteAccount}
            />
            <SnackbarNotification
                open={snackbarOpen}
                onClose={closeSnackbar}
                severity={snackbarSeverity}
                message={snackbarMessage}
            />
        </Container>
    );
};

export default Accounts;
