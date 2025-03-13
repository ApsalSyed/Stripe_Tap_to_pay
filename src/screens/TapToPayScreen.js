import React, {useEffect} from 'react';
import {ActivityIndicator, Button, Text, View} from 'react-native';
import useTapToPay from '../hooks/useTapToPay';


export default function TapToPayScreen() {
  const {initializeTerminal, processPayment, reader, loading} = useTapToPay(
    success => alert('Payment Successful!'),
    error => alert('Payment Failed: ' + JSON.stringify(error)),
  );

  useEffect(() => {
    initializeTerminal();
  }, []);

  return (
    <View>
      {loading && <ActivityIndicator size="large" />}
      <Text>Reader: {reader ? reader.label : 'Not Connected'}</Text>
      <Button
        title="Pay $10"
        onPress={() => processPayment(1000)}
        disabled={!reader || loading}
      />
    </View>
  );
}
