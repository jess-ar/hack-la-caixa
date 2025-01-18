import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import AccountDetails from '../../src/components/AccountDetails';
import { GlobalStateProvider } from '../../src/contexts/GlobalState';
import AddAccountDialog from '../../src/components/AddAccountDialog';

test('should add a new account and display AccountDetails', () => {
    const mockOnAddAccount = jest.fn();

    render(
        <GlobalStateProvider>
            <AddAccountDialog open={true} setOpen={() => { }} onAddAccount={mockOnAddAccount} />
        </GlobalStateProvider>
    );

    // Inputs del formulario
    const nameInput = screen.getByLabelText('Account Name');
    const balanceInput = screen.getByLabelText('Account Balance');
    const typeSelect = screen.getByLabelText('Type');
    const currencySelect = screen.getByLabelText('Currency');
    const addButton = screen.getByTestId('submit-button');

    fireEvent.change(nameInput, { target: { value: 'New Account' } });
    fireEvent.change(balanceInput, { target: { value: '1000' } });

    fireEvent.mouseDown(typeSelect);
    fireEvent.click(screen.getByText('Checking'));

    fireEvent.mouseDown(currencySelect);
    fireEvent.click(screen.getByText('EUR'));

    fireEvent.click(addButton);

    expect(mockOnAddAccount).toHaveBeenCalledWith({
        accountName: 'New Account',
        accountBalance: '1000',
        type: 'Checking',
        currency: 'EUR',
    });
});
