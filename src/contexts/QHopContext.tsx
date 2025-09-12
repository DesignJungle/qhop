import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { queueService, Business, Ticket, NotificationData } from '../services/QueueService';

// State interface
interface QHopState {
  user: {
    id?: string;
    name?: string;
    email?: string;
    phone?: string;
    isAuthenticated: boolean;
  };
  businesses: Business[];
  activeTickets: Ticket[];
  notifications: NotificationData[];
  loading: {
    businesses: boolean;
    tickets: boolean;
    joining: boolean;
  };
  error: string | null;
}

// Action types
type QHopAction =
  | { type: 'SET_LOADING'; payload: { key: keyof QHopState['loading']; value: boolean } }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_BUSINESSES'; payload: Business[] }
  | { type: 'SET_ACTIVE_TICKETS'; payload: Ticket[] }
  | { type: 'ADD_TICKET'; payload: Ticket }
  | { type: 'UPDATE_TICKET'; payload: { id: string; updates: Partial<Ticket> } }
  | { type: 'REMOVE_TICKET'; payload: string }
  | { type: 'ADD_NOTIFICATION'; payload: NotificationData }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string }
  | { type: 'SET_USER'; payload: QHopState['user'] }
  | { type: 'LOGOUT' };

// Initial state
const initialState: QHopState = {
  user: {
    isAuthenticated: false
  },
  businesses: [],
  activeTickets: [],
  notifications: [],
  loading: {
    businesses: false,
    tickets: false,
    joining: false
  },
  error: null
};

// Reducer
function qhopReducer(state: QHopState, action: QHopAction): QHopState {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        loading: {
          ...state.loading,
          [action.payload.key]: action.payload.value
        }
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload
      };

    case 'SET_BUSINESSES':
      return {
        ...state,
        businesses: action.payload,
        loading: { ...state.loading, businesses: false }
      };

    case 'SET_ACTIVE_TICKETS':
      return {
        ...state,
        activeTickets: action.payload,
        loading: { ...state.loading, tickets: false }
      };

    case 'ADD_TICKET':
      return {
        ...state,
        activeTickets: [...state.activeTickets, action.payload],
        loading: { ...state.loading, joining: false }
      };

    case 'UPDATE_TICKET':
      return {
        ...state,
        activeTickets: state.activeTickets.map(ticket =>
          ticket.id === action.payload.id
            ? { ...ticket, ...action.payload.updates }
            : ticket
        )
      };

    case 'REMOVE_TICKET':
      return {
        ...state,
        activeTickets: state.activeTickets.filter(ticket => ticket.id !== action.payload)
      };

    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [action.payload, ...state.notifications]
      };

    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map(notification =>
          notification.id === action.payload
            ? { ...notification, read: true }
            : notification
        )
      };

    case 'SET_USER':
      return {
        ...state,
        user: action.payload
      };

    case 'LOGOUT':
      return {
        ...initialState
      };

    default:
      return state;
  }
}

// Context interface
interface QHopContextType {
  state: QHopState;
  dispatch: React.Dispatch<QHopAction>;
  actions: {
    searchBusinesses: (query?: string, category?: string) => Promise<void>;
    loadActiveTickets: () => Promise<void>;
    joinQueue: (businessId: string, serviceId: string, partySize: number, acceptsTerms: boolean) => Promise<Ticket>;
    cancelTicket: (ticketId: string) => Promise<void>;
    markNotificationRead: (notificationId: string) => void;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
  };
}

// Create context
const QHopContext = createContext<QHopContextType | undefined>(undefined);

// Provider component
interface QHopProviderProps {
  children: ReactNode;
}

export const QHopProvider: React.FC<QHopProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(qhopReducer, initialState);

  // Actions
  const actions = {
    searchBusinesses: async (query?: string, category?: string) => {
      dispatch({ type: 'SET_LOADING', payload: { key: 'businesses', value: true } });
      dispatch({ type: 'SET_ERROR', payload: null });

      try {
        const businesses = await queueService.searchBusinesses(query, category);
        dispatch({ type: 'SET_BUSINESSES', payload: businesses });
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to load businesses' });
        dispatch({ type: 'SET_LOADING', payload: { key: 'businesses', value: false } });
      }
    },

    loadActiveTickets: async () => {
      dispatch({ type: 'SET_LOADING', payload: { key: 'tickets', value: true } });
      dispatch({ type: 'SET_ERROR', payload: null });

      try {
        const tickets = await queueService.getActiveTickets();
        dispatch({ type: 'SET_ACTIVE_TICKETS', payload: tickets });
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to load tickets' });
        dispatch({ type: 'SET_LOADING', payload: { key: 'tickets', value: false } });
      }
    },

    joinQueue: async (businessId: string, serviceId: string, partySize: number, acceptsTerms: boolean): Promise<Ticket> => {
      dispatch({ type: 'SET_LOADING', payload: { key: 'joining', value: true } });
      dispatch({ type: 'SET_ERROR', payload: null });

      try {
        const ticket = await queueService.joinQueue({
          businessId,
          serviceId,
          partySize,
          acceptsTerms
        });

        dispatch({ type: 'ADD_TICKET', payload: ticket });

        // Add success notification
        const notification: NotificationData = {
          id: `notif-${Date.now()}`,
          type: 'queue_update',
          title: 'Successfully joined queue!',
          message: `You're #${ticket.position} in line at ${ticket.businessName}`,
          time: 'Just now',
          read: false,
          businessName: ticket.businessName,
          ticketNumber: ticket.ticketNumber
        };
        dispatch({ type: 'ADD_NOTIFICATION', payload: notification });

        return ticket;
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to join queue' });
        dispatch({ type: 'SET_LOADING', payload: { key: 'joining', value: false } });
        throw error;
      }
    },

    cancelTicket: async (ticketId: string) => {
      try {
        const success = await queueService.cancelTicket(ticketId);
        if (success) {
          dispatch({ type: 'REMOVE_TICKET', payload: ticketId });
          
          // Add cancellation notification
          const notification: NotificationData = {
            id: `notif-${Date.now()}`,
            type: 'cancelled',
            title: 'Queue cancelled',
            message: 'Your queue position has been cancelled',
            time: 'Just now',
            read: false
          };
          dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
        }
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to cancel ticket' });
      }
    },

    markNotificationRead: (notificationId: string) => {
      dispatch({ type: 'MARK_NOTIFICATION_READ', payload: notificationId });
    },

    login: async (email: string, password: string) => {
      // Mock login - in real app, this would call authentication service
      dispatch({ type: 'SET_USER', payload: {
        id: 'user-1',
        name: 'John Doe',
        email,
        phone: '+234 801 234 5678',
        isAuthenticated: true
      }});
    },

    logout: () => {
      dispatch({ type: 'LOGOUT' });
      queueService.disconnectFromUpdates();
    }
  };

  // Set up real-time updates
  useEffect(() => {
    if (state.user.isAuthenticated) {
      queueService.connectToUpdates((data) => {
        if (data.type === 'position_update') {
          dispatch({
            type: 'UPDATE_TICKET',
            payload: {
              id: data.ticketId,
              updates: {
                position: data.newPosition,
                eta: data.newETA,
                progress: ((state.activeTickets.find(t => t.id === data.ticketId)?.totalInQueue || 1) - data.newPosition) / (state.activeTickets.find(t => t.id === data.ticketId)?.totalInQueue || 1) * 100
              }
            }
          });

          // Add position update notification
          const notification: NotificationData = {
            id: `notif-${Date.now()}`,
            type: 'position_update',
            title: 'Position updated',
            message: `You're now #${data.newPosition} in line`,
            time: 'Just now',
            read: false
          };
          dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
        }
      });
    }

    return () => {
      queueService.disconnectFromUpdates();
    };
  }, [state.user.isAuthenticated]);

  // Load initial data
  useEffect(() => {
    if (state.user.isAuthenticated) {
      actions.loadActiveTickets();
      actions.searchBusinesses();
    }
  }, [state.user.isAuthenticated]);

  const contextValue: QHopContextType = {
    state,
    dispatch,
    actions
  };

  return (
    <QHopContext.Provider value={contextValue}>
      {children}
    </QHopContext.Provider>
  );
};

// Custom hook to use the context
export const useQHop = (): QHopContextType => {
  const context = useContext(QHopContext);
  if (!context) {
    throw new Error('useQHop must be used within a QHopProvider');
  }
  return context;
};

export default QHopContext;
