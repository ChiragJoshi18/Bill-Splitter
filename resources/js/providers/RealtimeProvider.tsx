import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useToast } from '@/components/ui/toast';

interface RealtimeContextType {
  // Groups
  groups: any[];
  updateGroups: (updater: (prev: any[]) => any[]) => void;
  addGroup: (group: any) => void;
  updateGroup: (id: number, updates: any) => void;
  removeGroup: (id: number) => void;
  
  // Expenses
  expenses: any[];
  updateExpenses: (updater: (prev: any[]) => any[]) => void;
  addExpense: (expense: any) => void;
  updateExpense: (id: number, updates: any) => void;
  removeExpense: (id: number) => void;
  
  // Settlements
  settlements: any[];
  updateSettlements: (updater: (prev: any[]) => any[]) => void;
  addSettlement: (settlement: any) => void;
  updateSettlement: (id: number, updates: any) => void;
  removeSettlement: (id: number) => void;
  
  // Invitations
  invitations: any[];
  updateInvitations: (updater: (prev: any[]) => any[]) => void;
  addInvitation: (invitation: any) => void;
  updateInvitation: (id: number, updates: any) => void;
  removeInvitation: (id: number) => void;
  
  // Notifications
  notifications: any[];
  unreadCount: number;
  updateNotifications: (updater: (prev: any[]) => any[]) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
}

const RealtimeContext = createContext<RealtimeContextType | undefined>(undefined);

export function RealtimeProvider({ children }: { children: React.ReactNode }) {
  const { addToast } = useToast();
  
  // State
  const [groups, setGroups] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [settlements, setSettlements] = useState<any[]>([]);
  const [invitations, setInvitations] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Groups actions
  const updateGroups = useCallback((updater: (prev: any[]) => any[]) => {
    setGroups(updater);
  }, []);

  const addGroup = useCallback((group: any) => {
    setGroups(prev => [...prev, group]);
    addToast({
      type: 'success',
      title: 'Group created!',
      message: `"${group.name}" has been created successfully.`
    });
  }, [addToast]);

  const updateGroup = useCallback((id: number, updates: any) => {
    setGroups(prev => prev.map(group => 
      group.id === id ? { ...group, ...updates } : group
    ));
    addToast({
      type: 'success',
      title: 'Group updated!',
      message: 'Group has been updated successfully.'
    });
  }, [addToast]);

  const removeGroup = useCallback((id: number) => {
    setGroups(prev => prev.filter(group => group.id !== id));
    addToast({
      type: 'success',
      title: 'Group deleted!',
      message: 'Group has been deleted successfully.'
    });
  }, [addToast]);

  // Expenses actions
  const updateExpenses = useCallback((updater: (prev: any[]) => any[]) => {
    setExpenses(updater);
  }, []);

  const addExpense = useCallback((expense: any) => {
    setExpenses(prev => [...prev, expense]);
    addToast({
      type: 'success',
      title: 'Expense added!',
      message: `"${expense.title}" has been added successfully.`
    });
  }, [addToast]);

  const updateExpense = useCallback((id: number, updates: any) => {
    setExpenses(prev => prev.map(expense => 
      expense.id === id ? { ...expense, ...updates } : expense
    ));
    addToast({
      type: 'success',
      title: 'Expense updated!',
      message: 'Expense has been updated successfully.'
    });
  }, [addToast]);

  const removeExpense = useCallback((id: number) => {
    setExpenses(prev => prev.filter(expense => expense.id !== id));
    addToast({
      type: 'success',
      title: 'Expense deleted!',
      message: 'Expense has been deleted successfully.'
    });
  }, [addToast]);

  // Settlements actions
  const updateSettlements = useCallback((updater: (prev: any[]) => any[]) => {
    setSettlements(updater);
  }, []);

  const addSettlement = useCallback((settlement: any) => {
    setSettlements(prev => [...prev, settlement]);
    addToast({
      type: 'success',
      title: 'Settlement created!',
      message: 'Settlement has been created successfully.'
    });
  }, [addToast]);

  const updateSettlement = useCallback((id: number, updates: any) => {
    setSettlements(prev => prev.map(settlement => 
      settlement.id === id ? { ...settlement, ...updates } : settlement
    ));
    addToast({
      type: 'success',
      title: 'Settlement updated!',
      message: 'Settlement has been updated successfully.'
    });
  }, [addToast]);

  const removeSettlement = useCallback((id: number) => {
    setSettlements(prev => prev.filter(settlement => settlement.id !== id));
    addToast({
      type: 'success',
      title: 'Settlement deleted!',
      message: 'Settlement has been deleted successfully.'
    });
  }, [addToast]);

  // Invitations actions
  const updateInvitations = useCallback((updater: (prev: any[]) => any[]) => {
    setInvitations(updater);
  }, []);

  const addInvitation = useCallback((invitation: any) => {
    setInvitations(prev => [...prev, invitation]);
    addToast({
      type: 'success',
      title: 'Invitation sent!',
      message: `Invitation has been sent to ${invitation.email}.`
    });
  }, [addToast]);

  const updateInvitation = useCallback((id: number, updates: any) => {
    setInvitations(prev => prev.map(invitation => 
      invitation.id === id ? { ...invitation, ...updates } : invitation
    ));
  }, []);

  const removeInvitation = useCallback((id: number) => {
    setInvitations(prev => prev.filter(invitation => invitation.id !== id));
  }, []);

  // Notifications actions
  const updateNotifications = useCallback((updater: (prev: any[]) => any[]) => {
    setNotifications(updater);
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(notification => 
      notification.id === id ? { ...notification, is_read: true } : notification
    ));
    setUnreadCount(prev => Math.max(0, prev - 1));
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(notification => ({ ...notification, is_read: true })));
    setUnreadCount(0);
  }, []);

  // Fetch initial data
  useEffect(() => {
    // This would be called when the app loads to get initial data
    // For now, we'll rely on props being passed down
  }, []);

  const value: RealtimeContextType = {
    // Groups
    groups,
    updateGroups,
    addGroup,
    updateGroup,
    removeGroup,
    
    // Expenses
    expenses,
    updateExpenses,
    addExpense,
    updateExpense,
    removeExpense,
    
    // Settlements
    settlements,
    updateSettlements,
    addSettlement,
    updateSettlement,
    removeSettlement,
    
    // Invitations
    invitations,
    updateInvitations,
    addInvitation,
    updateInvitation,
    removeInvitation,
    
    // Notifications
    notifications,
    unreadCount,
    updateNotifications,
    markAsRead,
    markAllAsRead,
  };

  return (
    <RealtimeContext.Provider value={value}>
      {children}
    </RealtimeContext.Provider>
  );
}

export function useRealtime() {
  const context = useContext(RealtimeContext);
  if (!context) {
    throw new Error('useRealtime must be used within a RealtimeProvider');
  }
  return context;
} 