'use client';

import React from 'react';
import { TransactionModal } from './IncomeModal';

interface ExpenseModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
}

export default function ExpenseModal({ isOpen, onClose }: ExpenseModalProps) {
  return <TransactionModal isOpen={isOpen} onClose={onClose} kind="expense" />;
}
