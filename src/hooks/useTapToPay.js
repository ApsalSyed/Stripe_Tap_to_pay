import {useState} from 'react';
import {
  Terminal,
  useStripeTerminal,
} from '@stripe/stripe-terminal-react-native';

export default function useTapToPay(onPaymentSuccess, onPaymentFailure) {
  const [reader, setReader] = useState(null);
  const [loading, setLoading] = useState(false);
  const {initialize} = useStripeTerminal();

  async function initializeTerminal() {
    setLoading(true);
    try {
      await initialize({
        fetchConnectionToken: async () => {
          const response = await fetch(
            'http://192.168.1.43:3000/connection_token',
          );
          const {secret} = await response.json();
          return secret;
        },
      });

      const discoveredReaders = await Terminal.discoverReaders({
        discoveryMethod: 'localMobile',
      });

      if (discoveredReaders.length > 0) {
        const selectedReader = discoveredReaders[0];
        const connectionResult = await Terminal.connectReader(selectedReader);
        if (connectionResult.reader) {
          setReader(connectionResult.reader);
        }
      }
    } catch (error) {
      console.error('Error initializing Tap to Pay:', error);
    } finally {
      setLoading(false);
    }
  }

  async function processPayment(amount) {
    if (!reader) {
      console.error('No reader connected');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        'http://192.168.1.43:3000/create_payment_intent',
        {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({amount, currency: 'usd'}),
        },
      );

      const {client_secret} = await response.json();

      const result = await Terminal.collectPaymentMethod(client_secret);

      if (result.paymentIntent) {
        const confirmResult = await Terminal.confirmPaymentIntent(
          client_secret,
        );
        if (confirmResult.paymentIntent.status === 'succeeded') {
          onPaymentSuccess(confirmResult.paymentIntent);
        } else {
          onPaymentFailure(confirmResult);
        }
      }
    } catch (error) {
      console.error('Payment failed:', error);
      onPaymentFailure(error);
    } finally {
      setLoading(false);
    }
  }

  return {initializeTerminal, processPayment, reader, loading};
}
