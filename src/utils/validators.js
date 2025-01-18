export const validateAccountForm = (account) => {
    const errors = {};

    if (!account.name) errors.name = 'Account Name is required.';
    if (!account.balance || account.balance <= 0) errors.balance = 'Account Balance must be greater than 0.';
    if (!account.type) errors.type = 'Account Type is required.';
    if (!account.currency) errors.currency = 'Currency is required.';

    console.log('Validation Errors:', errors);

    return Object.keys(errors).length === 0;
};