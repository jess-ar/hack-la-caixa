import { renderHook } from '@testing-library/react-hooks';
import useFetch from './useFetch';

// Mock global fetch API
global.fetch = jest.fn();

describe('useFetch Hook', () => {
    beforeEach(() => {
        fetch.mockClear();
    });

    test('Debe retornar datos cuando la solicitud es exitosa', async () => {
        const mockData = { brokers: [{ id: 1, nombre: 'Broker 1', pais: 'España' }] };
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockData,
        });

        const { result, waitForNextUpdate } = renderHook(() =>
            useFetch('https://faas-lon1-917a94a7.doserverless.co/api/v1/web/fn-a089d91a-d109-4f83-b366-fa7151812c8d/default/BrokerList')
        );

        expect(result.current.loading).toBe(true);

        await waitForNextUpdate();

        expect(result.current.loading).toBe(false);
        expect(result.current.data).toEqual(mockData);
        expect(result.current.error).toBe(null);
    });

    test('Debe manejar errores de red correctamente', async () => {
        fetch.mockRejectedValueOnce(new Error('API failure'));

        const { result, waitForNextUpdate } = renderHook(() =>
            useFetch('https://faas-lon1-917a94a7.doserverless.co/api/v1/web/fn-a089d91a-d109-4f83-b366-fa7151812c8d/default/BrokerList')
        );

        expect(result.current.loading).toBe(true);

        await waitForNextUpdate();

        expect(result.current.loading).toBe(false);
        expect(result.current.data).toBe(null);
        expect(result.current.error).toBe('API failure');
    });

    test('Debe actualizar datos cuando cambia la URL', async () => {
        const mockData1 = { brokers: [{ id: 1, nombre: 'Broker 1', pais: 'España' }] };
        const mockData2 = { brokers: [{ id: 2, nombre: 'Broker 2', pais: 'Francia' }] };

        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockData1,
        });

        const { result, waitForNextUpdate, rerender } = renderHook(
            ({ url }) => useFetch(url),
            { initialProps: { url: 'https://faas-lon1-917a94a7.doserverless.co/api/v1/web/fn-a089d91a-d109-4f83-b366-fa7151812c8d/default/BrokerList?id=1' } }
        );

        await waitForNextUpdate();

        expect(result.current.data).toEqual(mockData1);

        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockData2,
        });

        rerender({ url: 'https://faas-lon1-917a94a7.doserverless.co/api/v1/web/fn-a089d91a-d109-4f83-b366-fa7151812c8d/default/BrokerList?id=2' });

        await waitForNextUpdate();

        expect(result.current.data).toEqual(mockData2);
    });
});