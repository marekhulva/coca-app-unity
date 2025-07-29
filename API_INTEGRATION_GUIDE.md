# API Integration Guide

This guide shows how to integrate a backend API with the current frontend architecture.

## Overview

The app is designed for easy API integration. Every state action can be enhanced with API calls without changing the component code.

## Integration Points

### 1. Authentication

```typescript
// Current (local state)
interface AppState {
  user: {
    id: string
    name: string
    email: string
    avatar: string
  }
}

// With API
interface AppState {
  user: User | null
  isAuthenticated: boolean
  authToken: string | null
  
  // Actions
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  refreshToken: () => Promise<void>
}

// Implementation
login: async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password })
    const { user, token } = response.data
    
    // Store token
    await AsyncStorage.setItem('authToken', token)
    
    // Update state
    set({
      user,
      authToken: token,
      isAuthenticated: true
    })
  } catch (error) {
    // Handle error
  }
}
```

### 2. Goal Management

```typescript
// Current
lockInGoal: () => set((state) => {
  const newGoal = {
    id: Date.now().toString(),
    title: state.selectedGoal,
    metric: state.goalMetric,
    deadline: state.goalDeadline!,
    milestones: state.milestones,
    progress: 0,
  }
  return {
    userGoals: [...state.userGoals, newGoal],
    showGoalAnnouncementModal: state.selectedSharingOption === 'public',
    currentStep: 1,
  }
})

// With API
lockInGoal: async () => {
  const state = get()
  
  try {
    // Create goal on backend
    const response = await api.post('/goals', {
      title: state.selectedGoal,
      metric: state.goalMetric,
      deadline: state.goalDeadline,
      milestones: state.milestones,
      isPublic: state.selectedSharingOption === 'public'
    })
    
    const newGoal = response.data
    
    // Update local state with server response
    set({
      userGoals: [...state.userGoals, newGoal],
      showGoalAnnouncementModal: state.selectedSharingOption === 'public',
      currentStep: 1,
    })
    
    // Sync with server in background
    await syncGoals()
    
  } catch (error) {
    // Handle offline mode
    const tempGoal = createTempGoal(state)
    set({ 
      userGoals: [...state.userGoals, tempGoal],
      pendingSync: [...state.pendingSync, tempGoal.id]
    })
  }
}
```

### 3. Action Tracking

```typescript
// Current
toggleAction: (actionId: string) => set((state) => ({
  checkedActions: {
    ...state.checkedActions,
    [actionId]: !state.checkedActions[actionId]
  }
}))

// With API
toggleAction: async (actionId: string) => {
  const state = get()
  const newStatus = !state.checkedActions[actionId]
  
  // Optimistic update
  set((state) => ({
    checkedActions: {
      ...state.checkedActions,
      [actionId]: newStatus
    }
  }))
  
  try {
    // Sync with server
    await api.post('/actions/toggle', {
      actionId,
      completed: newStatus,
      timestamp: new Date().toISOString()
    })
    
    // Update streak and points
    if (newStatus) {
      await updateUserStats()
    }
    
  } catch (error) {
    // Revert on failure
    set((state) => ({
      checkedActions: {
        ...state.checkedActions,
        [actionId]: !newStatus
      }
    }))
    
    showError('Failed to update action')
  }
}
```

### 4. Social Features

```typescript
// Current
shareAction: () => set({ showShareModal: true })

// With API
shareAction: async (content: ShareContent) => {
  try {
    const response = await api.post('/social/share', {
      type: content.type,
      actionId: content.actionId,
      message: content.message,
      visibility: content.visibility
    })
    
    // Update local feed
    set((state) => ({
      socialFeed: [response.data, ...state.socialFeed],
      showShareModal: false
    }))
    
    // Notify followers if public
    if (content.visibility === 'public') {
      await notifyFollowers(response.data.id)
    }
    
  } catch (error) {
    showError('Failed to share update')
  }
}
```

## API Service Layer

Create a centralized API service:

```typescript
// app/services/api.ts
import axios from 'axios'
import { API_BASE_URL } from '../config'

class ApiService {
  private client = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
  })
  
  constructor() {
    // Request interceptor for auth
    this.client.interceptors.request.use(
      async (config) => {
        const token = await AsyncStorage.getItem('authToken')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      }
    )
    
    // Response interceptor for errors
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Handle token refresh
          await this.refreshToken()
        }
        return Promise.reject(error)
      }
    )
  }
  
  // Auth methods
  login = (credentials: LoginCredentials) => 
    this.client.post('/auth/login', credentials)
    
  logout = () => 
    this.client.post('/auth/logout')
    
  // Goal methods
  createGoal = (goal: GoalInput) => 
    this.client.post('/goals', goal)
    
  getGoals = () => 
    this.client.get('/goals')
    
  updateGoal = (id: string, updates: Partial<Goal>) => 
    this.client.patch(`/goals/${id}`, updates)
    
  // Action methods
  toggleAction = (actionId: string, completed: boolean) => 
    this.client.post('/actions/toggle', { actionId, completed })
    
  getActions = (goalId?: string) => 
    this.client.get('/actions', { params: { goalId } })
    
  // Social methods
  getFeed = (page = 1) => 
    this.client.get('/social/feed', { params: { page } })
    
  shareUpdate = (content: ShareContent) => 
    this.client.post('/social/share', content)
    
  // Stats methods
  getUserStats = () => 
    this.client.get('/stats/user')
    
  getGroupStats = (groupId: string) => 
    this.client.get(`/stats/group/${groupId}`)
}

export const api = new ApiService()
```

## Data Synchronization

### Offline Support

```typescript
// app/services/sync.ts
interface SyncQueue {
  id: string
  type: 'goal' | 'action' | 'share'
  operation: 'create' | 'update' | 'delete'
  data: any
  timestamp: number
  retries: number
}

class SyncService {
  private queue: SyncQueue[] = []
  
  async addToQueue(item: Omit<SyncQueue, 'id' | 'timestamp' | 'retries'>) {
    const queueItem: SyncQueue = {
      ...item,
      id: uuid(),
      timestamp: Date.now(),
      retries: 0
    }
    
    this.queue.push(queueItem)
    await this.persistQueue()
    
    // Try to sync immediately if online
    if (await this.isOnline()) {
      this.processQueue()
    }
  }
  
  async processQueue() {
    const items = [...this.queue]
    
    for (const item of items) {
      try {
        await this.syncItem(item)
        this.removeFromQueue(item.id)
      } catch (error) {
        item.retries++
        
        if (item.retries > 3) {
          this.moveToFailedQueue(item)
        }
      }
    }
  }
  
  private async syncItem(item: SyncQueue) {
    switch (item.type) {
      case 'goal':
        return this.syncGoal(item)
      case 'action':
        return this.syncAction(item)
      case 'share':
        return this.syncShare(item)
    }
  }
}
```

### Real-time Updates

```typescript
// app/services/websocket.ts
class WebSocketService {
  private ws: WebSocket | null = null
  private reconnectAttempts = 0
  
  connect(userId: string) {
    this.ws = new WebSocket(`${WS_URL}?userId=${userId}`)
    
    this.ws.onopen = () => {
      console.log('WebSocket connected')
      this.reconnectAttempts = 0
    }
    
    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      this.handleMessage(data)
    }
    
    this.ws.onclose = () => {
      this.handleReconnect()
    }
  }
  
  private handleMessage(message: WSMessage) {
    const { updateState } = useAppStore.getState()
    
    switch (message.type) {
      case 'goal_updated':
        updateState((state) => ({
          userGoals: state.userGoals.map(g => 
            g.id === message.data.id ? message.data : g
          )
        }))
        break
        
      case 'new_follower':
        showNotification('New follower!', message.data.userName)
        break
        
      case 'action_completed':
        updateState((state) => ({
          socialFeed: [message.data, ...state.socialFeed]
        }))
        break
    }
  }
}
```

## Error Handling

```typescript
// app/utils/errorHandler.ts
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public data?: any
  ) {
    super(message)
  }
}

export const handleApiError = (error: any): string => {
  if (error.response) {
    // Server responded with error
    switch (error.response.status) {
      case 400:
        return error.response.data.message || 'Invalid request'
      case 401:
        return 'Please login again'
      case 403:
        return 'You don\'t have permission'
      case 404:
        return 'Not found'
      case 500:
        return 'Server error, please try again'
      default:
        return 'Something went wrong'
    }
  } else if (error.request) {
    // Request made but no response
    return 'Network error, please check your connection'
  } else {
    // Something else happened
    return error.message || 'Unknown error occurred'
  }
}
```

## Migration Strategy

### Phase 1: Authentication
1. Add login/signup screens
2. Implement auth flow
3. Add token management
4. Secure API calls

### Phase 2: Data Sync
1. Add API calls to existing actions
2. Implement offline queue
3. Add optimistic updates
4. Handle conflicts

### Phase 3: Real-time
1. Add WebSocket connection
2. Implement live updates
3. Add notifications
4. Handle presence

### Phase 4: Performance
1. Add caching layer
2. Implement pagination
3. Add data prefetching
4. Optimize bundle size

## Testing API Integration

```typescript
// __tests__/api/goals.test.ts
import { api } from '../../app/services/api'
import { mockServer } from '../mocks/server'

describe('Goals API', () => {
  beforeAll(() => mockServer.listen())
  afterEach(() => mockServer.resetHandlers())
  afterAll(() => mockServer.close())
  
  test('creates goal successfully', async () => {
    const goal = {
      title: 'Test Goal',
      metric: 'Test Metric',
      deadline: new Date()
    }
    
    const response = await api.createGoal(goal)
    
    expect(response.data).toMatchObject({
      ...goal,
      id: expect.any(String)
    })
  })
  
  test('handles network error', async () => {
    mockServer.use(
      rest.post('/goals', (req, res, ctx) => {
        return res.networkError('Network error')
      })
    )
    
    await expect(api.createGoal({})).rejects.toThrow()
  })
})
```

## Security Considerations

1. **Token Storage**
   - Use secure storage (Keychain/Keystore)
   - Implement token refresh
   - Clear on logout

2. **API Security**
   - HTTPS only
   - Certificate pinning
   - Request signing

3. **Data Validation**
   - Client-side validation
   - Server response validation
   - Input sanitization

4. **Privacy**
   - Encrypt sensitive data
   - Implement data retention
   - GDPR compliance

This guide provides a complete roadmap for integrating a backend API with your existing frontend architecture. The modular design makes it easy to add these features incrementally without disrupting the current functionality.