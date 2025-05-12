interface CardDetails {
  cardNumber: string;
  cardName: string;
  expiryDate: string;
  cvv: string;
  saveCard: boolean;
  referenceNumber?: string;  // Nuevo campo
  securityCode?: string;    // Nuevo campo
}