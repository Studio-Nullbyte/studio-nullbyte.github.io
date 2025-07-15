import React, { useState } from 'react'
import { Lock } from 'lucide-react'

interface PayPalPaymentProps {
  amount: number
  onSuccess: (paymentId: string) => void
  onError: (error: string) => void
  disabled?: boolean
}

const PayPalPayment: React.FC<PayPalPaymentProps> = ({
  amount,
  onSuccess,
  onError,
  disabled = false
}) => {
  const [isProcessing, setIsProcessing] = useState(false)

  const handlePayPalCheckout = async () => {
    setIsProcessing(true)

    try {
      // Simulate PayPal SDK integration
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Simulate PayPal payment success (95% success rate)
      if (Math.random() > 0.05) {
        const paymentId = `PAYPAL-${Math.random().toString(36).substr(2, 12).toUpperCase()}`
        onSuccess(paymentId)
      } else {
        onError('PayPal payment was cancelled or failed. Please try again.')
      }
    } catch (error) {
      onError('PayPal payment processing failed. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-6 h-6 bg-blue-600 rounded-sm flex items-center justify-center text-white font-bold text-sm">
          P
        </div>
        <span className="font-mono font-bold">PayPal</span>
      </div>

      <div className="bg-yellow-500 bg-opacity-10 border border-yellow-500 border-opacity-30 rounded-sm p-4 mb-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-yellow-500 rounded-sm flex items-center justify-center text-black font-bold">
            PP
          </div>
          <div>
            <div className="font-mono font-bold text-yellow-400 mb-1">
              Secure PayPal Payment
            </div>
            <div className="text-sm text-gray-300">
              You'll be redirected to PayPal to complete your payment securely.
              You can pay with your PayPal balance, bank account, or credit card.
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Amount:</span>
          <span className="font-mono font-bold text-electric-violet">${amount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">PayPal Fee:</span>
          <span className="font-mono">$0.00</span>
        </div>
        <div className="border-t border-gray-700 pt-2">
          <div className="flex justify-between">
            <span className="font-mono font-bold">Total:</span>
            <span className="font-mono font-bold text-electric-violet">${amount.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <button
        onClick={handlePayPalCheckout}
        disabled={disabled || isProcessing}
        className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-mono font-bold py-3 px-4 rounded-sm transition-colors flex items-center justify-center gap-2"
      >
        {isProcessing ? (
          <>
            <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
            Redirecting to PayPal...
          </>
        ) : (
          <>
            <Lock className="w-4 h-4" />
            Pay with PayPal
          </>
        )}
      </button>

      <div className="text-xs text-gray-400 text-center">
        <Lock className="w-3 h-3 inline mr-1" />
        Protected by PayPal's Buyer Protection Program
      </div>
    </div>
  )
}

export default PayPalPayment
