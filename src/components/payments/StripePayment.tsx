import React, { useState } from 'react'
import { CreditCard, Lock } from 'lucide-react'

interface StripePaymentProps {
  amount: number
  onSuccess: (paymentId: string) => void
  onError: (error: string) => void
  disabled?: boolean
}

const StripePayment: React.FC<StripePaymentProps> = ({
  amount,
  onSuccess,
  onError,
  disabled = false
}) => {
  const [cardData, setCardData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: ''
  })
  const [isProcessing, setIsProcessing] = useState(false)

  const formatCardNumber = (value: string) => {
    // Remove all non-digit characters
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    // Add spaces every 4 digits
    const matches = v.match(/\d{4,16}/g)
    const match = matches && matches[0] || ''
    const parts = []

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }

    if (parts.length) {
      return parts.join(' ')
    } else {
      return v
    }
  }

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    if (v.length >= 2) {
      return v.substring(0, 2) + (v.length > 2 ? '/' + v.substring(2, 4) : '')
    }
    return v
  }

  const handleInputChange = (field: keyof typeof cardData, value: string) => {
    let formattedValue = value

    if (field === 'cardNumber') {
      formattedValue = formatCardNumber(value)
    } else if (field === 'expiryDate') {
      formattedValue = formatExpiryDate(value)
    } else if (field === 'cvv') {
      formattedValue = value.replace(/[^0-9]/g, '').substring(0, 4)
    }

    setCardData(prev => ({
      ...prev,
      [field]: formattedValue
    }))
  }

  const validateCard = (): boolean => {
    const cardNumber = cardData.cardNumber.replace(/\s/g, '')
    
    if (cardNumber.length < 13 || cardNumber.length > 19) {
      onError('Please enter a valid card number')
      return false
    }

    if (cardData.expiryDate.length !== 5) {
      onError('Please enter a valid expiry date (MM/YY)')
      return false
    }

    if (cardData.cvv.length < 3) {
      onError('Please enter a valid CVV')
      return false
    }

    if (!cardData.nameOnCard.trim()) {
      onError('Please enter the name on card')
      return false
    }

    return true
  }

  const handleSubmit = async () => {
    if (!validateCard()) return

    setIsProcessing(true)

    try {
      // Simulate Stripe API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Simulate payment success (90% success rate)
      if (Math.random() > 0.1) {
        const paymentId = `pi_${Math.random().toString(36).substr(2, 9)}`
        onSuccess(paymentId)
      } else {
        onError('Your card was declined. Please try a different payment method.')
      }
    } catch (error) {
      onError('Payment processing failed. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <CreditCard className="w-5 h-5 text-blue-500" />
        <span className="font-mono font-bold">Credit/Debit Card</span>
        <div className="flex gap-1 ml-auto">
          <div className="w-8 h-5 bg-blue-600 rounded-sm flex items-center justify-center text-white text-xs font-bold">
            VISA
          </div>
          <div className="w-8 h-5 bg-red-600 rounded-sm flex items-center justify-center text-white text-xs font-bold">
            MC
          </div>
          <div className="w-8 h-5 bg-blue-700 rounded-sm flex items-center justify-center text-white text-xs font-bold">
            AMEX
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-mono text-gray-400 mb-2">
          Card Number *
        </label>
        <input
          type="text"
          value={cardData.cardNumber}
          onChange={(e) => handleInputChange('cardNumber', e.target.value)}
          placeholder="1234 5678 9012 3456"
          maxLength={19}
          disabled={disabled || isProcessing}
          className="w-full px-3 py-2 bg-code-gray-dark border border-gray-700 rounded-sm focus:border-blue-500 focus:outline-none font-mono text-sm"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-mono text-gray-400 mb-2">
            Expiry Date *
          </label>
          <input
            type="text"
            value={cardData.expiryDate}
            onChange={(e) => handleInputChange('expiryDate', e.target.value)}
            placeholder="MM/YY"
            maxLength={5}
            disabled={disabled || isProcessing}
            className="w-full px-3 py-2 bg-code-gray-dark border border-gray-700 rounded-sm focus:border-blue-500 focus:outline-none font-mono text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-mono text-gray-400 mb-2">
            CVV *
          </label>
          <input
            type="text"
            value={cardData.cvv}
            onChange={(e) => handleInputChange('cvv', e.target.value)}
            placeholder="123"
            maxLength={4}
            disabled={disabled || isProcessing}
            className="w-full px-3 py-2 bg-code-gray-dark border border-gray-700 rounded-sm focus:border-blue-500 focus:outline-none font-mono text-sm"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-mono text-gray-400 mb-2">
          Name on Card *
        </label>
        <input
          type="text"
          value={cardData.nameOnCard}
          onChange={(e) => handleInputChange('nameOnCard', e.target.value)}
          placeholder="John Doe"
          disabled={disabled || isProcessing}
          className="w-full px-3 py-2 bg-code-gray-dark border border-gray-700 rounded-sm focus:border-blue-500 focus:outline-none font-mono text-sm"
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={disabled || isProcessing}
        className="btn-primary w-full flex items-center justify-center gap-2"
      >
        {isProcessing ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Processing Payment...
          </>
        ) : (
          <>
            <Lock className="w-4 h-4" />
            Pay ${amount.toFixed(2)}
          </>
        )}
      </button>

      <div className="text-xs text-gray-400 text-center">
        <Lock className="w-3 h-3 inline mr-1" />
        Your payment is secured with 256-bit SSL encryption
      </div>
    </div>
  )
}

export default StripePayment
