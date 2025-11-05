import { AxiosError } from 'axios'
import { Reducer, useReducer } from 'react'

export function useSimpleReducer<T>(initialValue: T) {
  return useReducer<T, any>((prevState, newState: Partial<T>) => ({ ...prevState, ...newState }), initialValue)
}

export const getGenericErrorMessage = (message: string, error: AxiosError) => (
  <>
    <p>{message}</p>
    <code>{JSON.stringify(error.response?.data, null, 2)}</code>
  </>
)
