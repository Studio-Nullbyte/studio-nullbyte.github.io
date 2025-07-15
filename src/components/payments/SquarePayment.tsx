import React, { useState } from 'react'
import { CreditCard, Lock } from 'lucide-react'

interface SquarePaymentProps {
  amount: number
  onSuccess: (paymentId: string) => void
  onError: (error: string) => void
  disabled?: boolean
}

const SquarePayment: React.FC<SquarePaymentProps> = ({
  amount,
  onSuccess,
  onError,
  disabled = false
}) => {
  const [cardData, setCardData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: '',
    zipCode: ''
  })
  const [isProcessing, setIsProcessing] = useState(false)

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = matches && matches[0] || ''
    const parts = []

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }

    return parts.length ? parts.join(' ') : v
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
    } else if (field === 'zipCode') {
      formattedValue = value.replace(/[^0-9]/g, '').substring(0, 5)
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

    if (cardData.zipCode.length < 5) {
      onError('Please enter a valid ZIP code')
      return false
    }

    return true
  }

  const handleSubmit = async () => {
    if (!validateCard()) return

    setIsProcessing(true)

    try {
      // Simulate Square API call
      await new Promise(resolve => setTimeout(resolve, 2500))
      
      // Simulate payment success (92% success rate)
      if (Math.random() > 0.08) {
        const paymentId = `sq_${Math.random().toString(36).substr(2, 15)}`
        onSuccess(paymentId)
      } else {
        onError('Transaction declined. Please check your card details and try again.')
      }
    } catch (error) {
      onError('Square payment processing failed. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-6 h-6 bg-gray-600 rounded-sm flex items-center justify-center text-white font-bold text-sm">
          ⬛
        </div>
        <span className="font-mono font-bold">Square Payment</span>
        <div className="ml-auto text-xs text-gray-400">
          Powered by Square
        </div>
      </div>

      <div className="bg-gray-800 bg-opacity-50 border border-gray-700 rounded-sm p-4 mb-4">
        <div className="text-sm text-gray-300 mb-2">
          <CreditCard className="w-4 h-4 inline mr-2" />
          Secure payment processing by Square
        </div>
        <div className="text-xs text-gray-400">
          Your payment information is encrypted and processed securely through Square's
          PCI-compliant payment infrastructure.
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
          className="w-full px-3 py-2 bg-code-gray-dark border border-gray-700 rounded-sm focus:border-gray-500 focus:outline-none font-mono text-sm"
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-mono text-gray-400 mb-2">
            Expiry *
          </label>
          <input
            type="text"
            value={cardData.expiryDate}
            onChange={(e) => handleInputChange('expiryDate', e.target.value)}
            placeholder="MM/YY"
            maxLength={5}
            disabled={disabled || isProcessing}
            className="w-full px-3 py-2 bg-code-gray-dark border border-gray-700 rounded-sm focus:border-gray-500 focus:outline-none font-mono text-sm"
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
            className="w-full px-3 py-2 bg-code-gray-dark border border-gray-700 rounded-sm focus:border-gray-500 focus:outline-none font-mono text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-mono text-gray-400 mb-2">
            ZIP *
          </label>
          <input
            type="text"
            value={cardData.zipCode}
            onChange={(e) => handleInputChange('zipCode', e.target.value)}
            placeholder="12345"
            maxLength={5}
            disabled={disabled || isProcessing}
            className="w-full px-3 py-2 bg-code-gray-dark border border-gray-700 rounded-sm focus:border-gray-500 focus:outline-none font-mono text-sm"
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
          className="w-full px-3 py-2 bg-code-gray-dark border border-gray-700 rounded-sm focus:border-gray-500 focus:outline-none font-mono text-sm"
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={disabled || isProcessing}
        className="btn-secondary w-full flex items-center justify-center gap-2"
      >
        {isProcessing ? (
          <>
            <div className="w-4 h-4 border-2 border-electric-violet border-t-transparent rounded-full animate-spin"></div>
            Processing Payment...
          </>
        ) : (
          <>
            <Lock className="w-4 h-4" />
            Pay ${amount.toFixed(2)} with Square
          </>
        )}
      </button>

      <div className="text-xs text-gray-400 text-center">
        <Lock className="w-3 h-3 inline mr-1" />
        PCI DSS compliant payment processing
      </div>
    </div>
  )
}

export default SquarePayment
