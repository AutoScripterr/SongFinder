import { useState } from 'react';
import { api } from '../services/api';
import type { AppState } from '../types';

export function useSongIdentifier() {
  const [state, setState] = useState<AppState>({ status: 'idle' });

  const identify = async (url: string) => {
    if (!url.trim()) {
      setState({
        status: 'error',
        message: 'Please enter a video URL',
      });
      return;
    }

    setState({ status: 'loading' });

    try {
      const result = await api.identifySong(url);

      if (result.success && result.data) {
        setState({
          status: 'success',
          song: result.data,
        });
      } else {
        setState({
          status: 'error',
          message: result.error || 'Failed to identify song',
          suggestions: result.suggestions,
        });
      }
    } catch (error) {
      let errorMessage = 'An unexpected error occurred';

      if (error instanceof Error) {
        errorMessage = error.message;
      }

      setState({
        status: 'error',
        message: errorMessage,
      });
    }
  };

  const reset = () => {
    setState({ status: 'idle' });
  };

  return {
    state,
    identify,
    reset,
  };
}
