import React, { useState, useEffect } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  IonButton,
  IonIcon,
  IonList,
  IonItem,
  IonLabel,
  IonAvatar,
  IonBadge,
  IonChip,
  IonSearchbar,
  IonSelect,
  IonSelectOption,
  IonFab,
  IonFabButton,
  IonModal,
  IonInput,
  IonTextarea,
  IonCheckbox,
  IonToggle,
  IonSpinner,
  IonAlert,
  IonToast,
  IonSegment,
  IonSegmentButton,
  IonProgressBar,
  IonText
} from '@ionic/react';
import {
  peopleOutline,
  addOutline,
  personOutline,
  mailOutline,
  callOutline,
  settingsOutline,
  timeOutline,
  analyticsOutline,
  createOutline,
  trashOutline,
  checkmarkCircleOutline,
  closeCircleOutline,
  starOutline,
  trendingUpOutline
} from 'ionicons/icons';
import './StaffManagement.css';

interface StaffMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'OWNER' | 'MANAGER' | 'STAFF';
  permissions: Record<string, boolean>;
  schedule: Record<string, any>;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  performance?: {
    customersServed: number;
    avgServiceTime: number;
    customerSatisfaction: number;
    punctuality: number;
    efficiency: number;
    performanceScore: number;
  };
}

const StaffManagement: React.FC = () => {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedView, setSelectedView] = useState('list');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'STAFF' as 'OWNER' | 'MANAGER' | 'STAFF',
    permissions: {} as Record<string, boolean>
  });

  useEffect(() => {
    loadStaff();
  }, []);

  const loadStaff = async () => {
    setLoading(true);
    try {
      // Mock data for demonstration
      const mockStaff: StaffMember[] = [
        {
          id: '1',
          name: 'Sarah Johnson',
          email: 'sarah@example.com',
          phone: '+1234567890',
          role: 'MANAGER',
          permissions: {
            manage_queue: true,
            view_analytics: true,
            manage_staff_schedule: true
          },
          schedule: {
            monday: { isWorking: true, startTime: '09:00', endTime: '17:00' },
            tuesday: { isWorking: true, startTime: '09:00', endTime: '17:00' },
            wednesday: { isWorking: true, startTime: '09:00', endTime: '17:00' },
            thursday: { isWorking: true, startTime: '09:00', endTime: '17:00' },
            friday: { isWorking: true, startTime: '09:00', endTime: '17:00' },
            saturday: { isWorking: false },
            sunday: { isWorking: false }
          },
          isActive: true,
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-20T14:30:00Z',
          performance: {
            customersServed: 156,
            avgServiceTime: 18,
            customerSatisfaction: 4.7,
            punctuality: 95,
            efficiency: 88,
            performanceScore: 92
          }
        },
        {
          id: '2',
          name: 'Michael Chen',
          email: 'michael@example.com',
          phone: '+1234567891',
          role: 'STAFF',
          permissions: {
            view_queue: true,
            call_customers: true,
            update_ticket_status: true
          },
          schedule: {
            monday: { isWorking: true, startTime: '10:00', endTime: '18:00' },
            tuesday: { isWorking: true, startTime: '10:00', endTime: '18:00' },
            wednesday: { isWorking: true, startTime: '10:00', endTime: '18:00' },
            thursday: { isWorking: true, startTime: '10:00', endTime: '18:00' },
            friday: { isWorking: true, startTime: '10:00', endTime: '18:00' },
            saturday: { isWorking: true, startTime: '10:00', endTime: '16:00' },
            sunday: { isWorking: false }
          },
          isActive: true,
          createdAt: '2024-01-10T09:00:00Z',
          updatedAt: '2024-01-18T11:15:00Z',
          performance: {
            customersServed: 134,
            avgServiceTime: 22,
            customerSatisfaction: 4.5,
            punctuality: 92,
            efficiency: 85,
            performanceScore: 89
          }
        },
        {
          id: '3',
          name: 'Emily Rodriguez',
          email: 'emily@example.com',
          phone: '+1234567892',
          role: 'STAFF',
          permissions: {
            view_queue: true,
            call_customers: true,
            update_ticket_status: true
          },
          schedule: {
            monday: { isWorking: false },
            tuesday: { isWorking: true, startTime: '14:00', endTime: '22:00' },
            wednesday: { isWorking: true, startTime: '14:00', endTime: '22:00' },
            thursday: { isWorking: true, startTime: '14:00', endTime: '22:00' },
            friday: { isWorking: true, startTime: '14:00', endTime: '22:00' },
            saturday: { isWorking: true, startTime: '12:00', endTime: '20:00' },
            sunday: { isWorking: true, startTime: '12:00', endTime: '20:00' }
          },
          isActive: true,
          createdAt: '2024-01-05T16:00:00Z',
          updatedAt: '2024-01-19T09:45:00Z',
          performance: {
            customersServed: 98,
            avgServiceTime: 20,
            customerSatisfaction: 4.6,
            punctuality: 88,
            efficiency: 82,
            performanceScore: 86
          }
        }
      ];

      setStaff(mockStaff);
    } catch (error) {
      console.error('Error loading staff:', error);
      setToastMessage('Failed to load staff members');
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  const filteredStaff = staff.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchText.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchText.toLowerCase());
    const matchesRole = filterRole === 'all' || member.role === filterRole;
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' && member.isActive) ||
                         (filterStatus === 'inactive' && !member.isActive);
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleAddStaff = async () => {
    try {
      // Mock API call
      const newStaff: StaffMember = {
        id: Date.now().toString(),
        ...formData,
        schedule: {},
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      setStaff([...staff, newStaff]);
      setShowAddModal(false);
      setFormData({ name: '', email: '', phone: '', role: 'STAFF', permissions: {} });
      setToastMessage('Staff member added successfully');
      setShowToast(true);
    } catch (error) {
      console.error('Error adding staff:', error);
      setToastMessage('Failed to add staff member');
      setShowToast(true);
    }
  };

  const handleEditStaff = (member: StaffMember) => {
    setSelectedStaff(member);
    setFormData({
      name: member.name,
      email: member.email,
      phone: member.phone,
      role: member.role,
      permissions: member.permissions
    });
    setShowEditModal(true);
  };

  const handleUpdateStaff = async () => {
    if (!selectedStaff) return;

    try {
      const updatedStaff = staff.map(member =>
        member.id === selectedStaff.id
          ? { ...member, ...formData, updatedAt: new Date().toISOString() }
          : member
      );

      setStaff(updatedStaff);
      setShowEditModal(false);
      setSelectedStaff(null);
      setToastMessage('Staff member updated successfully');
      setShowToast(true);
    } catch (error) {
      console.error('Error updating staff:', error);
      setToastMessage('Failed to update staff member');
      setShowToast(true);
    }
  };

  const handleDeleteStaff = async () => {
    if (!selectedStaff) return;

    try {
      const updatedStaff = staff.map(member =>
        member.id === selectedStaff.id
          ? { ...member, isActive: false, updatedAt: new Date().toISOString() }
          : member
      );

      setStaff(updatedStaff);
      setShowDeleteAlert(false);
      setSelectedStaff(null);
      setToastMessage('Staff member removed successfully');
      setShowToast(true);
    } catch (error) {
      console.error('Error removing staff:', error);
      setToastMessage('Failed to remove staff member');
      setShowToast(true);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'OWNER': return 'primary';
      case 'MANAGER': return 'secondary';
      case 'STAFF': return 'tertiary';
      default: return 'medium';
    }
  };

  const getPerformanceColor = (score: number) => {
    if (score >= 90) return 'success';
    if (score >= 80) return 'warning';
    return 'danger';
  };

  const renderStaffList = () => (
    <IonList>
      {filteredStaff.map(member => (
        <IonItem key={member.id} className="staff-item">
          <IonAvatar slot="start">
            <div className="avatar-placeholder">
              {member.name.split(' ').map(n => n[0]).join('')}
            </div>
          </IonAvatar>
          
          <IonLabel>
            <div className="staff-info">
              <h2>{member.name}</h2>
              <p>{member.email}</p>
              <p>{member.phone}</p>
              
              <div className="staff-badges">
                <IonBadge color={getRoleBadgeColor(member.role)}>
                  {member.role}
                </IonBadge>
                <IonBadge color={member.isActive ? 'success' : 'danger'}>
                  {member.isActive ? 'Active' : 'Inactive'}
                </IonBadge>
                {member.performance && (
                  <IonBadge color={getPerformanceColor(member.performance.performanceScore)}>
                    {member.performance.performanceScore}% Performance
                  </IonBadge>
                )}
              </div>
            </div>
          </IonLabel>
          
          <div slot="end" className="staff-actions">
            <IonButton 
              fill="clear" 
              size="small"
              onClick={() => handleEditStaff(member)}
            >
              <IonIcon icon={createOutline} />
            </IonButton>
            <IonButton 
              fill="clear" 
              size="small" 
              color="danger"
              onClick={() => {
                setSelectedStaff(member);
                setShowDeleteAlert(true);
              }}
            >
              <IonIcon icon={trashOutline} />
            </IonButton>
          </div>
        </IonItem>
      ))}
    </IonList>
  );

  const renderPerformanceView = () => (
    <IonGrid>
      <IonRow>
        {filteredStaff.filter(member => member.performance).map(member => (
          <IonCol key={member.id} size="12" sizeMd="6" sizeLg="4">
            <IonCard className="performance-card">
              <IonCardHeader>
                <IonCardTitle>{member.name}</IonCardTitle>
                <IonBadge color={getRoleBadgeColor(member.role)}>
                  {member.role}
                </IonBadge>
              </IonCardHeader>
              <IonCardContent>
                {member.performance && (
                  <div className="performance-metrics">
                    <div className="metric">
                      <IonIcon icon={peopleOutline} />
                      <span>{member.performance.customersServed} Customers</span>
                    </div>
                    <div className="metric">
                      <IonIcon icon={timeOutline} />
                      <span>{member.performance.avgServiceTime} min avg</span>
                    </div>
                    <div className="metric">
                      <IonIcon icon={starOutline} />
                      <span>{member.performance.customerSatisfaction}/5 rating</span>
                    </div>
                    <div className="metric">
                      <IonIcon icon={checkmarkCircleOutline} />
                      <span>{member.performance.punctuality}% punctual</span>
                    </div>
                    
                    <div className="performance-score">
                      <h3>Overall Performance</h3>
                      <IonProgressBar 
                        value={member.performance.performanceScore / 100}
                        color={getPerformanceColor(member.performance.performanceScore)}
                      />
                      <IonText color={getPerformanceColor(member.performance.performanceScore)}>
                        <strong>{member.performance.performanceScore}%</strong>
                      </IonText>
                    </div>
                  </div>
                )}
              </IonCardContent>
            </IonCard>
          </IonCol>
        ))}
      </IonRow>
    </IonGrid>
  );

  if (loading) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Staff Management</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <div className="loading-container">
            <IonSpinner name="crescent" />
            <p>Loading staff...</p>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Staff Management</IonTitle>
        </IonToolbar>
      </IonHeader>
      
      <IonContent>
        <div className="staff-header">
          <IonGrid>
            <IonRow className="ion-align-items-center">
              <IonCol size="12" sizeMd="6">
                <IonSegment 
                  value={selectedView} 
                  onIonChange={e => setSelectedView(e.detail.value as string)}
                >
                  <IonSegmentButton value="list">
                    <IonLabel>Staff List</IonLabel>
                  </IonSegmentButton>
                  <IonSegmentButton value="performance">
                    <IonLabel>Performance</IonLabel>
                  </IonSegmentButton>
                </IonSegment>
              </IonCol>
              
              <IonCol size="12" sizeMd="6">
                <div className="staff-stats">
                  <IonChip color="primary">
                    <IonIcon icon={peopleOutline} />
                    <IonLabel>{staff.filter(s => s.isActive).length} Active</IonLabel>
                  </IonChip>
                  <IonChip color="secondary">
                    <IonIcon icon={analyticsOutline} />
                    <IonLabel>
                      {staff.filter(s => s.performance && s.performance.performanceScore >= 90).length} Top Performers
                    </IonLabel>
                  </IonChip>
                </div>
              </IonCol>
            </IonRow>
          </IonGrid>
        </div>

        <div className="staff-filters">
          <IonGrid>
            <IonRow>
              <IonCol size="12" sizeMd="4">
                <IonSearchbar
                  value={searchText}
                  onIonInput={e => setSearchText(e.detail.value!)}
                  placeholder="Search staff..."
                  showClearButton="focus"
                />
              </IonCol>
              
              <IonCol size="6" sizeMd="4">
                <IonSelect
                  value={filterRole}
                  onIonChange={e => setFilterRole(e.detail.value!)}
                  placeholder="Filter by Role"
                  interface="popover"
                >
                  <IonSelectOption value="all">All Roles</IonSelectOption>
                  <IonSelectOption value="OWNER">Owner</IonSelectOption>
                  <IonSelectOption value="MANAGER">Manager</IonSelectOption>
                  <IonSelectOption value="STAFF">Staff</IonSelectOption>
                </IonSelect>
              </IonCol>
              
              <IonCol size="6" sizeMd="4">
                <IonSelect
                  value={filterStatus}
                  onIonChange={e => setFilterStatus(e.detail.value!)}
                  placeholder="Filter by Status"
                  interface="popover"
                >
                  <IonSelectOption value="all">All Status</IonSelectOption>
                  <IonSelectOption value="active">Active</IonSelectOption>
                  <IonSelectOption value="inactive">Inactive</IonSelectOption>
                </IonSelect>
              </IonCol>
            </IonRow>
          </IonGrid>
        </div>

        <div className="staff-content">
          {selectedView === 'list' ? renderStaffList() : renderPerformanceView()}
        </div>

        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={() => setShowAddModal(true)}>
            <IonIcon icon={addOutline} />
          </IonFabButton>
        </IonFab>

        {/* Add Staff Modal */}
        <IonModal isOpen={showAddModal} onDidDismiss={() => setShowAddModal(false)}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Add Staff Member</IonTitle>
              <IonButton 
                slot="end" 
                fill="clear" 
                onClick={() => setShowAddModal(false)}
              >
                Close
              </IonButton>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            <IonItem>
              <IonLabel position="stacked">Name</IonLabel>
              <IonInput
                value={formData.name}
                onIonInput={e => setFormData({...formData, name: e.detail.value!})}
                placeholder="Enter full name"
              />
            </IonItem>
            
            <IonItem>
              <IonLabel position="stacked">Email</IonLabel>
              <IonInput
                type="email"
                value={formData.email}
                onIonInput={e => setFormData({...formData, email: e.detail.value!})}
                placeholder="Enter email address"
              />
            </IonItem>
            
            <IonItem>
              <IonLabel position="stacked">Phone</IonLabel>
              <IonInput
                type="tel"
                value={formData.phone}
                onIonInput={e => setFormData({...formData, phone: e.detail.value!})}
                placeholder="Enter phone number"
              />
            </IonItem>
            
            <IonItem>
              <IonLabel position="stacked">Role</IonLabel>
              <IonSelect
                value={formData.role}
                onIonChange={e => setFormData({...formData, role: e.detail.value!})}
                interface="popover"
              >
                <IonSelectOption value="STAFF">Staff</IonSelectOption>
                <IonSelectOption value="MANAGER">Manager</IonSelectOption>
                <IonSelectOption value="OWNER">Owner</IonSelectOption>
              </IonSelect>
            </IonItem>
            
            <div className="modal-actions">
              <IonButton 
                expand="block" 
                onClick={handleAddStaff}
                disabled={!formData.name || !formData.email || !formData.phone}
              >
                Add Staff Member
              </IonButton>
            </div>
          </IonContent>
        </IonModal>

        {/* Edit Staff Modal */}
        <IonModal isOpen={showEditModal} onDidDismiss={() => setShowEditModal(false)}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Edit Staff Member</IonTitle>
              <IonButton 
                slot="end" 
                fill="clear" 
                onClick={() => setShowEditModal(false)}
              >
                Close
              </IonButton>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            <IonItem>
              <IonLabel position="stacked">Name</IonLabel>
              <IonInput
                value={formData.name}
                onIonInput={e => setFormData({...formData, name: e.detail.value!})}
                placeholder="Enter full name"
              />
            </IonItem>
            
            <IonItem>
              <IonLabel position="stacked">Email</IonLabel>
              <IonInput
                type="email"
                value={formData.email}
                onIonInput={e => setFormData({...formData, email: e.detail.value!})}
                placeholder="Enter email address"
              />
            </IonItem>
            
            <IonItem>
              <IonLabel position="stacked">Phone</IonLabel>
              <IonInput
                type="tel"
                value={formData.phone}
                onIonInput={e => setFormData({...formData, phone: e.detail.value!})}
                placeholder="Enter phone number"
              />
            </IonItem>
            
            <IonItem>
              <IonLabel position="stacked">Role</IonLabel>
              <IonSelect
                value={formData.role}
                onIonChange={e => setFormData({...formData, role: e.detail.value!})}
                interface="popover"
              >
                <IonSelectOption value="STAFF">Staff</IonSelectOption>
                <IonSelectOption value="MANAGER">Manager</IonSelectOption>
                <IonSelectOption value="OWNER">Owner</IonSelectOption>
              </IonSelect>
            </IonItem>
            
            <div className="modal-actions">
              <IonButton 
                expand="block" 
                onClick={handleUpdateStaff}
                disabled={!formData.name || !formData.email || !formData.phone}
              >
                Update Staff Member
              </IonButton>
            </div>
          </IonContent>
        </IonModal>

        {/* Delete Confirmation */}
        <IonAlert
          isOpen={showDeleteAlert}
          onDidDismiss={() => setShowDeleteAlert(false)}
          header="Remove Staff Member"
          message={`Are you sure you want to remove ${selectedStaff?.name}? This action cannot be undone.`}
          buttons={[
            {
              text: 'Cancel',
              role: 'cancel'
            },
            {
              text: 'Remove',
              role: 'destructive',
              handler: handleDeleteStaff
            }
          ]}
        />

        {/* Toast */}
        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={3000}
          position="bottom"
        />
      </IonContent>
    </IonPage>
  );
};

export default StaffManagement;
